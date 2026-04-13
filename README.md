# AIAgent-Hub v10.0

100 универсальных промтов для Claude Code. Каждый промт начинается с реальной команды (`/ralph-loop`, `/feature-dev`, `/review-pr`) и включает фазу полного изучения проекта.

## Quick Start

```bash
# 1. Открой сайт
https://desire-cabin-sponsor-das.trycloudflare.com

# 2. Выбери промт для задачи
# 3. Скопируй команду
# 4. Вставь в Claude Code CLI
# 5. Агент изучит проект и работает автономно
```

## Что внутри

| Метрика | Значение |
|---|---|
| Промты | **100** универсальных |
| Комбо | **23** готовых пакета |
| Шпаргалки | **5 секций, 40 команд** |
| CLI Commands | **5 групп, 18 команд** |
| Config Templates | **5 шаблонов** |

## Категории промтов

| Категория | Промты |
|---|---|
| **Feature Dev** | Feature, Guided Dev, API, UI, DB, Auth |
| **Code Quality** | PR Review, Code Review, Simplify, Types |
| **Testing** | TDD, Test Suite, E2E, Strategy |
| **Security** | Audit, Fix, Rate Limit, 2FA, OAuth |
| **Performance** | Perf, Bundle, Cache, Images |
| **DevOps** | CI/CD, Docker, Deploy, Backup, Multi-env |
| **UI Components** | Modal, Toast, Tabs, Drag, Kanban, Calendar, Forms, Filters, Skeleton, Dark Mode, Animations |
| **Full Apps** | Dashboard, Landing, Onboarding, Chat, Settings, Wizard |
| **Data** | Seed, CSV Import, PDF, Migration, Changelog |
| **Integrations** | AI/LLM, WebSocket, Email, Upload, Search, Map, Webhook, Notifications |
| **Architecture** | Review, Monorepo, Microservice, API Versioning |

## Команды Claude Code

Каждый промт начинается с одной из команд:

```
/ralph-loop "задача" --completion-promise "DONE"   # Автономный цикл
/feature-dev                                        # Guided разработка
/review-pr                                          # Мульти-агент PR ревью
/code-review                                        # Ревью текущих изменений
/simplify                                           # Упрощение кода
/commit                                             # Smart commit
/commit-push-pr                                     # Commit + Push + PR
/loop 3m                                            # Рекурсивная задача
```

## Комбо-пакеты (23)

```
Frontend Sprint     — UI + формы + state + a11y + dark mode + бандл
Backend Sprint      — API + БД + auth + ошибки + логи + кэш
Full Stack Sprint   — Feature + тесты + ревью + PR
Quality Gate        — Code review + security + simplify
Night Worker        — Рефакторинг + cleanup + обновления
Security Hardening  — Аудит + фиксы + auth + env
Performance Sprint  — Performance + bundle + cache
Project Bootstrap   — Lint + CI + Docker + docs
Testing Blitz       — Unit + integration + E2E
UI Kit              — Modal + toast + tabs + skeleton + theme
Admin Panel         — Dashboard + таблицы + роли + формы
Auth Complete       — Auth + OAuth + 2FA + RBAC
Interactive App     — Kanban + drag&drop + calendar + chat
SaaS Starter        — Auth + payments + email + deploy
AI-Powered          — LLM + API + UI + deploy
Landing + Marketing — Landing + SEO + аналитика + адаптив
Data Operations     — Сидинг + импорт + PDF + бэкапы
```

## Платформы

| Платформа | Описание |
|---|---|
| **Web** | SPA на React + Vite |
| **API** | Hono + SQLite (регистрация, CRUD, рейтинги) |
| **CLI** | `node cli/index.cjs list\|show\|search\|copy` |
| **Telegram** | `node bot/telegram.cjs` (8 команд) |
| **VS Code** | Extension с Ctrl+Shift+A поиском |

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

- **Frontend**: React 19, Vite, TypeScript
- **API**: Hono, better-sqlite3
- **Tests**: Vitest (220 unit) + Playwright (E2E)
- **Deploy**: Docker + nginx + Cloudflare Tunnel

## License

MIT
