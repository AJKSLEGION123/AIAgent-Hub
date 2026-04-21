# AIAgent-Hub v12

**10 009 промтов · 74 комбо · 30 шпаргалок · 110 CLI-команд** для Claude Code + Opus 4.7 · 1M context.

Полевой справочник автономной разработки. Каждый промт готов к копированию в Claude Code, содержит фазу полной разведки проекта и **[AUTONOMY-v4]** wrapper — даёт агенту полные права + арсенал (Browser MCP, все MCP servers, skills, plugins, shell, web) + auto-commit/push/deploy после каждого улучшения + браузерную верификацию post-deploy + бесконечный цикл улучшений.

**Проект-level политика:** любая сессия Claude Code, открытая в этом репо, автоматически работает в full-autonomy режиме — см. [`CLAUDE.md`](./CLAUDE.md) (AUTONOMY-v4 policy) и [`.claude/settings.json`](./.claude/settings.json) (expanded Bash allowlist + `defaultMode: auto` + safety hooks). Копировать промт необязательно — агент готов к работе сразу.

Live: <https://ai-agent-hub.net>

## Quick start

```bash
# 1. Запусти Claude Code с Opus 4.7 1M
claude --model claude-opus-4-7[1m]

# 2. Открой ai-agent-hub.net, выбери промт для задачи
# 3. Нажми "Копировать"
# 4. Вставь в Claude Code — агент работает автономно
```

## Что внутри

| Раздел | Количество |
|---|---|
| Промты | **10 009** |
| Воркфлоу-комбо | **74** |
| Шпаргалки | **30** |
| CLI-команды | **110** |
| Config-шаблоны | **13** |
| Категории | **12** |

## Содержимое

**Промты (10 009):** 20 языков × 35 задач, 40 фреймворков × 10 операций, 15 БД × 12 операций, AWS/GCP/Azure/Cloudflare × сервисы, паттерны проектирования, алгоритмы, тестирование, безопасность, performance, e-commerce, SaaS, analytics, CMS, auth, платежи, observability, web3, DX. Плюс **∞ Opus 4.7 Perfectionist Suite** + **∞ God-Mode Autonomous** — премиум-промты с полной автономией и всеми инструментами для любого проекта.

**Комбо (74):** ∞ Perpetual Improvement, AI Product Launch, Next.js Production, E-commerce Launch, SaaS Bootstrap, Zero-Trust Security, Observability Stack, Mobile MVP, Data Pipeline, Performance Triage, Incident Response Playbook, Event-Driven Architecture, Multi-Tenant SaaS, Full-Stack AI Agent, CI/CD Modernization, Testing Pyramid Rollout и др.

**Шпаргалки (30):** Claude Code, Git, npm/pnpm, Docker, Testing, TypeScript, React, Prisma, Tailwind CSS, SQL, Python, Go, Rust, Kubernetes, Redis, Nginx, Next.js, Cargo, curl, openssl, ffmpeg, jq, awk, Homebrew, Terraform, GitHub Actions, Kafka, psql, Linux perf.

**CLI-команды (110):** 14 категорий — Разработка, Тестирование, Git, Docker, Claude Code, Поиск и навигация, npm / pnpm, Деплой, Kubernetes, Docker Compose, PostgreSQL, Bun, Python/uv.

## Команды Claude Code внутри промтов

```
/ralph-loop "задача" --completion-promise "DONE"   — автономный цикл
/feature-dev                                        — guided разработка
/review-pr                                          — мульти-агент PR ревью
/code-review                                        — ревью кода / A11y / DB
/simplify                                           — рефакторинг / упрощение
/commit                                             — smart commit
/loop 3m "задача"                                   — рекурсивный мониторинг
```

## Стек

- **Frontend:** React 19 + Vite 8 + inline styles
- **Typography:** Fraunces (display), Instrument Serif (body), JetBrains Mono (data/code)
- **Palette:** espresso `#0a0806` + cream `#ece3ce` + burnt orange `#e86a2a`
- **Data:** zlib+base64 blob в `src/App.jsx` (`const Z`)
- **API:** Hono + SQLite (api/server.cjs)
- **Tests:** Vitest (220 unit) + Playwright (E2E)
- **Deploy:** Vercel auto + self-hosted Docker через `scripts/ssh-deploy-docker.py`

## Dev

```bash
git clone https://github.com/AJKSLEGION123/AIAgent-Hub.git
cd AIAgent-Hub
npm install
npm run dev          # localhost:5173
npm test             # 220 unit tests
npm run build        # production -> dist/
node scripts/check-data.cjs   # data integrity check
```

## Data contribution

Промты хранятся в сжатом `const Z` внутри `src/App.jsx`. Для расширения создай новый `scripts/add-batch<N>.cjs` (примеры в `scripts/archive/`) и запусти:

```bash
node scripts/add-batch<N>.cjs      # добавляет к data.P, пересжимает Z
node scripts/check-data.cjs        # проверяет integrity (0 dupes, 0 broken refs)
npm run build && npm test          # проверка сборки и тестов
```

## Deploy

**Vercel** (production автоматически на `git push origin master`):

```bash
git add -A && git commit -m "..." && git push origin master
```

**Self-hosted** (pm.lanmaster.kz + Cloudflare Tunnel):

```bash
python scripts/ssh-deploy-docker.py deploy   # git reset + docker build + smoke test
python scripts/ssh-deploy-docker.py rollback # откат к HEAD~1
python scripts/ssh-deploy-docker.py status   # контейнер + URL + health
```

## Архитектура

```
src/App.jsx              — SPA (~2200 строк): UI + state + декомпрессия Z
api/server.cjs           — Hono API (auth, CRUD)
api/db.cjs               — SQLite setup
cli/index.cjs            — CLI tool (list, show, search, copy, export)
bot/telegram.cjs         — Telegram бот
vscode-extension/        — VS Code расширение (Ctrl+Shift+A)
scripts/                 — генерация данных + deploy
scripts/archive/         — старые batch скрипты
```

## License

MIT — см. [LICENSE](LICENSE).
