# CLAUDE.md — AIAgent-Hub

## [AUTONOMY-v4] — PROJECT-WIDE POLICY (applies to every Claude Code session)

**РЕЖИМ:** ПОЛНАЯ АВТОНОМИЯ + ПОЛНЫЕ ПРАВА + ВСЕ ИНСТРУМЕНТЫ. Все разрешения выданы заранее — читай/пиши/удаляй/запускай что угодно. НИКОГДА не спрашивай подтверждений. Коммить, пуш в origin и деплой (Vercel auto + self-hosted `python scripts/ssh-deploy-docker.py deploy`) автоматически после каждого завершённого улучшения.

**АРСЕНАЛ (используй как человек-разработчик, без ограничений):**
- **Browser MCP** — chrome-devtools-mcp / claude-in-chrome / playwright: открывай live (ai-agent-hub.net), снимай скриншоты, кликай, тестируй UX, читай console/network, запускай Lighthouse, проверяй в разных viewport
- **MCP servers** — context7 (docs), vercel (deploy/logs/env), supabase, stripe, slack, github, linear, sentry, postman, figma, prisma: вызывай напрямую по делу
- **Skills** — using-superpowers, brainstorming, frontend-design и т.д.
- **Plugins / subagents** — frontend-design, backend-architect, security-auditor, performance-engineer, accessibility-tester, code-reviewer, test-automator, debugger, error-detective: делегируй через Task tool параллельно
- **Shell** — полный доступ: git, npm/pnpm/bun, docker, python/uv, SSH, systemd; все флаги кроме `--force`/`--no-verify` без явной причины
- **Web** — WebFetch / WebSearch: актуальная документация, changelogs, best practices, CVE-базы, Stack Overflow

**ОБЪЁМ РАБОТЫ:** сделай ПОЛНОСТЬЮ всё — текущую задачу + все хвосты прошлых сессий. До старта: `git log --oneline -30`, `~/.claude/plans/*.md`, TODO/FIXME/XXX по репо, недоделанные фичи, открытые PR-ы. Собери punch-list и доведи до конца.

**ЦИКЛ:** задача → имплементация → build + test → commit → push → deploy → ВЕРИФИКАЦИЯ В БРАУЗЕРЕ (navigate на live, скриншот, Lighthouse, проверка console errors, network) → поиск новых улучшений (perf, a11y, SEO, security, tests, UI polish, dead code, bundle, DX) → следующая итерация. Остановка только по явному STOP.

**ЕСЛИ НЕЯСНО:** задай 1-3 вопроса с 2-4 вариантами в формате `Q1: <вопрос> / A) / B) / C)`. После ответов — без повторов.

**Проект-level разрешения:** `.claude/settings.json` в корне репо уже содержит нужный Bash allowlist + `defaultMode: "auto"` + хуки безопасности. Любая сессия, открытая в этом репозитории, автоматически работает в full-autonomy режиме.

---

## Project
- **Name:** AIAgent-Hub
- **Purpose:** 3 299 портативных промтов + 76 комбо + 30 шпаргалок + 108 CLI команд для Claude Code с моделью Opus 4.7 (1M context). После массивной консолидации (с 10 014 → 3 299) каждый промт уникален, [AUTONOMY-v4], работает в любом проекте.
- **Stack:** React 19 + Vite 8 + inline styles + Hono API + SQLite + Vitest
- **Port:** 5173 (dev), 3000 (Docker/production)
- **Live:** https://ai-agent-hub.net (Vercel) + pm.lanmaster.kz (self-hosted via Cloudflare Tunnel)
- **Repo:** github.com/AJKSLEGION123/AIAgent-Hub

## Commands
```bash
npm run dev      # Dev server localhost:5173
npm run build    # Production build → dist/
npm test         # vitest (api.test.js skips when API offline — expected)
npm run check    # lint + typecheck + knip + check-data + check-i18n + test + build
npm run test:e2e # E2E tests (playwright)

node scripts/check-data.cjs                 # data integrity check
node scripts/check-i18n.cjs                 # i18n hard-fail gates (iter124+)
python scripts/ssh-deploy-docker.py deploy  # self-hosted deploy
python scripts/ssh-deploy-docker.py rollback
```

## Architecture
SPA was a single 2.4k-line `App.jsx` until iter113–122 extracted concerns
into focused modules. App.jsx is still the orchestrator (~2.2k lines:
imports, App() boot wrapper, AgentHub() main UI) but now imports from:

- `src/data.js` — `export const Z = "..."` — compressed catalog blob
  (~600KB raw, code-split via dynamic `import("./data.js")` since iter125)
- `src/icons.jsx` — inline SVG icon components (`IconStats`, `IconLog`, …)
- `src/theme-utils.js` — `font` / `fontDisplay` typography stacks +
  `alpha()` / `textOn()` (WCAG-luminance auto-contrast)
- `src/components.jsx` — `Pill` / `CBtn` / `Toast` / `EmptyState` / `HL`
- `src/constants.js` — `TH` (dark/light tokens) / `MC`/`ML`/`MI` (model
  maps, single model `opus47m`) / `pl()` Russian pluralization
- `src/translations.js` — `T = { ru, en, kk }` role-translation maps
- `src/app-styles.css` — extracted from inline `<style>` template
- `src/utils/decompress.ts` — async decompress helper (Web Streams)
- `src/utils/i18n.ts` — `detectLanguage()` for boot-UI lang choice
- `src/hooks/useLocalStorage.ts` — typed wrapper with quota warnings
- `src/ErrorBoundary.jsx` — lang-aware ErrorBoundary (replaced inline)

`src/utils/**` and `src/hooks/**` are locked at 100% coverage thresholds
in `vite.config.js`. App.jsx is intentionally e2e-tested (jsdom can't run
DecompressionStream).

Other entry points:
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
Prompts compressed inside `const Z` (in `src/data.js` since iter122). Each entry:
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
- **Role translations:** `t.r[role]` with `||role` fallback; add to all three of `ru` + `en` + `kk` in `T` (`src/translations.js`)
- **All data fields need defaults** in the destructuring inside `AgentHub()`: `CHEAT={}`, `QUICK_CMDS={ru:[],en:[]}`, etc.
- **Combo has both `.ids` and `.agents`** — set both to same array
- **All prompts wrapped with `[AUTONOMY-v4]`** preamble (evolved from v1→v2→v3→v4 via `scripts/archive/upgrade-autonomy-v*.cjs`)
- **i18n hard-fail gates** (`scripts/check-i18n.cjs`, all locked at 0):
  binary ru-only ternaries with no kk fallback, identical-branch ternaries,
  locale-blind aria-label/title/placeholder/alt literals, Cyrillic JSX text
  content (`<tag>Текст</tag>` shape) — all fail CI immediately

## UI polish patterns
- Use `textOn(hex)` for auto-contrast text on colored backgrounds
- Use `c.onAccent` token for dark-theme-safe text on accent bg
- Use `.label-tech-sm` class for tracked-caps metadata labels
- Use `.body-serif` class for readable paragraph text
- Use `.numeric` class for tabular-aligned numbers
- Use inline SVG icons (Icon* components) instead of emoji for nav/buttons

## Anti-patterns
- Don't modify the compressed Z string in `src/data.js` directly — use scripts
- Don't add data fields without defaults in `AgentHub()`'s destructuring
- Don't forget role translations in all three of `ru` + `en` + `kk` `T.r` maps
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
