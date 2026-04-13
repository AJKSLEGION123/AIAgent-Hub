const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 ПОЛНАЯ РАЗВЕДКА:\nПрочитай ВЕСЬ проект. Структура, конфиги, зависимости, БД, API, тесты, CI, git log.\n\n";
const A = "\n\nАНТИ-ЛУП: 3 ошибки = смена подхода.";

const add = [
  {id:"rl-feature-flags",m:"/ralph-loop",mk:"claude",role:"Feature Flags",type:"command",icon:"\u{1F6A9}",ac:"#f97316",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Feature flags.\n\nSERVICE: LaunchDarkly / Unleash / PostHog / custom (DB-based).\nIMPLEMENTATION:\n- Backend: isFeatureEnabled(\"new-checkout\", userId)\n- Frontend: useFeatureFlag(\"new-checkout\")\n- Gradual rollout: 10% -> 50% -> 100%\n- A/B testing: variant A vs B\nDB: feature_flags (key, enabled, percentage, rules).\nADMIN UI: toggle flags, set rules, target users.\nCLEANUP: remove old flags + dead code после full rollout.' + A + '" --completion-promise "DONE"',
   tags:["feature-flags","a-b-testing","rollout","toggles"],difficulty:"intermediate",output:"Feature flags",related:["rl-analytics","rl-rbac"],prereqs:[],v:"11.0"},

  {id:"rl-retry",m:"/ralph-loop",mk:"claude",role:"Retry & Circuit Breaker",type:"command",icon:"\u{1F504}",ac:"#dc2626",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Retry + Circuit Breaker patterns.\n\nRETRY: exponential backoff (1s, 2s, 4s, 8s), max attempts, jitter.\nCIRCUIT BREAKER: closed -> open (after N failures) -> half-open (test) -> closed.\nIMPLEMENTATION: wrapper function withRetry(fn, options).\nCONFIG: maxRetries, backoff, timeout, circuitThreshold.\nUSE CASES: external API calls, DB reconnect, email sending.\nMONITOR: log retries, track circuit state.\nTEST: simulate failures, verify retry behavior.' + A + '" --completion-promise "DONE"',
   tags:["retry","circuit-breaker","resilience","fault-tolerance"],difficulty:"intermediate",output:"Retry + circuit breaker",related:["rl-err","rl-api-client"],prereqs:[],v:"11.0"},

  {id:"rl-snapshot",m:"/ralph-loop",mk:"claude",role:"Visual Regression Testing",type:"command",icon:"\u{1F4F8}",ac:"#8b5cf6",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Visual regression тесты.\n\nTOOL: Playwright screenshots / Chromatic / Percy / Argos.\nSETUP: reference screenshots per component/page.\nCI: compare screenshots on PR, flag diffs.\nTHRESHOLD: pixel diff threshold (0.1%).\nRESPONSIVE: screenshots для mobile + desktop.\nDARK MODE: screenshots для light + dark.\nSTORYBOOK: Chromatic integration для component stories.\nREVIEW: approve visual changes в dashboard.' + A + '" --completion-promise "DONE"',
   tags:["visual-regression","screenshots","chromatic","percy"],difficulty:"intermediate",output:"Visual regression suite",related:["rl-e2e","rl-storybook"],prereqs:[],v:"11.0"},

  {id:"rl-api-gateway",m:"/ralph-loop",mk:"claude",role:"API Gateway",type:"command",icon:"\u{1F6AA}",ac:"#0891b2",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: API Gateway.\n\nROUTING: path-based routing к microservices.\nAUTH: centralized JWT validation.\nRATE LIMIT: per-user, per-endpoint.\nCACHE: response caching (Redis).\nLOGGING: request/response logging, tracing ID.\nTRANSFORM: header injection, response mapping.\nHEALTH: aggregate health from all services.\nLOAD BALANCE: round-robin / least-connections.\nTOOL: Kong / Nginx / Traefik / custom (Node/Go).' + A + '" --completion-promise "DONE"',
   tags:["api-gateway","routing","microservices","proxy"],difficulty:"advanced",output:"API Gateway",related:["rl-microservice","rl-nginx"],prereqs:[],v:"11.0"},

  {id:"rl-cicd-matrix",m:"/ralph-loop",mk:"claude",role:"CI/CD Advanced",type:"command",icon:"\u{2699}",ac:"#6366f1",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Advanced CI/CD pipeline.\n\nMATRIX: test across Node 20/22, OS ubuntu/macos.\nCACHE: dependency caching, build cache.\nPARALLEL: lint + typecheck + test в parallel jobs.\nDEPLOY: staging on PR merge, production on tag.\nROLLBACK: one-click rollback script.\nSECRETS: rotation schedule, audit log.\nNOTIFY: Slack/TG on deploy success/failure.\nCANARY: 10% traffic -> monitor -> full deploy.\nARTIFACTS: build artifacts, test reports, coverage.' + A + '" --completion-promise "DONE"',
   tags:["ci-cd","advanced","matrix","canary","deploy"],difficulty:"advanced",output:"Advanced CI/CD",related:["rl-ci","rl-deploy"],prereqs:[],v:"11.0"},

  {id:"rl-openapi",m:"/ralph-loop",mk:"claude",role:"OpenAPI Spec",type:"command",icon:"\u{1F4D6}",ac:"#85ea2d",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: OpenAPI спецификация.\n\nGENERATE: из кода (swagger-jsdoc, FastAPI auto, tsoa) или schema-first.\nSPEC: openapi.yaml — paths, schemas, security, examples.\nVALIDATE: swagger-cli validate, spectral lint.\nUI: Swagger UI (/docs), Redoc (/redoc).\nCODEGEN: client SDK generation (openapi-generator).\nMOCK: Prism mock server из spec.\nTEST: contract validation (каждый response matches spec).\nCI: spec validation + breaking change detection в pipeline.' + A + '" --completion-promise "DONE"',
   tags:["openapi","swagger","api-docs","codegen","spec"],difficulty:"intermediate",output:"OpenAPI spec",related:["rl-api-doc","rl-api"],prereqs:[],v:"11.0"},

  {id:"rl-error-tracking",m:"/ralph-loop",mk:"claude",role:"Error Tracking",type:"command",icon:"\u{1F6A8}",ac:"#362d59",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Error tracking (Sentry / Bugsnag).\n\nSETUP: DSN в .env, SDK init в entry point.\nSOURCE MAPS: upload при deploy (sentry-cli / plugin).\nCONTEXT: user info, request data, breadcrumbs.\nALERTS: Slack/email на новые ошибки.\nGROUPING: custom fingerprints для группировки.\nRELEASE: link errors к git commits/releases.\nPERFORMANCE: transaction tracing, slow queries.\nSAMPLING: 100% errors, 10% transactions (production).' + A + '" --completion-promise "DONE"',
   tags:["sentry","error-tracking","bugsnag","monitoring"],difficulty:"beginner",output:"Error tracking",related:["rl-logging","rl-monit"],prereqs:[],v:"11.0"},

  {id:"rl-caching-patterns",m:"/ralph-loop",mk:"claude",role:"Caching Patterns",type:"command",icon:"\u{1F4BE}",ac:"#ea580c",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Паттерны кэширования.\n\nPATTERNS:\n- Cache-Aside: app checks cache, miss -> DB -> set cache\n- Write-Through: write to cache + DB simultaneously\n- Write-Behind: write to cache, async write to DB\n- Read-Through: cache auto-loads from DB on miss\n\nINVALIDATION:\n- TTL: auto-expire after N seconds\n- Event-based: invalidate on write event\n- Tag-based: invalidate by tag group\n\nLEVELS: L1 (in-memory LRU) -> L2 (Redis) -> L3 (CDN).\nKEY DESIGN: prefix:entity:id:field.\nMONITOR: hit rate, miss rate, eviction rate.' + A + '" --completion-promise "DONE"',
   tags:["caching","patterns","redis","invalidation","ttl"],difficulty:"advanced",output:"Caching strategy",related:["rl-cache","rl-redis","rl-perf"],prereqs:[],v:"11.0"},
];

add.forEach(p => { p.compact = p.text.slice(0, 400); });
data.P = [...data.P, ...add];

// Cheat sheets: Go + Rust
data.CHEAT['Go'] = {
  name: 'Go', color: '#00add8',
  cmds: [
    { cmd: 'go mod init module-name', desc: 'Init module' },
    { cmd: 'go run ./cmd/server', desc: 'Run' },
    { cmd: 'go build -o bin/app ./cmd/server', desc: 'Build' },
    { cmd: 'go test ./...', desc: 'Test all' },
    { cmd: 'go test -race -cover ./...', desc: 'Test + race + coverage' },
    { cmd: 'go vet ./...', desc: 'Static analysis' },
    { cmd: 'golangci-lint run', desc: 'Lint' },
    { cmd: 'go mod tidy', desc: 'Clean deps' },
    { cmd: 'go generate ./...', desc: 'Code generation' },
  ]
};

data.CHEAT['Rust'] = {
  name: 'Rust', color: '#dea584',
  cmds: [
    { cmd: 'cargo new project-name', desc: 'New project' },
    { cmd: 'cargo run', desc: 'Build + run' },
    { cmd: 'cargo build --release', desc: 'Release build' },
    { cmd: 'cargo test', desc: 'Run tests' },
    { cmd: 'cargo clippy -- -D warnings', desc: 'Lint strict' },
    { cmd: 'cargo fmt', desc: 'Format' },
    { cmd: 'cargo add serde tokio axum', desc: 'Add deps' },
    { cmd: 'cargo doc --open', desc: 'Generate docs' },
    { cmd: 'cargo audit', desc: 'Security audit' },
  ]
};

// Final combo
data.COMBOS.ru.push(
  { name:"Resilient Backend", agents:["rl-retry","rl-queue-pattern","rl-error-tracking","rl-monit","rl-caching-patterns"], ids:["rl-retry","rl-queue-pattern","rl-error-tracking","rl-monit","rl-caching-patterns"], desc:"Retry + очереди + error tracking + мониторинг + кэш" },
);
data.COMBOS.en.push(
  { name:"Resilient Backend", agents:["rl-retry","rl-queue-pattern","rl-error-tracking","rl-monit","rl-caching-patterns"], ids:["rl-retry","rl-queue-pattern","rl-error-tracking","rl-monit","rl-caching-patterns"], desc:"Retry + queues + error tracking + monitoring + caching" },
);

const json = JSON.stringify(data);
const compressed = deflateSync(json).toString('base64');
const newSrc = src.replace(/const Z = "[^"]+"/, 'const Z = "' + compressed + '"');
fs.writeFileSync('src/App.jsx', newSrc);
console.log('Prompts:', data.P.length);
console.log('Combos:', data.COMBOS.ru.length);
console.log('Cheat sections:', Object.keys(data.CHEAT).length);
console.log('Cheat commands:', Object.values(data.CHEAT).reduce((a,s) => a + s.cmds.length, 0));
console.log('Configs:', data.CONFIGS.length);
