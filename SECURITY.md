# Security Notes — AIAgent-Hub

## Scope

Production surface = **static SPA on Vercel** (`ai-agent-hub.net`) + **self-hosted Docker** via Cloudflare Tunnel. These are purely client-side — no user data is processed server-side in production.

Development artifacts in the repo (`api/server.cjs`, `bot/telegram.cjs`) are **not deployed** to production. They exist for local development / future integration.

## Production (live site)

### Protections in place
- **CSP** (`index.html`): `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'`
- **HTTPS-only** — both Vercel + Cloudflare Tunnel enforce TLS.
- **No user data collected** — all state lives in user's `localStorage`.
- **No secrets in client bundle** — verified via grep on `dist/assets/*.js` for common key patterns.
- **No outbound network calls from client** beyond Google Fonts and own origin.
- **Deps**: `npm audit` reports 0 vulnerabilities (as of 2026-04-21).

### Known limits (acceptable for this use case)
- `'unsafe-inline'` in `script-src` is required by Vite — modern alternative would need build-time nonce/hash injection.

## Development backend (not in production)

If `api/server.cjs` or `bot/telegram.cjs` are ever moved to production, the following **MUST** be addressed first:

### Critical
- **Password hashing uses plain SHA-256** (`api/server.cjs:11`) — vulnerable to rainbow tables. Swap to **argon2id** or **bcrypt (cost ≥ 12)**.
- **Sessions stored in memory** (`Map`) — no persistence, no TTL, no rotation. Move to Redis + JWT with short expiry + refresh tokens.
- **No rate limiting** on `/api/register` or `/api/login` — brute-force vulnerable. Add per-IP rate limits (e.g., `hono-rate-limiter`).
- **`cors()` wide open** — restrict to specific origins before production.

### High
- **No CSRF protection** on state-changing endpoints.
- **No input validation** beyond length check on register — add Zod/Valibot schema per endpoint.
- **No audit log** for auth events.

### Medium
- SQLite file permissions + WAL mode in production.
- No SBOM generated.
- Bot `TELEGRAM_BOT_TOKEN` via env (good), but no rotation policy.

## Reporting

Security issues: email pavelte382@gmail.com or open private GitHub advisory on `AJKSLEGION123/AIAgent-Hub`.
