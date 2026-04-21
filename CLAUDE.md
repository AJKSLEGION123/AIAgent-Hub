# CLAUDE.md — AIAgent-Hub

## Project
- **Name:** AIAgent-Hub
- **Purpose:** 10 036 промтов + 73 комбо + 30 шпаргалок + 110 CLI команд для Claude Code с моделью Opus 4.7 (1M context)
- **Stack:** React 19 + Vite 8 + inline styles + Hono API + SQLite + Vitest
- **Port:** 5173 (dev), 3000 (Docker/production)
- **Live:** https://ai-agent-hub.net (Vercel) + pm.lanmaster.kz (self-hosted via Cloudflare Tunnel)
- **Repo:** github.com/AJKSLEGION123/AIAgent-Hub

## Commands
```bash
npm run dev      # Dev server localhost:5173
npm run build    # Production build → dist/
npm test         # 220 unit tests (vitest)
npm run test:e2e # E2E tests (playwright)

node scripts/check-data.cjs                 # data integrity check
python scripts/ssh-deploy-docker.py deploy  # self-hosted deploy
python scripts/ssh-deploy-docker.py rollback
```

## Architecture
- `src/App.jsx` — single-file SPA (~2200 lines). UI, state, Z decompression.
- `src/App.jsx:90` — `const Z = "..."` — compressed data blob (zlib + base64)
- `src/App.jsx:73` — `TH.dark` / `TH.light` — theme tokens including `onAccent` for auto-contrast
- `src/App.jsx:76` — `MC/ML/MI` — single model: `opus47m` = "Claude Opus 4.7 · 1M"
- `src/App.jsx:80` — `font` / `fontDisplay` / `fontBody` — 3-tier typography
- `src/App.jsx:84` — `alpha()` + `textOn()` — color helpers (WCAG luminance for contrast)
- `src/App.jsx:205`+ — inline SVG icon components (`IconStats`, `IconLog`, etc.)
- `api/server.cjs` — Hono API server (auth, CRUD, SQLite)
- `api/db.cjs` — SQLite database setup
- `cli/index.cjs` — CLI tool (list, show, search, copy, export)
- `bot/telegram.cjs` — Telegram bot
- `vscode-extension/` — VS Code extension (Ctrl+Shift+A)
- `scripts/archive/` — historical batch/migration scripts
- `scripts/ssh-deploy-docker.py` — self-hosted deploy with auto-rollback

## Typography (3-tier)
- **Display:** Fraunces (serif, variable SOFT/opsz axes) — h1-h3, stat numbers, combo names
- **Body:** Instrument Serif — descriptions, subtitles, readable paragraphs
- **Mono:** JetBrains Mono (with ligatures + ss01/ss02 stylistic sets) — labels, data, code

## Palette (warm editorial)
- **Dark:** bg `#0a0806` espresso / text `#ece3ce` cream / accent `#e86a2a` burnt orange / onAccent `#0a0806`
- **Light:** bg `#f5f0e6` cream / text `#1a140a` / accent `#a84a12` rust / onAccent `#f5efdd`
- **NO** indigo/purple, NO rounded corners > 2px, NO generic SaaS aesthetic

## Data Format
Prompts compressed inside `const Z`. Each entry:
```ts
{
  id: "rl-xxx" | "fd-xxx" | ...,     // prefix encodes command
  m: "/ralph-loop" | "/feature-dev" | "/review-pr" | "/code-review" | "/simplify" | "/loop" | "/commit",
  mk: "opus47m",                      // model (only opus47m remains)
  role: string,                        // role title (unique at scale)
  type: "command",
  icon: string,                        // emoji
  ac: string,                          // accent hex color
  time: "~30m" | "~1h" | "~1-2h" | ...,
  text: string,                        // full prompt text with [AUTONOMY-v1] wrapper
  desc: string,                        // 280-char human-readable description (shown in UI)
  tags: string[],
  difficulty: "beginner" | "intermediate" | "advanced",
  compact: string,                     // 400-char preview version
  v: string                            // version tag
}
```

To extend data: create `scripts/add-batch<N>.cjs` modeled on archived examples.

## Key Patterns
- **Prompt IDs:** `rl-*` (ralph-loop), `fd-*` (feature-dev), `rv-*` (review-pr), `cr-*` (code-review), `sm-*` (simplify), `cm-*` (commit), `lp-*` (loop)
- **Role translations:** `t.r[role]` with `||role` fallback; add to both `ru` + `en` + `kk` in `T` object
- **All data fields need defaults:** destructuring at line ~299 has `CHEAT={}`, `QUICK_CMDS={ru:[],en:[]}`, etc.
- **Combo has both `.ids` and `.agents`** — set both to same array
- **All prompts wrapped with `[AUTONOMY-v1]`** preamble (via `scripts/archive/wrap-autonomy.cjs`)

## UI polish patterns
- Use `textOn(hex)` for auto-contrast text on colored backgrounds
- Use `c.onAccent` token for dark-theme-safe text on accent bg
- Use `.label-tech-sm` class for tracked-caps metadata labels
- Use `.body-serif` class for readable paragraph text
- Use `.numeric` class for tabular-aligned numbers
- Use inline SVG icons (Icon* components) instead of emoji for nav/buttons

## Anti-patterns
- Don't modify compressed Z string directly — use scripts
- Don't add data fields without defaults in destructuring at line ~299
- Don't forget role translations in `ru` + `en` + `kk` `t.r` objects
- Don't use emoji as UI icons — use inline SVG from `Icon*` components
- Don't hardcode `#fff` / `#000` text color on accent backgrounds — use `textOn(cl)` or `c.onAccent`
- Don't use `border-radius > 2px` on cards/buttons — editorial aesthetic is sharp
- Don't use indigo/purple — palette is warm espresso+cream+burnt orange only
- Don't skip `npm test` + `node scripts/check-data.cjs` before deploy

## Service Worker
`public/sw.js` uses split strategy:
- HTML + navigation requests → network-first (user sees fresh index.html with latest asset hashes)
- `/assets/*` → cache-first (hash in filename makes them immutable)
- Fallback → network-first with cache fallback
`main.jsx` registers SW with 5-minute update checks and auto-reload on controllerchange.

**Bump `BUILD_ID` in public/sw.js on any deploy that needs forced cache bust.**
