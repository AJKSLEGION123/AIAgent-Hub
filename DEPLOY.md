# Deployment

AIAgent-Hub runs in two places:

| Target | Where | Trigger |
| --- | --- | --- |
| **Vercel** (`https://ai-agent-hub.net`) | managed by Vercel | automatic on `git push origin master` |
| **Self-hosted** (Docker + Cloudflare Quick-tunnel) | `pm.lanmaster.kz` | `scripts/ssh-deploy-docker.py deploy` after push |

Both serve the same code. Vercel auto-builds; self-hosted needs one command after a push.

---

## 1. Vercel (automatic)

```bash
git push origin master
```

Vercel picks up the push, runs `vite build` from `vercel.json`, promotes to production in ~30 s.

---

## 2. Self-hosted

### First-time setup (already done, documented for the record)

Three things were put in place so deploys don't need a password and don't risk losing custom files:

1. **SSH key-based auth.** A dedicated ed25519 keypair lives at `~/.ssh/aiagent-deploy` on the developer machine; the public half is in `~integrator/.ssh/authorized_keys` on the server. After that, no `SSH_PASS` is needed.

   Reproduce on a new dev machine:

   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/aiagent-deploy -N ""
   SSH_PASS='…' python scripts/ssh-deploy-docker.py setup-key
   ```

2. **Server directory is a git clone of `origin/master`.** `/home/integrator/agent-hub/` is a real `git` checkout (was a flat copy before 2026-04-17). Deploys are now `git reset --hard origin/master` + docker build. The previous flat copy is preserved at `/home/integrator/agent-hub.backup-<ts>/` and can be removed once you are happy with the new setup.

3. **Cron job keeps `.webapp_url` fresh.** A user-level cron runs every minute, greps the latest `*.trycloudflare.com` URL out of the tunnel log, and writes it to `/home/integrator/.webapp_url`. Installed via:

   ```bash
   python scripts/ssh-deploy-docker.py setup-url-cron
   ```

### Everyday workflow

```bash
# 1. make changes, commit
git add -A && git commit -m "your change"

# 2. push to GitHub (Vercel starts its own build here)
git push origin master

# 3. deploy to self-hosted server (key auth, ~60–90 s)
python scripts/ssh-deploy-docker.py deploy
```

What the `deploy` command does, in order:

1. `git fetch && git reset --hard origin/master` — snap the server dir to the latest.
2. `docker compose build aiagent-hub` — new image from updated sources.
3. `docker compose up -d aiagent-hub` — recreate the container.
4. Probes `localhost:3000` and the current Cloudflare Quick-tunnel URL; prints the live URL.

### Helper commands

```bash
python scripts/ssh-deploy-docker.py status       # container, URL, HTTP health, last 3 commits
python scripts/ssh-deploy-docker.py url          # just the public URL
python scripts/ssh-deploy-docker.py sync-url     # force-refresh ~/.webapp_url
python scripts/ssh-deploy-docker.py setup-key    # (re)install deploy key; needs SSH_PASS
python scripts/ssh-deploy-docker.py setup-url-cron  # reinstall the URL-refresh cron
```

### Server layout reference

| Item | Path |
| --- | --- |
| Host | `pm.lanmaster.kz:34221`, user `integrator` |
| Project | `/home/integrator/agent-hub` — git clone of origin/master |
| Backup (pre-git conversion) | `/home/integrator/agent-hub.backup-20260417_151337` |
| Container | `aiagent-hub` (image `agent-hub-aiagent-hub:latest`), restart `unless-stopped` |
| Port | `0.0.0.0:3000 → 80/tcp` |
| Cloudflared process | `/home/integrator/bin/cloudflared tunnel --url http://127.0.0.1:3000` |
| Tunnel log | `/home/integrator/agent-hub-tunnel.log` |
| URL cache | `/home/integrator/.webapp_url` |
| URL refresh script | `/home/integrator/bin/refresh-webapp-url.sh` (every minute via cron) |

---

## 3. Open items the user still has to decide on

### Named Cloudflare tunnel (stable subdomain)

`cloudflared tunnel --url …` generates a random `*.trycloudflare.com` subdomain that rotates every time the process restarts. The URL cron hides this from scripts, but a user who bookmarked yesterday's link will still hit 404 after a restart.

**Permanent fix**: migrate to a named tunnel and attach a subdomain of a domain you own (the server already has a named tunnel `ais-lvg` serving `ais-lvg.com`). Needs Cloudflare account access:

1. Add hostname `agent.ais-lvg.com → http://127.0.0.1:3000` in `~/.cloudflared/config.yml`.
2. Create DNS CNAME in Cloudflare dashboard: `agent.ais-lvg.com → <tunnel-id>.cfargotunnel.com`.
3. Kill the quick-tunnel (`pkill -f 'tunnel --url'`) and restart `cloudflared tunnel run ais-lvg`.

### Disable SSH password auth

Key auth works. Password auth is still enabled (for recovery). To disable, on the server:

```bash
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl reload ssh
```

Do this **only** after confirming your key works from a fresh shell.

### Rotate or lock down the password

The password for `integrator` has been visible in recent chat history. Even with key auth, a compromised password lets someone in over the LAN or any path that bypasses the key check. Change it with `passwd` on the server.
