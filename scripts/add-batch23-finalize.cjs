const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0: Разведка. ";
const A = " АНТИ-ЛУП.";

function mk(id, role, icon, ac, time, d, tags, diff) {
  const cmd = id.startsWith("rl-") ? "/ralph-loop" : id.startsWith("fd-") ? "/feature-dev" : id.startsWith("rv-") ? "/review-pr" : id.startsWith("cr-") ? "/code-review" : id.startsWith("sm-") ? "/simplify" : id.startsWith("lp-") ? "/loop" : id.startsWith("cm-") ? "/commit" : "/feature-dev";
  const text = cmd === "/ralph-loop" ? '/ralph-loop "' + E + d + A + '" --completion-promise "DONE"' : cmd === "/loop" ? '/loop 5m "' + d + '"' : d;
  return { id, m: cmd, mk: "claude", role, type: "command", icon, ac, time, text, tags: tags.split(","), difficulty: diff, output: "Result", related: [], prereqs: [], v: "11.2" };
}
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const add = [];

// PAIN POINTS × DOMAIN (25 × 4 = 100)
const PAINS = [
  'Slow Page Load','High Bounce Rate','Low Conversion','Cart Abandonment','Checkout Friction',
  'Search No Results','Form Validation Errors','Login Failures','Password Resets High','Support Ticket Volume',
  'Bug Reports Recurring','Feature Requests Backlog','Churn Rate High','NPS Score Low','Onboarding Drop-off',
  'Feature Adoption Low','Mobile UX Issues','Dark Mode Missing','Accessibility Complaints','GDPR Compliance Gap',
  'Tax Calculation Errors','Currency Display Issues','Email Deliverability Poor','SMS Delivery Failing','Push Notification Opt-out'
];
const PAIN_DOMAINS = ['SaaS','E-commerce','Marketplace','Content Platform'];
for (const p of PAINS) for (const d of PAIN_DOMAINS) {
  add.push(mk(`rl-pain-${slug(p)}-${slug(d)}`, `Fix: ${p} (${d})`, '⚠', '#ef4444', '~1-2h',
    `Диагностируй и исправь "${p}" в ${d}. Метрики, гипотезы, A/B тест.`, `pain,${slug(p)},${slug(d)}`, 'intermediate'));
}

// CODEBASE AUDITS (50)
const AUDITS = [
  'Dead Code Detection','Dependency Audit','Type Coverage Audit','Test Coverage Audit','Mutation Score Audit',
  'Lint Warning Audit','Security Scan SAST','Security Scan DAST','Secret Scan Repo History','License Audit',
  'SBOM Generate','CVE Scan Container','OWASP ZAP Scan','Lighthouse Performance','Web Vitals Baseline',
  'Bundle Size Analysis','Cyclomatic Complexity','Cognitive Complexity','File Size Outliers','Function Length Outliers',
  'Dead Feature Flags','Stale Git Branches','Abandoned Docs','Broken Links Check','API Version Usage',
  'Deprecated API Usage','Unused Exports','Unused Deps','Duplicate Code Blocks','Bus Factor Map',
  'Comment Rot','TODO/FIXME Inventory','Monorepo Dependency Graph','Service Mesh Map','Database Schema Drift',
  'Feature Flag Audit','Environment Parity Check','Secret Rotation Audit','Cert Expiry Audit','DNS Record Audit',
  'IAM Role Audit','Cloud Budget Review','Cost per Service','Error Budget Burn','SLO Compliance',
  'Change Failure Rate','Lead Time Deploy','MTTR Incidents','Deploy Frequency','Availability SLA'
];
for (const a of AUDITS) {
  add.push(mk(`rv-audit-${slug(a)}`, `Audit: ${a}`, '🔍', '#f59e0b', '~1-2h',
    `${a}. Инструменты, выход: отчёт с actionable items.`, `audit,${slug(a)}`, 'intermediate'));
}

// MIGRATION CONCRETE (30)
const MIGR_DETAIL = [
  'Monolith → Microservices Strangle','Microservices → Modular Monolith','Sync → Async Architecture','REST → GraphQL','GraphQL → tRPC',
  'Custom CMS → Headless','Self-hosted → Managed DB','On-prem → AWS Lift-Shift','AWS → Multi-Cloud','Kubernetes → Fargate',
  'EKS → GKE','ECS → EKS','Redis → DragonflyDB','MongoDB → Postgres JSONB','Elasticsearch → Meilisearch',
  'Datadog → Grafana Cloud','New Relic → Datadog','Sentry → Honeybadger','LaunchDarkly → GrowthBook','Custom SSO → WorkOS',
  'Custom Billing → Stripe','In-house Email → Resend','FCM → OneSignal','Twilio → Vonage','Direct DB → Feature Store',
  'Mixpanel → PostHog','GA Universal → GA4','Optimizely → Vercel','Hasura → Custom GraphQL','Apollo → URQL'
];
for (const m of MIGR_DETAIL) {
  add.push(mk(`rl-migr-${slug(m)}`, `Migrate: ${m}`, '⇶', '#10b981', '~3-6h',
    `Поэтапная миграция "${m}". План, strangler pattern, rollback.`, `migration,${slug(m)}`, 'advanced'));
}

// SYSTEM DESIGN QUESTIONS (30)
const SYSTEM_DESIGN = [
  'Design URL Shortener','Design Pastebin','Design Instagram','Design Twitter','Design WhatsApp',
  'Design YouTube','Design Netflix','Design Dropbox','Design Uber','Design DoorDash',
  'Design Airbnb','Design Booking.com','Design Slack','Design Zoom','Design Notion',
  'Design GitHub','Design Stack Overflow','Design Medium','Design Reddit','Design Ticketmaster',
  'Design Parking Lot','Design Elevator','Design Vending Machine','Design Library','Design Chess',
  'Design Key-Value Store','Design Distributed Cache','Design Rate Limiter','Design Unique ID Generator','Design Search Autocomplete'
];
for (const q of SYSTEM_DESIGN) {
  add.push(mk(`rl-sysdes-${slug(q)}`, `System Design: ${q}`, '◈', '#6366f1', '~1-2h',
    `${q}: requirements, estimates, APIs, schema, scaling.`, `system-design,${slug(q)}`, 'advanced'));
}

// INTERVIEW PREP (30)
const INTERVIEW = [
  'Behavioral STAR Answers','Leadership Principles','Conflict Resolution Story','Scope Negotiation','Trade-off Explanation',
  'Whiteboarding Mock','Live Coding Practice','Algorithm Review','Data Structure Review','Complexity Analysis',
  'OOD Design Patterns','Concurrency Basics','OS Fundamentals','Networking Fundamentals','Database Fundamentals',
  'Distributed Systems Q&A','System Design Mock','HLD LLD Walk-through','Object Oriented Design','Design Patterns Refresh',
  'Tech Deep-dive Prep','Projects Story Tell','Failure Story Prep','Proudest Project','Feedback Handling',
  'Mentorship Examples','Mentor Junior Story','Onboard New Hire','Introduce Process Change','Deprecate Feature'
];
for (const t of INTERVIEW) {
  add.push(mk(`rl-interview-${slug(t)}`, `Interview: ${t}`, '◈', '#8b5cf6', '~1h',
    `${t}. Structure, examples, framing.`, `interview,${slug(t)}`, 'intermediate'));
}

// PAIR PROGRAMMING SCENARIOS (20)
const PAIRING = [
  'Driver-Navigator Switch','Ping-Pong TDD','Strong-Style Pairing','Mob Programming 3+','Remote Pair Setup',
  'Pair on Legacy Code','Pair on Bug Investigation','Pair Review Before Merge','Pair on New Feature','Pair on Refactor',
  'Knowledge Transfer Pair','Onboarding Shadow Pair','Cross-functional Pair','Frontend-Backend Pair','QA-Dev Pair',
  'Security-Dev Pair','DevOps-Dev Pair','Designer-Dev Pair','PM-Dev Spike Pair','Architect-Dev Pair'
];
for (const p of PAIRING) {
  add.push(mk(`rl-pair-${slug(p)}`, `Pair: ${p}`, '⧉', '#10b981', '~1-2h',
    `${p}. Protocol, tools (Tuple, VS Code Live Share), outcomes.`, `pairing,${slug(p)}`, 'intermediate'));
}

// SLACK / TEAMS OPERATIONS (20)
const CHAT_OPS = [
  'Slack Slash Command','Slack App Home Tab','Slack Shortcut Global','Slack Modal Interactive','Slack Block Kit',
  'Slack Scheduled Message','Slack Channel Management API','Slack User Groups Sync','Slack Incoming Webhook','Slack Events API Listener',
  'Teams Bot Framework','Teams Adaptive Card','Teams Message Extension','Teams Outgoing Webhook','Teams Graph API',
  'Discord Slash Commands','Discord Interactions','Discord Gateway Intents','Discord Webhook Announce','Discord OAuth'
];
for (const t of CHAT_OPS) {
  add.push(mk(`fd-chatops-${slug(t)}`, `${t}`, '💬', '#4a154b', '~1h',
    `${t}. SDK, events, permissions.`, `chatops,${slug(t)}`, 'intermediate'));
}

// MUSIC/AUDIO PROCESSING (20)
const AUDIO_TASKS = [
  'MP3 Transcoding','WAV to FLAC','Audio Normalization','Silence Trimming','Fade In/Out',
  'Multi-track Mixing','Audio Waveform Visual','Pitch Shift','Tempo Change','Reverse Audio',
  'Noise Reduction','Voice Isolation','Audio Fingerprinting','Music BPM Detection','Key Detection',
  'MIDI Generation','Synthesizer Basics','Web Audio API Node Graph','Spatial Audio','Audio Streaming HLS'
];
for (const t of AUDIO_TASKS) {
  add.push(mk(`fd-audio-${slug(t)}`, `Audio: ${t}`, '♪', '#10b981', '~1h',
    `${t}. ffmpeg/Web Audio API, библиотеки.`, `audio,${slug(t)}`, 'intermediate'));
}

// IMAGE PROCESSING (25)
const IMG_TASKS = [
  'Resize Preserve Aspect','Crop Smart Center','Compress Lossy Lossless','Format Convert AVIF/WebP','Watermark Overlay',
  'Color Adjust HSL','Grayscale Filter','Blur Gaussian','Sharpen Unsharp Mask','Edge Detection Canny',
  'Face Detection OpenCV','Object Detection YOLO','OCR Tesseract','QR Code Generate','QR Code Scan',
  'Barcode Generate','Exif Metadata Strip','GPS Exif Remove','Image Diff Visual','Duplicate Detection',
  'Background Remove','Super Resolution','Image Captioning AI','Style Transfer','Thumbnail Generation'
];
for (const t of IMG_TASKS) {
  add.push(mk(`fd-image-${slug(t)}`, `Image: ${t}`, '◐', '#10b981', '~1h',
    `${t}. Sharp/ImageMagick/OpenCV.`, `image,${slug(t)}`, 'intermediate'));
}

// MONITORING ALERT TEMPLATES (40)
const ALERTS = [
  'High Error Rate API','p95 Latency Spike','Queue Depth Growing','Worker Lag High','DB Connection Pool Exhausted',
  'Memory Usage > 90%','CPU Usage > 85%','Disk Usage > 80%','Inode Exhaustion','Open File Descriptors',
  'SSL Cert Expiring 30d','DNS Record Missing','Endpoint Unreachable','Slow Checkout Flow','Cart Abandonment Spike',
  'Payment Failures Spike','Login Failures Spike','Failed Signup Spike','Email Bounce Rate','Push Notification Failed',
  'Webhook Delivery Failures','Export Job Timeout','Backup Job Failed','Cron Job Missing','Feature Flag Disabled',
  'Deploy Taking Too Long','Deploy Rollback Detected','Canary Unhealthy','Blue-Green Switch Failed','Service Mesh Unhealthy',
  'Cross-Region Lag','Replication Lag','Checkpoint Age','WAL Full','Autovacuum Stalled',
  'Kafka Consumer Lag','Redis Eviction Rate','CDN 5xx Rate','Origin 5xx Rate','Synthetic Check Failed'
];
for (const a of ALERTS) {
  add.push(mk(`rl-alert-${slug(a)}`, `Alert: ${a}`, '🚨', '#dc2626', '~30m',
    `Alert rule "${a}". PromQL/MetricQL, threshold, runbook link, severity.`, `alert,${slug(a)}`, 'intermediate'));
}

// MICROSERVICES PATTERNS (30)
const MSA_PATTERNS = [
  'Service Discovery','Client-side Load Balancing','Server-side Load Balancing','API Gateway','BFF Backend for Frontend',
  'Circuit Breaker','Bulkhead','Timeout','Retry','Fallback',
  'Saga Orchestration','Saga Choreography','Event Sourcing','CQRS','Outbox Pattern',
  'Transactional Outbox','Inbox Pattern','Idempotent Consumer','Transactional Messaging','Two-Phase Commit',
  'Strangler Fig','Branch by Abstraction','Shadow Traffic','Blue-Green','Canary',
  'A/B Testing Traffic Split','Feature Toggle','Dark Launch','Configuration Management','Distributed Tracing'
];
for (const p of MSA_PATTERNS) {
  add.push(mk(`rl-msa-${slug(p)}`, `MSA: ${p}`, '⧈', '#6366f1', '~1h',
    `${p}. Реализация, tools, trade-offs.`, `microservices,${slug(p)}`, 'advanced'));
}

// DISTRIBUTED SYSTEMS PROBLEMS (25)
const DIST_PROBS = [
  'Byzantine Fault Tolerance','Two Generals Problem','Fischer-Lynch-Paterson','Split Brain Prevention','Quorum Reads/Writes',
  'Eventual Consistency','Strong Consistency','Causal Consistency','Read-Your-Writes','Monotonic Reads',
  'Write Conflict Resolution','Last-Writer-Wins','Conflict-Free Replicated','Vector Clocks','Hybrid Logical Clock',
  'Leader Election Raft','Paxos Protocol','Viewstamped Replication','Zab (ZooKeeper)','Raft Log Replication',
  'Distributed Transactions 2PC','Distributed Transactions 3PC','Percolator Snapshot','Spanner TrueTime','CockroachDB MVCC'
];
for (const p of DIST_PROBS) {
  add.push(mk(`rl-dist-${slug(p)}`, `Dist: ${p}`, '⧈', '#6366f1', '~1-2h',
    `${p}. Explain, use case, example system.`, `distributed,${slug(p)}`, 'advanced'));
}

// BUILD OPTIMIZATIONS (20)
const BUILD_OPT = [
  'Incremental TypeScript Build','Vite Deps Pre-bundling','Webpack DLL Plugin','Rollup Cache','esbuild Watch Mode',
  'Bazel Rules Node','Turbo Remote Cache','Nx Affected Graph','Rush Selective Build','pnpm Filter Workspaces',
  'CI Parallel Jobs Matrix','CI Artifact Caching','Docker Layer Reuse','Build Image Distroless','Multi-Stage Docker',
  'Precompiled Dependencies','GitHub Actions Cache','CircleCI Parallelism','Go Module Cache','Maven Local Cache'
];
for (const t of BUILD_OPT) {
  add.push(mk(`rl-build-${slug(t)}`, `Build: ${t}`, '⎔', '#10b981', '~45m',
    `${t}. Конфиг, замеры, gain.`, `build,optimization,${slug(t)}`, 'intermediate'));
}

// FEATURE SPECS (30)
const FEAT_SPECS = [
  'User Profile Page','Settings + Preferences','Notification Settings','API Tokens Page','Team Members',
  'Billing History','Subscription Plan Change','Invoice Download PDF','Receipt Email','Invite Teammate',
  'Accept Invite Flow','Forgot Password','Reset Password','Change Email Verify','Delete Account GDPR',
  'Export My Data','Import From CSV','Bulk Actions Table','Saved Filters','Custom Dashboards',
  'Shareable Links','Embeddable Widgets','Public Profile','Private Portfolio','Status Page Custom',
  'Feedback Widget','Bug Report Form','Feature Request Submit','Changelog Page','Roadmap Page'
];
for (const f of FEAT_SPECS) {
  add.push(mk(`fd-feat-${slug(f)}`, `${f}`, '◈', '#10b981', '~1-2h',
    `${f}. Flow, validation, edge cases, a11y, тесты.`, `feature,${slug(f)}`, 'intermediate'));
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
