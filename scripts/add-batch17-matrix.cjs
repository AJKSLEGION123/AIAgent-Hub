const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 РАЗВЕДКА: Прочитай структуру, конфиги, зависимости, тесты. ";
const A = " АНТИ-ЛУП: 3 ошибки \u2014 смена подхода.";

function mkPrompt(id, role, icon, ac, time, taskDesc, tags, difficulty) {
  const cmd = id.startsWith("rl-") ? "/ralph-loop" : id.startsWith("fd-") ? "/feature-dev" : id.startsWith("rv-") ? "/review-pr" : id.startsWith("cr-") ? "/code-review" : id.startsWith("sm-") ? "/simplify" : id.startsWith("lp-") ? "/loop" : id.startsWith("cm-") ? "/commit" : "/feature-dev";
  const text = cmd === "/ralph-loop" ? '/ralph-loop "' + E + 'ЗАДАЧА: ' + taskDesc + A + '" --completion-promise "DONE"' : cmd === "/loop" ? '/loop 5m "' + taskDesc + '"' : taskDesc;
  return { id, m: cmd, mk: "claude", role, type: "command", icon, ac, time, text, tags: tags.split(","), difficulty, output: "Result", related: [], prereqs: [], v: "11.2" };
}

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const add = [];

// ═════════════════════════════════════════════════════
// MATRIX 1: LANGUAGE × TASK (20 × 35 = 700)
// ═════════════════════════════════════════════════════
const LANGS = [
  {key:'js',label:'JavaScript',color:'#f7df1e',icon:'JS'},
  {key:'ts',label:'TypeScript',color:'#3178c6',icon:'TS'},
  {key:'py',label:'Python',color:'#3776ab',icon:'PY'},
  {key:'go',label:'Go',color:'#00acd7',icon:'GO'},
  {key:'rs',label:'Rust',color:'#ce422b',icon:'RS'},
  {key:'java',label:'Java',color:'#ed8b00',icon:'JV'},
  {key:'kt',label:'Kotlin',color:'#7f52ff',icon:'KT'},
  {key:'swift',label:'Swift',color:'#f05138',icon:'SW'},
  {key:'cs',label:'C#',color:'#512bd4',icon:'C#'},
  {key:'cpp',label:'C++',color:'#00599c',icon:'C+'},
  {key:'rb',label:'Ruby',color:'#cc342d',icon:'RB'},
  {key:'php',label:'PHP',color:'#777bb4',icon:'PH'},
  {key:'ex',label:'Elixir',color:'#4e2a8e',icon:'EX'},
  {key:'dart',label:'Dart',color:'#0175c2',icon:'DT'},
  {key:'scala',label:'Scala',color:'#dc322f',icon:'SC'},
  {key:'lua',label:'Lua',color:'#2c2d72',icon:'LU'},
  {key:'r',label:'R',color:'#276dc3',icon:'R'},
  {key:'jl',label:'Julia',color:'#389826',icon:'JL'},
  {key:'hs',label:'Haskell',color:'#5e5086',icon:'HS'},
  {key:'clj',label:'Clojure',color:'#5881d8',icon:'CJ'},
];

const TASKS = [
  {key:'crud',label:'CRUD REST API',desc:'CRUD endpoints с валидацией, pagination, sort, filter, тестами',diff:'intermediate',time:'~1-2h'},
  {key:'graphql',label:'GraphQL API',desc:'GraphQL схема, resolvers, dataloader, авторизация',diff:'intermediate',time:'~1-2h'},
  {key:'grpc',label:'gRPC Service',desc:'gRPC service с proto3, streaming, interceptors',diff:'intermediate',time:'~1-2h'},
  {key:'ws',label:'WebSocket Server',desc:'WebSocket server с rooms, broadcast, reconnect, heartbeat',diff:'intermediate',time:'~1h'},
  {key:'sse',label:'SSE Stream',desc:'Server-Sent Events endpoint с retry, backpressure',diff:'intermediate',time:'~45m'},
  {key:'auth-jwt',label:'JWT Auth',desc:'Access + refresh tokens, middleware, refresh endpoint',diff:'intermediate',time:'~1h'},
  {key:'auth-oauth',label:'OAuth2 Integration',desc:'OAuth2 PKCE flow, provider integration, callback',diff:'advanced',time:'~1-2h'},
  {key:'upload',label:'File Upload to S3',desc:'Presigned URL, multipart, validation, processing',diff:'intermediate',time:'~1h'},
  {key:'queue',label:'Background Job Queue',desc:'Job queue с retry, DLQ, priority, concurrency',diff:'intermediate',time:'~1h'},
  {key:'unit-test',label:'Unit Tests',desc:'Unit test suite с coverage, mocks, fixtures',diff:'beginner',time:'~45m'},
  {key:'integration',label:'Integration Tests',desc:'Integration tests с Testcontainers, real DB',diff:'intermediate',time:'~1h'},
  {key:'e2e',label:'E2E Testing',desc:'E2E тесты: критические flows, cleanup, CI',diff:'intermediate',time:'~1-2h'},
  {key:'docker',label:'Docker Container',desc:'Multi-stage Dockerfile, non-root, healthcheck, compose',diff:'intermediate',time:'~45m'},
  {key:'k8s',label:'K8s Deployment',desc:'Deployment + Service + Ingress + ConfigMap + HPA manifests',diff:'intermediate',time:'~1h'},
  {key:'ci-cd',label:'CI/CD Pipeline',desc:'CI/CD: lint + test + build + deploy, matrix builds',diff:'intermediate',time:'~1h'},
  {key:'rate-limit',label:'Rate Limiter',desc:'Rate limit: token bucket, per-user/IP, Redis-backed',diff:'intermediate',time:'~45m'},
  {key:'cache',label:'Cache Layer',desc:'Redis cache layer: keys, TTL, invalidation, stampede prevention',diff:'intermediate',time:'~1h'},
  {key:'db-migration',label:'DB Migrations',desc:'Schema migrations: up/down, data backfill, zero-downtime',diff:'intermediate',time:'~1h'},
  {key:'monitoring',label:'Monitoring Setup',desc:'Prometheus metrics, Grafana dashboards, alerts',diff:'intermediate',time:'~1-2h'},
  {key:'error-track',label:'Error Tracking',desc:'Sentry setup: SDK, source maps, releases, context',diff:'beginner',time:'~45m'},
  {key:'json-log',label:'Structured Logging',desc:'JSON logs: levels, context, correlation IDs, PII scrubbing',diff:'beginner',time:'~45m'},
  {key:'profiling',label:'Performance Profiling',desc:'CPU/memory profiling, flamegraphs, top bottlenecks',diff:'advanced',time:'~1h'},
  {key:'sec-audit',label:'Security Audit',desc:'OWASP checklist, deps audit, secrets scan, fix critical',diff:'intermediate',time:'~1-2h'},
  {key:'load-test',label:'Load Testing',desc:'Load test: k6/Locust/JMeter, baseline, stress, spike',diff:'intermediate',time:'~1h'},
  {key:'payment',label:'Payment Integration',desc:'Stripe integration: Checkout, webhooks, refunds',diff:'intermediate',time:'~1-2h'},
  {key:'email',label:'Email Sending',desc:'Transactional email: templates, retry, bounce handling',diff:'beginner',time:'~45m'},
  {key:'sms',label:'SMS Integration',desc:'SMS OTP: Twilio/Vonage, delivery tracking, country codes',diff:'beginner',time:'~45m'},
  {key:'search',label:'Full-Text Search',desc:'Elasticsearch/Meilisearch: indexing, queries, facets',diff:'intermediate',time:'~1h'},
  {key:'chat',label:'Real-time Chat',desc:'Chat service: messages, typing, presence, history',diff:'intermediate',time:'~1-2h'},
  {key:'mfa',label:'MFA 2FA',desc:'TOTP 2FA: enrollment, backup codes, recovery',diff:'intermediate',time:'~1h'},
  {key:'backup',label:'Backup Strategy',desc:'Automated backups: full + incremental, encryption, restore testing',diff:'intermediate',time:'~1h'},
  {key:'api-docs',label:'API Documentation',desc:'OpenAPI spec, examples, authentication, publish',diff:'beginner',time:'~45m'},
  {key:'admin',label:'Admin Panel',desc:'Admin UI: CRUD, filters, audit log, role-based access',diff:'intermediate',time:'~2h'},
  {key:'bg-tasks',label:'Scheduled Tasks',desc:'Cron jobs: idempotent, locking, monitoring, retries',diff:'beginner',time:'~45m'},
  {key:'retry',label:'Retry + Backoff',desc:'Retry wrapper: exponential backoff + jitter, budget',diff:'beginner',time:'~30m'},
];

for (const lang of LANGS) {
  for (const task of TASKS) {
    add.push(mkPrompt(
      `rl-${lang.key}-${task.key}`,
      `${task.label} (${lang.label})`,
      lang.icon,
      lang.color,
      task.time,
      `${task.desc}. Язык: ${lang.label}. Конвенции и идиомы языка, типы, тесты, readme.`,
      `${lang.key},${task.key},${slug(task.label)}`,
      task.diff,
    ));
  }
}

// ═════════════════════════════════════════════════════
// MATRIX 2: FRAMEWORK × OPERATION (50+ × 10 = 500+)
// ═════════════════════════════════════════════════════
const FRAMEWORKS = [
  {key:'nextjs',label:'Next.js',color:'#000000'},{key:'remix',label:'Remix',color:'#121212'},
  {key:'astro',label:'Astro',color:'#ff5d01'},{key:'nuxt',label:'Nuxt',color:'#00dc82'},
  {key:'svelte',label:'SvelteKit',color:'#ff3e00'},{key:'solidstart',label:'SolidStart',color:'#2c4f7c'},
  {key:'qwik',label:'Qwik',color:'#ac7ef4'},{key:'angular',label:'Angular',color:'#dd0031'},
  {key:'express',label:'Express',color:'#000000'},{key:'fastify',label:'Fastify',color:'#00a8a8'},
  {key:'nestjs',label:'NestJS',color:'#e0234e'},{key:'hono',label:'Hono',color:'#e36002'},
  {key:'koa',label:'Koa',color:'#33333d'},{key:'bun-http',label:'Bun HTTP',color:'#fbf0df'},
  {key:'deno',label:'Deno',color:'#000000'},{key:'fastapi',label:'FastAPI',color:'#009688'},
  {key:'django',label:'Django',color:'#092e20'},{key:'flask',label:'Flask',color:'#000000'},
  {key:'starlette',label:'Starlette',color:'#10b981'},{key:'litestar',label:'Litestar',color:'#5f3dc4'},
  {key:'rails',label:'Rails',color:'#cc0000'},{key:'sinatra',label:'Sinatra',color:'#000000'},
  {key:'laravel',label:'Laravel',color:'#ff2d20'},{key:'symfony',label:'Symfony',color:'#000000'},
  {key:'spring-boot',label:'Spring Boot',color:'#6db33f'},{key:'quarkus',label:'Quarkus',color:'#4695eb'},
  {key:'micronaut',label:'Micronaut',color:'#00ccc7'},{key:'ktor',label:'Ktor',color:'#7f52ff'},
  {key:'vapor',label:'Vapor Swift',color:'#0d0d0d'},{key:'go-fiber',label:'Go Fiber',color:'#00acd7'},
  {key:'go-echo',label:'Go Echo',color:'#00acd7'},{key:'go-chi',label:'Go Chi',color:'#00acd7'},
  {key:'axum',label:'Rust Axum',color:'#ce422b'},{key:'actix',label:'Actix-web',color:'#ce422b'},
  {key:'rocket',label:'Rust Rocket',color:'#ce422b'},{key:'phoenix',label:'Phoenix',color:'#4e2a8e'},
  {key:'plug',label:'Elixir Plug',color:'#4e2a8e'},{key:'aspnet',label:'ASP.NET Core',color:'#512bd4'},
  {key:'minimal-api',label:'Minimal APIs .NET',color:'#512bd4'},{key:'dropwizard',label:'Dropwizard',color:'#2e2e2e'},
];

const FRAMEWORK_OPS = [
  {key:'setup',label:'Setup',desc:'Полный setup проекта с конфигурацией',time:'~1h',diff:'beginner'},
  {key:'auth',label:'Auth Integration',desc:'Auth система с JWT/session',time:'~1-2h',diff:'intermediate'},
  {key:'db-orm',label:'ORM/DB Layer',desc:'ORM интеграция, миграции, модели',time:'~1h',diff:'intermediate'},
  {key:'middleware',label:'Middleware Chain',desc:'Middleware: logging, CORS, compression, rate limit',time:'~45m',diff:'intermediate'},
  {key:'validation',label:'Input Validation',desc:'Валидация входных данных, schema-based',time:'~45m',diff:'intermediate'},
  {key:'testing',label:'Testing Setup',desc:'Unit + integration test harness',time:'~1h',diff:'intermediate'},
  {key:'deploy',label:'Production Deploy',desc:'Production deployment: Docker/K8s/serverless',time:'~1-2h',diff:'intermediate'},
  {key:'observability',label:'Observability',desc:'Metrics + logs + traces + error tracking',time:'~1h',diff:'intermediate'},
  {key:'openapi',label:'OpenAPI Spec',desc:'OpenAPI спецификация с авто-документацией',time:'~45m',diff:'intermediate'},
  {key:'scale',label:'Horizontal Scale',desc:'Horizontal scaling: stateless, session store, WebSocket sticky',time:'~1-2h',diff:'advanced'},
];

for (const fw of FRAMEWORKS) {
  for (const op of FRAMEWORK_OPS) {
    add.push(mkPrompt(
      `rl-${fw.key}-${op.key}`,
      `${fw.label}: ${op.label}`,
      fw.label.substring(0,2).toUpperCase(),
      fw.color,
      op.time,
      `${op.desc}. Фреймворк: ${fw.label}. Best practices, production-ready.`,
      `${fw.key},${op.key},framework`,
      op.diff,
    ));
  }
}

// ═════════════════════════════════════════════════════
// MATRIX 3: DATABASE × OPERATION (15 × 12 = 180)
// ═════════════════════════════════════════════════════
const DBS = [
  {key:'pg',label:'PostgreSQL',color:'#336791'},{key:'mysql',label:'MySQL',color:'#4479a1'},
  {key:'mariadb',label:'MariaDB',color:'#003545'},{key:'sqlite',label:'SQLite',color:'#003b57'},
  {key:'mongo',label:'MongoDB',color:'#47a248'},{key:'redis',label:'Redis',color:'#dc382d'},
  {key:'es',label:'Elasticsearch',color:'#005571'},{key:'cassandra',label:'Cassandra',color:'#1287b1'},
  {key:'dynamodb',label:'DynamoDB',color:'#4053d6'},{key:'ch',label:'ClickHouse',color:'#ffcc00'},
  {key:'scylla',label:'ScyllaDB',color:'#9a2aed'},{key:'neo4j',label:'Neo4j',color:'#008cc1'},
  {key:'influx',label:'InfluxDB',color:'#22adf6'},{key:'couch',label:'CouchDB',color:'#e42528'},
  {key:'surrealdb',label:'SurrealDB',color:'#ff00a0'},
];

const DB_OPS = [
  {key:'schema',label:'Schema Design',desc:'Схема БД: нормализация, индексы, ограничения',time:'~1h',diff:'intermediate'},
  {key:'indexing',label:'Indexing Strategy',desc:'Стратегия индексирования, сложные индексы, покрывающие',time:'~1h',diff:'advanced'},
  {key:'partition',label:'Partitioning',desc:'Partitioning: range/list/hash, pruning',time:'~1h',diff:'advanced'},
  {key:'replication',label:'Replication',desc:'Replication: master-slave/multi-master, failover',time:'~1-2h',diff:'advanced'},
  {key:'sharding',label:'Sharding',desc:'Sharding стратегия: shard key, resharding',time:'~2h',diff:'advanced'},
  {key:'backup',label:'Backup + PITR',desc:'Backup: full/incremental, PITR, restore testing',time:'~1h',diff:'intermediate'},
  {key:'monitoring',label:'Monitoring',desc:'Мониторинг БД: медленные запросы, блокировки, connection pool',time:'~45m',diff:'intermediate'},
  {key:'tuning',label:'Performance Tuning',desc:'Тюнинг: конфиг, индексы, vacuum/maintenance',time:'~1-2h',diff:'advanced'},
  {key:'migration',label:'Zero-Downtime Migration',desc:'Zero-downtime migration: dual-write, backfill, cutover',time:'~1-2h',diff:'advanced'},
  {key:'security',label:'DB Security',desc:'Аудит, TLS, роли/privileges, encryption at rest',time:'~1h',diff:'intermediate'},
  {key:'pooling',label:'Connection Pooling',desc:'Connection pool: PgBouncer/HikariCP, размеры, timeouts',time:'~45m',diff:'intermediate'},
  {key:'query-opt',label:'Query Optimization',desc:'Optimize slow queries: EXPLAIN, rewrite, indexes',time:'~1h',diff:'advanced'},
];

for (const db of DBS) {
  for (const op of DB_OPS) {
    add.push(mkPrompt(
      `rl-${db.key}-${op.key}`,
      `${db.label}: ${op.label}`,
      '◈',
      db.color,
      op.time,
      `${op.desc}. СУБД: ${db.label}. Production best practices.`,
      `${db.key},${op.key},database`,
      op.diff,
    ));
  }
}

// ═════════════════════════════════════════════════════
// MATRIX 4: CLOUD × SERVICE × ACTION (10 × 6 = ~250)
// ═════════════════════════════════════════════════════
const CLOUDS = [
  {key:'aws',label:'AWS',color:'#ff9900'},
  {key:'gcp',label:'GCP',color:'#4285f4'},
  {key:'azure',label:'Azure',color:'#0089d6'},
  {key:'cloudflare',label:'Cloudflare',color:'#f38020'},
  {key:'digitalocean',label:'DigitalOcean',color:'#0080ff'},
  {key:'linode',label:'Linode',color:'#00a95c'},
  {key:'vercel',label:'Vercel',color:'#000000'},
  {key:'netlify',label:'Netlify',color:'#00c7b7'},
  {key:'railway',label:'Railway',color:'#0b0d0e'},
  {key:'fly',label:'Fly.io',color:'#7e3aed'},
];

const CLOUD_SERVICES = [
  {key:'compute',label:'Compute',desc:'VM/container setup: sizing, AMI, autoscale'},
  {key:'storage',label:'Object Storage',desc:'Object storage: buckets, lifecycle, CDN, signed URLs'},
  {key:'db',label:'Managed DB',desc:'Managed database: provisioning, HA, backup, PITR'},
  {key:'serverless',label:'Serverless Functions',desc:'Serverless: deploy, triggers, cold start, observability'},
  {key:'queue',label:'Message Queue',desc:'Managed queue: topic/queue setup, DLQ, visibility'},
  {key:'cdn',label:'CDN Config',desc:'CDN: origins, cache rules, invalidation, WAF'},
  {key:'secrets',label:'Secret Manager',desc:'Secrets: rotation, access control, injection'},
  {key:'monitoring',label:'Monitoring Stack',desc:'Metrics + logs + alerts + dashboards'},
];

const CLOUD_ACTIONS = [
  {key:'setup',label:'Setup',time:'~1h',diff:'intermediate'},
  {key:'optimize',label:'Cost Optimization',time:'~1h',diff:'intermediate'},
  {key:'secure',label:'Security Hardening',time:'~1h',diff:'intermediate'},
];

for (const cloud of CLOUDS) {
  for (const svc of CLOUD_SERVICES) {
    for (const act of CLOUD_ACTIONS) {
      add.push(mkPrompt(
        `rl-${cloud.key}-${svc.key}-${act.key}`,
        `${cloud.label} ${svc.label}: ${act.label}`,
        '☁',
        cloud.color,
        act.time,
        `${svc.desc}. Cloud: ${cloud.label}. Действие: ${act.label}. IaC (Terraform).`,
        `${cloud.key},${svc.key},${act.key}`,
        act.diff,
      ));
    }
  }
}

// ═════════════════════════════════════════════════════
// MATRIX 5: DESIGN PATTERNS × LANGUAGE (25 × 8 = 200)
// ═════════════════════════════════════════════════════
const PATTERNS = [
  {key:'singleton',label:'Singleton'},{key:'factory',label:'Factory'},{key:'builder',label:'Builder'},
  {key:'prototype',label:'Prototype'},{key:'observer',label:'Observer'},{key:'strategy',label:'Strategy'},
  {key:'decorator',label:'Decorator'},{key:'adapter',label:'Adapter'},{key:'facade',label:'Facade'},
  {key:'proxy',label:'Proxy'},{key:'command',label:'Command'},{key:'state',label:'State'},
  {key:'chain',label:'Chain of Responsibility'},{key:'iterator',label:'Iterator'},{key:'composite',label:'Composite'},
  {key:'visitor',label:'Visitor'},{key:'mediator',label:'Mediator'},{key:'template',label:'Template Method'},
  {key:'flyweight',label:'Flyweight'},{key:'memento',label:'Memento'},{key:'bridge',label:'Bridge'},
  {key:'interpreter',label:'Interpreter'},{key:'repository',label:'Repository'},{key:'uow',label:'Unit of Work'},
  {key:'cqrs',label:'CQRS'},
];

const PATTERN_LANGS = LANGS.slice(0,8);
for (const pat of PATTERNS) {
  for (const lang of PATTERN_LANGS) {
    add.push(mkPrompt(
      `rl-pattern-${pat.key}-${lang.key}`,
      `${pat.label} (${lang.label})`,
      '◆',
      lang.color,
      '~45m',
      `Реализуй паттерн ${pat.label} в ${lang.label}. Идиоматичный подход, тесты, когда применим.`,
      `pattern,${pat.key},${lang.key}`,
      'intermediate',
    ));
  }
}

// ═════════════════════════════════════════════════════
// MATRIX 6: ALGORITHMS × LANGUAGE (30 × 6 = 180)
// ═════════════════════════════════════════════════════
const ALGOS = [
  {key:'binary-search',label:'Binary Search'},{key:'quicksort',label:'Quicksort'},
  {key:'mergesort',label:'Merge Sort'},{key:'heapsort',label:'Heap Sort'},
  {key:'dfs',label:'DFS Graph'},{key:'bfs',label:'BFS Graph'},
  {key:'dijkstra',label:'Dijkstra Shortest Path'},{key:'astar',label:'A* Pathfinding'},
  {key:'bellman-ford',label:'Bellman-Ford'},{key:'floyd-warshall',label:'Floyd-Warshall'},
  {key:'kruskal',label:'Kruskal MST'},{key:'prim',label:'Prim MST'},
  {key:'tarjan',label:'Tarjan SCC'},{key:'topological',label:'Topological Sort'},
  {key:'dp-knapsack',label:'0/1 Knapsack DP'},{key:'dp-lcs',label:'Longest Common Subseq DP'},
  {key:'dp-edit',label:'Edit Distance DP'},{key:'kmp',label:'KMP String Match'},
  {key:'rabin-karp',label:'Rabin-Karp'},{key:'trie',label:'Trie'},
  {key:'bloom',label:'Bloom Filter'},{key:'lru',label:'LRU Cache'},
  {key:'lfu',label:'LFU Cache'},{key:'union-find',label:'Union-Find'},
  {key:'segment-tree',label:'Segment Tree'},{key:'fenwick',label:'Fenwick Tree'},
  {key:'merkle',label:'Merkle Tree'},{key:'consistent-hash',label:'Consistent Hashing'},
  {key:'hyperloglog',label:'HyperLogLog'},{key:'raft-algo',label:'Raft Consensus'},
];

const ALGO_LANGS = LANGS.slice(0,6);
for (const alg of ALGOS) {
  for (const lang of ALGO_LANGS) {
    add.push(mkPrompt(
      `rl-algo-${alg.key}-${lang.key}`,
      `${alg.label} (${lang.label})`,
      '◎',
      lang.color,
      '~45m',
      `Реализуй алгоритм ${alg.label} на ${lang.label}. Время O(?), память O(?), тесты edge cases.`,
      `algorithm,${alg.key},${lang.key}`,
      'intermediate',
    ));
  }
}

// ═════════════════════════════════════════════════════
// MATRIX 7: UI COMPONENTS × FRAMEWORK (40 × 5 = 200)
// ═════════════════════════════════════════════════════
const UI_COMPONENTS = [
  'Button','Input','Textarea','Select','Checkbox','Radio','Switch','Slider',
  'Modal','Drawer','Dialog','Tooltip','Popover','Dropdown','ContextMenu','Tabs',
  'Accordion','Card','Badge','Avatar','Alert','Toast','Progress','Spinner',
  'Skeleton','Pagination','Breadcrumb','Stepper','DatePicker','TimePicker','Calendar','ColorPicker',
  'FileUpload','TreeView','DataTable','Combobox','Autocomplete','CommandMenu','Carousel','Accordion',
];

const UI_FRAMEWORKS = [
  {key:'react',label:'React',color:'#61dafb'},
  {key:'vue',label:'Vue 3',color:'#42b883'},
  {key:'svelte',label:'Svelte 5',color:'#ff3e00'},
  {key:'solid',label:'SolidJS',color:'#2c4f7c'},
  {key:'angular',label:'Angular',color:'#dd0031'},
];

for (const comp of UI_COMPONENTS) {
  for (const fw of UI_FRAMEWORKS) {
    add.push(mkPrompt(
      `fd-ui-${slug(comp)}-${fw.key}`,
      `${comp} (${fw.label})`,
      '◧',
      fw.color,
      '~45m',
      `Создай компонент ${comp} на ${fw.label}: accessible (ARIA), keyboard nav, типы/props, примеры, тесты.`,
      `ui,${slug(comp)},${fw.key}`,
      'intermediate',
    ));
  }
}

// ═════════════════════════════════════════════════════
// MATRIX 8: TESTING TYPE × CONTEXT × TECH (10 × 3 × 5 = 150)
// ═════════════════════════════════════════════════════
const TEST_TYPES = [
  {key:'unit',label:'Unit'},{key:'integration',label:'Integration'},{key:'e2e',label:'E2E'},
  {key:'property',label:'Property-based'},{key:'mutation',label:'Mutation'},{key:'contract',label:'Contract'},
  {key:'visual',label:'Visual Regression'},{key:'perf',label:'Performance'},{key:'load',label:'Load'},
  {key:'security',label:'Security Scan'},
];
const TEST_CTX = [{key:'api',label:'API'},{key:'ui',label:'UI'},{key:'db',label:'Database'}];
const TEST_TECH = [
  {key:'js',label:'JS/TS',color:'#f7df1e'},{key:'py',label:'Python',color:'#3776ab'},
  {key:'go',label:'Go',color:'#00acd7'},{key:'java',label:'Java',color:'#ed8b00'},
  {key:'rb',label:'Ruby',color:'#cc342d'},
];

for (const tt of TEST_TYPES) {
  for (const ctx of TEST_CTX) {
    for (const tech of TEST_TECH) {
      add.push(mkPrompt(
        `rl-test-${tt.key}-${ctx.key}-${tech.key}`,
        `${tt.label} ${ctx.label} Tests (${tech.label})`,
        '✓',
        tech.color,
        '~1h',
        `${tt.label} тесты для ${ctx.label} слоя. Стек: ${tech.label}. Coverage, фикстуры, CI.`,
        `testing,${tt.key},${ctx.key},${tech.key}`,
        'intermediate',
      ));
    }
  }
}

// ═════════════════════════════════════════════════════
// MATRIX 9: SECURITY TOPIC × CONTEXT (18 × 6 = 108)
// ═════════════════════════════════════════════════════
const SEC_TOPICS = [
  {key:'xss',label:'XSS Protection'},{key:'csrf',label:'CSRF Defense'},{key:'sqli',label:'SQL Injection'},
  {key:'ssrf',label:'SSRF Prevention'},{key:'rce',label:'RCE Hardening'},{key:'idor',label:'IDOR Fix'},
  {key:'auth-bypass',label:'Auth Bypass Audit'},{key:'jwt-sec',label:'JWT Security'},{key:'session',label:'Session Security'},
  {key:'csp',label:'CSP Strict'},{key:'cors-audit',label:'CORS Audit'},{key:'headers',label:'Security Headers'},
  {key:'dos',label:'DoS Mitigation'},{key:'rate-limit-sec',label:'Rate Limit Hardening'},{key:'input-val',label:'Input Validation'},
  {key:'output-enc',label:'Output Encoding'},{key:'crypto',label:'Crypto Choices'},{key:'audit-log-sec',label:'Audit Logging'},
];
const SEC_CTX = [
  {key:'webapp',label:'Web App'},{key:'rest-api',label:'REST API'},{key:'graphql-api',label:'GraphQL API'},
  {key:'mobile',label:'Mobile App'},{key:'infra',label:'Infrastructure'},{key:'pipeline',label:'CI/CD Pipeline'},
];

for (const topic of SEC_TOPICS) {
  for (const ctx of SEC_CTX) {
    add.push(mkPrompt(
      `rl-sec-${topic.key}-${ctx.key}`,
      `${topic.label} (${ctx.label})`,
      '⚠',
      '#dc2626',
      '~45m',
      `${topic.label} для ${ctx.label}. OWASP рекомендации, checklist, audit, fix.`,
      `security,${topic.key},${ctx.key}`,
      'intermediate',
    ));
  }
}

// ═════════════════════════════════════════════════════
// MATRIX 10: MOBILE PLATFORM × FEATURE (6 × 25 = 150)
// ═════════════════════════════════════════════════════
const MOBILE = [
  {key:'rn',label:'React Native',color:'#61dafb'},{key:'expo',label:'Expo',color:'#000020'},
  {key:'flutter',label:'Flutter',color:'#02569b'},{key:'ios',label:'iOS Native',color:'#f05138'},
  {key:'android',label:'Android Native',color:'#3ddc84'},{key:'kmp',label:'KMP',color:'#7f52ff'},
];

const MOBILE_FEATURES = [
  'Login + Registration','OAuth Social Login','Biometric Auth','Push Notifications',
  'Deep Linking','In-App Browser','Camera Photo/Video','Location + Maps',
  'Background Tasks','Local Database','Offline Sync','File Upload',
  'Pull-to-Refresh','Infinite Scroll','Image Caching','Analytics Events',
  'Crash Reporting','In-App Purchases','Subscription Flow','Share Sheet',
  'QR Scanner','Bluetooth LE','NFC','AR Integration',
  'Dark Mode Toggle',
];

for (const platf of MOBILE) {
  for (const feat of MOBILE_FEATURES) {
    add.push(mkPrompt(
      `fd-mobile-${platf.key}-${slug(feat)}`,
      `${feat} (${platf.label})`,
      '📱',
      platf.color,
      '~1h',
      `Реализуй "${feat}" на ${platf.label}. Разрешения, UX, тесты, edge cases.`,
      `mobile,${platf.key},${slug(feat)}`,
      'intermediate',
    ));
  }
}

// ═════════════════════════════════════════════════════
// MATRIX 11: AI/ML MODEL × OPERATION (15 × 10 = 150)
// ═════════════════════════════════════════════════════
const AI_MODELS = [
  {key:'gpt-4o',label:'GPT-4o'},{key:'claude-sonnet',label:'Claude Sonnet'},{key:'claude-opus',label:'Claude Opus'},
  {key:'gemini-pro',label:'Gemini Pro'},{key:'llama-3',label:'Llama 3'},{key:'mistral',label:'Mistral'},
  {key:'qwen',label:'Qwen'},{key:'phi-3',label:'Phi-3'},{key:'deepseek',label:'DeepSeek'},
  {key:'stable-diff',label:'Stable Diffusion'},{key:'flux',label:'FLUX'},{key:'whisper',label:'Whisper STT'},
  {key:'elevenlabs',label:'ElevenLabs TTS'},{key:'clip',label:'CLIP Embeddings'},{key:'bge',label:'BGE Embeddings'},
];

const AI_OPS = [
  {key:'integrate',label:'Integration'},{key:'stream',label:'Streaming'},{key:'cache',label:'Prompt Caching'},
  {key:'batch',label:'Batch Processing'},{key:'eval',label:'Evaluation Harness'},{key:'cost',label:'Cost Optimization'},
  {key:'fallback',label:'Fallback Chain'},{key:'safety',label:'Safety Filtering'},
  {key:'finetune',label:'Fine-tune Pipeline'},{key:'deploy',label:'Self-host Deploy'},
];

for (const model of AI_MODELS) {
  for (const op of AI_OPS) {
    add.push(mkPrompt(
      `rl-ai-${model.key}-${op.key}`,
      `${model.label}: ${op.label}`,
      '◈',
      '#8b5cf6',
      '~1h',
      `${op.label} для ${model.label}. Лучшие практики, типичные pitfall'ы, мониторинг.`,
      `ai,${model.key},${op.key}`,
      'intermediate',
    ));
  }
}

// ═════════════════════════════════════════════════════
// MATRIX 12: DEVOPS TOOL × OPERATION (15 × 10 = 150)
// ═════════════════════════════════════════════════════
const DEVOPS_TOOLS = [
  {key:'terraform',label:'Terraform',color:'#7b42bc'},{key:'pulumi',label:'Pulumi',color:'#8a3391'},
  {key:'ansible',label:'Ansible',color:'#ee0000'},{key:'packer',label:'Packer',color:'#02a8ef'},
  {key:'helm',label:'Helm',color:'#0f1689'},{key:'kustomize',label:'Kustomize',color:'#326ce5'},
  {key:'argocd',label:'ArgoCD',color:'#ef7b4d'},{key:'flux',label:'Flux',color:'#316ce6'},
  {key:'vault',label:'Vault',color:'#000000'},{key:'consul',label:'Consul',color:'#e03875'},
  {key:'nomad',label:'Nomad',color:'#60dea9'},{key:'docker',label:'Docker',color:'#2496ed'},
  {key:'k8s',label:'Kubernetes',color:'#326ce5'},{key:'nix',label:'Nix',color:'#5277c3'},
  {key:'chef',label:'Chef',color:'#f09820'},
];

const DEVOPS_OPS = [
  {key:'install',label:'Install'},{key:'config',label:'Configuration'},{key:'secrets-mgmt',label:'Secrets Management'},
  {key:'state-mgmt',label:'State Management'},{key:'multi-env',label:'Multi-Environment'},{key:'drift',label:'Drift Detection'},
  {key:'upgrade',label:'Version Upgrade'},{key:'cost-track',label:'Cost Tracking'},
  {key:'audit',label:'Audit + Compliance'},{key:'teach',label:'Training/Onboarding Doc'},
];

for (const tool of DEVOPS_TOOLS) {
  for (const op of DEVOPS_OPS) {
    add.push(mkPrompt(
      `rl-devops-${tool.key}-${op.key}`,
      `${tool.label}: ${op.label}`,
      '⎈',
      tool.color,
      '~1h',
      `${op.label} для ${tool.label}. Production patterns, security, рабочий пример.`,
      `devops,${tool.key},${op.key}`,
      'intermediate',
    ));
  }
}

// Write out
add.forEach(p => { p.compact = (p.text||"").slice(0,400); });
const existingIds = new Set(data.P.map(p=>p.id));
const toAdd = add.filter(p => !existingIds.has(p.id));
const dupes = add.filter(p=>existingIds.has(p.id)).map(p=>p.id);
if (dupes.length) console.error('Skipped', dupes.length, 'duplicates');
data.P = [...data.P, ...toAdd];

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('✓ Added', toAdd.length, 'prompts from matrices. Total:', data.P.length);
