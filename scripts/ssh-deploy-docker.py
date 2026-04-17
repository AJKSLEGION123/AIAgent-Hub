"""Deploy AIAgent-Hub to pm.lanmaster.kz (docker-compose + Cloudflare Quick-tunnel).

Server layout (discovered 2026-04-17):
  - Host:           pm.lanmaster.kz:34221 (user: integrator)
  - Project:        /home/integrator/agent-hub/   (plain copy, NOT git)
  - Runtime:        Docker container 'aiagent-hub' (nginx:alpine), 3000:80
  - Public URL:     Cloudflare Quick-tunnel -> http://127.0.0.1:3000
                    cached in /home/integrator/.webapp_url
  - Tunnel log:     /home/integrator/agent-hub-tunnel.log
                    (latest URL is the most recent `*.trycloudflare.com` in the log)

Usage:
  # deploy local src/App.jsx + index.html, rebuild docker image, restart container
  SSH_PASS='xxx' python scripts/ssh-deploy-docker.py deploy

  # just sync /home/integrator/.webapp_url with the latest URL in the tunnel log
  SSH_PASS='xxx' python scripts/ssh-deploy-docker.py sync-url

  # print the currently live public URL (the one serving our content)
  SSH_PASS='xxx' python scripts/ssh-deploy-docker.py url

  # non-destructive: show server state (container status, URL, disk etc)
  SSH_PASS='xxx' python scripts/ssh-deploy-docker.py status

Security notes:
  - Never commit SSH_PASS.
  - Prefer key-based auth; put the public key in ~integrator/.ssh/authorized_keys
    on the server and then you can drop the SSH_PASS env var.
"""
import io
import os
import posixpath
import sys

import paramiko

# Force UTF-8 on Windows stdout so Cyrillic in output doesn't crash
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

HOST = "pm.lanmaster.kz"
PORT = 34221
USER = "integrator"
REMOTE = "/home/integrator/agent-hub"
TUNNEL_LOG = "/home/integrator/agent-hub-tunnel.log"
URL_FILE = "/home/integrator/.webapp_url"

# Files uploaded on `deploy`. Add more paths if your edits touch them.
FILES = [
    "src/App.jsx",
    "index.html",
]

LOCAL_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def connect():
    p = os.environ.get("SSH_PASS")
    if not p:
        sys.exit("Set SSH_PASS env var (or configure key-based auth and edit this script).")
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, port=PORT, username=USER, password=p, timeout=20,
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
    """Return the most recent *.trycloudflare.com URL in the tunnel log, or None."""
    rc, out, _ = run(
        c,
        f"grep -oE 'https://[a-z0-9-]+\\.trycloudflare\\.com' {TUNNEL_LOG} | tail -1",
        show=False,
    )
    url = out.strip()
    return url or None


def upload(c, files):
    sftp = c.open_sftp()
    try:
        for rel in files:
            local = os.path.join(LOCAL_ROOT, rel.replace("/", os.sep))
            remote = posixpath.join(REMOTE, rel)
            if not os.path.isfile(local):
                print(f"SKIP (missing): {local}")
                continue
            run(c, f"mkdir -p {posixpath.dirname(remote)}", show=False)
            print(f"UPLOAD {rel} ({os.path.getsize(local)} bytes)")
            sftp.put(local, remote)
    finally:
        sftp.close()


def cmd_status():
    c = connect()
    try:
        run(c, "docker ps --filter name=aiagent-hub --format '{{.Names}} {{.Status}} {{.Ports}}'")
        run(c, f"cat {URL_FILE}")
        url = _latest_tunnel_url(c)
        print(f"\nLatest URL in log: {url or '(none)'}")
        if url:
            run(c, f"curl -sS -o /dev/null -w 'public HTTP %{{http_code}}\\n' {url}/")
        run(c, "curl -sS -o /dev/null -w 'local HTTP %{http_code}\\n' http://localhost:3000/")
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
        print("=== 1. Pre-check ===")
        run(c, f"cd {REMOTE} && ls -1 Dockerfile docker-compose.yml")
        run(c, "docker ps --filter name=aiagent-hub --format '{{.Names}} {{.Status}}'")

        print("\n=== 2. Upload changed files ===")
        upload(c, FILES)

        print("\n=== 3. Quick sanity check on uploaded source ===")
        run(c, f"grep -c 'comboSearch\\|search-row' {REMOTE}/src/App.jsx")
        run(c, f"grep '<title>' {REMOTE}/index.html")

        print("\n=== 4. Rebuild Docker image ===")
        rc, _, _ = run(
            c, f"cd {REMOTE} && docker compose build aiagent-hub 2>&1 | tail -30", timeout=900
        )
        if rc != 0:
            sys.exit("BUILD FAILED")

        print("\n=== 5. Recreate container ===")
        run(c, f"cd {REMOTE} && docker compose up -d aiagent-hub 2>&1 | tail -10")

        print("\n=== 6. Post-check ===")
        run(c, "docker ps --filter name=aiagent-hub --format '{{.Names}} {{.Status}} {{.Ports}}'")
        # Wait a sec for nginx to come up, then probe local & public
        run(c, "sleep 3 && curl -sS -o /dev/null -w 'local HTTP %{http_code}\\n' http://localhost:3000/")
        url = _latest_tunnel_url(c)
        if url:
            run(c, f"curl -sS -o /dev/null -w 'public HTTP %{{http_code}}\\n' {url}/")
            run(c, f"curl -s {url}/ | grep '<title>'")
            print(f"\nLive at: {url}")
    finally:
        c.close()


COMMANDS = {
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
