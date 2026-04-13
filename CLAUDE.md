# CLAUDE.md — AIAgent-Hub

## Project
- **Name**: AIAgent-Hub
- **Purpose**: 100 universal prompts for Claude Code
- **Stack**: React 19 + Vite + Hono API + SQLite + Vitest
- **Port**: 5173 (dev), 3000 (Docker/production)

## Commands
```bash
npm run dev      # Dev server localhost:5173
npm run build    # Production build → dist/
npm test         # 220 unit tests (vitest)
npm run test:e2e # E2E tests (playwright)
```

## Architecture
- `src/App.jsx` — Single-file SPA (all UI, ~2000 lines)
- `src/App.jsx:85` — `const Z = "..."` — compressed prompt data (zlib+base64)
- `api/server.cjs` — Hono API server (auth, CRUD, SQLite)
- `api/db.cjs` — SQLite database setup
- `cli/index.cjs` — CLI tool (list, show, search, copy, export)
- `bot/telegram.cjs` — Telegram bot
- `vscode-extension/` — VS Code extension
- `scripts/` — Data generation scripts

## Data Format
Prompts are compressed in `const Z` inside App.jsx. To modify:
1. Use `scripts/generate-prompts.cjs` or `scripts/add-batch*.cjs`
2. These scripts read current data, add/modify, recompress, write back
3. Data structure: `{ P: Prompt[], COMBOS, CHEAT, QUICK_CMDS, CONFIGS }`

## Key Patterns
- Prompt IDs: `rl-*` (ralph-loop), `rv-*` (review), `sm-*` (simplify), `cm-*` (commit), `fd-*` (feature-dev), `lp-*` (loop)
- Role translations: `t.r[role]` with `||role` fallback
- All data fields need defaults: `CHEAT={}`, `QUICK_CMDS={ru:[],en:[]}`, etc.
- Combo .ids field must exist (some code uses .ids, some .agents)

## Anti-patterns
- Don't modify compressed Z string directly — use scripts
- Don't add data fields without defaults in destructuring (line ~289)
- Don't forget role translations in both ru and en `t.r` objects
- Don't use `any` — TypeScript strict
