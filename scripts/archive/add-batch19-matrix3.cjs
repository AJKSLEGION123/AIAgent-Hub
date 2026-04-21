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

// STATE MANAGEMENT LIBRARIES × OPS (12 × 6 = 72)
const STATES = [
  {key:'redux',label:'Redux Toolkit',color:'#764abc'},{key:'zustand',label:'Zustand',color:'#000'},
  {key:'jotai',label:'Jotai',color:'#000'},{key:'recoil',label:'Recoil',color:'#3578e5'},
  {key:'mobx',label:'MobX',color:'#ff9955'},{key:'valtio',label:'Valtio',color:'#000'},
  {key:'nanostores',label:'Nanostores',color:'#f8c307'},{key:'signals',label:'Preact Signals',color:'#673ab8'},
  {key:'xstate',label:'XState',color:'#2c3e50'},{key:'effector',label:'Effector',color:'#ef4844'},
  {key:'pinia',label:'Pinia',color:'#ffd859'},{key:'rxjs',label:'RxJS',color:'#b7178c'},
];
const STATE_OPS = ['Setup','Async Actions','DevTools','Persistence','Testing','Migration'];
for (const s of STATES) for (const op of STATE_OPS) {
  add.push(mk(`rl-state-${s.key}-${slug(op)}`, `${s.label}: ${op}`, '◈', s.color, '~45m',
    `${op} в ${s.label}. Patterns, типы, примеры.`, `state,${s.key},${slug(op)}`, 'intermediate'));
}

// CSS/STYLING LIBRARIES × TASKS (10 × 7 = 70)
const STYLING = [
  {key:'tailwind',label:'Tailwind CSS',color:'#06b6d4'},{key:'emotion',label:'Emotion',color:'#d36ac2'},
  {key:'styled-comp',label:'styled-components',color:'#db7093'},{key:'stitches',label:'Stitches',color:'#fc0'},
  {key:'vanilla-extract',label:'Vanilla Extract',color:'#e100ff'},{key:'linaria',label:'Linaria',color:'#0074d9'},
  {key:'panda-css',label:'Panda CSS',color:'#ffce1f'},{key:'uno-css',label:'UnoCSS',color:'#000'},
  {key:'windicss',label:'WindiCSS',color:'#48b0f1'},{key:'open-props',label:'Open Props',color:'#0096ff'},
];
const STYLE_OPS = ['Setup','Theme Tokens','Dark Mode','Responsive','Component Recipes','Animation','Type Safety'];
for (const s of STYLING) for (const op of STYLE_OPS) {
  add.push(mk(`rl-style-${s.key}-${slug(op)}`, `${s.label}: ${op}`, '◈', s.color, '~45m',
    `${op} в ${s.label}. Примеры, подход, ошибки.`, `css,${s.key},${slug(op)}`, 'intermediate'));
}

// FORM LIBRARIES × TASKS (8 × 6 = 48)
const FORMS = [
  {key:'rhf',label:'React Hook Form',color:'#ec5990'},{key:'formik',label:'Formik',color:'#007acc'},
  {key:'final-form',label:'Final Form',color:'#008fff'},{key:'tanstack-form',label:'TanStack Form',color:'#ff4154'},
  {key:'conform',label:'Conform',color:'#e86a2a'},{key:'felte',label:'Felte',color:'#ff3e00'},
  {key:'vee-validate',label:'VeeValidate',color:'#42b883'},{key:'formkit',label:'FormKit',color:'#cfe7f5'},
];
const FORM_OPS = ['Setup','Zod Validation','Async Validation','Conditional Fields','Field Arrays','Persistence'];
for (const f of FORMS) for (const op of FORM_OPS) {
  add.push(mk(`rl-form-${f.key}-${slug(op)}`, `${f.label}: ${op}`, '◈', f.color, '~45m',
    `${op} в ${f.label}. Примеры, UX.`, `forms,${f.key},${slug(op)}`, 'intermediate'));
}

// ANIMATION LIBRARIES × TASKS (8 × 5 = 40)
const ANIMS = [
  {key:'fm',label:'Framer Motion',color:'#0055ff'},{key:'gsap2',label:'GSAP',color:'#88ce02'},
  {key:'anime',label:'anime.js',color:'#ffffff'},{key:'spring',label:'React Spring',color:'#41b883'},
  {key:'lottie2',label:'Lottie',color:'#00ddb3'},{key:'motion-one',label:'Motion One',color:'#000'},
  {key:'popmotion',label:'Popmotion',color:'#8b5cf6'},{key:'theatre',label:'Theatre.js',color:'#e86a2a'},
];
const ANIM_OPS = ['Basic Animations','Gesture Interactions','Timeline','Scroll-Triggered','SVG Path'];
for (const a of ANIMS) for (const op of ANIM_OPS) {
  add.push(mk(`rl-anim-${a.key}-${slug(op)}`, `${a.label}: ${op}`, '✿', a.color, '~45m',
    `${op} через ${a.label}. Примеры кода, производительность.`, `animation,${a.key},${slug(op)}`, 'intermediate'));
}

// LOGGING LIBRARIES × LANG (10 × 6 = 60)
const LOG_LIBS = [
  'pino','winston','log4js','bunyan','roarr','consola','signale','chalk','zerolog','logrus'
];
const LOG_TASKS = ['Structured JSON','Level Filtering','Transport Rotation','Context Propagation','PII Scrubbing','Performance Bench'];
for (const lib of LOG_LIBS) for (const task of LOG_TASKS) {
  add.push(mk(`rl-log-${slug(lib)}-${slug(task)}`, `${lib}: ${task}`, '≣', '#10b981', '~30m',
    `${task} в ${lib}. Конфиг, примеры.`, `logging,${slug(lib)},${slug(task)}`, 'beginner'));
}

// ERROR TRACKING SERVICES × FRAMEWORK (8 × 10 = 80)
const ERR_SVC = ['Sentry','Bugsnag','Rollbar','Raygun','Honeybadger','AppSignal','TrackJS','LogRocket'];
const ERR_FW = ['React','Vue','Angular','Next.js','Express','FastAPI','Django','Rails','Laravel','Spring'];
for (const svc of ERR_SVC) for (const fw of ERR_FW) {
  add.push(mk(`rl-err-${slug(svc)}-${slug(fw)}`, `${svc} в ${fw}`, '🐛', '#dc2626', '~45m',
    `${svc} интеграция с ${fw}. Source maps, breadcrumbs, releases, alerts.`,
    `errors,${slug(svc)},${slug(fw)}`, 'intermediate'));
}

// DATABASE MIGRATIONS TOOLS × SCENARIO (8 × 8 = 64)
const MIG_TOOLS = ['Prisma Migrate','Drizzle Kit','TypeORM','Sequelize CLI','Alembic','Flyway','Liquibase','goose'];
const MIG_SCENARIOS = [
  'Add Column Nullable','Rename Column Safely','Drop Column with Deploy','Change Column Type','Add Foreign Key',
  'Add Composite Index','Backfill Data Script','Split Table Migration'
];
for (const tool of MIG_TOOLS) for (const scen of MIG_SCENARIOS) {
  add.push(mk(`rl-dbmig-${slug(tool)}-${slug(scen)}`, `${tool}: ${scen}`, '⇶', '#336791', '~45m',
    `${scen} через ${tool}. Zero-downtime, rollback.`,
    `migration,${slug(tool)},${slug(scen)}`, 'intermediate'));
}

// API DOCUMENTATION / SDK TOOLS × LANG (8 × 6 = 48)
const API_DOC_TOOLS = ['OpenAPI Generator','Swagger UI','Redoc','Stoplight Elements','Mintlify','Scalar','Readme.io','Hoppscotch'];
const API_DOC_LANGS = ['TypeScript','Python','Go','Java','Rust','Ruby'];
for (const tool of API_DOC_TOOLS) for (const lang of API_DOC_LANGS) {
  add.push(mk(`rl-apidocs-${slug(tool)}-${slug(lang)}`, `${tool} + ${lang}`, '📘', '#85ea2d', '~45m',
    `${tool} + ${lang} SDK gen, examples, auth docs.`,
    `api-docs,${slug(tool)},${slug(lang)}`, 'intermediate'));
}

// HTTP CLIENTS × TASK (10 × 6 = 60)
const HTTP_CLIENTS = [
  {key:'axios',label:'Axios',color:'#671ddf'},{key:'fetch',label:'fetch API',color:'#000'},
  {key:'ky',label:'Ky',color:'#000'},{key:'got',label:'got',color:'#000'},
  {key:'undici',label:'undici',color:'#539e43'},{key:'requests',label:'requests (Py)',color:'#3776ab'},
  {key:'httpx',label:'httpx (Py)',color:'#3776ab'},{key:'aiohttp',label:'aiohttp',color:'#3776ab'},
  {key:'reqwest',label:'reqwest (Rust)',color:'#ce422b'},{key:'okhttp',label:'OkHttp',color:'#4caf50'},
];
const HTTP_OPS = ['Retry Strategy','Timeout Config','Interceptors','Pagination Iterator','Progress Tracking','Connection Pool'];
for (const c of HTTP_CLIENTS) for (const op of HTTP_OPS) {
  add.push(mk(`rl-http-${c.key}-${slug(op)}`, `${c.label}: ${op}`, '⇄', c.color, '~30m',
    `${op} в ${c.label}. Примеры, production config.`, `http,${c.key},${slug(op)}`, 'intermediate'));
}

// DATE/TIME LIBRARIES × TASK (6 × 5 = 30)
const DATE_LIBS = ['date-fns','dayjs','luxon','temporal','moment (legacy)','js-joda'];
const DATE_TASKS = ['Parse + Format','Timezone Conversion','Duration Arithmetic','Relative Time','Locale Support'];
for (const lib of DATE_LIBS) for (const task of DATE_TASKS) {
  add.push(mk(`rl-date-${slug(lib)}-${slug(task)}`, `${lib}: ${task}`, '⌚', '#10b981', '~30m',
    `${task} через ${lib}. Edge cases (DST, leap, UTC).`, `date,${slug(lib)},${slug(task)}`, 'beginner'));
}

// VALIDATION LIBRARIES (8 × 5 = 40)
const VAL_LIBS = ['Zod','Yup','Joi','Valibot','Arktype','TypeBox','ajv','Superstruct'];
const VAL_TASKS = ['Schema Definition','Async Validation','Error Messages i18n','Type Inference','Performance Bench'];
for (const lib of VAL_LIBS) for (const task of VAL_TASKS) {
  add.push(mk(`rl-val-${slug(lib)}-${slug(task)}`, `${lib}: ${task}`, '✓', '#10b981', '~30m',
    `${task} в ${lib}. Best practices, примеры.`, `validation,${slug(lib)},${slug(task)}`, 'intermediate'));
}

// ANALYTICS PLATFORMS × EVENT TYPE (8 × 8 = 64)
const ANAL_PL = ['GA4','PostHog','Mixpanel','Amplitude','Plausible','Umami','Segment','RudderStack'];
const ANAL_EVENTS = [
  'Signup Conversion','Feature Usage','Error Event','Purchase/Revenue','Page View SPA',
  'Form Abandonment','Button Click Heatmap','User Identify'
];
for (const pl of ANAL_PL) for (const ev of ANAL_EVENTS) {
  add.push(mk(`rl-anal-${slug(pl)}-${slug(ev)}`, `${pl}: ${ev}`, '◈', '#f59e0b', '~30m',
    `${ev} tracking в ${pl}. Schema, server-side, consent.`,
    `analytics,${slug(pl)},${slug(ev)}`, 'intermediate'));
}

// MARKETING TOOLS × INTEGRATION (6 × 6 = 36)
const MKT_TOOLS = ['HubSpot','Mailchimp','ConvertKit','Klaviyo','Brevo','Customer.io'];
const MKT_OPS = ['Contact Sync','Campaign Automation','List Segmentation','Unsubscribe Sync','Transactional Email','Webhook Events'];
for (const t of MKT_TOOLS) for (const op of MKT_OPS) {
  add.push(mk(`rl-mkt-${slug(t)}-${slug(op)}`, `${t}: ${op}`, '✉', '#8b5cf6', '~45m',
    `${op} в ${t}. API, webhooks, compliance.`,
    `marketing,${slug(t)},${slug(op)}`, 'intermediate'));
}

// E-COMMERCE PLATFORMS × ACTION (10 × 5 = 50)
const ECOM_PL = ['Shopify','WooCommerce','Magento','BigCommerce','Medusa','Swell','Saleor','commercetools','Snipcart','Vendure'];
const ECOM_ACT = ['Storefront API','Product Import','Cart + Checkout','Webhooks','Custom App/Plugin'];
for (const pl of ECOM_PL) for (const act of ECOM_ACT) {
  add.push(mk(`rl-ecom-${slug(pl)}-${slug(act)}`, `${pl}: ${act}`, '🛍', '#10b981', '~1h',
    `${act} в ${pl}. SDK, types, примеры.`, `ecommerce,${slug(pl)},${slug(act)}`, 'intermediate'));
}

// CMS HEADLESS × OP (10 × 5 = 50)
const CMS_PL = ['Sanity','Contentful','Strapi','Payload','Directus','Storyblok','DatoCMS','Hygraph','Keystatic','Prismic'];
const CMS_OPS = ['Schema Modeling','Localization','Preview Mode','Media Library','Rich Text Renderer'];
for (const c of CMS_PL) for (const op of CMS_OPS) {
  add.push(mk(`rl-cms-${slug(c)}-${slug(op)}`, `${c}: ${op}`, '◆', '#f97316', '~1h',
    `${op} в ${c}. Best practices, примеры.`, `cms,${slug(c)},${slug(op)}`, 'intermediate'));
}

// AUTH PROVIDERS × SETUP (12 × 4 = 48)
const AUTH_PRV = ['Auth0','Clerk','Supabase Auth','Firebase Auth','WorkOS','Kinde','Ory','Keycloak','Okta','Azure AD B2C','AWS Cognito','Stytch'];
const AUTH_OPS = ['Basic Setup','Social Login','SAML SSO','Org Management'];
for (const p of AUTH_PRV) for (const op of AUTH_OPS) {
  add.push(mk(`rl-auth-${slug(p)}-${slug(op)}`, `${p}: ${op}`, '⚿', '#dc2626', '~1h',
    `${op} для ${p}. Integration, security.`, `auth,${slug(p)},${slug(op)}`, 'intermediate'));
}

// PAYMENT PROVIDERS × OPS (10 × 5 = 50)
const PAY_PRV = ['Stripe','PayPal','Adyen','Braintree','Square','Paddle','LemonSqueezy','Mollie','Razorpay','Checkout.com'];
const PAY_OPS = ['One-time Payment','Subscription','Refund','Webhook Handler','Customer Portal'];
for (const p of PAY_PRV) for (const op of PAY_OPS) {
  add.push(mk(`rl-pay-${slug(p)}-${slug(op)}`, `${p}: ${op}`, '💳', '#635bff', '~1h',
    `${op} в ${p}. Security (PCI), testing, error handling.`, `payments,${slug(p)},${slug(op)}`, 'intermediate'));
}

// SEARCH ENGINES × OPS (8 × 6 = 48)
const SEARCH_ENG = ['Algolia','Meilisearch','Typesense','Elasticsearch','OpenSearch','Vespa','Qdrant','Weaviate'];
const SEARCH_OPS = ['Index Schema','Relevance Tuning','Typo Tolerance','Faceted Search','Autocomplete','Personalization'];
for (const e of SEARCH_ENG) for (const op of SEARCH_OPS) {
  add.push(mk(`rl-search-${slug(e)}-${slug(op)}`, `${e}: ${op}`, '⌕', '#10b981', '~1h',
    `${op} в ${e}. Best practices, примеры запросов.`, `search,${slug(e)},${slug(op)}`, 'intermediate'));
}

// OBSERVABILITY BACKENDS × OP (10 × 5 = 50)
const OBS_BE = ['Datadog','New Relic','Grafana','Honeycomb','SigNoz','Elastic APM','Dynatrace','AppDynamics','Lightstep','Sumo Logic'];
const OBS_OPS = ['Agent Setup','Custom Metrics','Tracing Instrument','Log Parsing Rules','Alert Policy'];
for (const b of OBS_BE) for (const op of OBS_OPS) {
  add.push(mk(`rl-obs-${slug(b)}-${slug(op)}`, `${b}: ${op}`, '◈', '#f59e0b', '~1h',
    `${op} в ${b}. Cost-effective, signal vs noise.`, `observability,${slug(b)},${slug(op)}`, 'intermediate'));
}

// MESSAGING BROKERS × OPS (8 × 6 = 48)
const MSG_BROKERS = ['Kafka','RabbitMQ','NATS','Redis Streams','AWS SQS','AWS SNS','GCP Pub/Sub','RedPanda'];
const MSG_OPS = ['Producer Setup','Consumer Group','DLQ Strategy','Ordering Guarantees','Exactly-Once','Monitoring'];
for (const b of MSG_BROKERS) for (const op of MSG_OPS) {
  add.push(mk(`rl-msgbus-${slug(b)}-${slug(op)}`, `${b}: ${op}`, '⇨', '#10b981', '~1h',
    `${op} в ${b}. Throughput, latency, reliability.`, `messaging,${slug(b)},${slug(op)}`, 'intermediate'));
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
