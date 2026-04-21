const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0: Прочитай структуру, конфиги, зависимости, тесты. ";
const A = " АНТИ-ЛУП: 3 ошибки \u2014 смена подхода.";

function mk(id, role, icon, ac, time, d, tags, diff) {
  const cmd = id.startsWith("rl-") ? "/ralph-loop" : id.startsWith("fd-") ? "/feature-dev" : id.startsWith("rv-") ? "/review-pr" : id.startsWith("cr-") ? "/code-review" : id.startsWith("sm-") ? "/simplify" : id.startsWith("lp-") ? "/loop" : id.startsWith("cm-") ? "/commit" : "/feature-dev";
  const text = cmd === "/ralph-loop" ? '/ralph-loop "' + E + 'ЗАДАЧА: ' + d + A + '" --completion-promise "DONE"' : cmd === "/loop" ? '/loop 5m "' + d + '"' : d;
  return { id, m: cmd, mk: "claude", role, type: "command", icon, ac, time, text, tags: tags.split(","), difficulty: diff, output: "Result", related: [], prereqs: [], v: "11.2" };
}
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const add = [];

// REST CRUD × ENTITY (20 entities × 5 actions = 100)
const ENTITIES = [
  'User','Post','Comment','Product','Order','Invoice','Subscription','Customer','Team','Organization',
  'Project','Task','Event','Notification','Message','Channel','Document','Folder','Tag','Category'
];
const CRUD_ACTIONS = ['Create','List + Filter','Detail + Relations','Update + Partial','Delete + Cascade'];
for (const e of ENTITIES) for (const a of CRUD_ACTIONS) {
  add.push(mk(`rl-entity-${slug(e)}-${slug(a)}`, `${a}: ${e}`, '⎘', '#10b981', '~30m',
    `${a} API для сущности ${e}. Validation, auth, pagination.`, `crud,${slug(e)},${slug(a)}`, 'beginner'));
}

// PERMISSIONS / ROLES × CONTEXT (15 × 4 = 60)
const PERM_SCENARIOS = [
  'Read-only Viewer','Editor','Admin Full Access','Billing Access','Audit Reader',
  'API-only Bot','Guest + Time Limit','Service Account','SSO Linked','Cross-Org Access',
  'Project-scoped Role','Department-scoped','Region-scoped','Resource Owner','Delegated Admin'
];
const PERM_CONTEXTS = ['SaaS App','Enterprise ERP','Government Portal','Healthcare Platform'];
for (const s of PERM_SCENARIOS) for (const c of PERM_CONTEXTS) {
  add.push(mk(`rl-perm-${slug(s)}-${slug(c)}`, `${s} (${c})`, '⚿', '#dc2626', '~45m',
    `Реализуй "${s}" роль в ${c}. RBAC/ABAC модель, audit.`, `permissions,${slug(s)},${slug(c)}`, 'intermediate'));
}

// BUG CLASS × LANGUAGE (20 × 5 = 100)
const BUG_CLASSES = [
  'Null Pointer Exception','Off-by-One Error','Race Condition','Deadlock','Memory Leak',
  'Buffer Overflow','Integer Overflow','Division by Zero','Infinite Loop','Stack Overflow Recursion',
  'Dangling Reference','Use After Free','Double Free','Concurrent Modification','Lost Update Race',
  'Timezone Bug','Floating-Point Precision','Unicode Character Bug','Endianness Issue','Locale-dependent Bug'
];
const BUG_LANGS = [
  {k:'js',l:'JavaScript',c:'#f7df1e'},{k:'py',l:'Python',c:'#3776ab'},
  {k:'go',l:'Go',c:'#00acd7'},{k:'java',l:'Java',c:'#ed8b00'},{k:'cs',l:'C#',c:'#512bd4'}
];
for (const bug of BUG_CLASSES) for (const lang of BUG_LANGS) {
  add.push(mk(`rl-bug-${slug(bug)}-${lang.k}`, `Fix ${bug} (${lang.l})`, '🐛', lang.c, '~30m',
    `Найди и исправь "${bug}" в ${lang.l} коде. Тесты, root cause, prevention.`,
    `bugs,debugging,${slug(bug)},${lang.k}`, 'intermediate'));
}

// CODE SMELLS × LANGUAGE (15 × 5 = 75)
const SMELLS = [
  'Long Method > 100 lines','God Class > 500 lines','Feature Envy','Duplicate Code','Primitive Obsession',
  'Data Clumps','Shotgun Surgery','Divergent Change','Refused Bequest','Parallel Inheritance',
  'Lazy Class','Speculative Generality','Temporary Field','Inappropriate Intimacy','Switch Statements Instead of Poly'
];
for (const smell of SMELLS) for (const lang of BUG_LANGS) {
  add.push(mk(`sm-smell-${slug(smell)}-${lang.k}`, `Refactor ${smell} (${lang.l})`, '⎔', lang.c, '~45m',
    `Обнаружь "${smell}" в ${lang.l}. Refactor план, тесты до/после.`,
    `smell,refactor,${slug(smell)},${lang.k}`, 'intermediate'));
}

// API INTEGRATIONS × OP (20 popular APIs × 5 = 100)
const APIS = [
  'Stripe','Slack','Discord','Notion','Airtable','Linear','Jira','GitHub','GitLab','Bitbucket',
  'Google Calendar','Zoom','Microsoft Graph','Salesforce','HubSpot','Intercom','Zendesk','Twilio','SendGrid','Shopify'
];
const API_OPS = ['Auth OAuth','Webhook Handler','Pagination Fetch All','Error Retry','Rate Limit Respect'];
for (const api of APIS) for (const op of API_OPS) {
  add.push(mk(`rl-api-${slug(api)}-${slug(op)}`, `${api}: ${op}`, '⇨', '#0ea5e9', '~45m',
    `${op} для ${api} API. Типы, retries, ошибки.`, `api-integration,${slug(api)},${slug(op)}`, 'intermediate'));
}

// TECH DEBT TASKS (40)
const DEBT = [
  'Upgrade Node 16 → 22','Upgrade Python 3.8 → 3.12','Drop Internet Explorer Support','Remove jQuery Migration','Drop AngularJS (1.x)',
  'Replace Moment.js with date-fns','Replace Axios with fetch','Replace Lodash full with individual','Remove Bootstrap for Tailwind','Drop IE11 CSS prefixes',
  'Typescript Strict Mode Enable','Enable noImplicitAny','Enable strictNullChecks','Remove any Types','Migrate JS → TS gradually',
  'ESLint 8 → 9 Flat Config','Prettier 2 → 3 Upgrade','Jest → Vitest Migration','Webpack 4 → 5 → Vite','CRA → Vite',
  'CommonJS → ESM Migration','Node require → import','HTTP/1.1 → HTTP/2','HTTP → HTTPS Enforce','TLS 1.0/1.1 Deprecate',
  'MD5 → SHA-256','bcrypt → argon2id','Custom Auth → Clerk/Auth0','Custom Queue → BullMQ','Custom Cache → Redis',
  'Custom Logger → structured','Custom Metrics → Prometheus','Custom Tracing → OTel','Polling → Webhooks','Scheduled Tasks → Events',
  'Monolith Slice to Microservice','Single DB → Shard','Session Cookies → JWT','JSON Storage → Proper Schema','XML Config → YAML'
];
for (const d of DEBT) {
  add.push(mk(`rl-debt-${slug(d)}`, `Debt: ${d}`, '⎔', '#ef4444', '~2-4h',
    `Technical debt: ${d}. План, шаги, rollback, тесты.`, `tech-debt,${slug(d)}`, 'advanced'));
}

// DOMAIN FEATURES × PLATFORM (15 features × 4 platforms = 60)
const DOMAIN_FEAT = [
  'Referral Program','Loyalty Points','Gift Cards','Discount Coupons','Abandoned Cart Recovery',
  'Product Reviews + Ratings','Wishlist Sharing','Price Drop Alerts','Back-in-Stock Notify','Recently Viewed',
  'Search + Autocomplete','Faceted Filter','Related Products','Recommendation Engine','User-generated Content'
];
const DOMAIN_PLAT = ['Next.js','Shopify','SaaS Platform','Marketplace'];
for (const f of DOMAIN_FEAT) for (const p of DOMAIN_PLAT) {
  add.push(mk(`fd-domain-${slug(f)}-${slug(p)}`, `${f} в ${p}`, '🛍', '#10b981', '~1-2h',
    `${f} в ${p}. UX, backend, аналитика.`, `domain,${slug(f)},${slug(p)}`, 'intermediate'));
}

// TESTING SCENARIOS × TYPE (25 scenarios × 3 = 75)
const TEST_SC = [
  'Happy Path Signup','Email Already Exists','Invalid Password Format','SQL Injection Attempt','XSS Script Inject',
  'Concurrent Signup Same Email','Race Condition Double Submit','Expired Session Redirect','Revoked Token Rejection','Rate Limit Exceeded',
  'File Size Too Large','Wrong MIME Type','Malware File Upload','Path Traversal Filename','Zip Bomb Upload',
  'Payment Card Declined','3DS Challenge Flow','Refund Partial','Subscription Renew','Subscription Cancel',
  'Cart Abandoned Recovery','Out of Stock During Checkout','Price Change During Cart','Coupon Expiry','Tax Calculation Multi-State'
];
const TEST_TYPE = [{k:'e2e',l:'E2E'},{k:'int',l:'Integration'},{k:'unit',l:'Unit'}];
for (const s of TEST_SC) for (const t of TEST_TYPE) {
  add.push(mk(`rl-testcase-${slug(s)}-${t.k}`, `${t.l}: ${s}`, '✓', '#10b981', '~30m',
    `${t.l} тест: "${s}". Given-When-Then, assertions.`, `testing,${t.k},${slug(s)}`, 'intermediate'));
}

// DEBUGGING SCENARIOS (40)
const DEBUG_SC = [
  'Memory Leak in Node.js','Slow Postgres Query','High CPU on Container','Intermittent 502 Gateway','DNS Resolution Slow',
  'CORS Issue Production','Webhook Not Delivered','JWT Expired Clock Skew','Redis Connection Pool Exhausted','DB Connection Pool Exhausted',
  'Memory Leak React Component','Memory Leak Worker Thread','Zombie Process','File Descriptor Leak','Socket Hang Up',
  'Event Loop Blocked','Slow TLS Handshake','Cold Start Lambda','Image Not Loading LCP','Hydration Mismatch',
  'Uncaught Promise Rejection','Silent Failure Try-Catch','Timer Not Fired','Async Context Lost','Race Condition Login',
  'Flaky E2E Test','CI Green but Prod Fail','Works on My Machine','Different Timezone Bug','Daylight Saving Bug',
  'Encoding UTF-8 vs Latin-1','BOM in File','Line Endings CRLF','Unicode Normalization','Emoji Breaking Layout',
  'Browser Back Button State','Infinite Redirect Loop','Service Worker Stale Cache','Form Double Submit','Checkbox Not Checked'
];
for (const sc of DEBUG_SC) {
  add.push(mk(`rl-debug-${slug(sc)}`, `Debug: ${sc}`, '🐛', '#ef4444', '~1h',
    `Диагностика: "${sc}". Инструменты, шаги, root cause, prevention.`, `debugging,${slug(sc)}`, 'advanced'));
}

// METRIC TYPE × SERVICE (10 × 10 = 100)
const METRICS = [
  'Request Rate','Error Rate','p50 Latency','p95 Latency','p99 Latency',
  'Queue Depth','Cache Hit Ratio','DB Connection Pool Usage','CPU Utilization','Memory Used'
];
const METRIC_SERVICES = [
  'API Service','Worker Queue','Database','Cache Layer','Message Broker',
  'CDN Edge','Auth Service','Payment Service','Search Service','Realtime WebSocket'
];
for (const metric of METRICS) for (const svc of METRIC_SERVICES) {
  add.push(mk(`rl-metric-${slug(metric)}-${slug(svc)}`, `${metric} for ${svc}`, '◈', '#f59e0b', '~30m',
    `Метрика "${metric}" для ${svc}: сбор, dashboard, alerting threshold.`,
    `metrics,${slug(metric)},${slug(svc)}`, 'intermediate'));
}

// ERROR HANDLING SCENARIOS (40)
const ERR_SC = [
  'Idempotent POST with Idempotency-Key','Optimistic Concurrency ETag','Pessimistic Lock Row','Timeout at Every Layer','Cascading Failure Prevention',
  'Graceful Degradation Fallback','Retry with Backoff + Jitter','Circuit Breaker Half-Open','Bulkhead Pool Isolation','Dead Letter Queue Review',
  'Partial Failure Batch','Rollback on Error','Two-Phase Commit Alternative','Saga Compensation','Outbox Relay',
  'Event Replay From Point','Snapshot + Event Replay','Database Failover Handling','Read Replica Lag Handling','Network Partition',
  'Slow Downstream Timeout','Batch Timeout Partial','Streaming Error Recovery','Transactional Outbox Poller','Exactly-Once Effect',
  'Retry Budget Per User','429 Respect Retry-After','Honor 503 Retry-After','Cache Serve Stale on Error','Fallback to Default Value',
  'Feature Flag Kill Switch','Fail-Open vs Fail-Closed','Graceful Shutdown SIGTERM','Drain In-Flight Connections','Reject New Requests',
  'Error Budget Tracking','SLO Burn Rate Alert','Multi-Window Multi-Burn','Error Budget Policy Freeze','Post-Mortem Blameless'
];
for (const sc of ERR_SC) {
  add.push(mk(`rl-errhdl-${slug(sc)}`, `Error: ${sc}`, '⚠', '#ef4444', '~45m',
    `${sc}. Implementation, тесты, observability.`, `error-handling,reliability,${slug(sc)}`, 'advanced'));
}

// DATA PIPELINE TASKS (30)
const PIPE_TASKS = [
  'CDC from Postgres to Kafka','ETL Batch to Warehouse','Streaming Aggregation Flink','Materialized View Incremental','dbt Model Build',
  'Airflow DAG Setup','Prefect Flow','Dagster Asset','Data Contract Schema','Data Catalog Metadata',
  'PII Tokenization Pipeline','Schema Evolution Avro','Schema Registry Confluent','Kafka Connect Source','Kafka Connect Sink',
  'Debezium Postgres CDC','Temporal Workflow Orchestration','Airbyte Connector','Fivetran Sync','Snowflake COPY',
  'BigQuery Load','Redshift Copy','Iceberg Table Ops','Delta Lake Merge','Lakehouse Architecture',
  'Data Quality Great Expectations','dbt Tests','Data Observability Monte Carlo','Data Lineage Marquez','Data Mesh Domain'
];
for (const t of PIPE_TASKS) {
  add.push(mk(`rl-pipe-${slug(t)}`, `Pipeline: ${t}`, '⇶', '#0d9488', '~1-2h',
    `${t}. Architecture, monitoring, cost.`, `data-pipeline,${slug(t)}`, 'advanced'));
}

// ENTERPRISE INTEGRATION PATTERNS (30)
const EIP = [
  'Content-Based Router','Message Filter','Recipient List','Splitter','Aggregator',
  'Resequencer','Claim Check','Normalizer','Canonical Data Model','Scatter-Gather',
  'Routing Slip','Process Manager','Request-Reply','Correlation Identifier','Return Address',
  'Event-Driven Consumer','Polling Consumer','Competing Consumers','Message Dispatcher','Selective Consumer',
  'Durable Subscriber','Idempotent Receiver','Transactional Client','Messaging Gateway','Messaging Mapper',
  'Control Bus','Detour','Wire Tap','Message History','Message Store'
];
for (const p of EIP) {
  add.push(mk(`rl-eip-${slug(p)}`, `EIP: ${p}`, '⧈', '#6366f1', '~1h',
    `Паттерн "${p}". Use case, реализация, примеры Apache Camel/Spring Integration.`,
    `eip,${slug(p)}`, 'advanced'));
}

// CHART TYPES × LIBRARY (15 × 4 = 60)
const CHART_TYPES = [
  'Line Chart','Bar Chart','Stacked Bar','Grouped Bar','Pie Chart',
  'Donut Chart','Area Chart','Scatter Plot','Bubble Chart','Heatmap',
  'Treemap','Sankey Diagram','Candlestick Chart','Radar Chart','Gauge Chart'
];
const CHART_LIBS = ['Recharts','Chart.js','ECharts','Visx'];
for (const ct of CHART_TYPES) for (const lib of CHART_LIBS) {
  add.push(mk(`fd-chart-${slug(ct)}-${slug(lib)}`, `${ct} (${lib})`, '◔', '#10b981', '~30m',
    `${ct} через ${lib}. Responsive, tooltips, animations, a11y.`, `charts,${slug(ct)},${slug(lib)}`, 'intermediate'));
}

// MAP FEATURES × LIBRARY (10 × 3 = 30)
const MAP_FEATS = [
  'Markers Cluster','Polyline Route','Polygon Area','Geolocation User','Search Geocoder',
  'Directions Routing','Traffic Layer','Satellite View','Drawing Tools','Heatmap Layer'
];
const MAP_LIBS = ['Leaflet','Mapbox GL','Google Maps'];
for (const f of MAP_FEATS) for (const lib of MAP_LIBS) {
  add.push(mk(`fd-map-${slug(f)}-${slug(lib)}`, `${f} (${lib})`, '⚐', '#10b981', '~45m',
    `${f} в ${lib}. API, events, стилизация.`, `maps,${slug(f)},${slug(lib)}`, 'intermediate'));
}

// FILE FORMATS × PROCESSING (10 × 4 = 40)
const FILE_FMT = ['PDF','DOCX','XLSX','CSV','JSON','XML','Markdown','HTML','PPTX','EPUB'];
const FMT_PROC = ['Parse + Extract Text','Generate from Template','Convert to Another Format','Validate + Schema'];
for (const fmt of FILE_FMT) for (const proc of FMT_PROC) {
  add.push(mk(`rl-file-${slug(fmt)}-${slug(proc)}`, `${fmt}: ${proc}`, '📄', '#10b981', '~45m',
    `${proc} для ${fmt}. Библиотеки per language, edge cases.`, `file,${slug(fmt)},${slug(proc)}`, 'intermediate'));
}

// INDUSTRY-SPECIFIC (30)
const INDUSTRY = [
  'HIPAA Compliant Architecture','SOC 2 Controls','PCI DSS Tokenization','GDPR Data Subject Rights','CCPA Opt-Out',
  'Financial Audit Trail','Banking KYC/AML Check','Stock Trading Order Routing','Crypto Exchange Matching Engine','Insurance Claims Workflow',
  'Healthcare Patient Portal','EHR Integration FHIR','Telemedicine Video','Pharmacy Rx Flow','Medical Device Integration',
  'Legal Document Versioning','Court Case Management','Contract Lifecycle','E-signature DocuSign','Compliance Reporting',
  'Education LMS Course','Assignment Submission','Quiz/Exam System','Gradebook','Student SIS',
  'Real Estate Listings','Property Management','Rent Collection','Maintenance Requests','Tenant Screening'
];
for (const ind of INDUSTRY) {
  add.push(mk(`fd-industry-${slug(ind)}`, `${ind}`, '◈', '#8b5cf6', '~2-3h',
    `${ind}. Compliance, architecture, integration points.`, `industry,${slug(ind)}`, 'advanced'));
}

// MATH / SCIENCE (25)
const MATH_SCI = [
  'Statistics Descriptive','Statistics Inferential','Hypothesis Testing','Bayesian Inference','Monte Carlo Simulation',
  'Linear Algebra Operations','Matrix Decomposition','Eigenvalues Computation','Gradient Descent','Newton Method',
  'FFT Fast Fourier Transform','Signal Processing','Image Processing Filters','Computer Vision Basics','OpenCV Object Detection',
  'Time Series Forecasting ARIMA','Time Series Prophet','Anomaly Detection Isolation Forest','Clustering KMeans','Clustering DBSCAN',
  'Dimensionality Reduction PCA','Dimensionality Reduction UMAP','Graph Algorithm Centrality','Optimization Linear Prog','Simulation Discrete Event'
];
for (const t of MATH_SCI) {
  add.push(mk(`rl-math-${slug(t)}`, `${t}`, '∑', '#10b981', '~1-2h',
    `${t}. Реализация на Python (numpy/scipy/sklearn), тесты, визуализация.`,
    `math,science,${slug(t)}`, 'advanced'));
}

// Write out
add.forEach(p => { p.compact = (p.text||"").slice(0,400); });
const existingIds = new Set(data.P.map(p=>p.id));
const toAdd = add.filter(p => !existingIds.has(p.id));
console.error('Dupes:', add.length - toAdd.length);
data.P = [...data.P, ...toAdd];

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('✓ Added', toAdd.length, '. Total:', data.P.length);
