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

// AWS SERVICES × OPERATIONS (40 × 4 = 160)
const AWS_SERVICES = [
  'EC2','ECS','EKS','Lambda','Fargate','Lightsail','App Runner','Batch',
  'S3','EBS','EFS','FSx','Glacier',
  'RDS','Aurora','DynamoDB','ElastiCache','Redshift','DocumentDB','MemoryDB','Timestream','Neptune',
  'VPC','Route 53','CloudFront','API Gateway','ALB','NLB','Global Accelerator',
  'IAM','Cognito','Secrets Manager','KMS','WAF','Shield','GuardDuty','Inspector',
  'CloudWatch','CloudTrail','X-Ray','SQS','SNS','EventBridge','Step Functions','Kinesis','MSK','SES'
];
const AWS_OPS = [
  {key:'setup',label:'Setup',diff:'intermediate',time:'~1h'},
  {key:'iac',label:'Terraform',diff:'intermediate',time:'~1h'},
  {key:'cost-opt',label:'Cost Optimize',diff:'intermediate',time:'~1h'},
  {key:'security',label:'Security Hardening',diff:'advanced',time:'~1h'},
];
for (const svc of AWS_SERVICES) {
  for (const op of AWS_OPS) {
    add.push(mkPrompt(`rl-aws-${slug(svc)}-${op.key}`, `AWS ${svc}: ${op.label}`, '☁', '#ff9900', op.time,
      `${op.label} для AWS ${svc}. IAM best practices, tags, lifecycle, мониторинг.`,
      `aws,${slug(svc)},${op.key}`, op.diff));
  }
}

// GCP SERVICES × OPS (30 × 3 = 90)
const GCP_SERVICES = [
  'Compute Engine','GKE','Cloud Run','App Engine','Cloud Functions','Cloud Batch',
  'Cloud Storage','Filestore','Persistent Disk',
  'Cloud SQL','Spanner','Firestore','Bigtable','BigQuery','Memorystore','AlloyDB',
  'VPC','Cloud Load Balancing','Cloud CDN','Cloud DNS','Cloud Armor',
  'IAM','Secret Manager','Cloud KMS','Identity Platform',
  'Cloud Logging','Cloud Monitoring','Cloud Trace','Pub/Sub','Workflows','Eventarc'
];
const GCP_OPS = [
  {key:'setup',label:'Setup',diff:'intermediate',time:'~1h'},
  {key:'iac',label:'Terraform',diff:'intermediate',time:'~1h'},
  {key:'security',label:'Security + IAM',diff:'advanced',time:'~1h'},
];
for (const svc of GCP_SERVICES) {
  for (const op of GCP_OPS) {
    add.push(mkPrompt(`rl-gcp-${slug(svc)}-${op.key}`, `GCP ${svc}: ${op.label}`, '☁', '#4285f4', op.time,
      `${op.label} для GCP ${svc}. Workload Identity, labels, autoscaling.`,
      `gcp,${slug(svc)},${op.key}`, op.diff));
  }
}

// AZURE SERVICES × OPS (25 × 3 = 75)
const AZURE_SERVICES = [
  'Virtual Machines','AKS','App Service','Functions','Container Instances','Container Apps',
  'Blob Storage','Files','Disks',
  'SQL Database','Cosmos DB','Cache for Redis','Synapse','Database for Postgres',
  'Virtual Network','Application Gateway','Front Door','Traffic Manager','CDN',
  'Entra ID','Key Vault','Managed Identity',
  'Monitor','Log Analytics','Application Insights','Service Bus','Event Grid'
];
const AZ_OPS = [
  {key:'setup',label:'Setup',diff:'intermediate',time:'~1h'},
  {key:'iac',label:'Bicep/Terraform',diff:'intermediate',time:'~1h'},
  {key:'security',label:'Security',diff:'advanced',time:'~1h'},
];
for (const svc of AZURE_SERVICES) {
  for (const op of AZ_OPS) {
    add.push(mkPrompt(`rl-azure-${slug(svc)}-${op.key}`, `Azure ${svc}: ${op.label}`, '☁', '#0089d6', op.time,
      `${op.label} для Azure ${svc}. RBAC, tags, Log Analytics.`,
      `azure,${slug(svc)},${op.key}`, op.diff));
  }
}

// CLOUDFLARE PRODUCTS × OPS (20 × 2 = 40)
const CF_PRODUCTS = [
  'Workers','Pages','R2','KV','Durable Objects','D1','Queues','Vectorize','AI','Workers AI',
  'CDN','Images','Stream','Zaraz','Access','Gateway','Tunnel','DNS','WAF','Bot Management'
];
const CF_OPS = [
  {key:'setup',label:'Setup'},{key:'optimize',label:'Optimize'}
];
for (const prod of CF_PRODUCTS) {
  for (const op of CF_OPS) {
    add.push(mkPrompt(`rl-cf-${slug(prod)}-${op.key}`, `Cloudflare ${prod}: ${op.label}`, '⎔', '#f38020', '~45m',
      `${op.label} Cloudflare ${prod}. wrangler.toml, bindings, deploy.`,
      `cloudflare,${slug(prod)},${op.key}`, 'intermediate'));
  }
}

// EXTENDED LANGS × CORE TASKS (15 × 10 = 150)
const EXT_LANGS = [
  {key:'zig',label:'Zig',color:'#f7a41d'},{key:'nim',label:'Nim',color:'#ffe953'},
  {key:'crystal',label:'Crystal',color:'#000000'},{key:'odin',label:'Odin',color:'#60aed5'},
  {key:'v',label:'V',color:'#5d87bf'},{key:'fsharp',label:'F#',color:'#378bba'},
  {key:'erlang',label:'Erlang',color:'#a90533'},{key:'gleam',label:'Gleam',color:'#ffaff3'},
  {key:'racket',label:'Racket',color:'#3c5caa'},{key:'common-lisp',label:'Common Lisp',color:'#3fb68b'},
  {key:'rescript',label:'ReScript',color:'#e6484f'},{key:'purescript',label:'PureScript',color:'#1d222d'},
  {key:'ocaml2',label:'OCaml',color:'#ec6813'},{key:'idris',label:'Idris',color:'#6f1f28'},
  {key:'nushell',label:'Nushell',color:'#3e4958'},
];
const CORE_TASKS = [
  {key:'hello',label:'Hello Project Setup',desc:'Скелет проекта, package manager, build'},
  {key:'http',label:'HTTP Server',desc:'HTTP сервер с routing'},
  {key:'json',label:'JSON API',desc:'JSON API: encode/decode, валидация'},
  {key:'concurrency',label:'Concurrency Primer',desc:'Concurrency: threads/async/channels'},
  {key:'test',label:'Testing Framework',desc:'Unit testing framework + coverage'},
  {key:'cli-tool',label:'CLI Tool',desc:'CLI tool: args, flags, subcommands'},
  {key:'db-client',label:'DB Client',desc:'Работа с Postgres: queries, pool'},
  {key:'pkg-publish',label:'Package Publishing',desc:'Publish package в официальный registry'},
  {key:'bench',label:'Benchmarking',desc:'Benchmark harness, сравнение'},
  {key:'linter',label:'Linter Setup',desc:'Lint/format: конфиг, CI check'},
];
for (const lang of EXT_LANGS) {
  for (const t of CORE_TASKS) {
    add.push(mkPrompt(`rl-${lang.key}-${t.key}`, `${t.label} (${lang.label})`, lang.label.substring(0,2).toUpperCase(), lang.color, '~1h',
      `${t.desc}. Язык: ${lang.label}. Идиомы, экосистема.`,
      `${lang.key},${t.key}`, 'intermediate'));
  }
}

// GAME ENGINES × FEATURES (8 × 15 = 120)
const GAMES = [
  {key:'unity',label:'Unity',color:'#000000'},{key:'unreal',label:'Unreal',color:'#000000'},
  {key:'godot',label:'Godot',color:'#478cbf'},{key:'phaser',label:'Phaser',color:'#8cc63f'},
  {key:'pixijs',label:'PixiJS',color:'#e91e63'},{key:'threejs-game',label:'Three.js Game',color:'#000000'},
  {key:'bevy',label:'Bevy (Rust)',color:'#ce422b'},{key:'love2d',label:'LÖVE 2D',color:'#e64e9b'},
];
const GAME_FEATURES = [
  'Character Controller','Physics 2D','Physics 3D','Collision Detection','Animation State Machine',
  'Inventory System','Save/Load State','Audio Manager','Particle Effects','Multiplayer Netcode',
  'AI Behavior Tree','Pathfinding','UI HUD','Dialog System','Quest System'
];
for (const engine of GAMES) {
  for (const feat of GAME_FEATURES) {
    add.push(mkPrompt(`fd-game-${engine.key}-${slug(feat)}`, `${feat} (${engine.label})`, '🎮', engine.color, '~1-2h',
      `Реализуй "${feat}" в ${engine.label}. Архитектура, примеры кода, тесты gameplay.`,
      `gamedev,${engine.key},${slug(feat)}`, 'intermediate'));
  }
}

// EMBEDDED/IOT × TASKS (8 × 12 = 96)
const IOT = [
  {key:'arduino',label:'Arduino',color:'#00979d'},{key:'esp32',label:'ESP32',color:'#e7352c'},
  {key:'esp8266',label:'ESP8266',color:'#3ac2d0'},{key:'rpi',label:'Raspberry Pi',color:'#c51a4a'},
  {key:'microbit',label:'micro:bit',color:'#00c2ad'},{key:'stm32',label:'STM32',color:'#03234b'},
  {key:'rust-embedded',label:'Rust Embedded',color:'#ce422b'},{key:'nrf52',label:'nRF52',color:'#00a9ce'},
];
const IOT_TASKS = [
  'Sensor Read (DHT22)','Motor Control PWM','WiFi Provisioning','MQTT Client','BLE Peripheral',
  'OTA Updates','Low Power Sleep Mode','Display SPI','SD Card Logger','Button Debounce',
  'I2C Scanner','Watchdog Timer'
];
for (const board of IOT) {
  for (const task of IOT_TASKS) {
    add.push(mkPrompt(`rl-iot-${board.key}-${slug(task)}`, `${task} (${board.label})`, '⎔', board.color, '~1h',
      `${task} на ${board.label}. Pinout, схема, code, debug.`,
      `iot,embedded,${board.key},${slug(task)}`, 'intermediate'));
  }
}

// DATA SCIENCE / ML × TASKS (12 × 10 = 120)
const DS_TOOLS = [
  {key:'pandas',label:'Pandas',color:'#150458'},{key:'polars',label:'Polars',color:'#cd79ff'},
  {key:'numpy',label:'NumPy',color:'#013243'},{key:'scikit',label:'scikit-learn',color:'#f7931e'},
  {key:'pytorch',label:'PyTorch',color:'#ee4c2c'},{key:'tensorflow',label:'TensorFlow',color:'#ff6f00'},
  {key:'jax',label:'JAX',color:'#77c5db'},{key:'xgboost',label:'XGBoost',color:'#8f42f2'},
  {key:'lightgbm',label:'LightGBM',color:'#000000'},{key:'huggingface',label:'HuggingFace',color:'#ffd21e'},
  {key:'dask',label:'Dask',color:'#fda91e'},{key:'spark',label:'PySpark',color:'#e25a1c'},
];
const DS_TASKS = [
  'EDA Exploration','Data Cleaning','Feature Engineering','Train/Test Split','Cross-Validation',
  'Hyperparameter Tuning','Model Evaluation','Feature Importance','Model Serving','Pipeline MLOps'
];
for (const tool of DS_TOOLS) {
  for (const task of DS_TASKS) {
    add.push(mkPrompt(`rl-ds-${tool.key}-${slug(task)}`, `${task} (${tool.label})`, '◈', tool.color, '~1-2h',
      `${task} через ${tool.label}. Код, визуализация, метрики.`,
      `datascience,ml,${tool.key},${slug(task)}`, 'intermediate'));
  }
}

// BLOCKCHAIN/WEB3 × OPS (10 chains × 10 = 100)
const CHAINS = [
  {key:'eth',label:'Ethereum',color:'#627eea'},{key:'polygon',label:'Polygon',color:'#8247e5'},
  {key:'base',label:'Base',color:'#0052ff'},{key:'arbitrum',label:'Arbitrum',color:'#28a0f0'},
  {key:'optimism',label:'Optimism',color:'#ff0420'},{key:'solana',label:'Solana',color:'#9945ff'},
  {key:'avalanche',label:'Avalanche',color:'#e84142'},{key:'near',label:'NEAR',color:'#000000'},
  {key:'sui',label:'Sui',color:'#4da2ff'},{key:'aptos',label:'Aptos',color:'#00d4ff'},
];
const WEB3_OPS = [
  'Wallet Connect','Sign Message','Read Contract','Write Contract','Deploy Contract',
  'Event Listening','Token Balance','NFT Mint','Gas Optimization','Indexing via Subgraph'
];
for (const chain of CHAINS) {
  for (const op of WEB3_OPS) {
    add.push(mkPrompt(`rl-web3-${chain.key}-${slug(op)}`, `${op} (${chain.label})`, '◈', chain.color, '~1h',
      `${op} на ${chain.label}. SDK, RPC, примеры, security.`,
      `web3,${chain.key},${slug(op)}`, 'intermediate'));
  }
}

// INTEGRATION PATTERNS × TECH (20 × 5 = 100)
const INT_PATTERNS = [
  'Outbox','Inbox','Saga Orchestrator','Saga Choreography','CQRS Read Model',
  'Event Sourcing Store','API Gateway','BFF','Strangler Fig','Anti-Corruption Layer',
  'Circuit Breaker','Bulkhead','Timeout','Retry + Backoff','Fallback',
  'Rate Limiter','Load Shedder','Idempotency Receiver','Dead Letter Handler','Competing Consumers'
];
const INT_TECH = [
  {key:'node',label:'Node.js',color:'#339933'},{key:'py',label:'Python',color:'#3776ab'},
  {key:'go',label:'Go',color:'#00acd7'},{key:'java',label:'Java',color:'#ed8b00'},
  {key:'rust',label:'Rust',color:'#ce422b'}
];
for (const pat of INT_PATTERNS) {
  for (const tech of INT_TECH) {
    add.push(mkPrompt(`rl-intpat-${slug(pat)}-${tech.key}`, `${pat} (${tech.label})`, '◈', tech.color, '~1h',
      `Реализуй "${pat}" в ${tech.label}. Fault-tolerance, тестирование, observability.`,
      `integration,${slug(pat)},${tech.key}`, 'advanced'));
  }
}

// CONCURRENCY PATTERNS × LANG (15 × 6 = 90)
const CONCURRENCY = [
  'Mutex','RWLock','Semaphore','Channel','Atomic Counter',
  'Worker Pool','Pipeline Pattern','Fan-Out Fan-In','Actor Model','Futures/Promises',
  'Async/Await','Coroutines','Select Loop','Parallel Map-Reduce','Double-Checked Locking'
];
const CON_LANGS = [
  {key:'go2',label:'Go',color:'#00acd7'},{key:'rust2',label:'Rust',color:'#ce422b'},
  {key:'java2',label:'Java',color:'#ed8b00'},{key:'python2',label:'Python',color:'#3776ab'},
  {key:'ts2',label:'TypeScript',color:'#3178c6'},{key:'elixir2',label:'Elixir',color:'#4e2a8e'}
];
for (const pat of CONCURRENCY) {
  for (const lang of CON_LANGS) {
    add.push(mkPrompt(`rl-conc-${slug(pat)}-${lang.key}`, `${pat} (${lang.label})`, '⧈', lang.color, '~45m',
      `"${pat}" в ${lang.label}. Идиоматичный подход, race conditions, тесты.`,
      `concurrency,${slug(pat)},${lang.key}`, 'advanced'));
  }
}

// GIT WORKFLOWS / OPERATIONS (30 curated)
const GIT_OPS = [
  'Git Rebase Interactive','Cherry-Pick Multiple','Bisect to Find Bug','Squash Commits Before Merge','Rewrite Author',
  'Submodule Setup','Subtree Setup','Git Hooks Pre-commit','Git LFS Large Files','Commit Signing GPG',
  'Force Push Safely','Reflog Recovery','Stash Advanced','Sparse Checkout','Partial Clone',
  'Multi-Worktree Setup','Signed Tags Release','Reset --hard Safe','Cherry-pick Range','Patch File Workflow',
  'Merge vs Rebase Strategy','Git Blame Navigation','Git Log Advanced','Revert vs Reset','Bundle for Offline Transfer',
  'Aliases Power User','Hooks on Server','Custom Diff Driver','Monorepo with Git','Keep Fork in Sync'
];
for (const op of GIT_OPS) {
  add.push(mkPrompt(`rl-git-${slug(op)}`, `Git: ${op}`, '⎔', '#f05032', '~30m',
    `${op}. Команды, примеры, recovery план.`,
    `git,${slug(op)}`, 'intermediate'));
}

// DOCKER ADVANCED OPS (25)
const DOCKER_OPS = [
  'Multi-stage Dockerfile','Distroless Base','BuildKit Cache Mounts','Secret Mounts in Build','Buildx Multi-Platform',
  'Rootless Docker','User Namespace Remap','Scratch Image Go Binary','Layer Optimization','Healthcheck with Exec',
  'Entrypoint vs CMD','SIGTERM Handling','Docker Compose Profiles','Compose Watch Mode','Compose Depends-on Health',
  'Docker Swarm Basics','Docker Secrets','Docker Networks Advanced','Container Logs Driver','Resource Limits + Cgroups',
  'Security Scan Trivy','Image Signing Cosign','SBOM Generation','Private Registry Auth','Docker Cleanup Automation'
];
for (const op of DOCKER_OPS) {
  add.push(mkPrompt(`rl-docker-${slug(op)}`, `Docker: ${op}`, '🐳', '#2496ed', '~45m',
    `${op}. Пример Dockerfile/compose, best practices.`,
    `docker,${slug(op)}`, 'intermediate'));
}

// KUBECTL / K8S ADVANCED (40)
const K8S_OPS = [
  'Resource Quotas + LimitRange','Pod Disruption Budget','PodSecurityPolicy→PSA','Admission Controllers Webhooks',
  'Custom Resource Definition','Operator Pattern with Kubebuilder','StatefulSet Strategy','DaemonSet Usage',
  'Job + CronJob','Init Containers Pattern','Sidecar Proxy Pattern','Ambassador Pattern','Adapter Pattern',
  'Multi-Container Logging','Volume Claim Templates','Storage Classes','Provisioning Dynamic PV',
  'ConfigMap Hot Reload','Secret Rotation','Service Mesh Sidecar Inject','Ingress with TLS',
  'NetworkPolicy Deny All','Pod Affinity/Anti-affinity','Topology Spread Constraints','Node Affinity',
  'Taints + Tolerations','HPA Custom Metrics','VPA Recommendation Mode','Cluster Autoscaler',
  'Pod Priority Class','Graceful Node Drain','Rolling Update Strategy','Canary via Argo Rollouts',
  'Blue-Green via Service Switch','kubectl Debug Container','kubectl Port-Forward Multi','Kustomize Overlays',
  'Helm Chart Library','Sealed Secrets Setup','External Secrets Operator','Event Export to Sink'
];
for (const op of K8S_OPS) {
  add.push(mkPrompt(`rl-k8s-ops-${slug(op)}`, `K8s: ${op}`, '⎈', '#326ce5', '~1h',
    `${op}. Манифесты, best practices, troubleshoot.`,
    `kubernetes,${slug(op)}`, 'intermediate'));
}

// NPM / PACKAGE MANAGEMENT (20)
const PKG_OPS = [
  'Monorepo pnpm Workspaces','Turborepo Caching Remote','Nx Monorepo Setup','Rush Monorepo','Yarn Berry PnP',
  'Package Exports Field','Dual CJS+ESM Publish','Tree-shakeable Publish','Peer Deps Strategy','Package Provenance',
  'npm Audit Fix Automation','Lockfile Merge Conflicts','Publish with Changesets','Conventional Commits+Release',
  'Private Registry Verdaccio','Scoped Packages @org','Beta/Next Release Channels','Deprecate Package Properly',
  'License Compliance FOSSA','Unused Deps Detection'
];
for (const op of PKG_OPS) {
  add.push(mkPrompt(`rl-pkg-${slug(op)}`, `Package: ${op}`, '◈', '#cb3837', '~45m',
    `${op}. Конфиг, CI, workflow.`,
    `package,npm,${slug(op)}`, 'intermediate'));
}

// MIGRATION TASKS (25)
const MIGRATIONS = [
  'React 17 → 19','Vue 2 → 3','Angular 14 → 17','Next.js Pages → App Router','Webpack → Vite',
  'Create React App → Vite','JavaScript → TypeScript','Jest → Vitest','Webpack → Rspack','Express → Fastify',
  'Redux → Zustand','MobX → Jotai','REST → GraphQL','Django → FastAPI','Flask → Starlette',
  'Node 18 → 22','Python 3.9 → 3.12','Java 11 → 21','PHP 7 → 8','Ruby 2.7 → 3.3',
  'MySQL → Postgres','MongoDB → Postgres JSONB','AWS SDK v2 → v3','Heroku → Fly.io','Sass → Tailwind'
];
for (const mig of MIGRATIONS) {
  add.push(mkPrompt(`rl-migrate-${slug(mig)}`, `Migrate: ${mig}`, '⇶', '#10b981', '~2-4h',
    `Пошаговая миграция: ${mig}. План, breaking changes, постепенно, тесты.`,
    `migration,${slug(mig)}`, 'advanced'));
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
