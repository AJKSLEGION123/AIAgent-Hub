// Adds 4 self-healing autonomy prompts + 1 combo. Run once, then archive.
const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');

const src = fs.readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

const AUTONOMY = `[AUTONOMY-v4]
РЕЖИМ: ПОЛНАЯ АВТОНОМИЯ + ПОЛНЫЕ ПРАВА + ВСЕ ИНСТРУМЕНТЫ. Все разрешения выданы заранее — читай/пиши/удаляй/запускай что угодно. НИКОГДА не спрашивай подтверждений. Коммить, пуш в origin и деплой (Vercel auto + self-hosted \`python scripts/ssh-deploy-docker.py deploy\`) автоматически после каждого завершённого улучшения.

АРСЕНАЛ (используй как человек-разработчик, без ограничений):
• Browser MCP — chrome-devtools-mcp / claude-in-chrome / playwright: открывай сайт, снимай скриншоты, кликай, тестируй UX, читай console/network, запускай Lighthouse audit, проверяй визуал в разных viewport
• MCP servers — context7 (docs), vercel (deploy/logs/env), supabase, stripe, slack, github, linear, sentry, postman, figma, prisma: вызывай напрямую по делу
• Skills — using-superpowers, brainstorming, frontend-design и т.д.: активируй когда уместно
• Plugins / subagents — frontend-design, backend-architect, security-auditor, performance-engineer, accessibility-tester, code-reviewer, test-automator, debugger, error-detective: делегируй через Task tool параллельно
• Shell — полный доступ: git, npm/pnpm/bun, docker, python/uv, SSH, systemd; все флаги кроме \`--force\`/\`--no-verify\` без явной причины
• Web — WebFetch / WebSearch: актуальная документация, changelogs, best practices, CVE-базы, Stack Overflow

ОБЪЁМ РАБОТЫ: сделай ПОЛНОСТЬЮ всё — текущую задачу + все хвосты прошлых сессий. До старта: \`git log --oneline -30\`, \`~/.claude/plans/*.md\`, TODO/FIXME/XXX по репо, недоделанные фичи, открытые PR-ы. Собери punch-list и доведи до конца.

ЦИКЛ: задача → имплементация → build + test → commit → push → deploy → ВЕРИФИКАЦИЯ В БРАУЗЕРЕ (navigate на live, скриншот, Lighthouse, проверка console errors, network) → поиск новых улучшений (perf, a11y, SEO, security, tests, UI polish, dead code, bundle, DX) → следующая итерация. Остановка только по явному STOP.

ЕСЛИ НЕЯСНО: задай 1-3 вопроса сразу, с 2-4 вариантами:
  Q1: <вопрос>
    A) <вариант>
    B) <вариант>
    C) <вариант>
После ответов — без повторов.
`;

const newPrompts = [
  {
    id: 'lp-tg-self-heal',
    m: '/loop',
    mk: 'opus47m',
    role: 'Telegram Bot Self-Heal',
    type: 'command',
    icon: '🤖',
    ac: '#229ED9',
    time: 'continuous',
    text: `${AUTONOMY}
/loop 5m

ЗАДАЧА: Каждые 5 минут полностью прогоняй Telegram-бота как реальный пользователь — фикси всё что нашёл.

ПРОГОН:
1. Подключись через Bot API (BotFather token из .env) или telethon/aiogram dry-run.
2. Перечисли ВСЕ команды бота через getMyCommands + grep по \`bot/\` и \`api/\`. Не доверяй BotFather — сверь с реальным кодом.
3. Для КАЖДОЙ команды (/start, /help, /list, /search, /export, /settings, /admin, etc):
   • Вызови с пустыми/валидными/мусорными аргументами.
   • Сохрани ответ + время отклика + статус.
4. Прокликай ВСЕ inline-кнопки и callback_query во всех ответах рекурсивно (BFS до глубины 5).
5. Проверь уведомления: webhook→handler→reply chain, race conditions, дубли, missing acks.

ПРОВЕРКИ:
• Грамматика RU + EN + KK — LanguageTool или LLM-judge.
• Markdown V2 escape (точки, скобки, дефисы) — отсутствие "can't parse entities" в логах.
• Длина < 4096 chars, медиа < 50MB.
• Достоверность: упоминания счётчиков (10 009 промтов и т.д.) сверь с реальной БД.
• Inline-keyboard: все callback_data короче 64 байт, нет битых deep-links.
• Тайминги: ответ < 2s p95, иначе профилируй.
• Уведомления: rate limit, нет спама, текст соответствует событию.
• Логи: \`tail -200 /var/log/telegram-bot.log | grep -E "ERROR|WARN|TimeoutError"\`.

ФИКС:
• Опечатки/грамматика → правь строки в \`bot/locales/*.json\` или inline.
• Битые команды → допиши handler.
• Неверные данные → синхронизируй источник истины (БД / API).
• Долгий ответ → кэш Redis или async pre-fetch.
• Падения → try/except + fallback message + alert в админ-чат.

ВЫХОД ИТЕРАЦИИ:
• \`reports/tg-audit-<timestamp>.md\` — что протестировано, что сломано, что починено, p95 latency.
• git commit "fix(bot): <конкретно>" + push + auto-deploy.
• Если 0 ошибок 3 итерации подряд — увеличь интервал до 15m.`,
    desc: 'Каждые 5 мин гоняет Telegram-бота как живой юзер: прокликивает все команды и callback-кнопки, проверяет грамматику RU/EN/KK, Markdown V2 escape, длину сообщений, время отклика, достоверность данных, спам уведомлений, логи на ERROR. Опечатки правит в locales, битые команды дописывает, медленные ответы кэширует. Авто-коммит fix(bot): + push + deploy после каждой починки.',
    tags: ['telegram', 'bot', 'loop', 'self-heal', 'qa', 'monitoring'],
    difficulty: 'advanced',
    output: 'Healed bot + audit report',
    related: ['lp-watch', 'lp-message-quality', 'lp-full-click-test'],
    v: '12.0',
  },

  {
    id: 'rl-rag-project-knowledge',
    m: '/ralph-loop',
    mk: 'opus47m',
    role: 'Project RAG Knowledge Base',
    type: 'command',
    icon: '🧠',
    ac: '#8b5cf6',
    time: '~3-6h',
    text: `/ralph-loop "${AUTONOMY}
ЗАДАЧА: Построй живую RAG-базу знаний ИЗ САМОГО ПРОЕКТА — чтобы и LLM, и проект могли отвечать на любой вопрос про себя.

ИСТОЧНИКИ ИНДЕКСАЦИИ:
1. Код — все .js/.ts/.tsx/.py/.go/.cjs/.mjs (chunks по функции/классу/AST-узлу).
2. Конфиги — .env.example, *.config.*, package.json, vercel.json, Dockerfile, docker-compose.yml.
3. Документация — README, CLAUDE.md, *.md, JSDoc/docstrings.
4. Данные — все таблицы БД (SELECT * с пагинацией), строки JSON-фикстур, content из CMS.
5. История — git log --pretty=full последние 5000 коммитов, gh pr list --state all, gh issue list.
6. Логи — production logs за 30 дней (Sentry / Vercel / self-hosted), сэмпл по уровням.
7. Тесты — что покрыто (имена), как запускается, какие фикстуры.
8. UI — снапшоты страниц через Browser MCP + alt/aria тексты.

PIPELINE:
1. Сканер: \`scripts/rag/index.cjs\` ходит по корню, фильтрует .gitignore + node_modules + dist.
2. Чанкер: tree-sitter / @babel/parser → AST chunks 256-512 токенов с overlap 64.
3. Embeddings: text-embedding-3-large или bge-m3 (multilingual, бесплатно self-host).
4. Store: pgvector в существующем Postgres (новая таблица rag_chunks(id, source_path, chunk_idx, content, embedding vector(1536), metadata jsonb, updated_at)).
5. Sparse index: BM25 через pg_trgm или OpenSearch.
6. Reranker: bge-reranker-large на топ-50 → топ-5.

QUERY:
1. Endpoint /api/ask: { question, scope?: 'code'|'data'|'all' }.
2. CLI \`npm run ask -- 'почему мы выбрали Hono вместо Express'\`.
3. Slash-команда /ask в Telegram-боте.
4. Streaming ответ + цитаты с line:file ссылками.

САМО-ОБУЧЕНИЕ ПРОЕКТА:
• Каждый PR-merge → инкрементальная переиндексация изменённых файлов (git diff --name-only).
• GH Action: на push в master запускает scripts/rag/refresh.cjs.
• Раз в неделю: full reindex + чистка orphaned chunks.
• Метрики качества: golden-set 50 вопросов, измеряй recall@5 и faithfulness; алерт если просело > 5%.

ИСПОЛЬЗОВАНИЕ:
• onboarding нового разработчика → вместо чтения 2200 строк App.jsx задаёт вопросы.
• Code review бот: при PR подтягивает релевантные старые решения и предупреждает о повторении ошибок.
• Поддержка: пользователь спросил в боте — ответ из базы знаний с цитатой кода.

ВЫХОД: рабочий /api/ask + CLI + Telegram /ask + GH Action для переиндексации + golden-set + dashboard метрик в /admin/rag.${AUTONOMY ? '' : ''}\n\nАНТИ-ЛУП: 3 ошибки подряд = смена подхода (поменять модель embeddings / сменить chunker / отключить sparse).
" --completion-promise "RAG knowledge base shipped, /api/ask отвечает, GH Action работает"`,
    desc: 'Строит живую RAG-базу знаний из самого проекта: индексирует весь код (AST-чанки), конфиги, доки, БД, git log за 5000 коммитов, PR/issues, prod-логи, тесты и UI-снапшоты. Pgvector + BM25 + reranker. Endpoint /api/ask, CLI npm run ask, slash /ask в Telegram. GH Action переиндексирует на каждый PR, недельный full refresh. Golden-set 50 Q&A с метриками recall@5 и faithfulness.',
    tags: ['rag', 'knowledge-base', 'pgvector', 'embeddings', 'self-aware', 'documentation'],
    difficulty: 'advanced',
    output: 'Self-aware project + /api/ask',
    related: ['rl-rag-hybrid', 'rl-vector-db', 'rl-embeddings'],
    v: '12.0',
  },

  {
    id: 'lp-message-quality',
    m: '/loop',
    mk: 'opus47m',
    role: 'Message Quality Watchdog',
    type: 'command',
    icon: '✉️',
    ac: '#0ea5e9',
    time: 'continuous',
    text: `${AUTONOMY}
/loop 5m

ЗАДАЧА: Каждые 5 минут анализируй ВСЕ исходящие сообщения проекта и улучшай качество — грамматику, стиль, форматирование, длину, тон.

ОХВАТ:
• Telegram-бот ответы (parsed из bot/locales + inline strings).
• Web UI тосты + alerts + push notifications + service-worker уведомления.
• Email-шаблоны (transactional + marketing).
• Slack/Discord webhook payloads.
• Системные уведомления и alert-сообщения (Sentry / monitoring).
• Сообщения в логах с пользовательским уровнем (ошибки которые видны юзеру).

ПРОВЕРКИ ПО КАЖДОМУ СООБЩЕНИЮ:
1. Грамматика — LanguageTool (LT-API self-hosted) для RU + EN + KK.
2. Орфография — hunspell словари + custom dict для технических терминов.
3. Тон — LLM-judge: дружелюбный / нейтральный / тревожный — соответствует ли контексту?
4. Длина — push < 178 chars, тост < 80, email subject < 60, Telegram < 4096.
5. Форматирование — Markdown/HTML валиден, escaping правильный, emoji единый стиль (или вообще нет).
6. Локализация — покрыты все языки (ru/en/kk), нет hardcoded английских строк в RU-ветке.
7. Достоверность — числа (10 009 промтов, 74 комбо) сверь с реальными counts из data.P.length.
8. Дубли — одно и то же сообщение в 3+ местах = переноси в i18n.
9. CTA — кнопка "Купить" / "Узнать больше" — есть ли где должна быть?
10. Accessibility — alt-тексты для иконок, screen-reader-friendly формулировки.

A/B ТЕСТ:
• Для top-20 самых частых сообщений (по prod analytics): сгенерируй 3 варианта через LLM.
• Раздели трафик 25/25/25/25 (control + 3 варианта).
• Метрика: CTR / задержка / NPS / abandonment.
• Через 7 дней — winner промотится в production.

ФИКСЫ:
• Опечатки/грамматика → правь locales/messages.
• Длинные → сократи без потери смысла.
• Hardcoded → выноси в i18n с ключом.
• Устаревшие числа → используй computed-значения.
• Битый Markdown → escape + тест.

ВЫХОД ИТЕРАЦИИ:
• \`reports/messages-<timestamp>.md\` — найдено / исправлено / A/B результаты.
• git commit "fix(i18n): <конкретно>" или "feat(copy): A/B winner X" + push + deploy.
• Если найдено 0 проблем 5 итераций — расширь охват (новые шаблоны, новые языки).`,
    desc: 'Каждые 5 мин ловит все исходящие сообщения (бот, тосты, push, email, Slack, alerts) и проверяет: LanguageTool грамматику RU/EN/KK, hunspell орфографию, LLM-judge тон, лимиты длины, валидность Markdown, локализацию (нет hardcoded строк), сверку чисел с data.P.length, дубли (выносит в i18n), наличие CTA, accessibility. Топ-20 сообщений A/B-тестируются: 3 варианта через LLM, через 7д winner промотится. Авто-коммит fix(i18n) + deploy.',
    tags: ['i18n', 'copy', 'grammar', 'a11y', 'a-b-testing', 'loop', 'quality'],
    difficulty: 'intermediate',
    output: 'Polished copy across channels',
    related: ['lp-tg-self-heal', 'lp-watch', 'rl-a11y-audit'],
    v: '12.0',
  },

  {
    id: 'lp-full-click-test',
    m: '/loop',
    mk: 'opus47m',
    role: 'Full UI + Bot Click Sweep',
    type: 'command',
    icon: '🖱️',
    ac: '#16a34a',
    time: 'continuous',
    text: `${AUTONOMY}
/loop 5m

ЗАДАЧА: Каждые 5 минут полностью прокликивай и проверяй работоспособность ВСЕГО проекта — каждой кнопки сайта, каждой команды бота, каждого endpoint API.

WEB UI (через Browser MCP + Playwright):
1. Открой live (https://ai-agent-hub.net) и dev (http://localhost:5173).
2. Снапшот DOM → перечисли все элементы: button, [role="button"], a[href], input, select, textarea, [tabindex] (включая label-обёртки и иконки).
3. Для КАЖДОГО:
   • hover → проверь tooltip / cursor / визуальную реакцию.
   • click / focus / Enter → проверь действие (navigate / modal / toast / API call).
   • verify: HTTP 200 в Network, 0 новых console errors, ожидаемый элемент появился.
4. Прогон во всех табах (Промты, Комбо, Шпаргалки, CLI, Настройка).
5. Прогон в 3 viewports: 360×640 mobile, 768×1024 tablet, 1440×900 desktop.
6. Прогон в обеих темах (dark + light) и трёх языках (ru / en / kk).
7. Скриншот каждой страницы → diff с последним baseline (resemble-js или Playwright snapshot).

TELEGRAM BOT:
1. Перечисли все commands + callbacks (BotFather + grep кода).
2. Прокликай каждую команду + рекурсивно все inline-кнопки до глубины 5.
3. Для каждой проверь: response received, latency < 2s, корректный текст, корректные кнопки, нет parse errors.
4. Edge cases: пустой ввод, длинный ввод (10000 chars), emoji, RTL текст, спам 100 запросов / минуту.

API:
1. Из OpenAPI / route definitions перечисли все endpoint × method.
2. Для каждого: happy path + 4xx (плохой ввод) + auth (без токена / просрочен) + 429 (rate limit).
3. Проверь: схема ответа, headers (CORS, security), latency p95, идемпотентность для PUT/DELETE.

РЕГРЕССИЯ:
• Любой упавший шаг → создай GitHub issue с шагами + screenshot + console log + network HAR.
• Если можешь починить за < 30 мин → чини и закрывай issue в одном коммите.
• Если нельзя — оставь issue с label \`auto-found\` + assignee owner.

КРИТИКАЛ-ПУТИ (приоритет):
• Главная → копирование промта.
• Поиск → результат → копирование.
• Переключение темы / языка.
• Telegram /start → /search → копирование промта в чат.
• Регистрация / логин если есть.

ВЫХОД ИТЕРАЦИИ:
• \`reports/click-sweep-<timestamp>.md\` — total elements / clicked / passed / failed / fixed / new issues.
• \`reports/screenshots/<timestamp>/*.png\` — diffs.
• git commit "test(e2e): сводка + автофиксы" + push + deploy.
• Lighthouse audit раз в час → если score упал > 5pt → автотюн критикалов.`,
    desc: 'Каждые 5 мин Browser MCP + Playwright прокликивают ВСЕ кнопки/ссылки/инпуты сайта во всех табах × 3 viewport × 2 темы × 3 языка + все команды Telegram-бота с рекурсивным обходом inline-клавиатур + все API endpoints (happy path, 4xx, auth, rate limit). Скриншоты с diff vs baseline. Падение → GitHub issue auto-found + автофикс если < 30 мин, иначе assignee owner. Lighthouse раз в час с автотюном при просадке > 5pt.',
    tags: ['e2e', 'playwright', 'browser-mcp', 'regression', 'loop', 'visual-diff'],
    difficulty: 'advanced',
    output: 'Click sweep report + auto-fixes',
    related: ['lp-tg-self-heal', 'rl-a11y-audit', 'lp-watch'],
    v: '12.0',
  },
];

newPrompts.forEach(p => { p.compact = (p.text || '').slice(0, 400); });

// Dedupe by id
const existingIds = new Set(data.P.map(p => p.id));
const toAdd = newPrompts.filter(p => !existingIds.has(p.id));
data.P = [...data.P, ...toAdd];

// Add combo (RU + EN)
const comboNameRu = 'Self-Healing Project';
const comboNameEn = 'Self-Healing Project';
const comboIds = ['lp-tg-self-heal', 'rl-rag-project-knowledge', 'lp-message-quality', 'lp-full-click-test', 'lp-watch'];

const comboRu = {
  name: comboNameRu,
  agents: comboIds,
  ids: comboIds,
  desc: 'Полный авто-цикл самовосстановления проекта: Telegram-бот гоняется как живой юзер каждые 5 мин (грамматика, callbacks, latency, авто-фикс), параллельно строится RAG-знание из всего кода+БД+git+PR (endpoint /api/ask, /ask в боте), watchdog качества всех исходящих сообщений с A/B-тестами, Browser MCP + Playwright кликает всё на сайте × 3 viewport × 2 темы × 3 языка + все API endpoints. Падения → GitHub issue + автофикс. Lighthouse каждый час. Останавливается только по STOP.',
  color: '#229ED9',
};
const comboEn = {
  name: comboNameEn,
  agents: comboIds,
  ids: comboIds,
  desc: 'Full self-healing project loop: Telegram bot exercised as a real user every 5 min (grammar, callbacks, latency, auto-fix), parallel RAG knowledge base built from all code + DB + git + PRs (endpoint /api/ask, /ask in bot), outbound message quality watchdog with A/B tests, Browser MCP + Playwright clicking everything on site × 3 viewports × 2 themes × 3 languages + all API endpoints. Failures → GitHub issue + auto-fix. Lighthouse every hour. Stops only on STOP.',
  color: '#229ED9',
};

const ruExists = data.COMBOS.ru.find(c => c.name === comboNameRu);
const enExists = data.COMBOS.en.find(c => c.name === comboNameEn);
if (!ruExists) data.COMBOS.ru.push(comboRu);
if (!enExists) data.COMBOS.en.push(comboEn);

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));

console.log('✓ Added', toAdd.length, 'prompts. Total:', data.P.length);
console.log('✓ Combos RU:', data.COMBOS.ru.length, '| EN:', data.COMBOS.en.length);
console.log('✓ New Z size:', newZ.length, 'chars');
