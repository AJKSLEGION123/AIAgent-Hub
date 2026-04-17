# Deployment

AIAgent-Hub runs in two places:

| Target | Where | Trigger |
| --- | --- | --- |
| **Vercel** (`https://ai-agent-hub.net`) | managed by Vercel | automatic on `git push origin master` |
| **Self-hosted** (Docker + Cloudflare Quick-tunnel) | `pm.lanmaster.kz` | manual via [`scripts/ssh-deploy-docker.py`](scripts/ssh-deploy-docker.py) |

Both ultimately serve the same code, but the self-hosted copy is a flat snapshot (not a git clone), so it needs an explicit file-upload + rebuild step.

---

## 1. Vercel (automatic)

```bash
git push origin master
```

Vercel picks up the push, runs `vite build` from `vercel.json`, and promotes to production. No other action needed.

---

## 2. Self-hosted (manual)

### Prerequisites

```bash
pip install paramiko          # Python SSH client used by the deploy script
```

Set `SSH_PASS` for the `integrator` user. Prefer a key instead of a password in the long run (see §3).

### One-shot deploy

```bash
# build not required locally — the Dockerfile builds with vite inside the image
SSH_PASS='***' python scripts/ssh-deploy-docker.py deploy
```

What the script does:

1. **SFTP-upload** the files listed in `FILES` (default: `src/App.jsx`, `index.html`) to `/home/integrator/agent-hub/`.
2. `docker compose build aiagent-hub` — rebuilds the `agent-hub-aiagent-hub:latest` image (Node 22 → vite build → nginx:alpine).
3. `docker compose up -d aiagent-hub` — recreates the container on port `3000:80`.
4. Probes `localhost:3000` and the current Cloudflare Quick-tunnel URL. Prints the live URL at the end.

If you edit more files than `src/App.jsx` / `index.html`, extend the `FILES` list at the top of the script.

### Other commands

```bash
SSH_PASS='***' python scripts/ssh-deploy-docker.py status
# → prints container status, cached URL in ~/.webapp_url, latest tunnel URL, HTTP probes

SSH_PASS='***' python scripts/ssh-deploy-docker.py url
# → prints just the current public URL (scrapes the last *.trycloudflare.com from the tunnel log)

SSH_PASS='***' python scripts/ssh-deploy-docker.py sync-url
# → updates /home/integrator/.webapp_url to the current tunnel URL
#   (run this if the cloudflared process restarted and the URL in the file is stale)
```

### Server layout

- **Host**: `pm.lanmaster.kz:34221`, user `integrator` (member of `sudo`, `docker`)
- **Project**: `/home/integrator/agent-hub/` — flat copy, *not* a git repo. `git pull` will not work.
- **Container**: `aiagent-hub` (image `agent-hub-aiagent-hub:latest`), restarts `unless-stopped`
- **Published port**: `0.0.0.0:3000 → 80/tcp`
- **Cloudflared**: `/home/integrator/bin/cloudflared tunnel --url http://127.0.0.1:3000` as PID 1286260
- **Tunnel log**: `/home/integrator/agent-hub-tunnel.log` — first registered URL is the permanent one *for the lifetime of this cloudflared process*
- **URL cache**: `/home/integrator/.webapp_url`

---

## 3. Known issues & future work

### Cloudflare Quick-tunnel URL is not stable

`cloudflared tunnel --url …` gives a random `*.trycloudflare.com` subdomain that changes **every time** the process restarts. The user-visible effect is "the link I had yesterday is 404 today".

**Mitigation today**: `.webapp_url` is the source of truth — `sync-url` command updates it from the tunnel log.

**Proper fix**: migrate to a named tunnel and attach a subdomain of a domain you own (e.g. `agent.ais-lvg.com`, since there is already a named tunnel `ais-lvg` on this server). Requires Cloudflare account access. Outline:

1. `cloudflared tunnel create aiagent-hub` (or add hostname to the existing `ais-lvg` tunnel in `~/.cloudflared/config.yml`)
2. Add a DNS CNAME record in Cloudflare dashboard: `agent.ais-lvg.com → <tunnel-id>.cfargotunnel.com`
3. Kill the `--url` quick-tunnel, restart the named tunnel
4. Create a systemd unit so cloudflared restarts on reboot

### SSH password auth

Switch to key-based auth for deployments. From this repo, on a trusted machine:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/aiagent-deploy -C deploy@aiagent-hub
ssh-copy-id -i ~/.ssh/aiagent-deploy.pub -p 34221 integrator@pm.lanmaster.kz
# then edit ssh-deploy-docker.py to use key_filename= instead of password=
```

After the key works, disable password auth server-side:

```bash
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl reload ssh
```

### Making the project a git checkout

Right now every deploy is a file-upload + docker rebuild. If the directory on the server became a git clone, deploys would become `git pull && docker compose up -d --build`. On the server:

```bash
cd /home/integrator/agent-hub
git init && git remote add origin https://github.com/AJKSLEGION123/AIAgent-Hub.git
git fetch origin && git reset --hard origin/master
```

Then `scripts/ssh-deploy-docker.py` can be simplified to just run those commands over SSH.
