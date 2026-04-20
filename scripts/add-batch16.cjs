const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 РАЗВЕДКА: Прочитай структуру, конфиги, зависимости, тесты. ";
const A = " АНТИ-ЛУП: 3 ошибки \u2014 смена подхода.";

function P(id, role, icon, ac, time, taskDesc, tags, difficulty) {
  const cmd = id.startsWith("rl-") ? "/ralph-loop" : id.startsWith("fd-") ? "/feature-dev" : id.startsWith("rv-") ? "/review-pr" : id.startsWith("cr-") ? "/code-review" : id.startsWith("sm-") ? "/simplify" : id.startsWith("lp-") ? "/loop" : id.startsWith("cm-") ? "/commit" : "/feature-dev";
  const text = cmd === "/ralph-loop" ? '/ralph-loop "' + E + 'ЗАДАЧА: ' + taskDesc + A + '" --completion-promise "DONE"' : cmd === "/loop" ? '/loop 5m "' + taskDesc + '"' : taskDesc;
  return { id, m: cmd, mk: "claude", role, type: "command", icon, ac, time, text, tags: tags.split(","), difficulty, output: "Result", related: [], prereqs: [], v: "11.1" };
}

const add = [];

// OBSERVABILITY / INCIDENTS / OPERATIONS — 30
add.push(
  P("rl-datadog","Datadog APM","◈","#632ca6","~1-2h","Datadog agent, APM traces, dashboards, monitors, SLOs, log intake, synthetic.","datadog,apm","intermediate"),
  P("rl-newrelic","New Relic One","◈","#00ac69","~1h","New Relic APM, Infrastructure, Synthetics, Workloads, alerts, Nerdpacks.","newrelic,apm","intermediate"),
  P("rl-sentry-setup","Sentry Error Tracking","🐛","#362d59","~45m","Sentry SDK setup, source maps, release tracking, performance monitoring, session replay.","sentry,errors","intermediate"),
  P("rl-honeycomb","Honeycomb Tracing","◈","#f5b23e","~1h","Honeycomb OTel ingestion, BubbleUp, SLOs, triggers, Service Map.","honeycomb,tracing","intermediate"),
  P("rl-grafana-cloud","Grafana Cloud","◈","#f46800","~1h","Grafana Cloud stack: Metrics/Logs/Traces, Agent, alerts, managed.","grafana-cloud","intermediate"),
  P("rl-signoz","SigNoz OSS","◈","#eb6b2d","~1h","SigNoz OpenTelemetry-native observability, dashboards, traces.","signoz,oss","intermediate"),
  P("rl-elastic-apm","Elastic APM","◈","#005571","~1h","Elastic APM agent, indices, ML anomaly detection, service maps.","elastic,apm","intermediate"),
  P("rl-logrocket","LogRocket Sessions","👁","#764abc","~45m","LogRocket session replay, console logs, network, errors, Redux state.","logrocket,replay","intermediate"),
  P("rl-fullstory","FullStory Sessions","👁","#ec5d29","~45m","FullStory session replay, heatmaps, segments, funnel analysis.","fullstory,replay","intermediate"),
  P("rl-bugsnag","Bugsnag Errors","🐛","#4949e4","~45m","Bugsnag stability scores, release tracking, user impact, breadcrumbs.","bugsnag,errors","intermediate"),
  P("rl-oncall-setup","On-Call Setup","📞","#dc2626","~1h","Schedules, escalation policies, rotations, PagerDuty/Opsgenie/Grafana OnCall, overrides.","oncall,incidents","intermediate"),
  P("rl-runbook-template","Runbook Template","📋","#dc2626","~45m","Symptoms, impact, detection, mitigation steps, verify, follow-up, related dashboards.","runbook,incidents","intermediate"),
  P("rl-post-mortem","Post-Mortem Template","📝","#dc2626","~1h","Timeline, impact, root causes (5 whys), action items, blameless culture.","postmortem,incidents","intermediate"),
  P("rl-sli-sla","SLIs/SLAs/SLOs","◈","#dc2626","~1h","Difference: SLI metric, SLO internal target, SLA customer contract. Example calculations.","slo,reliability","intermediate"),
  P("rl-error-budget","Error Budget Policy","◈","#dc2626","~45m","Budget calculation, burn rate alerts, freeze features when depleted, review cycle.","slo,reliability","intermediate"),
  P("rl-capacity-plan","Capacity Planning","◈","#10b981","~1h","Load forecasting, autoscale limits, vendor quotas, Black Friday prep, resource reserves.","capacity,planning","intermediate"),
  P("rl-disaster-recovery","Disaster Recovery Plan","🚨","#dc2626","~1-2h","RTO/RPO targets, multi-region failover, backup restore drills, DR runbook.","dr,reliability","advanced"),
  P("rl-status-page","Status Page","🟢","#10b981","~45m","Statuspage.io/Incident.io/Better Stack, incident lifecycle, subscribe, component health.","status-page,incidents","beginner"),
  P("rl-incident-io","Incident.io Setup","🚨","#f25f3d","~45m","Incident.io: declare, roles, Slack, runbooks, post-incident review, catalog.","incident-io","intermediate"),
  P("rl-grafana-oncall","Grafana OnCall","📞","#f46800","~45m","Grafana OnCall: integrations, escalation chains, schedules, webhooks, Slack/MS Teams.","oncall,grafana","intermediate"),
  P("rl-slack-alerts","Slack Alert Routing","🔔","#4a154b","~30m","Slack webhooks, channels per severity/team, message formatting, interactive actions.","slack,alerts","beginner"),
  P("rl-error-dedup","Error Deduplication","◈","#10b981","~45m","Fingerprinting, grouping similar errors, noise reduction, alert thresholds.","errors,monitoring","intermediate"),
  P("rl-log-sampling","Log Sampling","◈","#10b981","~30m","Head-based sampling (1% debug), tail-based (slow/errors 100%), cost savings.","logging,sampling","intermediate"),
  P("rl-anomaly-detection","Anomaly Detection","◈","#10b981","~1h","Grafana ML, Datadog Watchdog, Prophet, EWMA, threshold alerts на отклонения от baseline.","monitoring,anomaly","intermediate"),
  P("rl-correlated-alerts","Correlated Alerts","◈","#10b981","~45m","Group related alerts, root cause suggestion, AIOps (BigPanda/Moogsoft), reduce noise.","aiops,alerts","advanced"),
  P("rl-synthetic-checks","Synthetic Checks","👁","#10b981","~45m","Browser/API monitoring, Checkly/Pingdom/Datadog Synthetics, assertions, regions.","synthetic,monitoring","intermediate"),
  P("rl-trace-sampling","Trace Sampling","◈","#10b981","~30m","OpenTelemetry probability/parent-based sampling, tail sampling collector, budget.","tracing,sampling","intermediate"),
  P("rl-apm-baseline","APM Baseline","◈","#10b981","~30m","p50/p95/p99 latency, throughput, error rate per endpoint, saved baselines, compare.","apm,baseline","intermediate"),
  P("rl-opentelemetry-rust","OTel for Rust","◈","#ce422b","~1h","opentelemetry-rust, tracing-opentelemetry, exporter OTLP, custom spans.","otel,rust","advanced"),
  P("rl-opentelemetry-go","OTel for Go","◈","#00acd7","~1h","otel-go, instrumentation libs, propagation, resource attributes, exporters.","otel,go","intermediate"),
);

// MARKETING / GROWTH / SEO — 20
add.push(
  P("fd-seo-audit","SEO Audit","⎔","#10b981","~1h","Technical (robots, sitemap, canonical, hreflang), on-page (titles/meta/schema), Core Web Vitals.","seo,audit","intermediate"),
  P("fd-schema-org","Schema.org Markup","◎","#10b981","~45m","JSON-LD: Article, Product, FAQPage, HowTo, Event, Organization. Validator.schema.org.","schema,seo","intermediate"),
  P("fd-sitemap","Sitemap Generation","◎","#10b981","~30m","sitemap.xml dynamic, sitemap index для >50k, lastmod, priority, submit GSC.","sitemap,seo","beginner"),
  P("fd-robots-txt","Robots.txt","◎","#10b981","~20m","Allow/disallow, sitemap reference, crawl-delay, per-bot rules (GPTBot opt-out).","robots,seo","beginner"),
  P("fd-og-images","Dynamic OG Images","🖼","#10b981","~1h","Vercel OG (@vercel/og), ImageResponse в Next.js 15, Cloudflare Workers/Puppeteer.","og-images,seo","intermediate"),
  P("fd-hreflang","Hreflang Setup","🌐","#10b981","~45m","hreflang tags, x-default, self-reference, sitemap with hreflang, common mistakes.","hreflang,i18n","intermediate"),
  P("fd-canonical","Canonical URLs","◎","#10b981","~30m","rel=canonical, cross-domain, parameters handling, self-canonical, mistakes (chain).","canonical,seo","intermediate"),
  P("fd-redirects","Redirect Strategy","⇶","#10b981","~45m","301 vs 302 vs 307 vs 308, redirect chains, preserve params, vercel.json/next.config.","redirects,seo","intermediate"),
  P("fd-analytics-event-tag","Event Tracking Setup","◈","#10b981","~45m","GTM / gtag / Plausible custom events, form submissions, outbound links, downloads.","analytics,tracking","intermediate"),
  P("fd-landing-ab","Landing A/B Test","◈","#10b981","~1h","Two variants, traffic split, conversion goal, stats significance (Optimizely/Vercel Split).","ab-test,landing","intermediate"),
  P("fd-newsletter","Newsletter Subscribe","✉","#10b981","~45m","Double opt-in, Mailchimp/ConvertKit/Buttondown API, unsubscribe, GDPR consent.","newsletter,email","beginner"),
  P("fd-referral","Referral Program","🎯","#10b981","~1-2h","Referral links, attribution, rewards (cash/credit), fraud detection, leaderboard.","referral,growth","intermediate"),
  P("fd-waitlist","Waitlist App","⎚","#10b981","~1h","Waitlist signup, position counter, skip-the-line referrals, launch email.","waitlist,growth","beginner"),
  P("fd-content-blog","Content Blog","📝","#10b981","~2h","Blog с MDX, categories, tags, related, RSS, SEO, author pages, reading time.","blog,content","intermediate"),
  P("fd-lead-capture","Lead Capture Forms","◈","#10b981","~1h","Hero/exit-intent/timed popups, form validation, CRM integration (HubSpot/Intercom).","lead-capture,forms","intermediate"),
  P("fd-crm-integration","CRM Integration","◈","#10b981","~1h","HubSpot / Salesforce / Pipedrive API, contacts sync, events, pipelines.","crm,integration","intermediate"),
  P("fd-intercom","Intercom Messenger","💬","#0057ff","~30m","Intercom widget install, identify users, events, Resolution Bot, conversations API.","intercom,support","beginner"),
  P("fd-plausible-goals","Plausible Goals","🎯","#5850ec","~30m","Custom events, goals dashboard, funnel, revenue tracking, API для reports.","plausible,goals","beginner"),
  P("fd-meta-pixel","Meta Pixel + Conversions API","◈","#1877f2","~1h","Facebook Pixel + server-side Conversions API, deduplication, event matching quality.","meta,tracking","intermediate"),
  P("fd-growth-hacks","Growth Hacks Collection","⎚","#10b981","~1h","Referrals, viral loops, onboarding email drip, gamification, rewards, product-led growth.","growth,hacks","intermediate"),
);

// WEB3 / BLOCKCHAIN — 15
add.push(
  P("rl-web3-wallet","Wallet Connect (wagmi)","🔑","#f6851b","~1h","wagmi v2 + RainbowKit + viem. Connect wallet, sign messages, read contracts.","web3,wagmi","intermediate"),
  P("rl-web3-viem","viem TypeScript","◈","#1e1e1e","~1h","viem: clients, actions, contracts, ABI types, multicall, utilities.","viem,web3","intermediate"),
  P("rl-web3-ethers","ethers.js v6","◈","#4f39fa","~1h","Providers, signers, contracts, events, BigInt, migration from v5.","ethers,web3","intermediate"),
  P("rl-web3-sign","Sign-In with Ethereum","🔑","#4f39fa","~45m","SIWE protocol, nonce, message formatting, verify signature, session JWT.","siwe,web3","intermediate"),
  P("rl-web3-hardhat","Hardhat Contracts","⎈","#f7c327","~1-2h","Hardhat project, Solidity, tests (chai), deploy scripts, verify Etherscan.","hardhat,solidity","intermediate"),
  P("rl-web3-foundry","Foundry Forge","⎈","#222222","~1-2h","Foundry: forge test, cast, anvil, fuzzing, invariant testing, gas optimization.","foundry,solidity","advanced"),
  P("rl-web3-solidity","Solidity Patterns","◈","#363636","~1-2h","Reentrancy, checks-effects-interactions, Ownable/AccessControl, upgradeability (proxy).","solidity,contracts","advanced"),
  P("rl-web3-erc20","ERC-20 Token","🪙","#363636","~45m","ERC-20 standard, OpenZeppelin library, mint/burn, allowances, transfer tax.","erc20,tokens","intermediate"),
  P("rl-web3-erc721","ERC-721 NFT","🖼","#363636","~1h","ERC-721: mint, transfer, tokenURI, metadata, OpenSea standards, enumerable.","erc721,nft","intermediate"),
  P("rl-web3-erc1155","ERC-1155 Multi-Token","🖼","#363636","~1h","ERC-1155 batch operations, semi-fungible, gaming items, gas efficient.","erc1155,nft","intermediate"),
  P("rl-web3-thirdweb","thirdweb SDK","⎈","#204dff","~1h","thirdweb v5: connect, contract deploy, pre-built UI components, Engine.","thirdweb,web3","intermediate"),
  P("rl-web3-alchemy","Alchemy APIs","⎈","#3d3dff","~45m","Alchemy: Enhanced APIs (NFT/Token/Transfers/Webhooks), Subscribe WebSocket.","alchemy,web3","intermediate"),
  P("rl-web3-infura","Infura Providers","⎈","#ff5733","~30m","Infura JSON-RPC, IPFS pinning, archive nodes, rate limits, key authentication.","infura,web3","beginner"),
  P("rl-web3-ipfs","IPFS / Pinata","◈","#65c2cb","~45m","IPFS add/pin via Pinata/web3.storage/nft.storage, CIDs, gateway URLs.","ipfs,storage","intermediate"),
  P("rl-web3-subgraph","The Graph Subgraphs","◈","#6747ed","~1-2h","Subgraph: schema, mapping, events handlers, deploy to The Graph, GraphQL queries.","thegraph,subgraph","advanced"),
);

// AUTOMATION / WORKFLOW / INTEGRATIONS — 15
add.push(
  P("rl-zapier","Zapier Integration","⎈","#ff4a00","~30m","Zapier webhooks, Zaps, multi-step, filters, formatters.","zapier,automation","beginner"),
  P("rl-make","Make (Integromat)","⎈","#593fbf","~30m","Make scenarios, routers, filters, error handlers, data stores.","make,automation","beginner"),
  P("rl-n8n","n8n Self-hosted","⎈","#ea4b71","~1h","n8n workflows, self-host, 400+ integrations, JSON/HTTP nodes, expressions.","n8n,automation","intermediate"),
  P("rl-ifttt","IFTTT Webhooks","⎈","#3b3b3b","~30m","IFTTT webhooks (Maker channel), triggers, actions, mobile app integration.","ifttt,automation","beginner"),
  P("rl-activepieces","Activepieces OSS","⎈","#6e41e2","~45m","Activepieces: open source Zapier alternative, flows, pieces, self-host.","activepieces","intermediate"),
  P("rl-windmill","Windmill Dev Platform","⎈","#3b82f6","~1h","Windmill: scripts (TS/Python/Go/Bash), flows, apps, schedule, self-host.","windmill,automation","intermediate"),
  P("rl-temporal-workflows","Temporal Workflows","⇶","#000000","~1-2h","Temporal SDKs (Go/TS/Python/Java), durable execution, signals, queries, saga.","temporal,workflows","advanced"),
  P("rl-inngest","Inngest Functions","⚡","#2f7fc1","~1h","Inngest: event-driven functions, step functions, retries, fan-out, cron.","inngest,serverless","intermediate"),
  P("rl-trigger-dev","Trigger.dev Jobs","⚡","#000000","~1h","Trigger.dev: background jobs, LLM tasks, events, crons, dashboard.","triggerdev,jobs","intermediate"),
  P("rl-resend-webhook","Webhook Receiver","⇉","#10b981","~45m","Verify webhook signatures (HMAC), idempotency, retry handling, DLQ.","webhooks,receiver","intermediate"),
  P("rl-svix","Svix Webhook Sender","⇨","#363fd3","~45m","Svix webhook platform: app portal, signing, retries, rate limit.","svix,webhooks","intermediate"),
  P("rl-cron-expression","Cron Expressions","⏰","#10b981","~30m","Cron syntax: minute/hour/dom/month/dow. Quartz extension. crontab.guru.","cron,scheduling","beginner"),
  P("rl-slack-bot","Slack Bot Setup","🤖","#4a154b","~1h","Slack Bolt framework, slash commands, interactive messages, OAuth.","slack,bot","intermediate"),
  P("rl-discord-bot","Discord Bot","🤖","#5865f2","~1h","Discord.js v14, slash commands, events, permissions, embeds.","discord,bot","intermediate"),
  P("rl-telegram-bot","Telegram Bot","🤖","#0088cc","~1h","Telegraf / aiogram, commands, inline keyboards, webhooks vs polling.","telegram,bot","intermediate"),
);

// NEW COMBOS — 20
const combos = [
  {name:"Next.js Production Launch", ids:["rl-next-app-router","rl-next-auth","rl-next-caching","rl-next-metadata","rl-next-image","rl-next-testing"], color:"#000000", descRu:"Next.js 15 в production: routing + auth + caching + SEO + тесты", descEn:"Next.js 15 to production: routing + auth + caching + SEO + tests"},
  {name:"E-commerce Launch", ids:["fd-ecom-product","fd-ecom-cart","fd-ecom-checkout","fd-ecom-stripe","fd-ecom-inventory","fd-ecom-orders"], color:"#10b981", descRu:"Магазин с нуля: каталог + корзина + Stripe + запасы + заказы", descEn:"Store from scratch: catalog + cart + Stripe + inventory + orders"},
  {name:"SaaS Bootstrap", ids:["fd-saas-signup","fd-saas-org","fd-saas-billing","fd-saas-plan-limits","fd-saas-api-keys"], color:"#8b5cf6", descRu:"SaaS с нуля: signup + orgs + billing + лимиты + API keys", descEn:"SaaS from scratch: signup + orgs + billing + limits + API keys"},
  {name:"AI Agent Stack", ids:["rl-langgraph","rl-agent-tool-use","rl-rag-hybrid-rerank","rl-llm-guardrails-input","rl-llm-observability"], color:"#8b5cf6", descRu:"AI-агент: LangGraph + tool use + RAG + guardrails + observability", descEn:"AI agent: LangGraph + tool use + RAG + guardrails + observability"},
  {name:"Mobile Release Prep", ids:["rl-rn-new-arch","rl-rn-updates-eas","rl-rn-push","rl-rn-sentry","rl-rn-testing"], color:"#61dafb", descRu:"RN release: new arch + OTA + push + Sentry + тесты", descEn:"RN release: new arch + OTA + push + Sentry + tests"},
  {name:"Data Pipeline v2", ids:["rl-kafka-producer","rl-kafka-streams","rl-clickhouse","rl-dbt-project","rl-data-quality"], color:"#0d9488", descRu:"Data Pipeline: Kafka + Streams + ClickHouse + dbt + DQ", descEn:"Data Pipeline: Kafka + Streams + ClickHouse + dbt + DQ"},
  {name:"Observability Stack v2", ids:["rl-opentelemetry","rl-datadog","rl-sentry-setup","rl-slo-sli","rl-oncall-setup"], color:"#f59e0b", descRu:"OTel + Datadog + Sentry + SLO + on-call", descEn:"OTel + Datadog + Sentry + SLO + on-call"},
  {name:"Security Hardening v2", ids:["rl-owasp-top10-2024","rl-sso-oidc","rl-waf-rules","rl-secret-scanning","rl-audit-log"], color:"#dc2626", descRu:"OWASP + SSO + WAF + секреты + audit log", descEn:"OWASP + SSO + WAF + secrets + audit log"},
  {name:"Performance Optimization", ids:["rl-core-web-vitals","rl-lcp-optimize","rl-image-optimization","rl-bundle-webpack","rl-cache-strategies"], color:"#ef4444", descRu:"CWV + LCP + images + bundle + cache", descEn:"CWV + LCP + images + bundle + cache"},
  {name:"API-First Product v2", ids:["fd-rest-api-design","rl-api-pagination","rl-api-filter-sort","fd-openapi-gen","rl-api-versioning"], color:"#10b981", descRu:"REST API: design + pagination + filter + OpenAPI + versioning", descEn:"REST API: design + pagination + filter + OpenAPI + versioning"},
  {name:"Auth Enterprise", ids:["fd-auth-workos","rl-sso-saml","fd-saas-scim","rl-passkey","rl-mfa-enforcement"], color:"#dc2626", descRu:"WorkOS + SAML + SCIM + passkeys + MFA", descEn:"WorkOS + SAML + SCIM + passkeys + MFA"},
  {name:"Event-Driven v2", ids:["rl-kafka-producer","rl-outbox-pattern","rl-cdc-debezium","rl-saga-pattern","rl-eventually-consistent"], color:"#6366f1", descRu:"Kafka + outbox + CDC + saga (eventual consistency)", descEn:"Kafka + outbox + CDC + saga"},
  {name:"Static Site Launch", ids:["rl-astro","rl-astro-content","fd-seo-audit","fd-og-images","rl-cdn-strategies"], color:"#ff5d01", descRu:"Astro + content + SEO + OG + CDN", descEn:"Astro + content + SEO + OG + CDN"},
  {name:"Real-Time Chat App", ids:["fd-chat-messaging","rl-redis-streams","rl-kafka-consumer","fd-moderation","rl-push-web"], color:"#06b6d4", descRu:"Chat с real-time + streams + модерация + push", descEn:"Chat with real-time + streams + moderation + push"},
  {name:"Multi-Tenant SaaS", ids:["fd-saas-multi-tenant","fd-saas-org","fd-saas-sso-enterprise","fd-saas-audit","fd-saas-data-export"], color:"#8b5cf6", descRu:"Multi-tenant + orgs + SSO + audit + export", descEn:"Multi-tenant + orgs + SSO + audit + export"},
  {name:"FinOps Cost Control", ids:["lp-cost-watch","rl-aws-iam","rl-capacity-plan","rl-cold-start-lambda","rl-cache-strategies"], color:"#eab308", descRu:"Мониторинг + IAM + capacity + cold start + cache для снижения стоимости", descEn:"Monitor + IAM + capacity + cold start + cache for cost"},
  {name:"Content Platform", ids:["fd-cms-sanity","fd-full-text-search","fd-comments-system","fd-moderation","fd-media-upload"], color:"#f97316", descRu:"CMS + search + комменты + модерация + media upload", descEn:"CMS + search + comments + moderation + media upload"},
  {name:"Dev Platform", ids:["rl-dx-devcontainer","rl-dx-commitlint","rl-dx-renovate","rl-gh-actions","rl-dx-typedoc"], color:"#3b82f6", descRu:"Dev platform: container + commitlint + renovate + GHA + TypeDoc", descEn:"Dev platform: container + commitlint + renovate + GHA + TypeDoc"},
  {name:"Monetization Launch", ids:["fd-ecom-stripe-sub","fd-saas-billing","fd-saas-trial","fd-saas-affiliate","fd-ecom-coupons"], color:"#10b981", descRu:"Stripe subs + trial + affiliates + coupons", descEn:"Stripe subs + trial + affiliates + coupons"},
  {name:"Web3 dApp Launch", ids:["rl-web3-wallet","rl-web3-viem","rl-web3-sign","rl-web3-hardhat","rl-web3-subgraph"], color:"#f6851b", descRu:"Web3: wallet + viem + SIWE + Hardhat + Subgraph", descEn:"Web3: wallet + viem + SIWE + Hardhat + Subgraph"},
];
combos.forEach(cb => {
  const base = {name:cb.name, ids:cb.ids, agents:cb.ids, color:cb.color};
  data.COMBOS.ru.push({...base, desc:cb.descRu});
  data.COMBOS.en.push({...base, desc:cb.descEn});
});

// NEW CHEAT SHEETS — 10
data.CHEAT['Next.js'] = {name:'Next.js', color:'#000000', cmds:[
  {cmd:'npx create-next-app@latest', desc:'Новый проект'},
  {cmd:'npm run dev', desc:'Dev server (Turbopack)'},
  {cmd:'npm run build', desc:'Production build'},
  {cmd:'npm run start', desc:'Запуск prod'},
  {cmd:'npx next build --profile', desc:'Профилирование билда'},
  {cmd:'npx next-unused', desc:'Неиспользуемые зависимости'},
  {cmd:'npx next lint', desc:'Lint'},
  {cmd:'npx @next/codemod@latest', desc:'Codemods для миграций'},
  {cmd:'npx next telemetry disable', desc:'Выключить телеметрию'},
  {cmd:'npx next info', desc:'Информация об окружении'},
]};

data.CHEAT['Cargo (Rust)'] = {name:'Cargo (Rust)', color:'#ce422b', cmds:[
  {cmd:'cargo new myapp', desc:'Новый проект'},
  {cmd:'cargo build --release', desc:'Release билд'},
  {cmd:'cargo run', desc:'Запуск'},
  {cmd:'cargo test', desc:'Тесты'},
  {cmd:'cargo bench', desc:'Бенчмарки'},
  {cmd:'cargo clippy -- -D warnings', desc:'Линтер'},
  {cmd:'cargo fmt --all', desc:'Форматирование'},
  {cmd:'cargo add serde', desc:'Добавить зависимость'},
  {cmd:'cargo update', desc:'Обновить зависимости'},
  {cmd:'cargo tree', desc:'Дерево зависимостей'},
  {cmd:'cargo audit', desc:'Security audit'},
  {cmd:'cargo expand', desc:'Macro expansion'},
]};

data.CHEAT['Go'] = {name:'Go', color:'#00acd7', cmds:[
  {cmd:'go mod init example.com/app', desc:'Инициализация модуля'},
  {cmd:'go mod tidy', desc:'Очистка go.mod'},
  {cmd:'go run .', desc:'Запуск'},
  {cmd:'go build -o app', desc:'Сборка binary'},
  {cmd:'go test ./... -race -cover', desc:'Все тесты + race + coverage'},
  {cmd:'go test -bench=. -benchmem', desc:'Бенчмарки'},
  {cmd:'go vet ./...', desc:'Vet check'},
  {cmd:'gofmt -w .', desc:'Форматирование'},
  {cmd:'go tool pprof cpu.prof', desc:'CPU профиль'},
  {cmd:'go doc http', desc:'Документация пакета'},
]};

data.CHEAT['Redis CLI'] = {name:'Redis CLI', color:'#dc382d', cmds:[
  {cmd:'redis-cli -h host -p 6379', desc:'Подключение'},
  {cmd:'INFO', desc:'Полная информация о сервере'},
  {cmd:'MONITOR', desc:'Live команды'},
  {cmd:'SLOWLOG GET 10', desc:'Последние 10 медленных команд'},
  {cmd:'MEMORY USAGE key', desc:'Размер ключа в байтах'},
  {cmd:'KEYS pattern:*', desc:'Ключи по паттерну (опасно в prod)'},
  {cmd:'SCAN 0 MATCH pattern:*', desc:'Iterating keys безопасно'},
  {cmd:'TTL key', desc:'Время жизни ключа'},
  {cmd:'CLIENT LIST', desc:'Список подключённых'},
  {cmd:'CONFIG GET maxmemory', desc:'Текущая конфигурация'},
  {cmd:'DEBUG OBJECT key', desc:'Детали объекта'},
  {cmd:'BGSAVE', desc:'Фоновый snapshot'},
]};

data.CHEAT['curl'] = {name:'curl', color:'#073551', cmds:[
  {cmd:'curl -I https://example.com', desc:'Только заголовки (HEAD)'},
  {cmd:'curl -L https://example.com', desc:'Следовать редиректам'},
  {cmd:'curl -v https://example.com', desc:'Verbose вывод'},
  {cmd:"curl -X POST -H 'Content-Type: application/json' -d '{}' url", desc:'POST с JSON'},
  {cmd:"curl -u user:pass https://api.example.com", desc:'Basic Auth'},
  {cmd:"curl -H 'Authorization: Bearer TOKEN' url", desc:'Bearer token'},
  {cmd:'curl -O https://example.com/file.zip', desc:'Скачать файл'},
  {cmd:'curl -w "%{time_total}\\n" -o /dev/null -s url', desc:'Только время ответа'},
  {cmd:"curl --resolve example.com:443:127.0.0.1 url", desc:'Override DNS'},
  {cmd:"curl --cert cert.pem --key key.pem url", desc:'mTLS client cert'},
  {cmd:"curl -F 'file=@path.jpg' url", desc:'Multipart file upload'},
]};

data.CHEAT['openssl'] = {name:'openssl', color:'#721412', cmds:[
  {cmd:'openssl genrsa -out key.pem 4096', desc:'RSA-4096 private key'},
  {cmd:'openssl req -x509 -new -key key.pem -out cert.pem -days 365', desc:'Self-signed cert'},
  {cmd:'openssl x509 -in cert.pem -text -noout', desc:'Показать cert info'},
  {cmd:'openssl s_client -connect host:443 -servername host', desc:'Проверить TLS handshake'},
  {cmd:"openssl rand -base64 32", desc:'Случайный 256-bit base64'},
  {cmd:'openssl dgst -sha256 file', desc:'SHA-256 hash файла'},
  {cmd:'openssl enc -aes-256-gcm -in f -out f.enc -k pass', desc:'AES-256-GCM шифрование'},
  {cmd:"openssl verify -CAfile ca.pem cert.pem", desc:'Verify cert chain'},
  {cmd:"openssl s_client -showcerts -connect host:443", desc:'Показать весь chain'},
  {cmd:'openssl ec -in ec-key.pem -pubout', desc:'Public key from EC private'},
]};

data.CHEAT['ffmpeg'] = {name:'ffmpeg', color:'#007808', cmds:[
  {cmd:'ffmpeg -i in.mov -c:v libx264 -crf 23 out.mp4', desc:'MOV → MP4 (H.264, CRF 23)'},
  {cmd:'ffmpeg -i in.mp4 -vn -acodec libmp3lame out.mp3', desc:'Извлечь audio в MP3'},
  {cmd:'ffmpeg -i in.mp4 -ss 00:01:30 -t 30 out.mp4', desc:'Вырезать 30сек с 1:30'},
  {cmd:'ffmpeg -i in.mp4 -vf "scale=1280:720" out.mp4', desc:'Ресайз 720p'},
  {cmd:'ffmpeg -i in.mp4 -vf fps=1 thumb%03d.png', desc:'Thumbnail каждую секунду'},
  {cmd:'ffmpeg -i in.mp4 -c copy out.mp4', desc:'Remux без перекодирования'},
  {cmd:'ffmpeg -i in.mp4 -hls_time 6 out.m3u8', desc:'HLS playlist'},
  {cmd:'ffmpeg -i in.mp4 -c:v libvpx-vp9 -b:v 1M out.webm', desc:'VP9 WebM'},
  {cmd:'ffmpeg -f concat -i list.txt -c copy out.mp4', desc:'Склеить файлы'},
  {cmd:'ffprobe -v error -show_streams in.mp4', desc:'Метаданные файла'},
]};

data.CHEAT['jq'] = {name:'jq', color:'#007700', cmds:[
  {cmd:"echo '{\"a\":1}' | jq '.a'", desc:'Извлечь поле'},
  {cmd:"jq '.items[] | .name' data.json", desc:'Iterate массив'},
  {cmd:"jq 'length'", desc:'Длина массива/объекта'},
  {cmd:"jq 'keys'", desc:'Ключи объекта'},
  {cmd:"jq 'map(select(.active))'", desc:'Фильтр по полю'},
  {cmd:"jq 'group_by(.type)'", desc:'Группировка'},
  {cmd:"jq 'to_entries | map(select(.key|startswith(\"a\")))'", desc:'Фильтр по ключу'},
  {cmd:"jq -s 'add'", desc:'Объединить JSON объекты'},
  {cmd:"jq -r '.foo'", desc:'Raw output (без кавычек)'},
  {cmd:"jq '.items | sort_by(.name)'", desc:'Сортировка'},
]};

data.CHEAT['awk'] = {name:'awk', color:'#525252', cmds:[
  {cmd:"awk '{print $1}'", desc:'Первая колонка'},
  {cmd:"awk -F, '{print $2}'", desc:'CSV: вторая колонка'},
  {cmd:"awk 'NR==5'", desc:'Только 5-я строка'},
  {cmd:"awk 'NR>1'", desc:'Skip header'},
  {cmd:"awk 'length > 80'", desc:'Строки длиннее 80 символов'},
  {cmd:"awk '{sum+=$1} END {print sum}'", desc:'Сумма первой колонки'},
  {cmd:"awk '!seen[$0]++'", desc:'Удалить дубликаты (preserving order)'},
  {cmd:"awk '/pattern/ {print}'", desc:'Grep-like filter'},
  {cmd:"awk -v OFS=, '{print $1,$3}' file", desc:'Извлечь колонки в CSV'},
  {cmd:"awk 'BEGIN{FS=\":\"} {print $1}' /etc/passwd", desc:'Custom separator'},
]};

data.CHEAT['Homebrew'] = {name:'Homebrew', color:'#fbb040', cmds:[
  {cmd:'brew install name', desc:'Установить пакет'},
  {cmd:'brew search term', desc:'Поиск пакета'},
  {cmd:'brew info name', desc:'Информация о пакете'},
  {cmd:'brew list', desc:'Установленные пакеты'},
  {cmd:'brew outdated', desc:'Доступные обновления'},
  {cmd:'brew upgrade', desc:'Обновить всё'},
  {cmd:'brew uninstall name', desc:'Удалить пакет'},
  {cmd:'brew cleanup', desc:'Очистить старые версии'},
  {cmd:'brew services start name', desc:'Запустить как сервис'},
  {cmd:'brew services list', desc:'Все сервисы'},
  {cmd:'brew bundle dump', desc:'Экспорт в Brewfile'},
  {cmd:'brew bundle', desc:'Восстановить из Brewfile'},
]};

// CLI commands additions
data.QUICK_CMDS.ru.push({cat:'pnpm', cmds:[
  {cmd:'pnpm install', label:'Установить зависимости'},
  {cmd:'pnpm add pkg', label:'Добавить пакет'},
  {cmd:'pnpm add -D pkg', label:'Dev-зависимость'},
  {cmd:'pnpm remove pkg', label:'Удалить'},
  {cmd:'pnpm update -L', label:'Обновить до latest'},
  {cmd:'pnpm audit --fix', label:'Audit + fix'},
  {cmd:'pnpm why pkg', label:'Почему пакет установлен'},
  {cmd:'pnpm dlx create-next-app', label:'Один раз без установки'},
]});

data.QUICK_CMDS.ru.push({cat:'Bun', cmds:[
  {cmd:'bun install', label:'Установить зависимости'},
  {cmd:'bun add pkg', label:'Добавить пакет'},
  {cmd:'bun run script', label:'Запустить script'},
  {cmd:'bun test', label:'Тесты'},
  {cmd:'bun build ./index.ts', label:'Билд'},
  {cmd:'bun dev --hot', label:'Dev server с HMR'},
]});

data.QUICK_CMDS.ru.push({cat:'Python/uv', cmds:[
  {cmd:'uv init myproject', label:'Новый проект'},
  {cmd:'uv add requests', label:'Добавить зависимость'},
  {cmd:'uv run python app.py', label:'Запустить с auto-venv'},
  {cmd:'uv sync', label:'Синхронизация lockfile'},
  {cmd:'uv venv .venv --python 3.12', label:'Создать venv Python 3.12'},
  {cmd:'uvx ruff check .', label:'Запустить tool без установки'},
]});

// Mirror to .en
if (Array.isArray(data.QUICK_CMDS.en)) {
  data.QUICK_CMDS.en.push({cat:'pnpm', cmds:[
    {cmd:'pnpm install', label:'Install dependencies'},
    {cmd:'pnpm add pkg', label:'Add package'},
    {cmd:'pnpm add -D pkg', label:'Dev dependency'},
    {cmd:'pnpm remove pkg', label:'Remove'},
    {cmd:'pnpm update -L', label:'Update to latest'},
    {cmd:'pnpm audit --fix', label:'Audit + fix'},
    {cmd:'pnpm why pkg', label:'Why this package'},
    {cmd:'pnpm dlx create-next-app', label:'Run without install'},
  ]});
  data.QUICK_CMDS.en.push({cat:'Bun', cmds:[
    {cmd:'bun install', label:'Install dependencies'},
    {cmd:'bun add pkg', label:'Add package'},
    {cmd:'bun run script', label:'Run script'},
    {cmd:'bun test', label:'Tests'},
    {cmd:'bun build ./index.ts', label:'Build'},
    {cmd:'bun dev --hot', label:'Dev server with HMR'},
  ]});
  data.QUICK_CMDS.en.push({cat:'Python/uv', cmds:[
    {cmd:'uv init myproject', label:'New project'},
    {cmd:'uv add requests', label:'Add dependency'},
    {cmd:'uv run python app.py', label:'Run with auto-venv'},
    {cmd:'uv sync', label:'Sync lockfile'},
    {cmd:'uv venv .venv --python 3.12', label:'Create Python 3.12 venv'},
    {cmd:'uvx ruff check .', label:'Run tool without install'},
  ]});
}

add.forEach(p => { p.compact = (p.text||"").slice(0,400); });
const existingIds = new Set(data.P.map(p=>p.id));
const toAdd = add.filter(p => !existingIds.has(p.id));
if (toAdd.length !== add.length) console.error('Dup:', add.filter(p=>existingIds.has(p.id)).map(p=>p.id));
data.P = [...data.P, ...toAdd];

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('✓ Added', toAdd.length, 'prompts. Total:', data.P.length);
console.log('✓ Combos RU:', data.COMBOS.ru.length, '| EN:', data.COMBOS.en.length);
console.log('✓ Cheat sheets:', Object.keys(data.CHEAT).length);
console.log('✓ QUICK_CMDS categories:', data.QUICK_CMDS.ru.length, '| entries:', data.QUICK_CMDS.ru.reduce((s,c)=>s+(c.cmds||[]).length,0));
