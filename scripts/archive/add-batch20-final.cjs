const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 РАЗВЕДКА: Прочитай структуру, конфиги, зависимости, тесты. ";
const A = " АНТИ-ЛУП: 3 ошибки \u2014 смена подхода.";

function mk(id, role, icon, ac, time, taskDesc, tags, difficulty) {
  const cmd = id.startsWith("rl-") ? "/ralph-loop" : id.startsWith("fd-") ? "/feature-dev" : id.startsWith("rv-") ? "/review-pr" : id.startsWith("cr-") ? "/code-review" : id.startsWith("sm-") ? "/simplify" : id.startsWith("lp-") ? "/loop" : id.startsWith("cm-") ? "/commit" : "/feature-dev";
  const text = cmd === "/ralph-loop" ? '/ralph-loop "' + E + 'ЗАДАЧА: ' + taskDesc + A + '" --completion-promise "DONE"' : cmd === "/loop" ? '/loop 5m "' + taskDesc + '"' : taskDesc;
  return { id, m: cmd, mk: "claude", role, type: "command", icon, ac, time, text, tags: tags.split(","), difficulty, output: "Result", related: [], prereqs: [], v: "11.2" };
}
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const add = [];

// ORMs × OPERATIONS (12 × 8 = 96)
const ORMS = [
  'Prisma','Drizzle','TypeORM','Sequelize','MikroORM','Kysely','Knex','Objection',
  'SQLAlchemy','Django ORM','Tortoise ORM','ActiveRecord'
];
const ORM_OPS = ['Schema Define','Relations One-to-Many','Relations Many-to-Many','Transactions','Batch Upsert','Complex Aggregation','N+1 Prevention','Raw SQL Escape Hatch'];
for (const orm of ORMS) for (const op of ORM_OPS) {
  add.push(mk(`rl-orm-${slug(orm)}-${slug(op)}`, `${orm}: ${op}`, '◈', '#336791', '~45m',
    `${op} в ${orm}. Типы, примеры, pitfalls.`, `orm,${slug(orm)},${slug(op)}`, 'intermediate'));
}

// HTTP PROTOCOL / STANDARDS (30 curated)
const HTTP_TOPICS = [
  'HTTP/2 Server Push','HTTP/3 QUIC Setup','Keep-Alive Tuning','Connection Reuse Pool','mTLS Handshake',
  'Content Negotiation','HTTP Range Requests','ETag/Last-Modified','Cache-Control Directives','Expires vs max-age',
  'Set-Cookie Attributes','SameSite Policies','Clear-Site-Data','Reporting-Endpoints','NEL Network Error Logging',
  'Expect: 100-continue','HTTP Trailers','Brotli Compression','Gzip Compression','WebSocket Upgrade',
  'Server-Timing Header','Early Hints 103','Priority Hints','Fetch Metadata','Origin vs Referer',
  'CORS Preflight Deep','Cross-Origin-Opener','Cross-Origin-Embedder','Cross-Origin-Resource-Policy','Timing-Allow-Origin'
];
for (const t of HTTP_TOPICS) {
  add.push(mk(`rl-http-proto-${slug(t)}`, `HTTP: ${t}`, '⇄', '#10b981', '~45m',
    `${t}. RFC ссылки, практический пример, тесты.`, `http,protocol,${slug(t)}`, 'advanced'));
}

// DNS / NETWORKING (25)
const DNS_TOPICS = [
  'DNS Records: A/AAAA/CNAME','MX Records for Email','TXT Records for SPF/DKIM/DMARC','CAA Record for SSL','SRV Records',
  'ALIAS/ANAME Records','DNSSEC Setup','DNS over HTTPS (DoH)','DNS over TLS (DoT)','GeoDNS Routing',
  'Split-Horizon DNS','DNS Propagation Check','Anycast DNS','Round-Robin DNS','Health Check Failover',
  'CNAME Flattening','Wildcard Records','Dynamic DNS Updates','Zone Transfer AXFR','Nameserver Redundancy',
  'Record TTL Strategy','Apex Domain CNAME Trick','Subdomain Delegation','Email Preservation on Migration','DMARC Reports'
];
for (const t of DNS_TOPICS) {
  add.push(mk(`rl-dns-${slug(t)}`, `DNS: ${t}`, '⎔', '#0089d6', '~30m',
    `${t}. Настройка, verify tools (dig/nslookup), troubleshoot.`, `dns,networking,${slug(t)}`, 'intermediate'));
}

// OS / LINUX ADMIN (35)
const LINUX_OPS = [
  'systemd Service Unit','systemd Timer','systemd Socket Activation','systemd-networkd','systemd-resolved',
  'Cron vs systemd Timer','journalctl Query','logrotate Config','iptables Rules','nftables Modernize',
  'firewalld Zones','SELinux Policies','AppArmor Profiles','ulimit + Systemd Limits','sysctl Kernel Tuning',
  'OOM Killer Tuning','Cgroups v2','Docker vs podman','Rootless Containers','User Namespaces',
  'Linux Capabilities','strace Debugging','ltrace Library Calls','ss Socket Statistics','tcpdump Capture',
  'iotop Disk I/O','perf top Profiling','flamegraph.pl Generation','Bottlerocket Container OS','Flatcar Linux Setup',
  'NixOS Config','Arch Linux Install','Ubuntu Server LTS','Debian Stable','RHEL/Rocky/Alma'
];
for (const op of LINUX_OPS) {
  add.push(mk(`rl-linux-${slug(op)}`, `Linux: ${op}`, '🐧', '#fcc624', '~45m',
    `${op}. Команды, конфиг, troubleshoot.`, `linux,sysadmin,${slug(op)}`, 'intermediate'));
}

// SHELL / BASH / POWERSHELL (30)
const SHELL_TASKS = [
  'Bash Strict Mode set -euo pipefail','Bash Traps SIGINT Cleanup','Bash Arrays Operations','Bash Associative Array','Bash String Manipulation',
  'Bash Globbing Advanced','Bash Process Substitution','Bash Named Pipes FIFO','Bash Getopts Args','Bash Heredocs',
  'Shellcheck Linting','Bash Unit Test bats','Bash Logger Function','Bash Parallel xargs','Bash Parallel GNU parallel',
  'Zsh vs Bash vs Fish','Fish Shell Scripting','Nushell Data Pipelines','PowerShell Cmdlets','PowerShell Pipeline',
  'PowerShell Remoting','PowerShell DSC','PowerShell Modules','PowerShell Jobs Async','PowerShell Error Handling',
  'Shell Script Self-Update','Shell Script Daemonize','Shell Script Locking flock','Shell Script JSON jq','Shell Script YAML yq'
];
for (const task of SHELL_TASKS) {
  add.push(mk(`rl-shell-${slug(task)}`, `Shell: ${task}`, '⌨', '#4eaa25', '~30m',
    `${task}. Примеры, safety, portability.`, `shell,bash,${slug(task)}`, 'intermediate'));
}

// REGEX PATTERNS (25)
const REGEX_TASKS = [
  'Email Validation','URL Validation','Phone E.164 Format','IPv4 Validation','IPv6 Validation',
  'UUID v4 Validation','Credit Card Luhn','Social Security Number','Date ISO 8601','Time 24-Hour',
  'Password Strength Check','Hex Color Code','File Extension Extract','Domain Extract from URL','Path Traversal Detect',
  'SQL Injection Detect','XSS Tag Strip','Markdown Link Extract','Hashtag Extract','Mention @user Extract',
  'Unicode Emoji Match','Right-to-Left Text','Multiline Capture Groups','Lookbehind/Lookahead','Named Capture Groups'
];
for (const task of REGEX_TASKS) {
  add.push(mk(`rl-regex-${slug(task)}`, `Regex: ${task}`, '⎔', '#10b981', '~20m',
    `${task}. Regex pattern, edge cases, тесты, performance.`, `regex,${slug(task)}`, 'intermediate'));
}

// DATA FORMATS × TASK (8 × 6 = 48)
const DATA_FMT = ['JSON','YAML','TOML','XML','Protobuf','Avro','MessagePack','Parquet'];
const FMT_TASKS = ['Schema Definition','Serialize/Deserialize','Streaming Parse','Validation','Binary vs Text Choice','Schema Evolution'];
for (const fmt of DATA_FMT) for (const task of FMT_TASKS) {
  add.push(mk(`rl-fmt-${slug(fmt)}-${slug(task)}`, `${fmt}: ${task}`, '◈', '#10b981', '~30m',
    `${task} для ${fmt}. Библиотеки, performance, compat.`, `data-format,${slug(fmt)},${slug(task)}`, 'intermediate'));
}

// FRONTEND DEEP: REACT HOOKS × USE CASE (15 hooks × 3 = 45)
const HOOKS = [
  'useState','useEffect','useRef','useMemo','useCallback','useContext','useReducer','useLayoutEffect',
  'useImperativeHandle','useTransition','useDeferredValue','useId','useSyncExternalStore','useOptimistic','useActionState'
];
const HOOK_TASKS = ['Practical Example','Performance Pitfall','Custom Hook Extract'];
for (const h of HOOKS) for (const t of HOOK_TASKS) {
  add.push(mk(`rl-rh-${slug(h)}-${slug(t)}`, `React ${h}: ${t}`, '⎈', '#61dafb', '~30m',
    `${h} hook — ${t}. Код, когда использовать, когда НЕ использовать.`, `react,hooks,${slug(h)}`, 'intermediate'));
}

// VUE 3 COMPOSITION × TASK (12 × 3 = 36)
const VUE_COMP = ['ref','reactive','computed','watch','watchEffect','defineProps','defineEmits','defineExpose','provide','inject','onMounted','onUnmounted'];
const VUE_TASKS = ['Example','Composable Extract','Gotcha'];
for (const c of VUE_COMP) for (const t of VUE_TASKS) {
  add.push(mk(`rl-vue-${slug(c)}-${slug(t)}`, `Vue ${c}: ${t}`, '✺', '#42b883', '~30m',
    `${c} — ${t}. Composition API patterns.`, `vue,composition,${slug(c)}`, 'intermediate'));
}

// CSS PROPERTIES DEEP × USE CASE (25 × 2 = 50)
const CSS_PROPS = [
  'display: grid','display: flex','container queries','subgrid','scroll-snap',
  'position: sticky','aspect-ratio','gap property','clamp() fluid','min() max()',
  'has() selector',':where() :is()','accent-color','color-scheme','color-mix()',
  'backdrop-filter','mask-image','clip-path','shape-outside','object-fit',
  'scroll-timeline','view-timeline','@scope','@layer cascade','@property register'
];
const CSS_USES = ['Practical Example','Browser Support Fallback'];
for (const p of CSS_PROPS) for (const u of CSS_USES) {
  add.push(mk(`rl-css-${slug(p)}-${slug(u)}`, `CSS ${p}: ${u}`, '◈', '#264de4', '~20m',
    `${p} — ${u}. Примеры, caveat'ы, progressive enhancement.`, `css,${slug(p)},${slug(u)}`, 'intermediate'));
}

// WEB APIs BROWSER (30 curated)
const WEB_APIS = [
  'Fetch API','Streams API','FormData API','File API','Blob API',
  'Clipboard API','Share API (Web Share)','Geolocation','Notification API','Service Worker',
  'IndexedDB','Web Storage','BroadcastChannel','Web Workers','SharedArrayBuffer',
  'WebSocket Native','Web RTC','Web Bluetooth','Web USB','Web NFC',
  'Screen Wake Lock','Payment Request API','Web Speech API','Web Audio API','Media Capture',
  'Web Locks API','Speech Synthesis','Web Authentication API','Performance Observer','Intersection Observer'
];
for (const api of WEB_APIS) {
  add.push(mk(`rl-webapi-${slug(api)}`, `Web API: ${api}`, '⊕', '#4285f4', '~45m',
    `${api}. Use case, browser support, polyfill, пример.`, `web-api,${slug(api)}`, 'intermediate'));
}

// PERFORMANCE DEEP TOPICS (40)
const PERF_TOPICS = [
  'React Render Optimization','Virtual List Windowing','Image Lazy Loading','Font Loading Strategy','Preload vs Prefetch',
  'Critical Path CSS Extract','Server Timing Header','Client-side Hydration Cost','Server Component Streaming','Partial Pre-Rendering',
  'Bundle Splitting Strategy','Dynamic Import Chunks','Tree Shaking Library','Dead Code Elimination','Minification Pitfalls',
  'CDN Cache Headers','Service Worker Cache','Stale-While-Revalidate','ETag vs Last-Modified','Immutable Cache',
  'HTTP/2 Multiplexing','HTTP/3 0-RTT','QUIC Migration','TCP Fast Open','TLS 1.3 0-RTT',
  'Brotli over Gzip','AVIF Image Format','Web Fonts FOIT/FOUT','Resource Hints','Priority Hints',
  'Largest Contentful Paint','First Contentful Paint','Interaction to Next Paint','Cumulative Layout Shift','Time to First Byte',
  'Memory Profiling Heap','CPU Profiling Flamegraph','Long Tasks > 50ms','Event Loop Blocking','Async Task Scheduling'
];
for (const t of PERF_TOPICS) {
  add.push(mk(`rl-perf-topic-${slug(t)}`, `Perf: ${t}`, '⚡', '#ef4444', '~1h',
    `${t}. Измерение, оптимизация, мониторинг.`, `performance,${slug(t)}`, 'intermediate'));
}

// ACCESSIBILITY TOPICS DEEP (30)
const A11Y_TOPICS = [
  'ARIA role=button vs <button>','ARIA live region priorities','Focus management after modal close','Skip link hidden until focus','Heading hierarchy check',
  'Landmark roles audit','Alt text for decorative images','Color contrast AA vs AAA','Reduced motion respect','Font size rem scaling',
  'Keyboard trap detect','Tab order linearity','Screen reader table headers','Form field error announcement','Required fields aria-required',
  'Custom checkbox accessible','Custom radio group','Date picker keyboard','Combobox aria pattern','Dialog modal trap',
  'Tooltip vs aria-describedby','Tab panel roving tabindex','Accordion aria-expanded','Menu button pattern','Tree view nodes',
  'Grid cell navigation','Accessible rich text editor','Accessible drag-drop','Skip-to-content link','Mobile VoiceOver testing'
];
for (const t of A11Y_TOPICS) {
  add.push(mk(`rl-a11y-topic-${slug(t)}`, `A11y: ${t}`, '♿', '#2563eb', '~45m',
    `${t}. WCAG criteria, примеры, тесты axe.`, `a11y,${slug(t)}`, 'intermediate'));
}

// INTERNATIONALIZATION (25)
const I18N_TOPICS = [
  'ICU Plural Select','Gender-Aware Messages','Date formatting by locale','Number format by locale','Currency display',
  'Right-to-Left bidirectional','Character encoding UTF-8','Unicode normalization NFC','Sort collation locale','Timezone handling',
  'Translation extraction script','Pseudo-localization','Translator context provide','Fallback locale chain','Locale switching UX',
  'Browser language detect','Geolocation + locale','URL locale path /en /ru','Subdomain locale ru.site','Hreflang SEO tags',
  'Text expansion 30%','Image of text avoidance','Font for multiple scripts','Pluralization gotchas','Translation memory'
];
for (const t of I18N_TOPICS) {
  add.push(mk(`rl-i18n-topic-${slug(t)}`, `i18n: ${t}`, '⌘', '#8b5cf6', '~45m',
    `${t}. Библиотеки, best practices, тесты.`, `i18n,${slug(t)}`, 'intermediate'));
}

// SECURITY DEEP (40)
const SEC_DEEP = [
  'JWT signing algorithm none vuln','JWT algorithm confusion RS256→HS256','JWT kid injection','OAuth state parameter','OIDC nonce parameter',
  'PKCE code challenge','Refresh token rotation detection','Session fixation prevention','Session hijacking cookie flags','CSRF token per session',
  'SameSite cookie Lax vs Strict','HttpOnly prevent JS access','Secure flag HTTPS only','Cookie __Host- prefix','Cookie prefix __Secure-',
  'CSP script-src nonce','CSP unsafe-eval remove','CSP report-only rollout','CSP Trusted Types','Subresource Integrity SRI',
  'HSTS Preload submit','X-Frame-Options DENY','Referrer-Policy strict','Permissions-Policy fine','X-Content-Type-Options nosniff',
  'CORS credentials pitfall','Origin header validation','Path traversal ../ prevention','SQL parameterized queries','NoSQL injection Mongo',
  'Command injection prevention','SSRF URL whitelist','XXE XML external entity','ReDoS catastrophic backtracking','Prototype pollution JS',
  'Deserialization vulnerability','LDAP injection','LDAPS TLS enforce','XML signature wrapping','SAML assertion forging'
];
for (const t of SEC_DEEP) {
  add.push(mk(`rl-sec-deep-${slug(t)}`, `Sec: ${t}`, '⚠', '#dc2626', '~45m',
    `${t}. Detection, exploit пример, fix, тесты.`, `security,${slug(t)}`, 'advanced'));
}

// COMPILER / LANGUAGE TOOLING (25)
const COMP_TOPICS = [
  'SWC Config','Babel Preset Build','TypeScript tsconfig Strict','esbuild Plugin Custom','Rollup Config Lib',
  'Vite Plugin Write','Webpack 5 Module Federation','Rspack Migration','Turbopack Custom Loader','Bun Build',
  'LLVM IR Basics','WASM Compile Target','Parser Combinators','AST Walker Transform','Code Generation Template',
  'Source Map Generation','Incremental Compilation','Watch Mode Efficient','Hot Module Replacement','Fast Refresh React',
  'Type Checker Incremental','Linter Rule Custom','Formatter Integration','Monorepo Bundler','Bundle Analyzer Visual'
];
for (const t of COMP_TOPICS) {
  add.push(mk(`rl-comp-${slug(t)}`, `Compiler: ${t}`, '⚙', '#000000', '~1h',
    `${t}. Настройка, troubleshoot.`, `compiler,tooling,${slug(t)}`, 'advanced'));
}

// EDITOR / IDE CONFIG (20)
const EDITOR_TOPICS = [
  'VSCode Settings Sync','VSCode Extensions Essential','VSCode Launch.json Debug','VSCode Tasks.json','VSCode Keybindings Custom',
  'Cursor AI Config','Zed Setup','Neovim Init.lua','Neovim LSP Setup','Vim Keybindings Power User',
  'Emacs Doom Config','IntelliJ Live Templates','IntelliJ Code Inspections','Sublime Text Build System','JetBrains AI Assistant',
  'GitHub Copilot Setup','Codeium Setup','Continue.dev Setup','Claude Code Setup','AI Rules File'
];
for (const t of EDITOR_TOPICS) {
  add.push(mk(`rl-editor-${slug(t)}`, `Editor: ${t}`, '⌨', '#007acc', '~30m',
    `${t}. Конфиг, productivity tips.`, `editor,ide,${slug(t)}`, 'beginner'));
}

// NOTIFICATION SERVICES × FRAMEWORK (6 × 8 = 48)
const NOTIF_SVC = ['Knock','Courier','Novu','OneSignal','Customer.io','SendBird'];
const NOTIF_FW = ['React','Vue','Angular','Next.js','Express','FastAPI','Django','Rails'];
for (const svc of NOTIF_SVC) for (const fw of NOTIF_FW) {
  add.push(mk(`rl-notif-${slug(svc)}-${slug(fw)}`, `${svc} в ${fw}`, '🔔', '#f59e0b', '~1h',
    `${svc} интеграция с ${fw}. Channels (push/email/SMS/in-app), preferences.`,
    `notifications,${slug(svc)},${slug(fw)}`, 'intermediate'));
}

// FILE STORAGE SERVICES × OP (6 × 5 = 30)
const FILE_STORE = ['AWS S3','Cloudflare R2','Backblaze B2','Wasabi','MinIO','Supabase Storage'];
const STORE_OPS = ['Upload Flow','Presigned URL','Public CDN','Image Resize','Virus Scan'];
for (const st of FILE_STORE) for (const op of STORE_OPS) {
  add.push(mk(`rl-store-${slug(st)}-${slug(op)}`, `${st}: ${op}`, '◈', '#10b981', '~45m',
    `${op} в ${st}. SDK, security, стоимость.`, `storage,${slug(st)},${slug(op)}`, 'intermediate'));
}

// VIDEO STREAMING × OP (5 × 5 = 25)
const VIDEO_SVC = ['Mux','Cloudflare Stream','Bunny.net','Vimeo','AWS MediaConvert'];
const VIDEO_OPS = ['Upload Pipeline','HLS Delivery','DRM Encryption','Thumbnail Gen','Analytics Views'];
for (const svc of VIDEO_SVC) for (const op of VIDEO_OPS) {
  add.push(mk(`rl-video-${slug(svc)}-${slug(op)}`, `${svc}: ${op}`, '📹', '#ef4444', '~1h',
    `${op} в ${svc}. Integration, webhooks, cost.`, `video,${slug(svc)},${slug(op)}`, 'intermediate'));
}

// SERVERLESS FRAMEWORKS × OP (6 × 5 = 30)
const SERVERLESS = ['Serverless Framework','SST','AWS SAM','Architect','OpenNext','SST Ion'];
const SRV_OPS = ['Lambda Deploy','API Gateway','Scheduled Trigger','SNS+SQS Integration','Local Dev'];
for (const f of SERVERLESS) for (const op of SRV_OPS) {
  add.push(mk(`rl-srv-${slug(f)}-${slug(op)}`, `${f}: ${op}`, '⚡', '#f59e0b', '~1h',
    `${op} в ${f}. IaC, deploy, monitoring.`, `serverless,${slug(f)},${slug(op)}`, 'intermediate'));
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
