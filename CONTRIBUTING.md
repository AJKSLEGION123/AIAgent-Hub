# Contributing to AIAgent-Hub

Спасибо за интерес! Этот документ описывает как развернуть проект, какие проверки
обязательны перед commit, и как добавлять/модифицировать промты.

## Setup

Предполагается **Node.js 22+** и **Python 3.11+** (последний — только для
self-hosted deploy через SSH).

```bash
git clone https://github.com/AJKSLEGION123/AIAgent-Hub.git
cd AIAgent-Hub
npm install
# опционально, для self-hosted deploy:
pip install -r scripts/requirements.txt
```

## Quality gates

Запустите **одну команду** перед коммитом — она цепляет все 5 проверок
в том же порядке как CI (fail-fast — самые быстрые сначала):

```bash
npm run check
# = lint → typecheck → check-data → test → build
```

Или по одной если нужно изолировать падение:

```bash
npm run lint          # eslint, ноль warnings
npm run typecheck     # tsc --noEmit, строгий режим
node scripts/check-data.cjs   # data integrity (zero broken refs/dupes)
npm test              # vitest run — ~250 unit, ~9 skipped когда api offline
npm run build         # vite build
```

E2E (медленные, опциональные локально, обязательны в CI):

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

## Development workflow

```bash
npm run dev            # vite dev server, localhost:5173
npm run dev:all        # dev + локальный API (concurrently)
npm run api            # только API (api/server.cjs, port 3001)
npm run test:watch     # vitest watch
```

## Прежде чем добавлять промты

Каталог прошёл массивную консолидацию (10 014 → 3 299) — формульные per-language
матрицы удалены сознательно. Прежде чем добавить промт, спросите:

- Существует ли уже похожий промт? (`npm run dev` + поиск в UI)
- Это **уникальный workflow**, или вариация существующего по языку/стеку? Если
  второе — лучше **обновить** существующий промт чтобы он покрывал больше стеков,
  чем создавать дубль.
- Промт **портативен**? Должен работать в любом проекте, не быть привязан к
  AIAgent-Hub-specific путям/именам.
- Содержит ли `[AUTONOMY-v4]` wrapper (для `rl-*` / `lp-*` командных промтов)?

## Добавление промтов

Промты хранятся как compressed JSON в `src/App.jsx` (`const Z`). Прямое
редактирование запрещено — используйте batch-скрипт:

```bash
# 1. Создайте scripts/add-batch-<topic>.cjs по образцу scripts/archive/add-batch-self-heal.cjs
# 2. Запустите:
node scripts/add-batch-<topic>.cjs
node scripts/check-data.cjs    # проверка integrity
npm test                       # регрессия
npm run build                  # build verifies
# 3. После merge переместите скрипт в scripts/archive/
```

### Prompt schema (post-v13)

```js
{
  id: "rl-foo",          // префикс: rl=ralph-loop, fd=feature-dev,
                         //          lp=loop, rv=review-pr, cr=code-review,
                         //          sm=simplify, cm=commit
  m: "/ralph-loop",      // slash command, должен соответствовать id-prefix
  mk: "opus47m",         // model key (текущий: opus47m = Claude Opus 4.7 · 1M)
  role: "Foo Workflow",  // unique role title (~3-6 слов)
  type: "command",
  icon: "🚀",
  ac: "#e86a2a",         // accent hex (warm palette: espresso/cream/burnt-orange)
  time: "~2-3h",
  text: "/ralph-loop \"[AUTONOMY-v4]\\n...\"",  // полный промт ≥ 1500 chars
  desc: "Краткое 1-3 предложения что промт делает (показывается в UI карточке)",
  tags: ["foo", "workflow"],
  difficulty: "intermediate",  // beginner | intermediate | advanced
  output: "What the prompt produces",
  related: ["rl-bar"],         // ID's существующих промтов
  v: "13.0",                   // версия в которой добавлен
  compact: "First 400 chars",  // короткая версия для compact view
}
```

## Code style

- React 19 + Vite 8 single-file SPA (`src/App.jsx`)
- Inline styles (`style={{...}}`) — **без** Tailwind/styled-components/CSS modules
- TypeScript для `src/utils/*` и `src/hooks/*`; JSX/JS для App.jsx
- `memo()` для pure components, `useMemo`/`useCallback` для дорогого
- `data-active="true"` атрибуты для CSS-target состояний (не классы)
- **Палитра**: warm editorial (espresso `#0a0806`, cream `#ece3ce`, burnt-orange
  `#e86a2a`). НЕ индиго/purple, НЕ generic SaaS aesthetic
- **Border-radius ≤ 2 px** — sharp edges, editorial feel

## Tests

- Unit: `src/test/*.test.{ts,tsx,js,jsx}` — vitest, jsdom env
- E2E: `e2e/*.spec.js` — playwright, base URL `localhost:5173`
- API tests skip-if-offline: `describe.skipIf(!serverUp)` — see `src/test/api.test.js`
- Coverage: `npm test -- --coverage` — `src/utils/` и `src/hooks/` должны быть
  100 % lines (E2E covers App.jsx)
- E2E patterns:
  - **Always-present** UI → `expect(btn).toBeVisible()` + click (fail loud)
  - **Conditional** UI (viewport/lang) → wrap в условие но включай `test.skip(...)`,
    не silent-pass

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): add new feature
fix(scope): bug fix
perf(scope): performance improvement
refactor(scope): no behavior change
test(scope): tests added/changed
docs(scope): documentation
chore(deps): dep bump (auto-generated by Dependabot)
chore(ci): CI workflow change
```

Atomic коммиты — один concern на коммит. Сообщение объясняет *почему*, не *что*
(diff показывает что).

## Deploy

- **Vercel**: автоматически на push в `master` → https://ai-agent-hub.net
- **Self-hosted** (pm.lanmaster.kz через Cloudflare Tunnel):
  ```bash
  python scripts/ssh-deploy-docker.py deploy   # с retry+rollback
  python scripts/ssh-deploy-docker.py rollback # к HEAD~1
  python scripts/ssh-deploy-docker.py status   # health check
  ```

## Dependencies

Dependabot опен PR-ы еженедельно (Mon 06:00 Asia/Almaty), grouped по доменам
(react, eslint, tests, build). Major-bump гарантия проверки local: запустить
все 5 quality gates выше + `npm run test:e2e`.

## Reporting issues

Безопасность: см. [SECURITY.md](./SECURITY.md).
Bugs/features: open issue на GitHub с минимальным репро.

## License

[MIT](./LICENSE).
