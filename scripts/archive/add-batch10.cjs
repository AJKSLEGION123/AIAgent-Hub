const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 ПОЛНАЯ РАЗВЕДКА:\nПрочитай ВЕСЬ проект. Структура, конфиги, зависимости, БД, API, тесты, CI, git log.\n\n";
const A = "\n\nАНТИ-ЛУП: 3 ошибки = смена подхода.";

const add = [

  // ── Diverse commands: /feature-dev ──────────

  {id:"fd-realtime-chat",m:"/feature-dev",mk:"claude",role:"Real-time Chat",type:"command",icon:"\u{1F4AC}",ac:"#06b6d4",time:"~2-3h",
   text:'Создай real-time чат (WebSocket / Socket.IO / SSE).\n\nARCHITECTURE:\n1. Server: WebSocket server (ws / socket.io / native).\n2. Client: connect, send, receive, reconnect on disconnect.\n3. Rooms: join/leave room, broadcast to room.\n4. Messages: {id, sender, text, timestamp, room}.\n5. DB: persist messages (last 100 per room).\n6. Typing indicator: emit "typing" event, debounce 2s.\n7. Online status: track connected users per room.\n8. Reconnect: auto-reconnect with exponential backoff.\n\nFEATURES:\n- Message history (load on join).\n- Unread counter badge.\n- Scroll to bottom on new message.\n- Optimistic UI (show message before server confirm).\n\nSECURITY:\n- Auth: JWT token on connect handshake.\n- Rate limit: max 10 messages/second.\n- Sanitize input (no XSS).',
   tags:["websocket","real-time","chat","socket-io","streaming"],difficulty:"intermediate",output:"Real-time chat",related:["rl-ws","rl-notif"],prereqs:[],v:"11.0"},

  {id:"fd-i18n",m:"/feature-dev",mk:"claude",role:"Internationalization (i18n)",type:"command",icon:"\u{1F310}",ac:"#8b5cf6",time:"~1-2h",
   text:'Добавь мультиязычность (i18n/l10n) в проект.\n\nSETUP:\n1. Библиотека: react-i18next / vue-i18n / next-intl / i18next.\n2. Файлы переводов: locales/ru.json, locales/en.json, locales/kz.json.\n3. Namespace: разбей по модулям (common, auth, dashboard, errors).\n\nIMPLEMENTATION:\n4. Обёрнуть все строки в t("key") / $t("key").\n5. Плюрализация: t("items", {count: 5}) → "5 элементов".\n6. Даты: Intl.DateTimeFormat с locale.\n7. Числа: Intl.NumberFormat (1 234 567,89 vs 1,234,567.89).\n8. RTL: direction: rtl для арабского/иврита (если нужно).\n\nUX:\n9. Language switcher в header/footer.\n10. Сохранение выбора в localStorage.\n11. Определение языка: URL param → cookie → navigator.language → default.\n12. SEO: hreflang тэги, lang атрибут на html.\n\nQA:\n13. Скрипт проверки: все ключи есть во всех языках?\n14. Длина текста: немецкий/русский ~30% длиннее английского — UI не ломается?',
   tags:["i18n","localization","internationalization","translations","multilingual"],difficulty:"intermediate",output:"Multi-language support",related:["rl-i18n","fd-auth-system"],prereqs:[],v:"11.0"},

  {id:"fd-search-engine",m:"/feature-dev",mk:"claude",role:"Search Engine",type:"command",icon:"\u{1F50D}",ac:"#f59e0b",time:"~1-2h",
   text:'Создай полнотекстовый поиск.\n\nOPTIONS:\n1. Simple: LIKE/ILIKE SQL (маленькие данные, < 10K записей).\n2. FTS: PostgreSQL tsvector/tsquery, SQLite FTS5.\n3. Elasticsearch / Meilisearch / Typesense (большие данные).\n\nIMPLEMENTATION:\n4. API: GET /search?q=query&type=all&page=1&limit=20.\n5. Debounce: 300ms на клиенте перед запросом.\n6. Highlight: подсвечивать совпадения в результатах.\n7. Suggestions: autocomplete по мере ввода (top 5).\n8. Filters: тип, дата, категория, автор.\n9. Sort: relevance, date, popularity.\n\nUX:\n10. Ctrl+K / Cmd+K — глобальный поиск (command palette).\n11. Recent searches (localStorage, max 10).\n12. "Did you mean?" для опечаток (fuzzy matching).\n13. Empty state: "Ничего не найдено. Попробуйте другой запрос."\n14. Loading skeleton во время запроса.\n\nPERFORMANCE:\n15. Index: по полям name, description, content.\n16. Cache: Redis на 60s для частых запросов.\n17. Pagination: cursor-based для стабильности.',
   tags:["search","full-text","autocomplete","elasticsearch","fts"],difficulty:"intermediate",output:"Search engine",related:["rl-search","rl-cache"],prereqs:[],v:"11.0"},

  {id:"fd-file-upload",m:"/feature-dev",mk:"claude",role:"File Upload System",type:"command",icon:"\u{1F4C1}",ac:"#10b981",time:"~1-2h",
   text:'Создай систему загрузки файлов.\n\nBACKEND:\n1. Endpoint: POST /upload (multipart/form-data).\n2. Storage: local disk / S3 / Cloudflare R2 / MinIO.\n3. Validation: max size (10MB), allowed types (image/*, .pdf, .docx).\n4. Naming: UUID + original extension (no path traversal).\n5. DB: files table (id, name, path, size, type, uploaded_by, created_at).\n\nFRONTEND:\n6. Drag & Drop zone + click to select.\n7. Preview: image thumbnail, file icon для документов.\n8. Progress bar (XMLHttpRequest.upload.onprogress).\n9. Multiple files: batch upload с индивидуальным прогрессом.\n10. Cancel: AbortController для отмены загрузки.\n\nFEATURES:\n11. Image resize: thumbnail 200x200 + medium 800x600.\n12. Virus scan: ClamAV (если production).\n13. Presigned URLs: для прямой загрузки в S3 (bypass server).\n14. Download: GET /files/:id/download с Content-Disposition.\n15. Delete: soft delete (is_deleted flag).',
   tags:["upload","files","s3","drag-drop","images"],difficulty:"intermediate",output:"File upload system",related:["rl-upload","rl-s3"],prereqs:[],v:"11.0"},

  // ── Diverse commands: /code-review ──────────

  {id:"cr-accessibility",m:"/code-review",mk:"claude",role:"Accessibility Audit",type:"command",icon:"\u267F",ac:"#2563eb",time:"~30m",
   text:'Проведи полный accessibility (a11y) аудит кода.\n\nWCAG 2.1 AA CHECKLIST:\n\n1. SEMANTIC HTML:\n   - h1-h6 иерархия (один h1, логичный порядок)?\n   - button vs a (button для действий, a для навигации)?\n   - nav, main, aside, footer, header — используются?\n   - Списки: ul/ol для списков, не div-ы?\n\n2. ARIA:\n   - aria-label на иконках без текста?\n   - aria-expanded на аккордеонах/меню?\n   - aria-live="polite" для динамического контента?\n   - role="alert" для ошибок валидации?\n\n3. KEYBOARD:\n   - Tab order логичный (tabindex не > 0)?\n   - Focus visible на всех интерактивных элементах?\n   - Escape закрывает модалы?\n   - Enter/Space активирует кнопки?\n\n4. VISUAL:\n   - Contrast ratio >= 4.5:1 (text), >= 3:1 (large text)?\n   - Не только цветом передаётся информация?\n   - Текст масштабируется до 200% без потери контента?\n   - prefers-reduced-motion для анимаций?\n\n5. FORMS:\n   - Каждый input имеет label?\n   - Error messages связаны с полем (aria-describedby)?\n   - Required fields помечены (aria-required)?\n\nВЫХОД: список нарушений с WCAG критерием, файл:строка, fix.',
   tags:["accessibility","a11y","wcag","aria","review","inclusive"],difficulty:"intermediate",output:"A11y audit report",related:["rv-security-audit"],prereqs:[],v:"11.0"},

  {id:"cr-db-review",m:"/code-review",mk:"claude",role:"Database Review",type:"command",icon:"\u{1F5C4}",ac:"#0d9488",time:"~30m-1h",
   text:'Проведи ревью базы данных и запросов.\n\nSCHEMA:\n1. Все таблицы имеют primary key?\n2. Foreign keys с ON DELETE (CASCADE/SET NULL/RESTRICT)?\n3. Indexes на часто фильтруемых колонках?\n4. Enum-ы через CHECK constraint или отдельная таблица?\n5. Timestamps: created_at, updated_at на каждой таблице?\n6. Soft delete: is_deleted/deleted_at (если нужно)?\n\nQUERIES:\n7. N+1 queries? (найди циклы с запросами внутри).\n8. SELECT *? (выбирай только нужные колонки).\n9. Unbounded queries? (всегда LIMIT).\n10. Missing WHERE? (случайный UPDATE/DELETE всех записей).\n11. Raw SQL с user input? (SQL injection → параметризуй).\n\nPERFORMANCE:\n12. EXPLAIN ANALYZE на медленных запросах.\n13. Composite indexes для multi-column WHERE.\n14. Partial indexes для частых фильтров (WHERE active=true).\n15. Connection pooling настроен?\n\nMIGRATION:\n16. Обратимые миграции (up + down)?\n17. Нет data loss при ALTER TABLE?\n18. Большие таблицы: ALTER без блокировки (concurrent index)?',
   tags:["database","review","sql","optimization","indexes","n+1"],difficulty:"intermediate",output:"DB review report",related:["rv-perf-review"],prereqs:[],v:"11.0"},

  // ── Diverse commands: /simplify ─────────────

  {id:"sm-refactor",m:"/simplify",mk:"claude",role:"Deep Refactor",type:"command",icon:"\u{1F9F9}",ac:"#ef4444",time:"~1-2h",
   text:'Проведи глубокий рефакторинг проекта.\n\nФОКУС:\n1. God classes/functions: разбей файлы > 300 строк.\n2. Дублирование: найди copy-paste код → extract function.\n3. Мёртвый код: неиспользуемые функции, imports, переменные → удали.\n4. Magic numbers/strings: замени на константы с понятными именами.\n5. Вложенность > 3 уровней: early return, guard clauses.\n6. Сложные условия: extract to named boolean or function.\n7. any/unknown в TypeScript: замени на конкретные типы.\n8. Console.log: замени на proper logger.\n9. Error handling: catch с конкретным типом ошибки, не catch(e){}.\n10. Naming: функции — глаголы, переменные — существительные, boolean — is/has/can.\n\nПРАВИЛА:\n- Один коммит = одна тема рефакторинга.\n- Тесты проходят после каждого шага.\n- Не меняй поведение (только структуру).',
   tags:["refactor","simplify","clean-code","dead-code","technical-debt"],difficulty:"intermediate",output:"Clean codebase",related:["rl-refactor","rl-cleanup"],prereqs:[],v:"11.0"},

  // ── Diverse commands: /loop ─────────────────

  {id:"lp-deploy-watch",m:"/loop",mk:"claude",role:"Deploy Watcher",type:"command",icon:"\u{1F6F0}",ac:"#2563eb",time:"continuous",
   text:'/loop 3m "Проверь статус последнего деплоя:\n\n1. Git: последний коммит на main (hash, message, время).\n2. CI: GitHub Actions / GitLab CI — статус последнего run (pass/fail).\n3. Vercel/Netlify: статус деплоя (ready/building/error).\n4. Health: curl production URL — 200 OK?\n5. Logs: последние 10 строк лога — нет ли ошибок?\n\nЕсли деплой упал:\n- Покажи error log.\n- Найди причину (build error? test fail? timeout?).\n- Предложи fix.\n\nЕсли всё ОК — краткий статус: ✅ Deploy OK | commit abc1234 | 2m ago"',
   tags:["deploy","monitoring","loop","ci-cd","continuous","watcher"],difficulty:"beginner",output:"Deploy status",related:["lp-health-monitor","rl-ci"],prereqs:[],v:"11.0"},

  {id:"lp-deps-update",m:"/loop",mk:"claude",role:"Dependency Updater",type:"command",icon:"\u{1F4E6}",ac:"#f97316",time:"~30m",
   text:'/loop "Проверь и обнови зависимости проекта:\n\n1. npm outdated / pip list --outdated / cargo outdated.\n2. Для каждого устаревшего пакета:\n   - Текущая vs последняя версия.\n   - CHANGELOG: breaking changes?\n   - Критичность: security fix? feature? patch?\n3. Обнови по одному (не все сразу):\n   - npm update package / pip install --upgrade package.\n   - Запусти тесты после КАЖДОГО обновления.\n   - Если тесты упали → откати и сообщи.\n4. npm audit fix / pip-audit — security уязвимости.\n5. Lock файл: package-lock.json / poetry.lock актуален?\n\nПРАВИЛА:\n- Major updates (2.x → 3.x) — только с confirmation.\n- Security patches — обновляй сразу.\n- Один пакет = один коммит (чтобы откатить если что)."',
   tags:["dependencies","update","security","npm","pip","maintenance"],difficulty:"beginner",output:"Updated dependencies",related:["lp-health-monitor","rl-security"],prereqs:[],v:"11.0"},

  // ── Missing categories ──────────────────────

  {id:"rl-mobile-app",m:"/ralph-loop",mk:"claude",role:"Mobile App (React Native)",type:"command",icon:"\u{1F4F1}",ac:"#61dafb",time:"~3-4h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Мобильное приложение на React Native / Expo.\n\nSETUP:\n- npx create-expo-app или npx react-native init.\n- TypeScript: tsconfig.json strict.\n- Navigation: React Navigation (stack + tabs + drawer).\n\nSCREENS:\n- Splash/Loading screen.\n- Auth: Login + Register + Forgot Password.\n- Home: main content + pull-to-refresh.\n- Profile: settings, avatar, logout.\n- Detail: individual item view.\n\nFEATURES:\n- State: Zustand / Redux Toolkit.\n- API: React Query + Axios.\n- Push notifications: expo-notifications.\n- Offline: AsyncStorage cache.\n- Deep linking: URL scheme.\n- Animations: react-native-reanimated.\n\nPLATFORM:\n- iOS + Android одновременно.\n- Platform-specific code: Platform.select().\n- Safe area: SafeAreaView.\n- Permissions: camera, location, notifications.\n\nBUILD:\n- EAS Build: eas build --platform all.\n- OTA updates: expo-updates.\n- App Store / Google Play submission checklist.' + A + '" --completion-promise "DONE"',
   tags:["mobile","react-native","expo","ios","android","app"],difficulty:"advanced",output:"Mobile app",related:["fd-auth-system","fd-realtime-chat"],prereqs:[],v:"11.0"},

  {id:"rl-monitoring",m:"/ralph-loop",mk:"claude",role:"Monitoring & Alerting",type:"command",icon:"\u{1F4DF}",ac:"#e6522c",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Monitoring + Alerting stack.\n\nMETRICS:\n- App metrics: request count, latency (p50/p95/p99), error rate.\n- System metrics: CPU, memory, disk, network.\n- Business metrics: active users, signups, revenue.\n- Custom metrics: counter, gauge, histogram.\n\nCOLLECTION:\n- Prometheus: /metrics endpoint (prom-client / prometheus_client).\n- StatsD / InfluxDB / Datadog (alternatives).\n- Structured logs: JSON → Loki / ELK.\n\nVISUALIZATION:\n- Grafana dashboards: request rate, error rate, latency.\n- Preset dashboards: Node.js / Python / PostgreSQL.\n- Variables: environment, service, time range.\n\nALERTING:\n- Error rate > 5% → Slack/Telegram alert.\n- Latency p95 > 500ms → warning.\n- Disk > 80% → critical.\n- Service down → PagerDuty / OpsGenie.\n\nLOGGING:\n- Structured: {level, timestamp, requestId, message, data}.\n- Correlation: requestId across services.\n- Log levels: error > warn > info > debug.\n- Rotation: 7 days retention, max 100MB per file.' + A + '" --completion-promise "DONE"',
   tags:["monitoring","prometheus","grafana","alerting","logging","observability","metrics"],difficulty:"advanced",output:"Monitoring stack",related:["rl-logging","lp-health-monitor"],prereqs:[],v:"11.0"},

  {id:"rl-db-optimize",m:"/ralph-loop",mk:"claude",role:"Database Optimization",type:"command",icon:"\u{1F3CE}",ac:"#336791",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Оптимизация базы данных.\n\nANALYSIS:\n1. Slow queries: включи pg_stat_statements / slow_query_log.\n2. EXPLAIN ANALYZE на топ-10 медленных запросов.\n3. Index usage: pg_stat_user_indexes (unused indexes → drop).\n4. Table bloat: VACUUM ANALYZE.\n5. Connection count: max_connections vs active.\n\nINDEXES:\n6. Покрывающие индексы: INCLUDE для SELECT без table lookup.\n7. Partial indexes: WHERE active=true (не индексируй всё).\n8. Composite: (company_id, created_at) для частых WHERE+ORDER.\n9. GIN: для JSONB и full-text search.\n10. BRIN: для append-only таблиц (logs, events).\n\nQUERIES:\n11. N+1 → JOIN или batch (WHERE id IN (...)).\n12. SELECT * → SELECT нужные колонки.\n13. OFFSET pagination → cursor-based (WHERE id > last_id).\n14. Subquery → CTE или JOIN.\n15. Count(*) → approximate (pg_class.reltuples).\n\nCONFIG:\n16. shared_buffers: 25% RAM.\n17. effective_cache_size: 75% RAM.\n18. work_mem: 50MB (для сложных sorts).\n19. maintenance_work_mem: 256MB (для VACUUM/CREATE INDEX).' + A + '" --completion-promise "DONE"',
   tags:["database","optimization","postgresql","indexes","performance","queries","sql"],difficulty:"advanced",output:"Optimized database",related:["cr-db-review","rv-perf-review"],prereqs:[],v:"11.0"},

  {id:"rl-design-system",m:"/ralph-loop",mk:"claude",role:"Design System",type:"command",icon:"\u{1F3A8}",ac:"#ec4899",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Design System / Component Library.\n\nFOUNDATION:\n- Tokens: colors, spacing (4px grid), typography (font sizes), shadows, border-radius.\n- CSS Variables: --color-primary, --space-4, --font-size-sm.\n- Theme: light + dark (prefers-color-scheme).\n\nCOMPONENTS (от простых к сложным):\n1. Button: variants (primary/secondary/ghost/danger), sizes (sm/md/lg), loading, disabled.\n2. Input: text, password (toggle), textarea, with label+error.\n3. Select: single, multi, searchable, async options.\n4. Modal/Dialog: header+body+footer, close on escape/overlay.\n5. Toast/Notification: success/error/warning/info, auto-dismiss.\n6. Card: header, body, footer, clickable variant.\n7. Table: sortable headers, pagination, loading skeleton.\n8. Tabs: horizontal, vertical, with badges.\n9. Avatar: image, initials fallback, sizes, status dot.\n10. Badge: variants, dot, removable.\n\nDOCUMENTATION:\n- Storybook: каждый компонент с args controls.\n- Props table: name, type, default, description.\n- Playground: live editing.\n\nQUALITY:\n- A11y: keyboard navigation, ARIA, screen reader tested.\n- Responsive: mobile-first.\n- Tests: visual regression (Chromatic), unit (testing-library).' + A + '" --completion-promise "DONE"',
   tags:["design-system","components","ui","storybook","tokens","theme"],difficulty:"advanced",output:"Component library",related:["rl-darkmode","rl-ui-kit"],prereqs:[],v:"11.0"},

  // ── Beginner prompts ────────────────────────

  {id:"rl-git-workflow",m:"/ralph-loop",mk:"claude",role:"Git Workflow Setup",type:"command",icon:"\u{1F33F}",ac:"#f05032",time:"~20m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Настрой Git workflow.\n\n1. Branch strategy:\n   - main: production, protected.\n   - develop: integration branch.\n   - feature/*: новые фичи.\n   - fix/*: баг-фиксы.\n   - release/*: подготовка релиза.\n\n2. Commit convention (Conventional Commits):\n   - feat: новая фича.\n   - fix: баг-фикс.\n   - docs: документация.\n   - refactor: рефакторинг.\n   - test: тесты.\n   - chore: рутина (deps, CI).\n   - Format: feat(scope): description.\n\n3. Pre-commit hooks:\n   - lint-staged: lint только изменённые файлы.\n   - commitlint: проверка формата коммита.\n   - husky / pre-commit (Python).\n\n4. PR template:\n   - ## What: описание изменений.\n   - ## Why: причина.\n   - ## How to test: шаги проверки.\n   - ## Checklist: tests, docs, breaking changes.\n\n5. .gitignore: node_modules, .env, dist, __pycache__, .DS_Store.' + A + '" --completion-promise "DONE"',
   tags:["git","workflow","branching","commits","hooks","beginner"],difficulty:"beginner",output:"Git workflow",related:["rl-project-setup","rl-ci"],prereqs:[],v:"11.0"},

  {id:"rl-error-handling",m:"/ralph-loop",mk:"claude",role:"Error Handling",type:"command",icon:"\u{1F6A8}",ac:"#dc2626",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Система обработки ошибок.\n\n1. Error classes:\n   - AppError (base): message, statusCode, isOperational.\n   - ValidationError (400): field errors array.\n   - NotFoundError (404): resource type + id.\n   - UnauthorizedError (401): missing/invalid token.\n   - ForbiddenError (403): insufficient permissions.\n\n2. Global error handler (middleware):\n   - Catch all unhandled errors.\n   - Log: error stack + request context.\n   - Response: {error: message, code: "VALIDATION_ERROR", details: [...]}.\n   - Production: скрывай stack trace.\n   - Development: показывай полный stack.\n\n3. Async errors:\n   - try/catch в async handlers.\n   - Express: asyncHandler wrapper.\n   - Unhandled rejection: process.on("unhandledRejection").\n\n4. Frontend:\n   - Error boundary (React): catch render errors.\n   - API errors: toast notification.\n   - Network errors: retry + offline indicator.\n   - 404 page: friendly design.\n\n5. Monitoring:\n   - Sentry/Bugsnag: auto-capture.\n   - Alert: new error types → Slack.' + A + '" --completion-promise "DONE"',
   tags:["error-handling","errors","validation","middleware","beginner"],difficulty:"beginner",output:"Error handling system",related:["rl-err","rl-logging"],prereqs:[],v:"11.0"},

  {id:"rl-api-client",m:"/ralph-loop",mk:"claude",role:"API Client Wrapper",type:"command",icon:"\u{1F4E1}",ac:"#6366f1",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: API клиент с error handling, retry, interceptors.\n\nBASE:\n1. Wrapper вокруг fetch / axios.\n2. Base URL из env: API_URL.\n3. Default headers: Content-Type, Accept, Authorization.\n\nFEATURES:\n4. Auth: автоматически добавляй Bearer token из store.\n5. Refresh: если 401 → refresh token → retry original request.\n6. Retry: 3 attempts на 500/503 с exponential backoff.\n7. Timeout: 30s default, configurable per request.\n8. Cancel: AbortController для отмены запросов.\n\nTYPING:\n9. Generic: apiClient.get<User>("/users/1").\n10. Response: {data, status, headers}.\n11. Error: {message, status, code, details}.\n\nINTERCEPTORS:\n12. Request: add auth header, requestId, timestamp.\n13. Response: unwrap data, log errors.\n14. Error: toast notification, redirect to login on 401.\n\nUSAGE:\n15. Hooks: useQuery / useMutation (React Query).\n16. Services: userService.getById(id) → apiClient.get(...).' + A + '" --completion-promise "DONE"',
   tags:["api-client","fetch","axios","http","retry","interceptors"],difficulty:"beginner",output:"API client",related:["fd-crud-api","rl-retry"],prereqs:[],v:"11.0"},
];

add.forEach(p => { p.compact = p.text.slice(0, 400); });
data.P = [...data.P, ...add];

// New combos
data.COMBOS.ru.push(
  { name:"Mobile Sprint", agents:["rl-mobile-app","fd-auth-system","fd-realtime-chat","rl-monitoring"], ids:["rl-mobile-app","fd-auth-system","fd-realtime-chat","rl-monitoring"], desc:"Мобильное приложение + auth + чат + мониторинг" },
  { name:"Code Quality Blitz", agents:["cr-accessibility","cr-db-review","sm-refactor","rv-security-audit","rv-perf-review"], ids:["cr-accessibility","cr-db-review","sm-refactor","rv-security-audit","rv-perf-review"], desc:"A11y + БД + рефакторинг + безопасность + перф" },
  { name:"Continuous Ops", agents:["lp-health-monitor","lp-test-watcher","lp-deploy-watch","lp-deps-update"], ids:["lp-health-monitor","lp-test-watcher","lp-deploy-watch","lp-deps-update"], desc:"Мониторинг + тесты + деплой + обновления — непрерывно" },
);
data.COMBOS.en.push(
  { name:"Mobile Sprint", agents:["rl-mobile-app","fd-auth-system","fd-realtime-chat","rl-monitoring"], ids:["rl-mobile-app","fd-auth-system","fd-realtime-chat","rl-monitoring"], desc:"Mobile app + auth + chat + monitoring" },
  { name:"Code Quality Blitz", agents:["cr-accessibility","cr-db-review","sm-refactor","rv-security-audit","rv-perf-review"], ids:["cr-accessibility","cr-db-review","sm-refactor","rv-security-audit","rv-perf-review"], desc:"A11y + DB + refactor + security + performance" },
  { name:"Continuous Ops", agents:["lp-health-monitor","lp-test-watcher","lp-deploy-watch","lp-deps-update"], ids:["lp-health-monitor","lp-test-watcher","lp-deploy-watch","lp-deps-update"], desc:"Health + tests + deploy + deps — continuous" },
);

// New configs
data.CONFIGS.push(
  { name:"nginx.conf (reverse proxy)", lang:"nginx", content:"server {\n    listen 80;\n    server_name example.com;\n\n    # Redirect HTTP → HTTPS\n    return 301 https://$server_name$request_uri;\n}\n\nserver {\n    listen 443 ssl http2;\n    server_name example.com;\n\n    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;\n\n    # Security headers\n    add_header X-Content-Type-Options nosniff;\n    add_header X-Frame-Options DENY;\n    add_header X-XSS-Protection \"1; mode=block\";\n    add_header Strict-Transport-Security \"max-age=63072000; includeSubDomains\";\n\n    # Gzip\n    gzip on;\n    gzip_types text/plain text/css application/json application/javascript;\n    gzip_min_length 256;\n\n    # Static files cache\n    location /assets/ {\n        root /var/www/html;\n        expires 1y;\n        add_header Cache-Control \"public, immutable\";\n    }\n\n    # API proxy\n    location /api/ {\n        proxy_pass http://127.0.0.1:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n    }\n\n    # SPA fallback\n    location / {\n        root /var/www/html;\n        try_files $uri $uri/ /index.html;\n    }\n}" },
  { name:"k8s-deployment.yaml", lang:"yaml", content:"apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app\n  labels:\n    app: app\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: app\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxUnavailable: 0\n      maxSurge: 1\n  template:\n    metadata:\n      labels:\n        app: app\n    spec:\n      containers:\n      - name: app\n        image: app:latest\n        ports:\n        - containerPort: 3000\n        resources:\n          requests:\n            cpu: 100m\n            memory: 128Mi\n          limits:\n            cpu: 500m\n            memory: 512Mi\n        livenessProbe:\n          httpGet:\n            path: /health\n            port: 3000\n          initialDelaySeconds: 10\n          periodSeconds: 15\n        readinessProbe:\n          httpGet:\n            path: /ready\n            port: 3000\n          initialDelaySeconds: 5\n          periodSeconds: 5\n        env:\n        - name: NODE_ENV\n          value: production\n        - name: DATABASE_URL\n          valueFrom:\n            secretKeyRef:\n              name: app-secrets\n              key: database-url\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: app\nspec:\n  type: ClusterIP\n  ports:\n  - port: 80\n    targetPort: 3000\n  selector:\n    app: app\n---\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: app\n  annotations:\n    cert-manager.io/cluster-issuer: letsencrypt\nspec:\n  tls:\n  - hosts:\n    - app.example.com\n    secretName: app-tls\n  rules:\n  - host: app.example.com\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: app\n            port:\n              number: 80" },
  { name:"Dockerfile (multi-stage)", lang:"dockerfile", content:"# ── Stage 1: Build ──\nFROM node:22-alpine AS build\nWORKDIR /app\n\n# Dependencies first (cache layer)\nCOPY package.json package-lock.json ./\nRUN npm ci --production=false\n\n# Source code\nCOPY . .\nRUN npm run build\n\n# Prune dev dependencies\nRUN npm prune --production\n\n# ── Stage 2: Production ──\nFROM node:22-alpine\nWORKDIR /app\n\n# Security: non-root user\nRUN addgroup -S app && adduser -S app -G app\n\n# Only production files\nCOPY --from=build --chown=app:app /app/dist ./dist\nCOPY --from=build --chown=app:app /app/node_modules ./node_modules\nCOPY --from=build --chown=app:app /app/package.json ./\n\nUSER app\nEXPOSE 3000\n\nHEALTHCHECK --interval=30s --timeout=3s --retries=3 \\\n  CMD wget -qO- http://localhost:3000/health || exit 1\n\nCMD [\"node\", \"dist/index.js\"]" },
);

// Cheat sheet: Redis
data.CHEAT['Redis'] = {
  name: 'Redis', color: '#dc382d',
  cmds: [
    { cmd: 'redis-cli ping', desc: 'Check connection' },
    { cmd: 'redis-cli SET key "value" EX 3600', desc: 'Set with 1h TTL' },
    { cmd: 'redis-cli GET key', desc: 'Get value' },
    { cmd: 'redis-cli DEL key', desc: 'Delete key' },
    { cmd: 'redis-cli KEYS "prefix:*"', desc: 'Find keys by pattern' },
    { cmd: 'redis-cli TTL key', desc: 'Check TTL remaining' },
    { cmd: 'redis-cli HSET user:1 name "John"', desc: 'Hash set' },
    { cmd: 'redis-cli HGETALL user:1', desc: 'Get all hash fields' },
    { cmd: 'redis-cli INFO memory', desc: 'Memory usage' },
    { cmd: 'redis-cli FLUSHDB', desc: 'Clear current DB' },
  ]
};

// Cheat sheet: Nginx
data.CHEAT['Nginx'] = {
  name: 'Nginx', color: '#009639',
  cmds: [
    { cmd: 'nginx -t', desc: 'Test config syntax' },
    { cmd: 'nginx -s reload', desc: 'Reload config (no downtime)' },
    { cmd: 'nginx -s stop', desc: 'Stop server' },
    { cmd: 'tail -f /var/log/nginx/error.log', desc: 'Stream error log' },
    { cmd: 'tail -f /var/log/nginx/access.log', desc: 'Stream access log' },
    { cmd: 'certbot --nginx -d example.com', desc: 'SSL via Let\'s Encrypt' },
    { cmd: 'certbot renew --dry-run', desc: 'Test SSL renewal' },
  ]
};

const json = JSON.stringify(data);
const compressed = deflateSync(json).toString('base64');
const newSrc = src.replace(/const Z = "[^"]+"/, 'const Z = "' + compressed + '"');
fs.writeFileSync('src/App.jsx', newSrc);
console.log('=== TOTALS ===');
console.log('Prompts:', data.P.length);
console.log('Combos RU:', data.COMBOS.ru.length);
console.log('Configs:', data.CONFIGS.length);
console.log('Cheat sheets:', Object.keys(data.CHEAT).length);
console.log('Quick cmds RU:', data.QUICK_CMDS.ru.length);

// Command diversity
const cmds = {};
data.P.forEach(p => { cmds[p.m] = (cmds[p.m]||0)+1; });
console.log('Commands:', JSON.stringify(cmds));

// Difficulty
const diff = {};
data.P.forEach(p => { diff[p.difficulty||'?'] = (diff[p.difficulty||'?']||0)+1; });
console.log('Difficulty:', JSON.stringify(diff));
