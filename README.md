# AIAgent-Hub v11.0

188 универсальных промтов для Claude Code. Каждый промт начинается с реальной команды (`/ralph-loop`, `/feature-dev`, `/review-pr`, `/code-review`, `/simplify`, `/loop`) и включает фазу полного изучения проекта.

## Quick Start

```bash
# 1. Открой сайт
https://ai-agent-hub.net

# 2. Выбери промт для задачи
# 3. Скопируй команду
# 4. Вставь в Claude Code CLI
# 5. Агент изучит проект и работает автономно
```

## Что внутри

| Метрика | Значение |
|---|---|
| Промты | **188** универсальных |
| Комбо | **39** готовых пакетов |
| Категории | **12** автоклассификация |
| Шпаргалки | **16** технологий |
| CLI Commands | **10** quick commands |
| Config Templates | **13** шаблонов |

## Категории (12)

| Категория | Примеры |
|---|---|
| **AI / LLM** | RAG Pipeline, AI Agent, Prompt Engineering |
| **Security** | Audit, Auth System, 2FA, RBAC, OWASP |
| **Testing / QA** | TDD, E2E, Project Supervisor, Output QA, Auto-Polish |
| **Performance** | Cache, Bundle, DB Optimization |
| **DevOps / CI** | Docker, K8s, GitHub Actions, Monitoring |
| **Frontend / UI** | Dashboard, Design System, Dark Mode, Animations |
| **Backend / API** | CRUD, REST, GraphQL, WebSocket, API Gateway |
| **Data & Files** | Registry Audit, CSV Import, PDF, Migration |
| **Integrations** | Webhooks, Email, Upload, Notifications |
| **Architecture** | Monorepo, Microservices, API Versioning |
| **Documentation** | README Gen, OpenAPI, Docs |
| **Project Setup** | Init, Git Workflow, Env Config, CI/CD |

## Команды Claude Code

```
/ralph-loop "задача" --completion-promise "DONE"   # Автономный цикл
/feature-dev                                        # Guided разработка
/review-pr                                          # Мульти-агент PR ревью
/code-review                                        # Ревью кода / A11y / DB
/simplify                                           # Рефакторинг / упрощение
/commit                                             # Smart commit
/commit-push-pr                                     # Commit + Push + PR
/loop 3m "задача"                                   # Рекурсивный мониторинг
/supervise                                          # QA-начальник проекта
```

## Комбо-пакеты (39)

```
Project QA Suite    — Supervisor + Output QA + Polish + Templates + Audit
AI Application      — RAG + AI Agent + Prompt Engineering
Project Kickstart   — Setup + Config + README + CI/CD
Full Stack Feature  — CRUD API + Auth + Dashboard
Mobile Sprint       — Mobile App + Auth + Chat + Monitoring
Code Quality Blitz  — A11y + DB Review + Refactor + Security + Perf
Continuous Ops      — Health Monitor + Tests + Deploy + Deps
Frontend Sprint     — UI + формы + state + a11y + dark mode + бандл
Backend Sprint      — API + БД + auth + ошибки + логи + кэш
Security Hardening  — Аудит + фиксы + auth + env
Testing Blitz       — Unit + integration + E2E
...и ещё 28 комбо
```

## Шпаргалки (16)

Claude Code, Git, npm/pnpm, Docker, Kubernetes, Testing, TypeScript, React, Prisma, Tailwind CSS, SQL, Python, Go, Rust, Redis, Nginx

## Config Templates (13)

CLAUDE.md, ESLint, Dockerfile, GitHub Actions CI, Docker Compose, tsconfig.json, Prettier, .gitignore, vitest.config.ts, .env.example, nginx.conf, K8s Deployment, Dockerfile Multi-stage

## Платформы

| Платформа | Описание |
|---|---|
| **Web** | SPA на React 19 + Vite |
| **API** | Hono + SQLite |
| **CLI** | `node cli/index.cjs list\|show\|search\|copy` |
| **Telegram** | `node bot/telegram.cjs` |
| **VS Code** | Extension с Ctrl+Shift+A |

## Dev Setup

```bash
git clone https://github.com/AJKSLEGION123/AIAgent-Hub.git
cd AIAgent-Hub
npm install
npm run dev        # localhost:5173
npm test           # 220 tests
npm run build      # production build
```

## Docker

```bash
docker compose up -d   # localhost:3000
docker compose logs -f
```

## Stack

- **Frontend**: React 19, Vite 8, TypeScript
- **API**: Hono, better-sqlite3
- **Tests**: Vitest (220 unit) + Playwright (E2E)
- **Deploy**: Vercel (ai-agent-hub.net) + Docker

## License

MIT
