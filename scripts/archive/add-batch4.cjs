const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 ПОЛНАЯ РАЗВЕДКА ПРОЕКТА:\nПрочитай ВЕСЬ проект рекурсивно. Изучи структуру, package.json/pyproject.toml/go.mod, README, CLAUDE.md, конфиги, точки входа, схему БД, API, тесты, CI/CD, git log.\n\n";
const A = "\n\nАНТИ-ЛУП: 3 одинаковых ошибки = кардинальная смена подхода.";

const add = [
  // ── Python ──
  {id:"rl-fastapi",m:"/ralph-loop",mk:"claude",role:"FastAPI App",type:"command",icon:"\u{26A1}",ac:"#009688",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: FastAPI приложение.\n\nSTRUCTURE: app/main.py, app/routers/, app/models/, app/schemas/, app/deps.py, app/config.py.\nROUTERS: APIRouter per resource, tags, prefix.\nSCHEMAS: Pydantic v2 models (BaseModel), response_model.\nDB: SQLAlchemy 2.0 async + Alembic migrations.\nAUTH: OAuth2PasswordBearer, JWT, depends.\nDOCS: auto Swagger UI (/docs), ReDoc (/redoc).\nTESTS: pytest + httpx AsyncClient.\nDOCKER: uvicorn + gunicorn workers.' + A + '" --completion-promise "DONE"',
   tags:["fastapi","python","api","pydantic","sqlalchemy"],difficulty:"intermediate",output:"FastAPI app",related:["rl-api","rl-docker"],prereqs:[],v:"10.0"},

  {id:"rl-django",m:"/ralph-loop",mk:"claude",role:"Django App",type:"command",icon:"\u{1F40D}",ac:"#092e20",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Django приложение.\n\nAPPS: разделяй по доменам (accounts, core, api).\nMODELS: Django ORM, migrations (makemigrations + migrate).\nVIEWS: class-based + DRF ViewSets для API.\nSERIALIZERS: DRF serializers, validation.\nAUTH: django-allauth или JWT (simplejwt).\nADMIN: ModelAdmin с list_display, search, filters.\nTESTS: pytest-django, factory_boy.\nSTATIC: collectstatic, WhiteNoise.\nDEPLOY: gunicorn + nginx.' + A + '" --completion-promise "DONE"',
   tags:["django","python","drf","orm"],difficulty:"intermediate",output:"Django app",related:["rl-api","rl-auth"],prereqs:[],v:"10.0"},

  {id:"rl-python-pkg",m:"/ralph-loop",mk:"claude",role:"Python Package",type:"command",icon:"\u{1F4E6}",ac:"#3776ab",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Python пакет.\n\nSTRUCTURE: src/package_name/, tests/, pyproject.toml.\nBUILD: pyproject.toml (hatchling/setuptools), version, deps.\nTYPES: py.typed marker, type hints everywhere.\nTESTS: pytest, coverage >80%.\nLINT: ruff (lint + format), mypy strict.\nCI: GitHub Actions (matrix Python 3.11+3.12+3.13).\nDOCS: docstrings (Google style), mkdocs/sphinx.\nPUBLISH: twine upload / trusted publisher (PyPI).' + A + '" --completion-promise "DONE"',
   tags:["python","package","pypi","pyproject"],difficulty:"intermediate",output:"Python package",related:["rl-ci"],prereqs:[],v:"10.0"},

  // ── Go ──
  {id:"rl-go-api",m:"/ralph-loop",mk:"claude",role:"Go REST API",type:"command",icon:"\u{1F439}",ac:"#00add8",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Go REST API.\n\nFRAMEWORK: net/http (stdlib) или Gin/Chi/Echo.\nSTRUCTURE: cmd/server/main.go, internal/handler/, internal/service/, internal/model/, internal/repo/.\nDB: pgx/sqlx + migrations (golang-migrate).\nMIDDLEWARE: logging, auth (JWT), CORS, recovery.\nCONFIG: envconfig/viper, .env.\nTESTS: go test, httptest, testify.\nDOCKER: multi-stage (build → scratch/alpine).\nGRACEFUL SHUTDOWN: signal.NotifyContext.' + A + '" --completion-promise "DONE"',
   tags:["go","golang","api","rest","gin"],difficulty:"intermediate",output:"Go API",related:["rl-api","rl-docker"],prereqs:[],v:"10.0"},

  // ── Tailwind ──
  {id:"rl-tailwind",m:"/ralph-loop",mk:"claude",role:"Tailwind CSS Setup",type:"command",icon:"\u{1F3A8}",ac:"#38bdf8",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Tailwind CSS setup + кастомизация.\n\nINSTALL: tailwindcss, postcss, autoprefixer.\nCONFIG: tailwind.config.ts — colors, fonts, spacing, breakpoints.\nBASE: @layer base для typography, links, headings.\nCOMPONENTS: @layer components для btn, card, input.\nUTILS: @layer utilities для custom utils.\nDARK MODE: class strategy, toggle.\nRESPONSIVE: mobile-first, sm/md/lg/xl.\nPURGE: content paths для tree-shaking.\nPLUGINS: @tailwindcss/typography, forms, aspect-ratio.' + A + '" --completion-promise "DONE"',
   tags:["tailwind","css","design","responsive"],difficulty:"beginner",output:"Tailwind setup",related:["rl-ui","rl-dark"],prereqs:[],v:"10.0"},

  // ── Next.js ──
  {id:"rl-nextjs",m:"/ralph-loop",mk:"claude",role:"Next.js App Router",type:"command",icon:"\u{25B6}",ac:"#000000",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Next.js App Router приложение.\n\nSTRUCTURE: app/ (layouts, pages, loading, error), components/, lib/, actions/.\nSERVER COMPONENTS: default, fetch data on server.\nCLIENT: \"use client\" только где нужно (interactivity).\nSERVER ACTIONS: form handling, mutations.\nMIDDLEWARE: auth check, redirects.\nMETADATA: generateMetadata для SEO.\nCACHING: fetch cache, revalidate, unstable_cache.\nIMAGES: next/image с sizes.\nDEPLOY: Vercel или Docker (standalone output).' + A + '" --completion-promise "DONE"',
   tags:["nextjs","react","app-router","ssr","server-actions"],difficulty:"intermediate",output:"Next.js app",related:["rl-feat","rl-auth","rl-seo"],prereqs:[],v:"10.0"},

  // ── Useful dev tasks ──
  {id:"rl-code-review-checklist",m:"/ralph-loop",mk:"claude",role:"Code Review Checklist",type:"command",icon:"\u{2705}",ac:"#16a34a",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Создай чеклист для code review в проекте.\n\nСОЗДАЙ .github/PULL_REQUEST_TEMPLATE.md:\n\n## Checklist\n- [ ] Тесты написаны и проходят\n- [ ] Types: no any, no as\n- [ ] Error handling: все ошибки обработаны\n- [ ] Security: нет secrets, injection, XSS\n- [ ] Performance: нет N+1, лишних ре-рендеров\n- [ ] A11y: semantic HTML, aria, keyboard\n- [ ] Mobile: responsive, touch targets\n- [ ] Docs: JSDoc/comments для сложной логики\n\nТакже создай CODEOWNERS и branch protection rules.' + A + '" --completion-promise "DONE"',
   tags:["code-review","checklist","pr-template","codeowners"],difficulty:"beginner",output:"PR template + CODEOWNERS",related:["rv-pr","rv-code"],prereqs:[],v:"10.0"},

  {id:"rl-debug-prod",m:"/ralph-loop",mk:"claude",role:"Production Debugging",type:"command",icon:"\u{1F6A8}",ac:"#ef4444",time:"~30m-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Дебаг production проблемы.\n\n1. СОБЕРИ ДАННЫЕ: error logs, stack traces, user reports, timestamps.\n2. ВОСПРОИЗВЕДИ: попробуй воспроизвести locally или на staging.\n3. ИЗОЛЯЦИЯ: когда началось? (git log), что изменилось? (git diff), кого затрагивает?\n4. ROOT CAUSE: trace через логи, проверь DB, проверь external services.\n5. FIX: минимальное исправление, тест, hotfix PR.\n6. POSTMORTEM: что случилось, почему, как предотвратить.\n\nИНСТРУМЕНТЫ: Sentry, logs, DB queries, network traces.' + A + '" --completion-promise "DONE"',
   tags:["debugging","production","postmortem","incident"],difficulty:"advanced",output:"Fix + postmortem",related:["rl-bug","rl-hotfix","rl-logging"],prereqs:[],v:"10.0"},

  {id:"rl-perf-audit",m:"/ralph-loop",mk:"claude",role:"Performance Audit",type:"command",icon:"\u{1F3CE}",ac:"#eab308",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Полный аудит производительности.\n\nFRONTEND: Lighthouse audit, Core Web Vitals (LCP/FID/CLS), bundle analyzer, network waterfall.\nBACKEND: response times per endpoint, slow queries (EXPLAIN ANALYZE), memory usage, CPU profiling.\nDB: missing indexes, N+1 queries, connection pool usage.\nINFRA: cold start times, memory limits, CDN hit rate.\n\nОТЧЁТ: .claude/reports/perf-audit.md\n- Метрики до оптимизации\n- Top 5 bottlenecks с impact score\n- Рекомендации с effort/impact\n- Quick wins (low effort, high impact)' + A + '" --completion-promise "DONE"',
   tags:["performance","audit","lighthouse","profiling"],difficulty:"advanced",output:"Perf audit report",related:["rl-perf","rl-bundle"],prereqs:[],v:"10.0"},

  {id:"rl-db-optimize",m:"/ralph-loop",mk:"claude",role:"Database Optimization",type:"command",icon:"\u{1F4CA}",ac:"#f59e0b",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Оптимизация БД.\n\nINDEXES: EXPLAIN ANALYZE на медленные запросы, добавь indexes на WHERE/JOIN/ORDER BY columns.\nN+1: найди через query logging, исправь include/join/eager loading.\nQUERIES: оптимизируй SELECT (только нужные поля), pagination (cursor > offset).\nCONNECTION POOL: настрой min/max, timeout.\nCACHE: Redis для hot data, materialized views для отчётов.\nCLEANUP: archive old data, vacuum/analyze.' + A + '" --completion-promise "DONE"',
   tags:["database","optimization","indexes","queries","n+1"],difficulty:"advanced",output:"Optimized DB",related:["rl-db","rl-perf","rl-cache"],prereqs:[],v:"10.0"},
];

add.forEach(p => { p.compact = p.text.slice(0, 400); });
data.P = [...data.P, ...add];

// More cheat sheets
data.CHEAT['Tailwind CSS'] = {
  name: 'Tailwind CSS', color: '#38bdf8',
  cmds: [
    { cmd: 'flex items-center gap-4', desc: 'Flexbox center' },
    { cmd: 'grid grid-cols-3 gap-6', desc: 'Grid 3 columns' },
    { cmd: 'p-4 px-6 py-2 m-auto', desc: 'Padding/margin' },
    { cmd: 'text-sm font-bold text-gray-900', desc: 'Typography' },
    { cmd: 'rounded-lg border shadow-md', desc: 'Card style' },
    { cmd: 'hover:bg-blue-600 transition-colors', desc: 'Hover' },
    { cmd: 'sm:flex md:grid lg:hidden', desc: 'Responsive' },
    { cmd: 'dark:bg-gray-900 dark:text-white', desc: 'Dark mode' },
    { cmd: 'animate-pulse animate-spin', desc: 'Animation' },
    { cmd: 'truncate line-clamp-3', desc: 'Text overflow' },
  ]
};

data.CHEAT['SQL'] = {
  name: 'SQL', color: '#336791',
  cmds: [
    { cmd: 'SELECT * FROM users WHERE active = true LIMIT 20', desc: 'Basic query' },
    { cmd: 'JOIN orders ON orders.user_id = users.id', desc: 'Join' },
    { cmd: 'GROUP BY status HAVING COUNT(*) > 5', desc: 'Aggregation' },
    { cmd: 'CREATE INDEX idx_email ON users(email)', desc: 'Index' },
    { cmd: 'EXPLAIN ANALYZE SELECT ...', desc: 'Query plan' },
    { cmd: 'BEGIN; UPDATE ...; COMMIT;', desc: 'Transaction' },
    { cmd: 'INSERT INTO ... ON CONFLICT DO UPDATE', desc: 'Upsert' },
    { cmd: 'WITH cte AS (SELECT ...) SELECT * FROM cte', desc: 'CTE' },
    { cmd: 'COALESCE(name, \'Unknown\')', desc: 'Null fallback' },
  ]
};

data.CHEAT['Python'] = {
  name: 'Python', color: '#3776ab',
  cmds: [
    { cmd: 'pip install package / uv add package', desc: 'Install' },
    { cmd: 'python -m venv .venv && source .venv/bin/activate', desc: 'Virtual env' },
    { cmd: 'ruff check . && ruff format .', desc: 'Lint + format' },
    { cmd: 'pytest -xvs tests/', desc: 'Run tests verbose' },
    { cmd: 'pytest --cov=app --cov-report=html', desc: 'Coverage' },
    { cmd: 'uvicorn app.main:app --reload', desc: 'FastAPI dev' },
    { cmd: 'python manage.py runserver', desc: 'Django dev' },
    { cmd: 'alembic revision --autogenerate -m "desc"', desc: 'Alembic migration' },
    { cmd: 'mypy app/ --strict', desc: 'Type check' },
  ]
};

// More combos
data.COMBOS.ru.push(
  { name:"Python Stack", agents:["rl-fastapi","rl-db","rl-auth","rl-test","rl-docker"], ids:["rl-fastapi","rl-db","rl-auth","rl-test","rl-docker"], desc:"FastAPI + DB + auth + тесты + Docker" },
  { name:"Next.js Full", agents:["rl-nextjs","rl-auth","rl-tailwind","rl-seo","rl-deploy"], ids:["rl-nextjs","rl-auth","rl-tailwind","rl-seo","rl-deploy"], desc:"Next.js + auth + Tailwind + SEO + deploy" },
  { name:"Performance Deep Dive", agents:["rl-perf-audit","rl-db-optimize","rl-bundle","rl-cache","rl-imageopt"], ids:["rl-perf-audit","rl-db-optimize","rl-bundle","rl-cache","rl-imageopt"], desc:"Audit + DB + bundle + cache + images" },
);
data.COMBOS.en.push(
  { name:"Python Stack", agents:["rl-fastapi","rl-db","rl-auth","rl-test","rl-docker"], ids:["rl-fastapi","rl-db","rl-auth","rl-test","rl-docker"], desc:"FastAPI + DB + auth + tests + Docker" },
  { name:"Next.js Full", agents:["rl-nextjs","rl-auth","rl-tailwind","rl-seo","rl-deploy"], ids:["rl-nextjs","rl-auth","rl-tailwind","rl-seo","rl-deploy"], desc:"Next.js + auth + Tailwind + SEO + deploy" },
  { name:"Performance Deep Dive", agents:["rl-perf-audit","rl-db-optimize","rl-bundle","rl-cache","rl-imageopt"], ids:["rl-perf-audit","rl-db-optimize","rl-bundle","rl-cache","rl-imageopt"], desc:"Audit + DB + bundle + cache + images" },
);

const json = JSON.stringify(data);
const compressed = deflateSync(json).toString('base64');
const newSrc = src.replace(/const Z = "[^"]+"/, 'const Z = "' + compressed + '"');
fs.writeFileSync('src/App.jsx', newSrc);
console.log('Prompts:', data.P.length);
console.log('Combos:', data.COMBOS.ru.length);
console.log('Cheat sections:', Object.keys(data.CHEAT).length);
console.log('Cheat commands:', Object.values(data.CHEAT).reduce((a,s) => a + s.cmds.length, 0));
