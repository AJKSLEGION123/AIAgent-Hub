const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0: Разведка. ";
const A = " АНТИ-ЛУП: 3 ошибки.";

function mk(id, role, icon, ac, time, d, tags, diff) {
  const cmd = id.startsWith("rl-") ? "/ralph-loop" : id.startsWith("fd-") ? "/feature-dev" : id.startsWith("rv-") ? "/review-pr" : id.startsWith("cr-") ? "/code-review" : id.startsWith("sm-") ? "/simplify" : id.startsWith("lp-") ? "/loop" : id.startsWith("cm-") ? "/commit" : "/feature-dev";
  const text = cmd === "/ralph-loop" ? '/ralph-loop "' + E + 'ЗАДАЧА: ' + d + A + '" --completion-promise "DONE"' : cmd === "/loop" ? '/loop 5m "' + d + '"' : d;
  return { id, m: cmd, mk: "claude", role, type: "command", icon, ac, time, text, tags: tags.split(","), difficulty: diff, output: "Result", related: [], prereqs: [], v: "11.2" };
}
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const add = [];

// PROFESSIONAL ROLES × OUTCOME (15 × 8 = 120)
const ROLES = [
  'Senior Engineer','Tech Lead','Staff Engineer','Principal Engineer','Architect',
  'Engineering Manager','Director of Engineering','CTO','DevOps Engineer','SRE',
  'Security Engineer','Data Engineer','ML Engineer','QA Engineer','Product Engineer'
];
const OUTCOMES = [
  'Tech Interview Prep','System Design Session','Incident Post-Mortem Lead','Quarterly Roadmap','Team Hiring Rubric',
  'Career Ladder Doc','1:1 Agenda Template','Performance Review','Skills Matrix','Learning Path'
];
for (const r of ROLES.slice(0,12)) for (const o of OUTCOMES) {
  add.push(mk(`fd-role-${slug(r)}-${slug(o)}`, `${r}: ${o}`, '◈', '#8b5cf6', '~1-2h',
    `${o} для ${r}. Template, checklist, примеры.`, `career,role,${slug(r)},${slug(o)}`, 'intermediate'));
}

// LOG QUERY EXAMPLES (50 unique)
const LOG_QUERIES = [
  'Find All 500 Errors Last 15min','Top 10 Slow Endpoints','Error Rate per Service','Failed Login Attempts','Request Count by Status',
  'Memory Usage per Pod','CPU Throttling Events','Network Errors by Host','DB Connection Errors','Cache Miss Rate',
  'Queue Message Backlog','Consumer Lag','Kafka Replication Lag','S3 Request Count','Lambda Cold Starts',
  'Geo Distribution 4xx','User Agent Distribution','Bot Traffic Filter','API Version Usage','Deprecated Endpoint Hits',
  'Payment Declined Reasons','OAuth Token Refresh','Session Timeout Events','Scheduled Job Failures','Webhook Delivery Failures',
  'Validation Error Field Counts','404 Not Found by Path','Rate Limit Triggered Users','Authentication Source','Feature Flag Evaluations',
  'A/B Test Conversion','Search Query Empty Results','Failed Email Sends','SMS Delivery Failures','Push Notification Errors',
  'File Upload Failures','Image Processing Errors','Report Generation Failures','Export Job Duration','Backup Success/Failure',
  'Deploy Events Timeline','Config Change Events','Secret Access Audit','Admin Actions Log','PII Access Audit',
  'Cross-Region Latency','TLS Handshake Failures','DNS Query Failures','CDN Cache Hit','Upstream Origin Errors'
];
for (const q of LOG_QUERIES) {
  add.push(mk(`rl-logq-${slug(q)}`, `Log Query: ${q}`, '≣', '#f59e0b', '~20m',
    `Запрос в логах: "${q}". LogQL/DogLog/Splunk SPL/ES DSL.`, `logs,query,${slug(q)}`, 'intermediate'));
}

// SRE / RELIABILITY (40)
const SRE = [
  'On-Call Schedule Rotation','Alert Fatigue Reduction','SLO Dashboard Design','Error Budget Review','Burn Rate Multi-Window',
  'Run Book Automation','Chaos Game Day Plan','Dependency Health Check','Capacity Planning Model','Load Shedding Strategy',
  'Graceful Degradation Ladder','Feature Flag Kill Switch','Canary Deploy Automation','Progressive Rollout','Automated Rollback',
  'Blast Radius Limit','Multi-Region Active-Active','Multi-Region Active-Passive','Geo Failover DNS','Disaster Recovery Drill',
  'Backup Restore Test','Secret Rotation Quarterly','Cert Renewal Automation','TLS Monitoring Expiry','DNS Delegation Audit',
  'Kernel Upgrade Rolling','Node Fleet Patch','Security Scan Continuous','Supply Chain Provenance','SBOM Attestation',
  'Observability Cost Review','Metric Cardinality Audit','Log Retention Tiering','Trace Sampling Head','Trace Sampling Tail',
  'Cost Anomaly Alert','Idle Resource Cleanup','Reserved Instance Review','Spot Instance Strategy','Cost per Request Metric'
];
for (const t of SRE) {
  add.push(mk(`rl-sre-${slug(t)}`, `SRE: ${t}`, '◈', '#ef4444', '~1h',
    `${t}. Process, automation, docs.`, `sre,reliability,${slug(t)}`, 'advanced'));
}

// KUBERNETES RESOURCE SCENARIOS (40)
const K8S_SC = [
  'CrashLoopBackOff Debug','ImagePullBackOff Fix','Pod Pending Scheduling','OOMKilled Memory Tune','Node NotReady Fix',
  'Stuck Terminating Pod','PVC Bound But Unused','Service Endpoints Empty','DNS Resolution in Pod','Network Policy Debug',
  'Ingress 502 Backend','Ingress 504 Timeout','TLS Certificate Mismatch','Cert Manager Not Renewing','HPA Not Scaling',
  'VPA Recommendations Apply','Cluster Autoscaler Stuck','PDB Preventing Drain','Multi-AZ Scheduling','Taint Toleration Mismatch',
  'Secret Not Mounted','ConfigMap Not Updated','Volume Mount Permission','SecurityContext Non-Root','PSA Restricted Migration',
  'CoreDNS Performance','CNI Plugin Errors','Cilium Network Policy','Calico Routing','Istio Sidecar Injection',
  'Linkerd Mesh Migration','ArgoCD Sync Failed','Flux Drift Detection','Helm Upgrade Stuck','Kustomize Patch Conflict',
  'K8s Audit Logs Review','Kube-proxy iptables','etcd Backup Restore','Control Plane Upgrade','Worker Node Upgrade Rolling'
];
for (const sc of K8S_SC) {
  add.push(mk(`rl-k8ssc-${slug(sc)}`, `K8s Scenario: ${sc}`, '⎈', '#326ce5', '~1h',
    `Диагностика/фикс: "${sc}". kubectl команды, логи, pattern.`, `kubernetes,scenario,${slug(sc)}`, 'advanced'));
}

// DATABASE PROBLEMS / FIXES (40)
const DB_PROBS = [
  'Slow SELECT Full Scan','Missing Index Detection','Index Bloat Rebuild','Table Bloat Vacuum','Statistics Stale Analyze',
  'Lock Contention Detect','Deadlock Diagnosis','Long-Running Transaction Kill','Prepared Statement Cache Bust','Connection Pool Exhaustion',
  'Replica Lag High','Replication Break','WAL Bloat','Checkpoint Tuning','Autovacuum Lagging',
  'Shared Buffer Hit Ratio Low','Work Mem Low','Random Page Cost Tune','Effective Cache Size','Max Connections Hit',
  'Idle Connections Trim','Connection Storm Protection','PgBouncer Transaction Mode','Prepared Statement PgBouncer','Query Plan Regression',
  'Parameter Sniffing Problem','Cardinality Estimate Wrong','Join Reorder Hint','Partitioning Prune Check','Parallel Query Config',
  'TOAST Table Grow','Large Object Bloat','FK Constraint Slow','Trigger Performance','Materialized View Refresh',
  'Row-Level Security Audit','Temp Table Churn','Bloat from Updates','HOT Updates Ratio','Zero-Downtime ADD COLUMN'
];
for (const p of DB_PROBS) {
  add.push(mk(`rl-dbprob-${slug(p)}`, `DB: ${p}`, '⎈', '#336791', '~1h',
    `Проблема БД: "${p}". Диагностика, запросы к системным таблицам, fix.`, `database,${slug(p)}`, 'advanced'));
}

// NETWORKING DEEP (30)
const NET_DEEP = [
  'TCP Handshake 3-way','TCP Slow Start','TCP Congestion Control','TCP Window Scaling','TCP Keepalive',
  'TLS Handshake 1.2','TLS Handshake 1.3','TLS 0-RTT Replay Risk','QUIC Connection Migration','HTTP/2 HOL Blocking',
  'Load Balancer L4 vs L7','DSR Direct Server Return','NAT Traversal','VXLAN Overlay','BGP Basics',
  'Anycast DNS','CDN Pop Selection','Edge Compute Request Routing','mTLS Mutual Auth','Certificate Pinning Mobile',
  'Public Key Infrastructure','Let\'s Encrypt ACME','DNS-01 Challenge Wildcard','HTTP-01 Challenge','Cert Chain Intermediate',
  'OCSP Stapling','Certificate Transparency','HSTS Preload Consider','Public Suffix List','EV Certificate Deprecation'
];
for (const t of NET_DEEP) {
  add.push(mk(`rl-netdeep-${slug(t)}`, `Net: ${t}`, '⎔', '#0089d6', '~1h',
    `${t}. Concept, tools, examples.`, `networking,${slug(t)}`, 'advanced'));
}

// ACCESSIBILITY COMPONENT SPECIFICS (25 × 2 = 50)
const A11Y_COMP = [
  'Combobox','Listbox','Menu Button','Menu Bar','Radio Group',
  'Spin Button','Tab List','Tree View','Grid','Treegrid',
  'Breadcrumb','Pagination','Progress Bar','Slider','Tabs',
  'Toolbar','Switch','Link','Dialog Modal','Dialog Non-Modal',
  'Alert','Alert Dialog','Status','Button Disabled','Checkbox Mixed'
];
for (const c of A11Y_COMP) {
  add.push(mk(`rl-a11y-comp-${slug(c)}`, `A11y ${c} Pattern`, '♿', '#2563eb', '~45m',
    `ARIA паттерн ${c}: roles, states, keyboard, тесты screen reader.`,
    `a11y,aria,${slug(c)}`, 'intermediate'));
  add.push(mk(`rv-a11y-comp-${slug(c)}`, `Review A11y ${c}`, '♿', '#2563eb', '~30m',
    `Code review ${c} компонента на a11y compliance.`,
    `a11y,review,${slug(c)}`, 'intermediate'));
}

// SQL QUERY OPTIMIZATIONS (30)
const SQL_OPTS = [
  'SELECT * Replace with Columns','EXISTS vs IN Subquery','NOT IN with NULL Trap','LATERAL JOIN Pattern','CTE vs Subquery Materialization',
  'Window Function LAG/LEAD','RANK DENSE_RANK ROW_NUMBER','Rolling Window Aggregation','Median PERCENTILE_CONT','Pivot with CASE',
  'UNPIVOT Pattern','Recursive CTE Tree','Hierarchy Closure Table','Materialized Path','Nested Set',
  'Full-Text Search tsvector','Fuzzy Search pg_trgm','JSON Path @> ?','Array Operations','GIN vs GiST Index',
  'Partial Index Example','Expression Index','Covering Index INCLUDE','Filtered Index','Composite Index Column Order',
  'Index-Only Scan','Bitmap Index Scan','Merge Join vs Hash Join','Parallel Query Workers','BRIN Index Large Tables'
];
for (const opt of SQL_OPTS) {
  add.push(mk(`rl-sql-opt-${slug(opt)}`, `SQL: ${opt}`, '◈', '#336791', '~30m',
    `${opt}. Пример, план, улучшение.`, `sql,optimization,${slug(opt)}`, 'intermediate'));
}

// TYPESCRIPT TYPE PATTERNS (30)
const TS_TYPES = [
  'Discriminated Union','Exhaustive Check never','Mapped Types','Conditional Types','Template Literal Types',
  'Recursive Types','Type Predicate Guards','Assertion Functions','Branded Types Opaque','Phantom Types',
  'Builder Pattern Fluent','Type-safe Event Emitter','Type-safe Redux Toolkit','Type-safe Router','Type-safe API Client',
  'infer Keyword','Variance Co/Contra','satisfies Operator','const Assertions','Generic Constraints',
  'Higher-Kinded Types Workaround','Tuple Types Advanced','Utility Types Built-in','Utility Types Custom','Type-level Recursion',
  'TypeScript 5.x What New','Decorators Stage-3','tsconfig paths','Module Resolution bundler','Project References Monorepo'
];
for (const t of TS_TYPES) {
  add.push(mk(`rl-ts-${slug(t)}`, `TS Type: ${t}`, '⎈', '#3178c6', '~45m',
    `${t}. Пример, use case, pitfalls.`, `typescript,types,${slug(t)}`, 'advanced'));
}

// RUST PATTERNS (25)
const RUST_TOPICS = [
  'Ownership Borrowing','Lifetimes Elision','Smart Pointers Box/Rc/Arc','Interior Mutability RefCell','Sync vs Send',
  'Async Runtime Tokio','Async Runtime async-std','Pin + Unpin','Error Handling Result','thiserror + anyhow',
  'Traits Generic Bounds','Dynamic Dispatch dyn Trait','Enum + Pattern Matching','Iterator Adapter Chain','Iterator Collect',
  'Derive Macros Common','Proc Macros Write','Macros by Example','unsafe Block Guidelines','FFI C Bindings',
  'Cargo Workspaces','Cargo Features Flags','Benchmark criterion','Fuzzing cargo-fuzz','Cross Compile to WASM'
];
for (const t of RUST_TOPICS) {
  add.push(mk(`rl-rust-${slug(t)}`, `Rust: ${t}`, '⎔', '#ce422b', '~1h',
    `${t}. Идиомы, примеры, gotchas.`, `rust,${slug(t)}`, 'advanced'));
}

// GO PATTERNS (25)
const GO_TOPICS = [
  'Goroutines Leaks Prevention','Channel Patterns','Context Cancellation','select + time.After','sync.WaitGroup',
  'errgroup.Group','sync.Pool','sync.Once','Atomic Operations','Mutex vs RWMutex',
  'Interface Composition','Embedding vs Inheritance','Table-Driven Tests','Benchmark go test -bench','pprof CPU/Mem',
  'errors.Is/As Wrapping','Sentinel Errors','Structured Logging slog','HTTP Server Timeout','HTTP Client Reuse',
  'JSON Marshaling Custom','sync.Map use cases','Build Tags Conditional','go:embed Files','Generics (1.18+)'
];
for (const t of GO_TOPICS) {
  add.push(mk(`rl-go-${slug(t)}`, `Go: ${t}`, '⎔', '#00acd7', '~45m',
    `${t}. Идиомы, примеры, pitfalls.`, `go,${slug(t)}`, 'advanced'));
}

// PYTHON PATTERNS (25)
const PY_TOPICS = [
  'Type Hints PEP 484','TypedDict vs Pydantic','Protocols Structural Typing','AsyncIO Event Loop','asyncio.gather Errors',
  'Context Managers __enter__','contextlib @contextmanager','Generators vs Iterators','Coroutines async def','Dataclasses vs attrs',
  'Pydantic v2 Migration','Mypy Strict Mode','Pytest Fixtures','Pytest Parametrize','Pytest Mocking',
  'Multiprocessing vs Threading','concurrent.futures','GIL Workarounds','subprocess Piping','logging Configuration',
  'Pathlib vs os.path','requests Session Keep-Alive','aiohttp Async Client','FastAPI Dependency Injection','SQLAlchemy 2.0 Style'
];
for (const t of PY_TOPICS) {
  add.push(mk(`rl-py-${slug(t)}`, `Python: ${t}`, '🐍', '#3776ab', '~45m',
    `${t}. Идиомы, примеры.`, `python,${slug(t)}`, 'advanced'));
}

// JAVA/JVM PATTERNS (25)
const JAVA_TOPICS = [
  'Virtual Threads Project Loom','Records JEP 395','Pattern Matching switch','Sealed Classes','Text Blocks',
  'var Local Inference','Optional Usage Patterns','Stream API Deep','Collectors Custom','CompletableFuture Composition',
  'Reactive Project Reactor','RxJava 3','Spring Boot AOT Native','GraalVM Native Image','JVM Tuning G1GC',
  'ZGC Low-Latency','JFR Flight Recorder','JVM Memory Areas','Heap Dump Analysis','jstack Deadlock',
  'Memory Leak Eclipse MAT','Concurrent Collections','Lock Framework ReentrantLock','StampedLock','VarHandle Atomic'
];
for (const t of JAVA_TOPICS) {
  add.push(mk(`rl-java-${slug(t)}`, `Java: ${t}`, '⎈', '#ed8b00', '~1h',
    `${t}. Примеры, когда использовать.`, `java,jvm,${slug(t)}`, 'advanced'));
}

// IDE SHORTCUTS / PRODUCTIVITY (20)
const IDE_PROD = [
  'VSCode Multi-Cursor Tricks','VSCode Regex Replace','VSCode Code Snippets','VSCode Tasks Runner','VSCode Git Lens',
  'VSCode Remote SSH','VSCode Dev Containers','IntelliJ Refactor Extract','IntelliJ Navigation Shortcuts','IntelliJ Live Templates',
  'Zed Collaborative Editing','Cursor Agent Mode','Claude Code + VSCode','Neovim Telescope Fuzzy','Neovim Harpoon Files',
  'Terminal Multiplexer tmux','Terminal Multiplexer zellij','SSH Config ~/.ssh/config','SSH Key Forwarding','Mosh Mobile Shell'
];
for (const t of IDE_PROD) {
  add.push(mk(`rl-prod-${slug(t)}`, `Productivity: ${t}`, '⌨', '#007acc', '~20m',
    `${t}. Shortcuts, setup, workflow.`, `productivity,ide,${slug(t)}`, 'beginner'));
}

// OPEN SOURCE / LICENSING (15)
const OSS = [
  'MIT vs Apache 2.0 License','GPL Copyleft Impact','BSL Business Source','LGPL Library Linking','Contributor License Agreement',
  'SPDX License Identifier','License Compatibility Matrix','FOSSA License Scanning','OSS Review Toolkit','ScanCode Toolkit',
  'npm Package License','Cargo License Field','PyPI License Classifier','Go Module License','Container Image License'
];
for (const t of OSS) {
  add.push(mk(`rl-oss-${slug(t)}`, `OSS: ${t}`, '◈', '#10b981', '~30m',
    `${t}. Checklist, tools, compliance.`, `oss,licensing,${slug(t)}`, 'intermediate'));
}

// EMOJI/UNICODE HANDLING (15)
const UNICODE = [
  'Grapheme Cluster Iteration','UTF-8 Encoding Validation','UTF-16 Surrogate Pairs','Emoji Joiner Sequences','Skin Tone Modifier',
  'Unicode Normalization NFC/NFD','Case Folding for Search','Bidirectional Text','Character Class Regex','CJK Unified Ideographs',
  'Arabic Shaping','Hebrew Cantillation','Thai Word Break','Hindi Devanagari','Combining Marks'
];
for (const t of UNICODE) {
  add.push(mk(`rl-unicode-${slug(t)}`, `Unicode: ${t}`, '⌘', '#8b5cf6', '~30m',
    `${t}. Примеры, библиотеки (ICU), тесты edge cases.`, `unicode,i18n,${slug(t)}`, 'advanced'));
}

// TIME/DATE EDGE CASES (20)
const TIME_EDGE = [
  'Daylight Saving Transition','Leap Second','Leap Year Feb 29','Timezone Politics (Samoa)','Historical Timezone Changes',
  'UTC vs GMT Confusion','Unix Epoch Y2038','Y2K Retro','Date.now() Precision','performance.now() Monotonic',
  'Clock Skew Between Servers','NTP Synchronization','Distributed Timestamp','Vector Clock','Lamport Timestamp',
  'CRDT Last-Writer-Wins','HLC Hybrid Logical Clock','Spanner TrueTime','Relative Time Formatting','Time Zone Database IANA'
];
for (const t of TIME_EDGE) {
  add.push(mk(`rl-time-${slug(t)}`, `Time: ${t}`, '⌚', '#10b981', '~30m',
    `${t}. Pitfalls, implementation, тесты.`, `time,date,${slug(t)}`, 'advanced'));
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
