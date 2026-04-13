const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 ПОЛНАЯ РАЗВЕДКА ПРОЕКТА:\nПрочитай ВЕСЬ проект рекурсивно. Изучи структуру, конфиги, зависимости, точки входа, БД, API, тесты, CI, git log.\n\n";
const A = "\n\nАНТИ-ЛУП: 3 одинаковых ошибки = кардинальная смена подхода.";

const add = [
  // ── Databases ──
  {id:"rl-redis",m:"/ralph-loop",mk:"claude",role:"Redis Integration",type:"command",icon:"\u{1F534}",ac:"#dc382d",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Redis.\n\nSETUP: ioredis (Node) / redis-py (Python). Connection pool.\nUSE CASES: session store, cache (TTL), rate limiting (INCR+EXPIRE), pub/sub, queues (BullMQ).\nPATTERNS: cache-aside (check cache -> miss -> DB -> set cache), write-through.\nKEY NAMING: app:entity:id (e.g. user:session:abc123).\nEVICTION: maxmemory-policy allkeys-lru.\nMONITOR: INFO, SLOWLOG, key count.\nDOCKER: redis:7-alpine в compose.' + A + '" --completion-promise "DONE"',
   tags:["redis","cache","session","pub-sub","queue"],difficulty:"intermediate",output:"Redis integration",related:["rl-cache","rl-cron"],prereqs:[],v:"10.2"},

  {id:"rl-mongo",m:"/ralph-loop",mk:"claude",role:"MongoDB Setup",type:"command",icon:"\u{1F343}",ac:"#47a248",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: MongoDB.\n\nDRIVER: mongoose (Node) / motor (Python).\nSCHEMA: models с validation, indexes, virtuals.\nQUERIES: find, aggregate pipeline, populate/lookup.\nINDEXES: compound, text, TTL, unique.\nPATTERNS: embed vs reference, schema design по access patterns.\nMIGRATIONS: migrate-mongo для schema changes.\nSECURITY: auth, network access, field-level encryption.\nDOCKER: mongo:7 в compose с volume.' + A + '" --completion-promise "DONE"',
   tags:["mongodb","mongoose","nosql","aggregation"],difficulty:"intermediate",output:"MongoDB setup",related:["rl-db","rl-api"],prereqs:[],v:"10.2"},

  {id:"rl-postgres",m:"/ralph-loop",mk:"claude",role:"PostgreSQL Advanced",type:"command",icon:"\u{1F418}",ac:"#336791",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: PostgreSQL advanced.\n\nFEATURES: JSONB columns, full-text search (tsvector), CTEs, window functions, materialized views.\nPERF: EXPLAIN ANALYZE, pg_stat_statements, index types (btree, gin, gist).\nSECURITY: roles, row-level security (RLS), pg_crypto.\nREPLICATION: streaming replication, read replicas.\nBACKUP: pg_dump, WAL archiving, point-in-time recovery.\nEXTENSIONS: uuid-ossp, pgcrypto, PostGIS, pg_trgm.\nTUNING: shared_buffers, work_mem, effective_cache_size.' + A + '" --completion-promise "DONE"',
   tags:["postgresql","advanced","jsonb","full-text","performance"],difficulty:"advanced",output:"PostgreSQL advanced",related:["rl-db","rl-db-optimize"],prereqs:[],v:"10.2"},

  // ── Mobile ──
  {id:"rl-rn",m:"/ralph-loop",mk:"claude",role:"React Native App",type:"command",icon:"\u{1F4F1}",ac:"#61dafb",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: React Native приложение.\n\nSETUP: Expo (recommended) или bare React Native.\nNAVIGATION: @react-navigation (stack, tabs, drawer).\nSTATE: Zustand + React Query (TanStack).\nSTYLE: StyleSheet.create, или NativeWind (Tailwind for RN).\nSTORAGE: AsyncStorage, SecureStore (tokens).\nAPI: fetch + React Query hooks.\nFORMS: react-hook-form.\nTESTS: Jest + React Native Testing Library.\nBUILD: EAS Build (Expo) для iOS/Android.' + A + '" --completion-promise "DONE"',
   tags:["react-native","expo","mobile","ios","android"],difficulty:"intermediate",output:"React Native app",related:["rl-ui","rl-auth"],prereqs:[],v:"10.2"},

  // ── AI/ML ──
  {id:"rl-rag",m:"/ralph-loop",mk:"claude",role:"RAG Pipeline",type:"command",icon:"\u{1F9E0}",ac:"#9333ea",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: RAG (Retrieval Augmented Generation) pipeline.\n\nINGEST: load documents (PDF, MD, HTML), chunk (500-1000 tokens overlap 100).\nEMBED: embed chunks (OpenAI/Cohere/local model).\nSTORE: vector DB (Pinecone, Qdrant, pgvector, ChromaDB).\nRETRIEVE: similarity search (top-k=5), reranking.\nGENERATE: LLM с retrieved context в system prompt.\nEVAL: relevance scoring, hallucination check.\nAPI: POST /api/ask { question } -> { answer, sources }.\nUI: chat + source references.' + A + '" --completion-promise "DONE"',
   tags:["rag","embeddings","vector-db","llm","ai"],difficulty:"advanced",output:"RAG pipeline",related:["rl-ai","rl-api"],prereqs:[],v:"10.2"},

  // ── Business ──
  {id:"rl-multitenant",m:"/ralph-loop",mk:"claude",role:"Multi-Tenancy",type:"command",icon:"\u{1F3E2}",ac:"#6366f1",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Multi-tenancy.\n\nSTRATEGY: shared DB + tenant_id column (или schema per tenant).\nMIDDLEWARE: extract tenant from subdomain/header/JWT.\nDB: автоматический WHERE tenant_id = X на каждый запрос (RLS или middleware).\nISOLATION: данные tenant A недоступны для tenant B.\nADMIN: super-admin видит всех tenants.\nBILLING: per-tenant usage tracking, plan limits.\nMIGRATION: schema changes применяются ко всем tenants.\nTESTS: тесты с разными tenant contexts.' + A + '" --completion-promise "DONE"',
   tags:["multi-tenant","saas","isolation","billing"],difficulty:"advanced",output:"Multi-tenant система",related:["rl-auth","rl-rbac","rl-db"],prereqs:[],v:"10.2"},

  {id:"rl-billing",m:"/ralph-loop",mk:"claude",role:"Billing & Subscriptions",type:"command",icon:"\u{1F4B0}",ac:"#eab308",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Billing система.\n\nPLANS: Free, Pro, Enterprise с feature limits.\nDB: plans, subscriptions, invoices, usage.\nSTRIPE: products, prices, checkout sessions, customer portal.\nWEBHOOKS: subscription created/updated/cancelled, invoice paid/failed.\nLIMITS: enforce plan limits (API calls, storage, seats).\nUPGRADE/DOWNGRADE: proration, immediate/end-of-period.\nUI: pricing page, billing settings, usage dashboard, invoices.\nGRACE PERIOD: 3 days after failed payment.' + A + '" --completion-promise "DONE"',
   tags:["billing","subscriptions","stripe","pricing","saas"],difficulty:"advanced",output:"Billing система",related:["rl-payment","rl-multitenant"],prereqs:[],v:"10.2"},

  // ── DevOps extras ──
  {id:"rl-nginx",m:"/ralph-loop",mk:"claude",role:"Nginx Configuration",type:"command",icon:"\u{1F310}",ac:"#009639",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Nginx конфигурация.\n\nREVERSE PROXY: upstream + proxy_pass к app серверу.\nSSL: LetsEncrypt (certbot), auto-renew cron.\nHEADERS: HSTS, CSP, X-Frame-Options, X-Content-Type.\nCACHE: static files 1y immutable, proxy_cache для API.\nGZIP: gzip on, types, min_length.\nRATE LIMIT: limit_req_zone, burst, nodelay.\nLOAD BALANCE: upstream с multiple backends.\nLOGS: access_log, error_log, log format.' + A + '" --completion-promise "DONE"',
   tags:["nginx","reverse-proxy","ssl","caching","load-balancer"],difficulty:"intermediate",output:"Nginx config",related:["rl-deploy","rl-docker"],prereqs:[],v:"10.2"},

  {id:"rl-ssl",m:"/ralph-loop",mk:"claude",role:"SSL / HTTPS Setup",type:"command",icon:"\u{1F512}",ac:"#16a34a",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: SSL/HTTPS.\n\nLETSENCRYPT: certbot --nginx -d example.com.\nAUTO-RENEW: cron 0 0 * * * certbot renew.\nFORCE HTTPS: redirect 80 -> 443.\nHSTS: Strict-Transport-Security header.\nMINIMUM TLS: 1.2+ (no SSLv3, TLS 1.0, 1.1).\nCIPHERS: modern cipher suite.\nTEST: SSL Labs A+ rating.\nCLOUDFLARE: Full (Strict) mode если используется.' + A + '" --completion-promise "DONE"',
   tags:["ssl","https","tls","letsencrypt","security"],difficulty:"beginner",output:"HTTPS setup",related:["rl-nginx","rl-deploy"],prereqs:[],v:"10.2"},

  // ── More useful patterns ──
  {id:"rl-queue-pattern",m:"/ralph-loop",mk:"claude",role:"Message Queue",type:"command",icon:"\u{1F4E8}",ac:"#f97316",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Message queue pattern.\n\nCHOOSE: BullMQ+Redis (Node), Celery+Redis (Python), RabbitMQ, Kafka.\nPRODUCER: enqueue jobs с payload и options (delay, retry, priority).\nCONSUMER: process jobs, error handling, retry strategy.\nPATTERNS: work queue, pub/sub, delayed jobs, scheduled jobs.\nMONITOR: Bull Board / Flower dashboard.\nDEAD LETTER: failed jobs queue, manual retry.\nSCALE: multiple workers, concurrency limits.\nIDEMPOTENT: jobs safe to re-run.' + A + '" --completion-promise "DONE"',
   tags:["queue","message-queue","bullmq","rabbitmq","async"],difficulty:"intermediate",output:"Message queue",related:["rl-cron","rl-redis"],prereqs:[],v:"10.2"},

  {id:"rl-event-driven",m:"/ralph-loop",mk:"claude",role:"Event-Driven Architecture",type:"command",icon:"\u{1F4E2}",ac:"#8b5cf6",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Event-driven architecture.\n\nEVENT BUS: EventEmitter (simple), Redis pub/sub, Kafka (scale).\nEVENTS: domain events (UserCreated, OrderPlaced, PaymentFailed).\nHANDLERS: loose coupling, каждый handler делает одно.\nSAGA: distributed transactions через events.\nOUTBOX: transactional outbox pattern (DB + events atomically).\nIDEMPOTENT: event ID, deduplication.\nSCHEMA: typed events с versioning.\nMONITOR: event flow visualization, dead letter queue.' + A + '" --completion-promise "DONE"',
   tags:["event-driven","events","saga","pub-sub","architecture"],difficulty:"advanced",output:"Event-driven system",related:["rl-microservice","rl-queue-pattern"],prereqs:[],v:"10.2"},

  {id:"rl-graphql-sub",m:"/ralph-loop",mk:"claude",role:"GraphQL Subscriptions",type:"command",icon:"\u{1F4E1}",ac:"#e535ab",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: GraphQL Subscriptions (real-time).\n\nSERVER: graphql-ws, WebSocket transport.\nSCHEMA: type Subscription { messageAdded: Message, orderUpdated(id: ID!): Order }.\nRESOLVER: subscribe с asyncIterator, filter по args.\nCLIENT: useSubscription hook, auto-reconnect.\nAUTH: authenticate on WebSocket connection.\nSCALE: Redis pub/sub для multi-server.\nTEST: subscription тесты с mock iterator.' + A + '" --completion-promise "DONE"',
   tags:["graphql","subscriptions","real-time","websocket"],difficulty:"advanced",output:"GraphQL Subscriptions",related:["rl-graphql","rl-ws"],prereqs:[],v:"10.2"},

  {id:"rl-cqrs",m:"/ralph-loop",mk:"claude",role:"CQRS Pattern",type:"command",icon:"\u{2194}",ac:"#0891b2",time:"~2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: CQRS (Command Query Responsibility Segregation).\n\nCOMMANDS: write operations (CreateUser, UpdateOrder). Validate -> execute -> emit event.\nQUERIES: read operations (GetUser, ListOrders). Optimized read models.\nSEPARATION: different models для read/write.\nEVENT SOURCING: store events, rebuild state from events.\nPROJECTIONS: build read models from event stream.\nCONSISTENCY: eventual consistency between write/read.\nTESTS: command handlers + query handlers separately.' + A + '" --completion-promise "DONE"',
   tags:["cqrs","event-sourcing","architecture","ddd"],difficulty:"advanced",output:"CQRS implementation",related:["rl-event-driven","rl-microservice"],prereqs:[],v:"10.2"},

  // ── More UI ──
  {id:"rl-rich-editor",m:"/ralph-loop",mk:"claude",role:"Rich Text Editor",type:"command",icon:"\u{270F}",ac:"#1e40af",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Rich text editor.\n\nLIBRARY: TipTap (recommended), Lexical, Slate, ProseMirror.\nFEATURES: bold/italic/underline, headings, lists, links, images, code blocks, tables.\nTOOLBAR: floating или fixed, responsive.\nOUTPUT: HTML или JSON (для DB storage).\nMENTIONS: @user autocomplete.\nCOLLABORATION: Yjs для real-time collaborative editing.\nSANITIZE: DOMPurify on output.\nA11Y: keyboard shortcuts, screen reader support.' + A + '" --completion-promise "DONE"',
   tags:["editor","rich-text","tiptap","wysiwyg"],difficulty:"intermediate",output:"Rich text editor",related:["rl-ui","rl-forms"],prereqs:[],v:"10.2"},

  {id:"rl-dataviz",m:"/ralph-loop",mk:"claude",role:"Data Visualization",type:"command",icon:"\u{1F4CA}",ac:"#6366f1",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Data visualization.\n\nLIBRARY: Recharts (React), Chart.js, D3.js, Nivo.\nCHARTS: line, bar, pie, area, scatter, heatmap.\nDASHBOARD: responsive grid layout, auto-refresh.\nINTERACTIVE: tooltips, zoom, brush (range select), click-through.\nRESPONSIVE: ResponsiveContainer, resize observer.\nTHEME: dark/light mode support.\nEXPORT: PNG/SVG download.\nREAL-TIME: streaming data updates.' + A + '" --completion-promise "DONE"',
   tags:["charts","visualization","recharts","d3","dashboard"],difficulty:"intermediate",output:"Data viz",related:["rl-dashboard","rl-ui"],prereqs:[],v:"10.2"},

  {id:"rl-table-adv",m:"/ralph-loop",mk:"claude",role:"Advanced Table Features",type:"command",icon:"\u{1F4CB}",ac:"#0ea5e9",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Advanced table features.\n\nCOLUMN RESIZE: drag column borders.\nCOLUMN REORDER: drag column headers.\nCOLUMN VISIBILITY: toggle columns menu.\nPINNED COLUMNS: sticky left/right.\nROW EXPANSION: expandable rows с detail view.\nGROUPING: group by column value.\nAGGREGATION: sum/avg/count per column.\nVIRTUALIZATION: @tanstack/react-virtual для 10K+ rows.\nEXPORT: CSV/XLSX с current filters.\nPERSIST: save column config в localStorage.' + A + '" --completion-promise "DONE"',
   tags:["table","advanced","virtualization","grouping","tanstack"],difficulty:"intermediate",output:"Advanced table",related:["rl-table","rl-ui"],prereqs:[],v:"10.2"},

  // ── Testing extras ──
  {id:"rl-contract-test",m:"/ralph-loop",mk:"claude",role:"Contract Testing",type:"command",icon:"\u{1F4DC}",ac:"#22c55e",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Contract testing (API contracts).\n\nTOOL: Pact / MSW / custom schema validation.\nCONSUMER: определи expected API response shape.\nPROVIDER: verify что API выполняет контракт.\nSCHEMA: OpenAPI spec как source of truth.\nVALIDATION: response matches schema (ajv / zod).\nCI: contract tests в pipeline, block breaking changes.\nVERSIONING: contract versioning, backwards compat check.\nMOCK: consumer tests используют mock provider.' + A + '" --completion-promise "DONE"',
   tags:["contract-testing","pact","api","schema","validation"],difficulty:"intermediate",output:"Contract tests",related:["rl-test","rl-api","rl-api-doc"],prereqs:[],v:"10.2"},

  {id:"rl-load-test",m:"/ralph-loop",mk:"claude",role:"Load Testing",type:"command",icon:"\u{1F4A5}",ac:"#ef4444",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Load testing.\n\nTOOL: k6 (recommended), Artillery, Apache Bench, wrk.\nSCENARIOS: smoke (1 user), load (normal), stress (peak), spike (sudden), soak (long).\nMETRICS: requests/sec, latency p50/p95/p99, error rate, throughput.\nTHRESHOLDS: p95 < 500ms, error rate < 1%.\nSCRIPT: k6 script с stages (ramp up -> hold -> ramp down).\nCI: load test в pipeline, fail on threshold breach.\nREPORT: HTML report с graphs.\nMONITOR: run alongside Grafana для live metrics.' + A + '" --completion-promise "DONE"',
   tags:["load-testing","k6","performance","stress-test","benchmarks"],difficulty:"intermediate",output:"Load test suite",related:["rl-perf","rl-perf-audit"],prereqs:[],v:"10.2"},

  // ── Security extras ──
  {id:"rl-cors",m:"/ralph-loop",mk:"claude",role:"CORS Configuration",type:"command",icon:"\u{1F310}",ac:"#dc2626",time:"~20m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: CORS.\n\nCONFIG: origin (whitelist, не *), methods, headers, credentials.\nDEV: localhost:3000 allowed.\nPROD: только production domain.\nPREFLIGHT: OPTIONS handler, Access-Control-Max-Age cache.\nCREDENTIALS: Access-Control-Allow-Credentials: true + specific origin.\nHEADERS: expose custom headers (X-Total-Count, X-Request-Id).\nMIDDLEWARE: cors() в Express/Hono/FastAPI.' + A + '" --completion-promise "DONE"',
   tags:["cors","security","headers","api"],difficulty:"beginner",output:"CORS config",related:["rl-api","sc-audit"],prereqs:[],v:"10.2"},

  {id:"rl-csp",m:"/ralph-loop",mk:"claude",role:"Content Security Policy",type:"command",icon:"\u{1F6E1}",ac:"#7c3aed",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Content Security Policy.\n\nHEADER: Content-Security-Policy.\nDIRECTIVES: default-src, script-src, style-src, img-src, connect-src, font-src, frame-src.\nNONCE: script nonce для inline scripts.\nREPORT: report-uri или report-to для violation reports.\nSTRICT: no unsafe-inline, no unsafe-eval.\nGRADUAL: start with report-only, fix violations, enforce.\nTEST: CSP Evaluator tool, browser console warnings.' + A + '" --completion-promise "DONE"',
   tags:["csp","security","headers","xss-prevention"],difficulty:"intermediate",output:"CSP policy",related:["sc-audit","rl-nginx"],prereqs:[],v:"10.2"},

  // ── DX ──
  {id:"rl-devcontainer",m:"/ralph-loop",mk:"claude",role:"Dev Container",type:"command",icon:"\u{1F4E6}",ac:"#0db7ed",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Dev Container (VS Code / Codespaces).\n\n.devcontainer/devcontainer.json:\n- Base image (Node/Python/Go).\n- VS Code extensions.\n- Port forwarding.\n- Post-create command (npm install).\n- Environment variables.\n- Docker compose integration.\n\nFEATURES: git, node, docker-in-docker.\nDOCKERFILE: custom Dockerfile для специфичных deps.\nTEST: открой в container, всё работает из коробки.' + A + '" --completion-promise "DONE"',
   tags:["devcontainer","codespaces","vscode","dx","docker"],difficulty:"beginner",output:"Dev container config",related:["rl-docker","rl-sprint"],prereqs:[],v:"10.2"},

  {id:"rl-monorepo-turbo",m:"/ralph-loop",mk:"claude",role:"Turborepo Optimization",type:"command",icon:"\u{1F680}",ac:"#ef4444",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Turborepo оптимизация.\n\nTURBO.JSON: pipeline (build, test, lint, typecheck), dependsOn.\nCACHE: remote cache (Vercel), local cache (.turbo).\nFILTER: turbo run test --filter=./apps/web, --filter=...changed.\nPRUNE: turbo prune --scope=web для Docker builds.\nPARALLEL: максимальная параллелизация tasks.\nENV: globalEnv, env per task.\nWATCH: turbo watch для dev mode.\nCI: кэш в GitHub Actions artifacts.' + A + '" --completion-promise "DONE"',
   tags:["turborepo","monorepo","build","cache","optimization"],difficulty:"intermediate",output:"Optimized Turborepo",related:["rl-monorepo","rl-ci"],prereqs:[],v:"10.2"},
];

add.forEach(p => { p.compact = p.text.slice(0, 400); });
data.P = [...data.P, ...add];

// More combos
data.COMBOS.ru.push(
  { name:"Database Pro", agents:["rl-postgres","rl-redis","rl-db-optimize","rl-backup"], ids:["rl-postgres","rl-redis","rl-db-optimize","rl-backup"], desc:"PostgreSQL + Redis + оптимизация + бэкапы" },
  { name:"SaaS Complete", agents:["rl-multitenant","rl-billing","rl-auth","rl-rbac","rl-deploy"], ids:["rl-multitenant","rl-billing","rl-auth","rl-rbac","rl-deploy"], desc:"Multi-tenant + billing + auth + roles + deploy" },
  { name:"AI Application", agents:["rl-rag","rl-ai","rl-api","rl-supabase"], ids:["rl-rag","rl-ai","rl-api","rl-supabase"], desc:"RAG + LLM + API + Supabase" },
);
data.COMBOS.en.push(
  { name:"Database Pro", agents:["rl-postgres","rl-redis","rl-db-optimize","rl-backup"], ids:["rl-postgres","rl-redis","rl-db-optimize","rl-backup"], desc:"PostgreSQL + Redis + optimization + backups" },
  { name:"SaaS Complete", agents:["rl-multitenant","rl-billing","rl-auth","rl-rbac","rl-deploy"], ids:["rl-multitenant","rl-billing","rl-auth","rl-rbac","rl-deploy"], desc:"Multi-tenant + billing + auth + roles + deploy" },
  { name:"AI Application", agents:["rl-rag","rl-ai","rl-api","rl-supabase"], ids:["rl-rag","rl-ai","rl-api","rl-supabase"], desc:"RAG + LLM + API + Supabase" },
);

// More configs
data.CONFIGS.push(
  {
    id: 'vitest-config',
    name: 'vitest.config.ts',
    icon: '\u{1F9EA}',
    accent: '#729b1b',
    desc: 'Vitest config с coverage',
    text: 'import { defineConfig } from "vitest/config";\nimport react from "@vitejs/plugin-react";\nimport path from "path";\n\nexport default defineConfig({\n  plugins: [react()],\n  test: {\n    globals: true,\n    environment: "jsdom",\n    setupFiles: "./src/test/setup.ts",\n    coverage: {\n      provider: "v8",\n      reporter: ["text", "html", "lcov"],\n      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },\n      exclude: ["node_modules", "src/test"],\n    },\n    include: ["src/**/*.{test,spec}.{ts,tsx}"],\n  },\n  resolve: { alias: { "@": path.resolve(__dirname, "src") } },\n});'
  },
  {
    id: 'env-example',
    name: '.env.example',
    icon: '\u{1F511}',
    accent: '#f59e0b',
    desc: 'Environment variables template',
    text: '# App\nNODE_ENV=development\nPORT=3000\nAPP_URL=http://localhost:3000\n\n# Database\nDATABASE_URL=postgresql://user:pass@localhost:5432/app\n\n# Redis\nREDIS_URL=redis://localhost:6379\n\n# Auth\nJWT_SECRET=change-me-in-production\nJWT_EXPIRES_IN=15m\nREFRESH_TOKEN_EXPIRES_IN=7d\n\n# External APIs\n# STRIPE_SECRET_KEY=sk_test_...\n# RESEND_API_KEY=re_...\n# OPENAI_API_KEY=sk-...'
  },
);

const json = JSON.stringify(data);
const compressed = deflateSync(json).toString('base64');
const newSrc = src.replace(/const Z = "[^"]+"/, 'const Z = "' + compressed + '"');
fs.writeFileSync('src/App.jsx', newSrc);
console.log('Prompts:', data.P.length);
console.log('Combos:', data.COMBOS.ru.length);
console.log('Configs:', data.CONFIGS.length);
