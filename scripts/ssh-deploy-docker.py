"""Deploy AIAgent-Hub to pm.lanmaster.kz (docker-compose + Cloudflare Quick-tunnel).

Authentication
  Prefers SSH key `~/.ssh/aiagent-deploy` (private). Falls back to SSH_PASS env var
  only if the key is missing or rejected. Run `scripts/ssh-deploy-docker.py setup-key`
  once to install the public key on the server; after that no password is needed.

Server layout
  - Host:       pm.lanmaster.kz:34221 (user: integrator)
  - Project:    /home/integrator/agent-hub   (git clone of origin/master)
  - Runtime:    Docker container 'aiagent-hub' (nginx:alpine), 3000:80
  - Public URL: Cloudflare Quick-tunnel -> http://127.0.0.1:3000
                cached in /home/integrator/.webapp_url, refreshed by user cron every minute
  - Tunnel log: /home/integrator/agent-hub-tunnel.log

Commands
  setup-key      Install ~/.ssh/aiagent-deploy.pub on the server (needs SSH_PASS).
  setup-url-cron Install a user cron job that keeps /home/integrator/.webapp_url
                 in sync with the latest tunnel URL every minute.
  deploy         git pull on the server, docker compose build, docker compose up -d.
                 Use this after `git push origin master`.
  status         Print container status, URL, HTTP health.
  url            Print the current public URL (reads tunnel log).
  sync-url       One-shot: rewrite ~/.webapp_url from the current tunnel log.
"""
import io
import os
import sys

import paramiko

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

HOST = "pm.lanmaster.kz"
PORT = 34221
USER = "integrator"
REMOTE = "/home/integrator/agent-hub"
TUNNEL_LOG = "/home/integrator/agent-hub-tunnel.log"
URL_FILE = "/home/integrator/.webapp_url"

KEY_PATH = os.path.expanduser("~/.ssh/aiagent-deploy")
PUB_PATH = KEY_PATH + ".pub"


def connect(prefer_password=False):
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    # Try key first unless explicitly asked for password (setup-key only)
    if not prefer_password and os.path.isfile(KEY_PATH):
        try:
            c.connect(HOST, PORT, USER, key_filename=KEY_PATH, timeout=20,
                      allow_agent=False, look_for_keys=False)
            return c
        except paramiko.AuthenticationException:
            pass  # fall through to password
    p = os.environ.get("SSH_PASS")
    if not p:
        sys.exit(
            "Key auth failed and SSH_PASS is not set. "
            "Run `setup-key` once with SSH_PASS to install the deploy key."
        )
    c.connect(HOST, PORT, USER, password=p, timeout=20,
              allow_agent=False, look_for_keys=False)
    return c


def run(c, cmd, show=True, timeout=600):
    _, stdout, stderr = c.exec_command(cmd, timeout=timeout)
    chan = stdout.channel
    out, err = [], []
    while True:
        if chan.recv_ready():
            d = chan.recv(4096).decode("utf-8", errors="replace")
            out.append(d)
            if show:
                print(d, end="", flush=True)
        if chan.recv_stderr_ready():
            d = chan.recv_stderr(4096).decode("utf-8", errors="replace")
            err.append(d)
            if show:
                print(d, end="", flush=True)
        if chan.exit_status_ready() and not chan.recv_ready() and not chan.recv_stderr_ready():
            break
    rc = chan.recv_exit_status()
    if show:
        print(f"\n[exit {rc}]")
    return rc, "".join(out), "".join(err)


def _latest_tunnel_url(c):
    rc, out, _ = run(
        c,
        f"grep -oE 'https://[a-z0-9-]+\\.trycloudflare\\.com' {TUNNEL_LOG} | tail -1",
        show=False,
    )
    return out.strip() or None


# ---- Commands ----

def cmd_setup_key():
    if not os.path.isfile(PUB_PATH):
        sys.exit(
            f"No public key at {PUB_PATH}. Generate one first:\n"
            f"  ssh-keygen -t ed25519 -f {KEY_PATH} -N ''"
        )
    with open(PUB_PATH) as f:
        pub = f.read().strip()
    print(f"Using public key: {pub.split()[-1]}")
    c = connect(prefer_password=True)  # must be password here
    try:
        run(c, (
            "mkdir -p ~/.ssh && chmod 700 ~/.ssh && "
            "touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && "
            f"grep -qxF '{pub}' ~/.ssh/authorized_keys || echo '{pub}' >> ~/.ssh/authorized_keys && "
            "echo 'authorized_keys updated' && wc -l ~/.ssh/authorized_keys"
        ))
    finally:
        c.close()
    # Verify key-only works
    c2 = connect(prefer_password=False)
    run(c2, "whoami")
    c2.close()
    print("\n✓ Key auth works. SSH_PASS is no longer required.")


def cmd_setup_url_cron():
    """Install user-level cron that refreshes URL_FILE every minute."""
    script = (
        '#!/bin/sh\n'
        f'URL=$(grep -oE "https://[a-z0-9-]+\\.trycloudflare\\.com" {TUNNEL_LOG} 2>/dev/null | tail -1)\n'
        f'[ -n "$URL" ] && echo "$URL" > {URL_FILE}\n'
    )
    remote_sh = "/home/integrator/bin/refresh-webapp-url.sh"
    cron_line = f"* * * * * {remote_sh} >/dev/null 2>&1"
    c = connect()
    try:
        # Write script
        run(c, f"mkdir -p /home/integrator/bin && cat > {remote_sh} <<'EOS'\n{script}EOS\nchmod +x {remote_sh} && {remote_sh} && cat {URL_FILE}")
        # Install cron (idempotent: remove any previous line for this script first)
        run(c, (
            '('
            f'crontab -l 2>/dev/null | grep -vF "{remote_sh}"; '
            f'echo "{cron_line}"'
            ') | crontab - && crontab -l'
        ))
    finally:
        c.close()
    print("\n✓ URL cron installed — .webapp_url refreshes every minute.")


def cmd_status():
    c = connect()
    try:
        run(c, "docker ps --filter name=aiagent-hub --format '{{.Names}} {{.Status}} {{.Ports}}'")
        run(c, f"cat {URL_FILE}")
        url = _latest_tunnel_url(c)
        print(f"\nLatest URL in log: {url or '(none)'}")
        if url:
            run(c, f"curl -sS -o /dev/null -w 'public HTTP %{{http_code}}\\n' {url}/")
        run(c, "curl -sS -o /dev/null -w 'local  HTTP %{http_code}\\n' http://localhost:3000/")
        run(c, f"cd {REMOTE} && git log --oneline -3")
    finally:
        c.close()


def cmd_url():
    c = connect()
    try:
        url = _latest_tunnel_url(c)
        if url:
            print(url)
        else:
            sys.exit("No trycloudflare URL found in tunnel log")
    finally:
        c.close()


def cmd_sync_url():
    c = connect()
    try:
        url = _latest_tunnel_url(c)
        if not url:
            sys.exit("No trycloudflare URL found in tunnel log")
        run(c, f"echo '{url}' > {URL_FILE} && cat {URL_FILE}")
        run(c, f"curl -sS -o /dev/null -w 'HTTP %{{http_code}}\\n' {url}/")
    finally:
        c.close()


def cmd_deploy():
    c = connect()
    try:
        print("=== 1. git pull ===")
        rc, _, _ = run(c, f"cd {REMOTE} && git fetch --quiet origin && git log --oneline HEAD..origin/master | head -20")
        run(c, f"cd {REMOTE} && git reset --hard origin/master && git log --oneline -1")

        print("\n=== 2. Rebuild Docker image ===")
        rc, _, _ = run(
            c, f"cd {REMOTE} && docker compose build aiagent-hub 2>&1 | tail -20", timeout=900
        )
        if rc != 0:
            sys.exit("BUILD FAILED")

        print("\n=== 3. Recreate container ===")
        run(c, f"cd {REMOTE} && docker compose up -d aiagent-hub 2>&1 | tail -8")

        print("\n=== 4. Post-check ===")
        run(c, "docker ps --filter name=aiagent-hub --format '{{.Names}} {{.Status}} {{.Ports}}'")
        run(c, "sleep 3 && curl -sS -o /dev/null -w 'local HTTP %{http_code}\\n' http://localhost:3000/")
        url = _latest_tunnel_url(c)
        if url:
            run(c, f"curl -sS -o /dev/null -w 'public HTTP %{{http_code}}\\n' {url}/")
            run(c, f"curl -s {url}/ | grep '<title>'")
            print(f"\nLive at: {url}")
    finally:
        c.close()


COMMANDS = {
    "setup-key": cmd_setup_key,
    "setup-url-cron": cmd_setup_url_cron,
    "deploy": cmd_deploy,
    "status": cmd_status,
    "url": cmd_url,
    "sync-url": cmd_sync_url,
}

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    fn = COMMANDS.get(cmd)
    if not fn:
        sys.exit(f"Unknown cmd: {cmd}. Available: {', '.join(COMMANDS)}")
    fn()
