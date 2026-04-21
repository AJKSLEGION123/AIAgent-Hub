const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "Разведка: ";
const A = " АНТИ-ЛУП.";

function mk(id, role, icon, ac, time, d, tags, diff) {
  const cmd = id.startsWith("rl-") ? "/ralph-loop" : id.startsWith("fd-") ? "/feature-dev" : id.startsWith("rv-") ? "/review-pr" : id.startsWith("cr-") ? "/code-review" : id.startsWith("sm-") ? "/simplify" : id.startsWith("lp-") ? "/loop" : id.startsWith("cm-") ? "/commit" : "/feature-dev";
  const text = cmd === "/ralph-loop" ? '/ralph-loop "' + E + d + A + '" --completion-promise "DONE"' : cmd === "/loop" ? '/loop 5m "' + d + '"' : d;
  return { id, m: cmd, mk: "claude", role, type: "command", icon, ac, time, text, tags: tags.split(","), difficulty: diff, output: "Result", related: [], prereqs: [], v: "11.2" };
}
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const add = [];

// REACT LIBRARIES × FEATURE (20 libs × 6 features = 120)
const RE_LIBS = [
  'React Query','SWR','TanStack Query','Apollo Client','URQL','Relay','TanStack Router','React Router',
  'Zustand','Jotai','Recoil','Redux Toolkit','MobX','Valtio','React Hook Form','Formik',
  'shadcn/ui','Radix UI','Mantine','Chakra UI'
];
const RE_FEATS = ['Setup + Provider','Mutation Handling','Optimistic Updates','Error States','Loading Skeleton','Testing Mock'];
for (const lib of RE_LIBS) for (const f of RE_FEATS) {
  add.push(mk(`rl-relib-${slug(lib)}-${slug(f)}`, `${lib}: ${f}`, '⎈', '#61dafb', '~45m',
    `${f} в ${lib}. Примеры, patterns.`, `react,${slug(lib)},${slug(f)}`, 'intermediate'));
}

// VUE LIBRARIES × FEATURE (10 × 5 = 50)
const VUE_LIBS = ['Pinia','VueUse','Vue Query','Vue Router','Nuxt Modules','VueDraggable','Vue I18n','Vee-Validate','FormKit','PrimeVue'];
const VUE_FEATS = ['Setup','Use Cases','Testing','Common Pitfalls','Advanced Config'];
for (const lib of VUE_LIBS) for (const f of VUE_FEATS) {
  add.push(mk(`rl-vuelib-${slug(lib)}-${slug(f)}`, `${lib}: ${f}`, '✺', '#42b883', '~45m',
    `${f} в ${lib}.`, `vue,${slug(lib)},${slug(f)}`, 'intermediate'));
}

// NODE LIBRARIES × FEATURE (15 × 4 = 60)
const NODE_LIBS = [
  'Fastify','Express','Hono','Koa','NestJS',
  'TypeORM','Prisma','Drizzle','Kysely','Sequelize',
  'BullMQ','Bee-Queue','pg','ioredis','mongoose'
];
const NODE_FEATS = ['Production Setup','Error Handling','Testing','Performance Tuning'];
for (const lib of NODE_LIBS) for (const f of NODE_FEATS) {
  add.push(mk(`rl-nodelib-${slug(lib)}-${slug(f)}`, `Node ${lib}: ${f}`, '⎈', '#339933', '~45m',
    `${f} в ${lib} на Node.js.`, `node,${slug(lib)},${slug(f)}`, 'intermediate'));
}

// PYTHON LIBRARIES × FEATURE (15 × 4 = 60)
const PY_LIBS = [
  'FastAPI','Django','Flask','Starlette','Litestar',
  'SQLAlchemy','Tortoise ORM','Peewee','MongoEngine','PyMongo',
  'Celery','RQ','Dramatiq','Huey','APScheduler'
];
for (const lib of PY_LIBS) for (const f of NODE_FEATS) {
  add.push(mk(`rl-pylib-${slug(lib)}-${slug(f)}`, `Py ${lib}: ${f}`, '🐍', '#3776ab', '~45m',
    `${f} в ${lib}.`, `python,${slug(lib)},${slug(f)}`, 'intermediate'));
}

// LLM PROVIDERS × CAPABILITY (10 × 6 = 60)
const LLM_PROV = ['OpenAI','Anthropic','Google AI','Mistral','Cohere','Together','Replicate','Groq','Fireworks','OpenRouter'];
const LLM_CAPS = ['Chat Completion','Embeddings','Vision','Tool Use','Structured Output','Streaming'];
for (const p of LLM_PROV) for (const c of LLM_CAPS) {
  add.push(mk(`rl-llmp-${slug(p)}-${slug(c)}`, `${p}: ${c}`, '◈', '#8b5cf6', '~45m',
    `${c} через ${p} API. SDK, стоимость, latency.`, `llm,${slug(p)},${slug(c)}`, 'intermediate'));
}

// VECTOR DBS × OP (8 × 5 = 40)
const VEC_DBS = ['Pinecone','Weaviate','Qdrant','Milvus','Chroma','LanceDB','Supabase pgvector','Upstash Vector'];
const VEC_OPS = ['Index Setup','Upsert Batch','Semantic Search','Hybrid Search','Metadata Filter'];
for (const db of VEC_DBS) for (const op of VEC_OPS) {
  add.push(mk(`rl-vec-${slug(db)}-${slug(op)}`, `${db}: ${op}`, '◈', '#8b5cf6', '~45m',
    `${op} в ${db}. SDK, performance.`, `vector-db,${slug(db)},${slug(op)}`, 'intermediate'));
}

// PACKAGE MANAGERS × OP (8 × 5 = 40)
const PKG_MGR = ['npm','pnpm','yarn','bun','pip','uv','poetry','conda'];
const PKG_OPS_ = ['Install Workspace','Upgrade Deps','Security Audit','Lockfile Merge','Private Registry'];
for (const pm of PKG_MGR) for (const op of PKG_OPS_) {
  add.push(mk(`rl-pkgm-${slug(pm)}-${slug(op)}`, `${pm}: ${op}`, '◈', '#cb3837', '~30m',
    `${op} в ${pm}. Best practices.`, `package-manager,${slug(pm)},${slug(op)}`, 'beginner'));
}

// TERRAFORM PROVIDERS × ACTION (15 × 3 = 45)
const TF_PROV = [
  'aws','google','azurerm','kubernetes','helm','cloudflare','datadog','github','gitlab','auth0',
  'vault','consul','nomad','okta','snowflake'
];
const TF_ACTIONS = ['Module Setup','State Management','Drift Detection'];
for (const p of TF_PROV) for (const a of TF_ACTIONS) {
  add.push(mk(`rl-tfp-${slug(p)}-${slug(a)}`, `Terraform ${p}: ${a}`, '⎈', '#7b42bc', '~45m',
    `${a} для Terraform provider ${p}. Best practices.`, `terraform,${slug(p)},${slug(a)}`, 'intermediate'));
}

// SERVICE × SLA SCENARIO (15 × 3 = 45)
const SLA_SVC = [
  'API Gateway','Auth Service','Payment Service','Search Service','Recommendation Service',
  'Notification Service','Webhook Dispatcher','Report Generator','Scheduled Jobs','Analytics Pipeline',
  'Realtime Chat','Video Stream','Audio Stream','File Storage','Email Sender'
];
const SLA_SC = ['SLO Definition','Incident Response','Capacity Plan'];
for (const s of SLA_SVC) for (const sc of SLA_SC) {
  add.push(mk(`rl-sla-${slug(s)}-${slug(sc)}`, `${s}: ${sc}`, '◈', '#ef4444', '~1h',
    `${sc} для ${s}. Metrics, targets, runbook.`, `sla,${slug(s)},${slug(sc)}`, 'advanced'));
}

// API ENDPOINT × AUTH STYLE (15 × 4 = 60)
const API_ENDPOINTS = [
  'User Registration','User Login','Password Reset','Email Verify','Token Refresh',
  'OAuth Callback','2FA Enable','2FA Verify','Session List','Session Revoke',
  'API Key Generate','API Key Revoke','Webhook Register','Webhook Test','User Delete'
];
const AUTH_STYLES = ['JWT Bearer','Session Cookie','OAuth2','API Key'];
for (const e of API_ENDPOINTS) for (const a of AUTH_STYLES) {
  add.push(mk(`fd-apiend-${slug(e)}-${slug(a)}`, `${e} via ${a}`, '⎘', '#10b981', '~45m',
    `Endpoint "${e}" с auth "${a}". Валидация, тесты, security.`,
    `api-endpoint,${slug(e)},${slug(a)}`, 'intermediate'));
}

// GRAPHQL SCHEMAS × FEATURE (10 × 5 = 50)
const GQL_SCHEMAS = [
  'User Account','E-commerce Product','Social Post','Chat Message','Blog Article',
  'Task/Project','Event/Calendar','Media Library','Payment Invoice','Analytics Report'
];
const GQL_FEATS = ['CRUD Schema','Relay Pagination','Subscriptions','Authorization','Performance Cache'];
for (const s of GQL_SCHEMAS) for (const f of GQL_FEATS) {
  add.push(mk(`fd-gql-${slug(s)}-${slug(f)}`, `GQL ${s}: ${f}`, '◊', '#e535ab', '~1h',
    `${f} для GraphQL "${s}" schema. Resolvers, dataloader.`,
    `graphql,${slug(s)},${slug(f)}`, 'intermediate'));
}

// CLI TOOLS × OP (10 × 4 = 40)
const CLI_TOOLS = [
  'commander.js','yargs','oclif','clap (Rust)','cobra (Go)',
  'click (Py)','typer (Py)','cliffy (Deno)','bubbletea (Go)','ink (Node React)'
];
const CLI_OPS = ['Basic Setup','Subcommands','Interactive Prompts','Output Formatting'];
for (const t of CLI_TOOLS) for (const op of CLI_OPS) {
  add.push(mk(`rl-cli-${slug(t)}-${slug(op)}`, `CLI ${t}: ${op}`, '⌨', '#10b981', '~45m',
    `${op} через ${t}. Примеры, UX.`, `cli,${slug(t)},${slug(op)}`, 'intermediate'));
}

// DEPLOYMENT TARGETS × STACK (10 × 4 = 40)
const DEPLOY_TARGETS = [
  'Vercel','Netlify','Cloudflare Pages','Fly.io','Railway',
  'Render','Heroku','AWS Amplify','DigitalOcean App Platform','GCP Cloud Run'
];
const DEPLOY_STACKS = ['Next.js','Python FastAPI','Go','Node Express'];
for (const t of DEPLOY_TARGETS) for (const s of DEPLOY_STACKS) {
  add.push(mk(`rl-deploy-${slug(t)}-${slug(s)}`, `Deploy ${s} → ${t}`, '☁', '#10b981', '~45m',
    `Deploy ${s} приложения на ${t}. Env vars, custom domain, CI/CD.`,
    `deploy,${slug(t)},${slug(s)}`, 'intermediate'));
}

// DATA STRUCTURES × LANG (20 × 4 = 80)
const DS = [
  'Array Operations','Linked List','Doubly Linked List','Stack','Queue',
  'Deque','Priority Queue','Heap (Min/Max)','Hash Map','Hash Set',
  'Tree (Binary)','BST Balanced','AVL Tree','Red-Black Tree','B-Tree',
  'Graph (Adjacency List)','Graph (Matrix)','Disjoint Set','Trie','LRU Cache'
];
const DS_LANGS = [
  {k:'js',l:'JS',c:'#f7df1e'},{k:'py',l:'Py',c:'#3776ab'},
  {k:'go',l:'Go',c:'#00acd7'},{k:'rs',l:'Rust',c:'#ce422b'}
];
for (const d of DS) for (const lang of DS_LANGS) {
  add.push(mk(`rl-ds-${slug(d)}-${lang.k}`, `DS ${d} (${lang.l})`, '◧', lang.c, '~45m',
    `${d} на ${lang.l}. Операции, сложность, примеры.`, `data-structure,${slug(d)},${lang.k}`, 'intermediate'));
}

// REFACTORING RECIPES (30)
const REFACT = [
  'Extract Method','Inline Method','Extract Variable','Inline Variable','Rename Variable',
  'Replace Conditional with Polymorphism','Replace Magic Number with Constant','Replace Nested Conditionals with Guard','Decompose Conditional','Consolidate Conditional',
  'Move Method to Class','Move Field to Class','Extract Class','Inline Class','Hide Delegate',
  'Replace Parameter with Method','Remove Flag Argument','Parameterize Method','Preserve Whole Object','Introduce Parameter Object',
  'Replace Temp with Query','Split Temp Variable','Remove Dead Code','Replace Comment with Clear Name','Split Long Method',
  'Reduce Nesting (Early Return)','Replace Loop with Pipeline','Replace Mutation with Pure Function','Replace Subclass with Delegate','Extract Superclass'
];
for (const r of REFACT) {
  add.push(mk(`sm-refact-${slug(r)}`, `Refactor: ${r}`, '⎔', '#10b981', '~30m',
    `${r}. Before/After пример, тесты.`, `refactor,${slug(r)}`, 'intermediate'));
}

// PRODUCT METRICS (25)
const PRODUCT_METRICS = [
  'MAU Monthly Active Users','DAU Daily Active Users','WAU Weekly Active Users','Session Duration','Sessions per User',
  'Bounce Rate','Conversion Rate','Signup to Paid Conversion','Trial to Paid Conversion','Feature Adoption Rate',
  'Feature Usage Frequency','Stickiness DAU/MAU','NPS Net Promoter Score','CSAT Customer Satisfaction','CES Customer Effort Score',
  'CAC Customer Acquisition Cost','LTV Lifetime Value','LTV:CAC Ratio','Churn Rate Monthly','Churn Rate Annual',
  'MRR Monthly Recurring Revenue','ARR Annual Recurring Revenue','Net Revenue Retention','Gross Revenue Retention','Expansion Revenue'
];
for (const m of PRODUCT_METRICS) {
  add.push(mk(`rl-pm-${slug(m)}`, `Metric: ${m}`, '◈', '#8b5cf6', '~30m',
    `Метрика "${m}": формула, реализация tracking, dashboard.`, `product-metric,${slug(m)}`, 'intermediate'));
}

// ONBOARDING FLOW STEPS (25)
const ONBOARDING = [
  'Welcome Splash Screen','Email Verification Gate','Profile Setup','Role Selection','Use Case Survey',
  'Team Invitation','First Integration Connect','Sample Data Import','Product Tour Start','Empty State Call-to-Action',
  'Tooltip Sequence','Progress Checklist','Milestone Celebration','Video Walkthrough','Interactive Demo',
  'Sample Project Template','AI Assistant Intro','Keyboard Shortcuts Tip','Collaboration Invite','Subscribe Prompt',
  'Webinar Sign-up','Community Join','Knowledge Base Tour','Support Channel Intro','Upgrade Upsell'
];
for (const o of ONBOARDING) {
  add.push(mk(`fd-onb-${slug(o)}`, `Onboarding: ${o}`, '◈', '#10b981', '~45m',
    `Шаг онбординга "${o}". UX, tracking event, A/B test idea.`, `onboarding,${slug(o)}`, 'intermediate'));
}

// DESIGN QA / REVIEW TOPICS (20)
const DESIGN_QA = [
  'Typography Hierarchy Check','Color Contrast WCAG','Spacing Scale Consistency','Border Radius Consistency','Shadow Depth Scale',
  'Icon Size Consistency','Button Size States','Form Field Alignment','Error State Design','Empty State Design',
  'Loading State Design','Success State Design','Responsive Breakpoints','Tablet Layout Review','Mobile Touch Targets',
  'Dark Mode Parity','Motion Duration Scale','Component Variant Audit','Design Token Usage','Storybook Coverage'
];
for (const q of DESIGN_QA) {
  add.push(mk(`rv-design-${slug(q)}`, `Design QA: ${q}`, '◆', '#f59e0b', '~30m',
    `Review: ${q}. Issues, fix suggestions, tokens.`, `design,qa,${slug(q)}`, 'intermediate'));
}

// CODE REVIEW FOCUS AREAS (20)
const CR_FOCUS = [
  'Business Logic Correctness','Error Handling Completeness','Test Coverage Adequacy','Performance Hot Paths','Security Input Validation',
  'API Contract Stability','Database Query Efficiency','Concurrency Race Conditions','Memory Leak Risks','Resource Cleanup',
  'Logging Appropriate','Metrics Emission','Tracing Span Coverage','Feature Flag Guard','Migration Safety',
  'Backward Compatibility','Documentation Update','Type Safety','Dependency Impact','Breaking Change Review'
];
for (const f of CR_FOCUS) {
  add.push(mk(`cr-focus-${slug(f)}`, `Code Review: ${f}`, '🔍', '#0ea5e9', '~20m',
    `Focus: ${f}. Checklist для ревью.`, `code-review,${slug(f)}`, 'intermediate'));
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
