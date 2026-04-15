const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 ПОЛНАЯ РАЗВЕДКА:\nПрочитай ВЕСЬ проект. Структура, конфиги, зависимости, БД, API, тесты, CI, git log.\n\n";
const A = "\n\nАНТИ-ЛУП: 3 ошибки = смена подхода.";

const add = [

  // ── AI / LLM ────────────────────────────────

  {id:"rl-rag-pipeline",m:"/ralph-loop",mk:"claude",role:"RAG Pipeline",type:"command",icon:"\u{1F9E0}",ac:"#8b5cf6",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: RAG (Retrieval-Augmented Generation) pipeline.\n\nINGEST:\n- Document loader: PDF, DOCX, TXT, HTML, Markdown.\n- Chunking: 500-1000 tokens, overlap 100-200.\n- Embedding: OpenAI text-embedding-3-small / local model.\n- Vector store: ChromaDB / Pinecone / pgvector / Qdrant.\n\nRETRIEVAL:\n- Semantic search (cosine similarity, top_k=5-10).\n- Hybrid: semantic + keyword (BM25/FTS5) + RRF fusion.\n- Metadata filters: doc_type, date, source.\n- Re-ranking: cross-encoder reranker.\n\nGENERATION:\n- System prompt: role + instructions + constraints.\n- Context injection: retrieved chunks into prompt.\n- Citation: reference source document + chunk.\n- Hallucination guard: answer only from context.\n\nEVAL:\n- Retrieval metrics: precision@k, recall@k, MRR.\n- Generation metrics: faithfulness, relevance, completeness.\n- End-to-end: test questions with known answers.' + A + '" --completion-promise "DONE"',
   tags:["rag","ai","llm","embeddings","vector-db","retrieval"],difficulty:"advanced",output:"RAG pipeline",related:["rl-ai-chat","rl-ai-agent"],prereqs:[],v:"11.0"},

  {id:"rl-ai-agent",m:"/ralph-loop",mk:"claude",role:"AI Agent / Tool Use",type:"command",icon:"\u{1F916}",ac:"#6366f1",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: AI Agent с tool calling.\n\nARCHITECTURE:\n- Agent loop: user message → LLM → tool call? → execute tool → LLM → response.\n- Tools: функции с JSON Schema описанием (name, description, parameters).\n- Memory: conversation history (sliding window / summarization).\n\nTOOLS:\n- Database queries (read-only для безопасности).\n- API calls (external services).\n- File operations (read, generate).\n- Calculations, data processing.\n- Web search (если нужно).\n\nSAFETY:\n- Tool execution в sandbox.\n- Rate limiting на API calls.\n- Max iterations (prevent infinite loops).\n- Human-in-the-loop для опасных действий.\n\nIMPLEMENTATION:\n- OpenAI function calling / Anthropic tool_use.\n- Structured output (JSON mode) для надёжного парсинга.\n- Error handling: tool failure → retry / fallback.\n- Streaming: показывай прогресс пользователю.\n\nTEST:\n- Unit tests на каждый tool.\n- Integration: full agent loop с mock LLM.\n- Eval: accuracy on test scenarios.' + A + '" --completion-promise "DONE"',
   tags:["ai","agent","tool-use","function-calling","llm","automation"],difficulty:"advanced",output:"AI agent with tools",related:["rl-rag-pipeline","rl-ai-chat"],prereqs:[],v:"11.0"},

  {id:"rl-prompt-eng",m:"/ralph-loop",mk:"claude",role:"Prompt Engineering System",type:"command",icon:"\u{1F4DD}",ac:"#ec4899",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Система управления промптами.\n\nPROMPT ARCHITECTURE:\n- System prompt: роль, контекст, правила, формат ответа.\n- Few-shot examples: 2-3 примера ideal input → output.\n- Chain-of-thought: \"Рассуждай шаг за шагом\".\n- Output format: JSON schema / structured text.\n\nPROMPT MANAGEMENT:\n- Хранение промптов в отдельных файлах (не хардкод в коде).\n- Версионирование: v1, v2, ... с changelog.\n- A/B testing: сравнение версий промптов.\n- Template variables: {user_name}, {context}, {query}.\n\nOPTIMIZATION:\n- Token counting: tiktoken / approximate.\n- Prompt caching: cache static prefix.\n- Context window management: truncate / summarize history.\n- Cost tracking: tokens × price per model.\n\nEVAL:\n- Test suite: 20+ test cases с expected outputs.\n- Metrics: accuracy, consistency, format compliance.\n- Regression: каждое изменение промпта проходит все тесты.' + A + '" --completion-promise "DONE"',
   tags:["prompt-engineering","ai","llm","optimization","testing"],difficulty:"intermediate",output:"Prompt management system",related:["rl-ai-agent","rl-rag-pipeline"],prereqs:[],v:"11.0"},

  // ── Feature Dev (diverse commands) ──────────

  {id:"fd-crud-api",m:"/feature-dev",mk:"claude",role:"Full CRUD API",type:"command",icon:"\u{1F4E6}",ac:"#10b981",time:"~1-2h",
   text:'Создай полноценный CRUD API для новой сущности.\n\nШАГИ:\n1. Определи модель данных (поля, типы, валидация, связи).\n2. Создай DB модель/миграцию.\n3. Создай сервис с бизнес-логикой (create, get, list, update, delete).\n4. Создай API endpoints (REST или GraphQL).\n5. Добавь пагинацию, фильтрацию, сортировку для list.\n6. Добавь валидацию входных данных.\n7. Напиши тесты (unit + integration).\n8. Добавь документацию (OpenAPI / JSDoc).\n\nСТАНДАРТЫ:\n- Soft delete (is_deleted / deleted_at) вместо hard delete.\n- Audit trail: created_at, updated_at, created_by.\n- Pagination: cursor-based или offset-based.\n- Error responses: {error: string, code: string, details: object}.\n- HTTP статусы: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found.',
   tags:["crud","api","rest","database","backend"],difficulty:"beginner",output:"CRUD API",related:["rl-api","rl-db-schema"],prereqs:[],v:"11.0"},

  {id:"fd-auth-system",m:"/feature-dev",mk:"claude",role:"Auth System",type:"command",icon:"\u{1F510}",ac:"#ef4444",time:"~2-3h",
   text:'Создай систему аутентификации и авторизации.\n\nТРЕБОВАНИЯ:\n1. Registration: email/password + email verification.\n2. Login: JWT access token (15min) + refresh token (7d).\n3. Password: bcrypt hash, min 8 chars, reset via email.\n4. RBAC: roles (admin, user, viewer) + permissions.\n5. Middleware: auth guard на protected routes.\n6. Session: хранение refresh token (DB или Redis).\n7. Rate limiting: 5 attempts → 15min lockout.\n8. 2FA: TOTP (Google Authenticator) — опционально.\n\nSECURITY:\n- Tokens в httpOnly cookies (не localStorage).\n- CSRF protection.\n- Helmet headers.\n- Audit log: login attempts, password changes.\n\nТЕСТЫ:\n- Login success/failure.\n- Token refresh flow.\n- Role-based access.\n- Rate limiting.\n- Password reset flow.',
   tags:["auth","jwt","security","rbac","registration","login"],difficulty:"intermediate",output:"Auth system",related:["rl-auth","rl-2fa","rl-rbac"],prereqs:[],v:"11.0"},

  {id:"fd-dashboard",m:"/feature-dev",mk:"claude",role:"Admin Dashboard",type:"command",icon:"\u{1F4CA}",ac:"#3b82f6",time:"~2-3h",
   text:'Создай admin dashboard с аналитикой.\n\nSTRUCTURE:\n1. Layout: sidebar navigation + header + main content.\n2. Dashboard page: KPI cards + charts + recent activity.\n3. Data tables: sortable, filterable, paginated, exportable.\n4. Forms: create/edit entities with validation.\n5. User management: roles, status, activity log.\n\nCOMPONENTS:\n- KPI Card: value + trend (↑↓) + sparkline.\n- Chart: line/bar/pie (Chart.js / Recharts / D3).\n- DataTable: columns config, search, bulk actions.\n- Modal: confirm dialogs, edit forms.\n- Toast: success/error/warning notifications.\n\nFEATURES:\n- Real-time: WebSocket updates для live data.\n- Export: CSV/Excel/PDF download.\n- Filters: date range, status, category.\n- Responsive: mobile sidebar collapse.\n- Dark mode toggle.\n\nTECH:\n- React + TailwindCSS / shadcn/ui.\n- API integration с error/loading states.\n- Optimistic UI updates.',
   tags:["dashboard","admin","charts","tables","analytics","ui"],difficulty:"intermediate",output:"Admin dashboard",related:["rl-dashboard","rl-crud","rl-charts"],prereqs:[],v:"11.0"},

  // ── Review / Quality (diverse commands) ─────

  {id:"rv-security-audit",m:"/review-pr",mk:"claude",role:"Security Audit",type:"command",icon:"\u{1F6E1}",ac:"#dc2626",time:"~1h",
   text:'Проведи полный security audit текущего кода.\n\nCHECKLIST:\n\n1. INJECTION:\n   - SQL injection (параметризованные запросы?)\n   - XSS (экранирование output?)\n   - Command injection (shell exec с user input?)\n   - Path traversal (../ в file paths?)\n\n2. AUTH:\n   - Пароли хешированы (bcrypt/argon2)?\n   - JWT секрет достаточно длинный?\n   - Rate limiting на login?\n   - Session timeout?\n\n3. DATA:\n   - .env в .gitignore?\n   - Secrets не в коде?\n   - HTTPS enforced?\n   - CORS настроен правильно?\n\n4. DEPENDENCIES:\n   - npm audit / pip audit — уязвимости?\n   - Устаревшие пакеты?\n\n5. API:\n   - Input validation на всех endpoints?\n   - Rate limiting?\n   - Нет mass assignment (только whitelist полей)?\n\nВЫХОД: Отчёт с severity (critical/high/medium/low), файл:строка, fix recommendation.',
   tags:["security","audit","owasp","vulnerability","review"],difficulty:"intermediate",output:"Security audit report",related:["rl-security","rl-auth"],prereqs:[],v:"11.0"},

  {id:"rv-perf-review",m:"/review-pr",mk:"claude",role:"Performance Review",type:"command",icon:"\u{26A1}",ac:"#f59e0b",time:"~1h",
   text:'Проведи performance review проекта.\n\nANALYSIS:\n\n1. DATABASE:\n   - N+1 queries? (eager loading нужен?)\n   - Missing indexes? (EXPLAIN ANALYZE на slow queries)\n   - Unoptimized queries? (SELECT * → SELECT fields)\n   - Connection pooling?\n\n2. API:\n   - Response time > 200ms? Где bottleneck?\n   - Caching? (Redis, in-memory, HTTP cache headers)\n   - Pagination? (нет ли загрузки всех записей)\n   - Compression? (gzip/brotli)\n\n3. FRONTEND:\n   - Bundle size? (analyzer: webpack-bundle-analyzer / vite-bundle-visualizer)\n   - Lazy loading? (code splitting, dynamic imports)\n   - Image optimization? (WebP, lazy load, srcset)\n   - Re-renders? (React.memo, useMemo, useCallback)\n\n4. INFRASTRUCTURE:\n   - Memory leaks? (growing heap over time)\n   - Connection leaks? (DB/Redis connections not closed)\n   - File descriptor leaks?\n\nВЫХОД: Bottlenecks ranked by impact, конкретные fixes с файл:строка.',
   tags:["performance","optimization","review","database","bundle"],difficulty:"intermediate",output:"Performance report",related:["rl-perf","rl-bundle","rl-cache"],prereqs:[],v:"11.0"},

  // ── Loop commands (monitoring, automation) ──

  {id:"lp-health-monitor",m:"/loop",mk:"claude",role:"Health Monitor",type:"command",icon:"\u{1F49A}",ac:"#22c55e",time:"continuous",
   text:'/loop 5m "Проверь здоровье проекта:\n\n1. Сервер запущен? (curl localhost:PORT/health)\n2. Тесты проходят? (npm test / pytest — только быстрые)\n3. Нет ошибок в логах? (tail -20 log файл)\n4. Диск не переполнен? (df -h)\n5. Память в норме? (free -h / процесс не течёт)\n\nЕсли проблема найдена — сообщи СРАЗУ с деталями.\nЕсли всё ОК — краткий статус в 1 строку."',
   tags:["monitoring","health","loop","devops","continuous"],difficulty:"beginner",output:"Health status",related:["rl-monit","rl-logging"],prereqs:[],v:"11.0"},

  {id:"lp-test-watcher",m:"/loop",mk:"claude",role:"Test Watcher",type:"command",icon:"\u{1F9EA}",ac:"#a855f7",time:"continuous",
   text:'/loop 3m "Запусти тесты проекта. Если есть failing тесты:\n\n1. Прочитай error message и stack trace.\n2. Найди файл и строку где ошибка.\n3. Определи root cause: код сломан или тест устарел?\n4. Исправь (код или тест — что правильнее).\n5. Перезапусти тесты.\n\nЕсли все тесты проходят — сообщи кратко: ✅ All N tests pass.\nЕсли не можешь починить за 3 попытки — сообщи с деталями."',
   tags:["testing","loop","tdd","watcher","continuous"],difficulty:"beginner",output:"Green tests",related:["rl-tdd","rl-e2e"],prereqs:[],v:"11.0"},

  // ── Beginner-friendly prompts ───────────────

  {id:"rl-project-setup",m:"/ralph-loop",mk:"claude",role:"Project Setup",type:"command",icon:"\u{1F680}",ac:"#0ea5e9",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Настрой проект с нуля.\n\nCHECKLIST:\n1. Package manager init (npm init / pip init / cargo init).\n2. TypeScript / типизация: tsconfig.json / mypy / pyright.\n3. Linter + formatter: eslint+prettier / ruff / clippy.\n4. Git: .gitignore, conventional commits.\n5. ENV: .env.example с описанием переменных.\n6. Scripts: dev, build, test, lint, format.\n7. README: Quick Start, Architecture, Contributing.\n8. CI: GitHub Actions — lint + test + build.\n9. Docker: Dockerfile + docker-compose.yml (dev).\n10. Pre-commit hooks: lint-staged + husky / pre-commit.\n\nКАЖДЫЙ ПУНКТ: проверь что работает, запусти, убедись.' + A + '" --completion-promise "DONE"',
   tags:["setup","init","project","beginner","boilerplate","scaffold"],difficulty:"beginner",output:"Project scaffold",related:["rl-ci","rl-docker","rl-lint"],prereqs:[],v:"11.0"},

  {id:"rl-readme-gen",m:"/ralph-loop",mk:"claude",role:"README Generator",type:"command",icon:"\u{1F4D6}",ac:"#6366f1",time:"~20m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Создай профессиональный README.md.\n\nСТРУКТУРА:\n1. Заголовок + бейджи (build, tests, coverage, license).\n2. Описание: 1-2 предложения — что делает проект.\n3. Features: буллеты с основными возможностями.\n4. Quick Start: 3-5 команд от клонирования до запуска.\n5. Architecture: краткая схема (мермейд или текст).\n6. API Reference: основные endpoints/commands.\n7. Configuration: переменные окружения, файлы конфигов.\n8. Development: как запустить dev, тесты, линтер.\n9. Deployment: как деплоить (Docker, Vercel, etc.).\n10. Contributing: code style, PR process.\n11. License.\n\nПРАВИЛА:\n- Только ФАКТЫ из кода. Не выдумывай features которых нет.\n- Проверь что Quick Start РЕАЛЬНО работает.\n- Команды из scripts в package.json / Makefile.' + A + '" --completion-promise "DONE"',
   tags:["readme","documentation","docs","beginner","markdown"],difficulty:"beginner",output:"README.md",related:["rl-api-doc","rl-project-setup"],prereqs:[],v:"11.0"},

  {id:"rl-env-setup",m:"/ralph-loop",mk:"claude",role:"Environment & Config",type:"command",icon:"\u{2699}",ac:"#64748b",time:"~20m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Настрой управление конфигурацией.\n\n1. .env файл: все секреты и настройки.\n2. .env.example: шаблон БЕЗ реальных значений, с описанием каждой переменной.\n3. Validation: при старте проверяй что все обязательные env есть (zod / pydantic / joi).\n4. Defaults: разумные значения по умолчанию для опциональных.\n5. Типизация: config object с типами (не string everywhere).\n6. Multi-env: development / staging / production.\n7. Docker: env_file в docker-compose.yml.\n8. CI: secrets в GitHub Actions / GitLab CI variables.\n9. .gitignore: .env, .env.local, .env.*.local.\n10. Документация: README секция Configuration.' + A + '" --completion-promise "DONE"',
   tags:["config","env","environment","secrets","setup","beginner"],difficulty:"beginner",output:"Config management",related:["rl-docker","rl-project-setup"],prereqs:[],v:"11.0"},

  // ── DevOps / Infrastructure ─────────────────

  {id:"rl-k8s-deploy",m:"/ralph-loop",mk:"claude",role:"Kubernetes Deploy",type:"command",icon:"\u{2638}",ac:"#326ce5",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Kubernetes deployment.\n\nMANIFESTS:\n- Deployment: replicas, resources (CPU/memory limits), health checks.\n- Service: ClusterIP / LoadBalancer / NodePort.\n- Ingress: domain routing, TLS termination.\n- ConfigMap: non-secret config.\n- Secret: credentials (base64 encoded).\n- HPA: auto-scaling (CPU > 70% → add pod).\n\nHEALTH:\n- livenessProbe: /health (restart if dead).\n- readinessProbe: /ready (remove from LB if not ready).\n- startupProbe: slow-starting apps.\n\nSTRATEGY:\n- RollingUpdate: maxUnavailable=0, maxSurge=1.\n- Resource requests + limits для каждого контейнера.\n- Pod Disruption Budget: minAvailable=1.\n\nOBSERVABILITY:\n- Prometheus metrics endpoint.\n- Structured JSON logging (→ ELK / Loki).\n- Distributed tracing (OpenTelemetry).\n\nSECURITY:\n- Non-root container.\n- ReadOnlyRootFilesystem.\n- Network policies.' + A + '" --completion-promise "DONE"',
   tags:["kubernetes","k8s","deploy","devops","containers","scaling"],difficulty:"advanced",output:"K8s deployment",related:["rl-docker","rl-ci","rl-monit"],prereqs:[],v:"11.0"},

  {id:"rl-github-actions",m:"/ralph-loop",mk:"claude",role:"GitHub Actions CI/CD",type:"command",icon:"\u{1F3AD}",ac:"#2088ff",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: GitHub Actions CI/CD pipeline.\n\n.github/workflows/ci.yml:\n\nTRIGGERS:\n- push: main, develop.\n- pull_request: main.\n\nJOBS (parallel):\n1. LINT: eslint/ruff/clippy.\n2. TYPECHECK: tsc --noEmit / mypy / cargo check.\n3. TEST: unit + integration (matrix: node 20/22 или python 3.11/3.12).\n4. BUILD: production build, check it succeeds.\n\nDEPLOY (sequential, after CI):\n5. STAGING: deploy on PR merge to develop.\n6. PRODUCTION: deploy on tag v*.*.* to main.\n\nOPTIMIZATIONS:\n- Dependency caching (actions/cache).\n- Parallel jobs.\n- Fail fast.\n- Artifact upload (test reports, coverage).\n- Status badges in README.\n\nSECRETS:\n- DEPLOY_TOKEN, DATABASE_URL, API_KEYS — в GitHub Secrets.\n- OIDC для cloud providers (no long-lived tokens).' + A + '" --completion-promise "DONE"',
   tags:["github-actions","ci-cd","automation","deploy","testing"],difficulty:"beginner",output:"CI/CD pipeline",related:["rl-ci","rl-deploy","rl-docker"],prereqs:[],v:"11.0"},

  // ── Data & Integrations ─────────────────────

  {id:"rl-webhook-system",m:"/ralph-loop",mk:"claude",role:"Webhook System",type:"command",icon:"\u{1F514}",ac:"#f97316",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Webhook система (отправка и приём).\n\nOUTGOING WEBHOOKS:\n- Event registry: event_type → URL subscribers.\n- Payload: {event, timestamp, data, signature}.\n- Signature: HMAC-SHA256(payload, secret).\n- Retry: 3 attempts с exponential backoff (1s, 5s, 25s).\n- Delivery log: status, response_code, latency, attempts.\n- Dead letter queue: failed после всех retries.\n\nINCOMING WEBHOOKS:\n- Endpoint: POST /webhooks/:provider.\n- Signature verification (provider-specific).\n- Idempotency: store webhook_id, skip duplicates.\n- Async processing: queue webhook → process later.\n- Timeout: respond 200 быстро, process async.\n\nADMIN UI:\n- Webhook subscribers list.\n- Delivery log (success/failed/pending).\n- Manual retry button.\n- Test webhook button (send sample payload).\n\nSECURITY:\n- Secret rotation.\n- IP whitelist (optional).\n- Rate limiting on incoming.' + A + '" --completion-promise "DONE"',
   tags:["webhooks","events","integration","api","async"],difficulty:"intermediate",output:"Webhook system",related:["rl-queue-pattern","rl-api"],prereqs:[],v:"11.0"},

  {id:"rl-email-system",m:"/ralph-loop",mk:"claude",role:"Email System",type:"command",icon:"\u{1F4E7}",ac:"#06b6d4",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Email система.\n\nTRANSPORT:\n- SMTP: nodemailer / smtplib / lettre.\n- Provider: SendGrid / Resend / AWS SES / Postmark.\n- Config: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS в .env.\n\nTEMPLATES:\n- HTML email templates (responsive, dark mode safe).\n- Template engine: Handlebars / Jinja2 / mjml.\n- Variables: {user_name}, {action_url}, {company_name}.\n- Base template: header + content + footer.\n- Types: welcome, reset password, notification, invoice.\n\nSENDING:\n- Queue: async sending (Bull / Celery / background job).\n- Rate limiting: max N emails/second.\n- Retry: failed sends → retry queue.\n- Logging: sent_at, to, subject, status, message_id.\n\nFEATURES:\n- Unsubscribe link (CAN-SPAM compliance).\n- Tracking: open rate, click rate (optional).\n- Preview: /dev/emails endpoint для просмотра шаблонов.\n- Test mode: redirect all emails to dev mailbox.' + A + '" --completion-promise "DONE"',
   tags:["email","smtp","templates","notifications","sendgrid"],difficulty:"intermediate",output:"Email system",related:["rl-notif","rl-webhook-system"],prereqs:[],v:"11.0"},
];

add.forEach(p => { p.compact = p.text.slice(0, 400); });
data.P = [...data.P, ...add];

// New combos
data.COMBOS.ru.push(
  { name:"AI Application", agents:["rl-rag-pipeline","rl-ai-agent","rl-prompt-eng"], ids:["rl-rag-pipeline","rl-ai-agent","rl-prompt-eng"], desc:"RAG + AI Agent + промпт-инженерия" },
  { name:"Project Kickstart", agents:["rl-project-setup","rl-env-setup","rl-readme-gen","rl-github-actions"], ids:["rl-project-setup","rl-env-setup","rl-readme-gen","rl-github-actions"], desc:"Setup + конфиг + README + CI/CD" },
  { name:"Full Stack Feature", agents:["fd-crud-api","fd-auth-system","fd-dashboard"], ids:["fd-crud-api","fd-auth-system","fd-dashboard"], desc:"CRUD API + Auth + Admin Dashboard" },
);
data.COMBOS.en.push(
  { name:"AI Application", agents:["rl-rag-pipeline","rl-ai-agent","rl-prompt-eng"], ids:["rl-rag-pipeline","rl-ai-agent","rl-prompt-eng"], desc:"RAG + AI Agent + prompt engineering" },
  { name:"Project Kickstart", agents:["rl-project-setup","rl-env-setup","rl-readme-gen","rl-github-actions"], ids:["rl-project-setup","rl-env-setup","rl-readme-gen","rl-github-actions"], desc:"Setup + config + README + CI/CD" },
  { name:"Full Stack Feature", agents:["fd-crud-api","fd-auth-system","fd-dashboard"], ids:["fd-crud-api","fd-auth-system","fd-dashboard"], desc:"CRUD API + Auth + Admin Dashboard" },
);

// New quick commands
data.QUICK_CMDS.ru.push(
  { cmd: '/supervise', desc: 'QA начальник: тестирует проект, чинит код, итерирует до идеала' },
  { cmd: '/ralph-loop "Добавь dark mode" --completion-promise "DONE"', desc: 'Автономная задача с гарантией завершения' },
  { cmd: '/feature-dev', desc: 'Guided разработка фичи с архитектурным фокусом' },
  { cmd: '/loop 5m "Проверь здоровье проекта"', desc: 'Мониторинг каждые 5 минут' },
  { cmd: '/review-pr', desc: 'Мульти-агент code review текущего PR' },
);
data.QUICK_CMDS.en.push(
  { cmd: '/supervise', desc: 'QA boss: tests project, fixes code, iterates until perfect' },
  { cmd: '/ralph-loop "Add dark mode" --completion-promise "DONE"', desc: 'Autonomous task with completion guarantee' },
  { cmd: '/feature-dev', desc: 'Guided feature dev with architecture focus' },
  { cmd: '/loop 5m "Check project health"', desc: 'Health monitoring every 5 minutes' },
  { cmd: '/review-pr', desc: 'Multi-agent code review for current PR' },
);

// Cheat sheet: Docker
data.CHEAT['Docker'] = {
  name: 'Docker', color: '#2496ed',
  cmds: [
    { cmd: 'docker compose up -d', desc: 'Start all services' },
    { cmd: 'docker compose down -v', desc: 'Stop + remove volumes' },
    { cmd: 'docker compose logs -f app', desc: 'Stream logs' },
    { cmd: 'docker compose build --no-cache', desc: 'Rebuild from scratch' },
    { cmd: 'docker exec -it container sh', desc: 'Shell into container' },
    { cmd: 'docker system prune -af', desc: 'Clean everything' },
    { cmd: 'docker stats', desc: 'Live resource usage' },
    { cmd: 'docker compose ps', desc: 'Running services' },
  ]
};

// Cheat sheet: Kubernetes
data.CHEAT['Kubernetes'] = {
  name: 'Kubernetes', color: '#326ce5',
  cmds: [
    { cmd: 'kubectl get pods -A', desc: 'All pods all namespaces' },
    { cmd: 'kubectl logs -f deploy/app', desc: 'Stream logs' },
    { cmd: 'kubectl apply -f k8s/', desc: 'Apply manifests' },
    { cmd: 'kubectl rollout restart deploy/app', desc: 'Rolling restart' },
    { cmd: 'kubectl describe pod <name>', desc: 'Pod details + events' },
    { cmd: 'kubectl exec -it pod/app -- sh', desc: 'Shell into pod' },
    { cmd: 'kubectl top pods', desc: 'Resource usage' },
    { cmd: 'kubectl port-forward svc/app 8080:80', desc: 'Local tunnel' },
  ]
};

const json = JSON.stringify(data);
const compressed = deflateSync(json).toString('base64');
const newSrc = src.replace(/const Z = "[^"]+"/, 'const Z = "' + compressed + '"');
fs.writeFileSync('src/App.jsx', newSrc);
console.log('Prompts:', data.P.length);
console.log('Combos RU:', data.COMBOS.ru.length);
console.log('Combos EN:', data.COMBOS.en.length);
console.log('Cheat sheets:', Object.keys(data.CHEAT).length);
console.log('Quick cmds RU:', data.QUICK_CMDS.ru.length);
console.log('Quick cmds EN:', data.QUICK_CMDS.en.length);
