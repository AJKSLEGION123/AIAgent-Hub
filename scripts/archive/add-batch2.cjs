const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 ПОЛНАЯ РАЗВЕДКА ПРОЕКТА:\nПрочитай ВЕСЬ проект рекурсивно. Изучи структуру, package.json, README, CLAUDE.md, конфиги, точки входа, схему БД, API, тесты, CI/CD, git log. Построй ментальную карту.\n\n";
const A = "\n\nАНТИ-ЛУП: 3 одинаковых ошибки = кардинальная смена подхода.";

const add = [
  // ── More Dev Workflows ──
  {id:"rl-scaffold",m:"/ralph-loop",mk:"claude",role:"Project Scaffolding",type:"command",icon:"\u{1F3D7}",ac:"#6366f1",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Scaffold нового модуля/фичи.\n\nСОЗДАЙ:\n- Route/page файл\n- API endpoint (если нужен)\n- DB model/migration (если нужен)\n- Component(ы) с базовой структурой\n- Test file с describe блоком\n- Index re-export\n\nСледуй conventions проекта: naming, структура папок, паттерны.\nВсё должно компилироваться и рендериться (пустой state).' + A + '" --completion-promise "DONE"',
   tags:["scaffold","generator","boilerplate"],difficulty:"beginner",output:"Scaffold модуля",related:["rl-feat"],prereqs:[],v:"9.1"},

  {id:"rl-errorpages",m:"/ralph-loop",mk:"claude",role:"Error & Loading States",type:"command",icon:"\u{1F6AB}",ac:"#ef4444",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Error pages + loading states.\n\n404 PAGE: дружелюбная, с поиском и ссылкой на главную.\n500 PAGE: извинение + retry кнопка.\nLOADING: skeleton screens (не spinner!) для каждого layout.\nEMPTY STATE: иллюстрация + CTA для каждого списка.\nERROR BOUNDARY: React Error Boundary с fallback UI.\nOFFLINE: offline indicator + cached content.' + A + '" --completion-promise "DONE"',
   tags:["error-pages","loading","skeleton","empty-state","404"],difficulty:"beginner",output:"Error/loading/empty states",related:["rl-ui","rl-err"],prereqs:[],v:"9.1"},

  {id:"rl-ratelimit",m:"/ralph-loop",mk:"claude",role:"Rate Limiting",type:"command",icon:"\u{1F6A6}",ac:"#f97316",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Rate limiting.\n\nSTRATEGY: sliding window или token bucket.\nSTORAGE: Redis (production) или in-memory Map (dev).\nENDPOINTS:\n- Auth: 5 req/15min (brute force protection)\n- API: 100 req/min per user\n- Public: 30 req/min per IP\n\nHEADERS: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After.\nRESPONSE: 429 Too Many Requests с retry info.\nMIDDLEWARE: rateLimit(config) для любого route.' + A + '" --completion-promise "DONE"',
   tags:["rate-limiting","security","redis","middleware"],difficulty:"intermediate",output:"Rate limiter middleware",related:["rl-auth","sc-audit"],prereqs:[],v:"9.1"},

  {id:"rl-imageopt",m:"/ralph-loop",mk:"claude",role:"Image Optimization",type:"command",icon:"\u{1F5BC}",ac:"#0ea5e9",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Оптимизация изображений.\n\nFORMATS: WebP/AVIF с fallback на JPEG/PNG.\nRESPONSIVE: srcset + sizes для каждого breakpoint.\nLAZY: loading=\"lazy\" + IntersectionObserver.\nPLACEHOLDER: blur placeholder (LQIP) или dominant color.\nCDN: Cloudflare Images / imgproxy / sharp.\nNEXT.JS: next/image с proper width/height.\nSVG: inline для icons, optimized (svgo).\nРЕЗУЛЬТАТ: LCP image <200KB, все images lazy кроме hero.' + A + '" --completion-promise "DONE"',
   tags:["images","optimization","webp","lazy-loading","performance"],difficulty:"intermediate",output:"Оптимизированные изображения",related:["rl-perf","rl-ui"],prereqs:[],v:"9.1"},

  {id:"rl-multi-env",m:"/ralph-loop",mk:"claude",role:"Multi-Environment",type:"command",icon:"\u{1F30D}",ac:"#8b5cf6",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Настройка dev/staging/production.\n\nENV FILES: .env.development, .env.staging, .env.production.\nCONFIG: src/config.ts с validation (zod) + type-safe access.\nCI/CD: deploy to staging on PR merge, production on tag/release.\nDB: отдельные БД для каждого env.\nFEATURE FLAGS: enable/disable features per env.\nSCRIPTS: deploy:staging, deploy:production.\nPROTECTION: production secrets только в CI, никогда в коде.' + A + '" --completion-promise "DONE"',
   tags:["environments","staging","production","config","ci-cd"],difficulty:"intermediate",output:"Dev/staging/prod pipeline",related:["rl-env","rl-ci","rl-deploy"],prereqs:[],v:"9.1"},

  {id:"rl-backup",m:"/ralph-loop",mk:"claude",role:"Backup & Restore",type:"command",icon:"\u{1F4BE}",ac:"#059669",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Бэкап и восстановление.\n\nDB BACKUP: pg_dump / mysqldump / sqlite3 .backup.\nSCHEDULE: cron ежедневно в 3:00 AM.\nSTORAGE: S3 / local / remote server.\nRETENTION: 7 daily + 4 weekly + 3 monthly.\nRESTORE: скрипт restore.sh (one command).\nVERIFY: автоматическая проверка backup integrity.\nFILES: backup media/uploads если есть.\nDOCS: runbook для восстановления.' + A + '" --completion-promise "DONE"',
   tags:["backup","restore","database","cron","disaster-recovery"],difficulty:"intermediate",output:"Backup система + restore script",related:["rl-db","rl-cron"],prereqs:[],v:"9.1"},

  {id:"rl-skeleton",m:"/ralph-loop",mk:"claude",role:"Loading Skeletons",type:"command",icon:"\u{1F480}",ac:"#94a3b8",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Skeleton loading screens.\n\nДЛЯ КАЖДОГО LAYOUT:\n- Card skeleton: rounded rect + pulse animation\n- Table skeleton: rows с animated gradient\n- Profile skeleton: circle + lines\n- Form skeleton: input shapes\n- List skeleton: repeating items\n\nCOMPONENT: <Skeleton width height variant={\"text\"|\"rect\"|\"circle\"} />\nANIMATION: CSS shimmer (background gradient animation).\nUSAGE: показывай skeleton пока data loading, не spinner.\nA11Y: aria-busy=\"true\", screen reader text.' + A + '" --completion-promise "DONE"',
   tags:["skeleton","loading","ux","animation"],difficulty:"beginner",output:"Skeleton компоненты",related:["rl-ui","rl-errorpages"],prereqs:[],v:"9.1"},

  {id:"rl-testing-strategy",m:"/ralph-loop",mk:"claude",role:"Testing Strategy",type:"command",icon:"\u{1F3AF}",ac:"#22c55e",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Тестовая стратегия проекта.\n\nПИРАМИДА:\n- Unit (70%): бизнес-логика, utils, hooks\n- Integration (20%): API endpoints, DB queries\n- E2E (10%): критические user flows\n\nSETUP:\n- Фреймворк + конфиг\n- Test utils: factories, fixtures, helpers\n- CI: тесты на каждый push\n- Coverage: threshold >80%, отчёт в PR\n\nPATTERNS:\n- AAA: Arrange, Act, Assert\n- One assert per test\n- No test interdependence\n- Fast: <10s для unit suite\n- Deterministic: no flaky\n\nДОКУМЕНТАЦИЯ: TESTING.md с conventions.' + A + '" --completion-promise "DONE"',
   tags:["testing","strategy","coverage","pyramid"],difficulty:"intermediate",output:"Testing strategy + TESTING.md",related:["rl-test","rl-tdd","rl-e2e"],prereqs:[],v:"9.1"},

  {id:"rl-api-client",m:"/ralph-loop",mk:"claude",role:"API Client Layer",type:"command",icon:"\u{1F517}",ac:"#6366f1",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Типизированный API клиент.\n\nCLIENT: src/lib/api.ts\n- Base URL из env\n- Auth header injection (Bearer token)\n- Request/response interceptors\n- Error handling: network, 401 redirect, 500 retry\n- TypeScript generics: api.get<User>(\"/users/1\")\n\nHOOKS: React Query wrappers\n- useUser(id), useUsers(filters)\n- useCreateUser(), useUpdateUser()\n- Typed params + response\n- Optimistic updates\n\nMOCKS: MSW для тестов\n- handlers для каждого endpoint\n- Realistic response data' + A + '" --completion-promise "DONE"',
   tags:["api-client","fetch","react-query","typescript","msw"],difficulty:"intermediate",output:"Typed API client + hooks",related:["rl-api","rl-state"],prereqs:[],v:"9.1"},

  {id:"rl-migration-data",m:"/ralph-loop",mk:"claude",role:"Data Migration",type:"command",icon:"\u{1F4E6}",ac:"#d97706",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Миграция данных между системами.\n\n1. АНАЛИЗ: источник (API/DB/CSV/JSON), объём, маппинг полей.\n2. СКРИПТ: scripts/migrate.ts\n   - Extract: читай из источника батчами\n   - Transform: маппинг, валидация, enrichment\n   - Load: записывай в целевую БД через ORM\n3. ВАЛИДАЦИЯ: сравни count, spot-check 10 записей.\n4. IDEMPOTENT: можно запустить повторно.\n5. LOGGING: прогресс, ошибки, пропущенные записи.\n6. ROLLBACK: скрипт отката если что-то пошло не так.' + A + '" --completion-promise "DONE"',
   tags:["data-migration","etl","import","export"],difficulty:"advanced",output:"Migration script + validation",related:["rl-db","rl-seed"],prereqs:[],v:"9.1"},

  {id:"rl-dashboard",m:"/ralph-loop",mk:"claude",role:"Admin Dashboard",type:"command",icon:"\u{1F4CA}",ac:"#8b5cf6",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Admin dashboard.\n\nLAYOUT: sidebar (nav) + header (user, search) + main content.\nPAGES:\n- Overview: KPI cards, charts (line/bar/pie), recent activity\n- Users: таблица CRUD, фильтры, поиск, bulk actions\n- Content: управление контентом\n- Settings: app settings, roles, integrations\n\nCOMPONENTS: stat card, chart wrapper, data table, modal form.\nAUTH: admin-only route guard.\nRESPONSIVE: sidebar collapse на mobile.\nCHARTS: recharts / chart.js.' + A + '" --completion-promise "DONE"',
   tags:["dashboard","admin","charts","crud","layout"],difficulty:"advanced",output:"Admin dashboard",related:["rl-table","rl-ui","rl-rbac"],prereqs:[],v:"9.1"},

  {id:"rl-landing",m:"/ralph-loop",mk:"claude",role:"Landing Page",type:"command",icon:"\u{1F3E0}",ac:"#ec4899",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Landing page.\n\nSECTIONS:\n- Hero: headline + subheadline + CTA + hero image\n- Features: 3-6 cards с иконками\n- How it works: 3 steps\n- Testimonials/Social proof\n- Pricing (если SaaS)\n- FAQ accordion\n- Footer: links, social, copyright\n\nDESIGN: modern, clean, mobile-first.\nPERF: static, no client JS where possible.\nSEO: meta tags, structured data, OG image.\nANIMATION: scroll-triggered (IntersectionObserver), subtle.' + A + '" --completion-promise "DONE"',
   tags:["landing","marketing","hero","sections"],difficulty:"intermediate",output:"Landing page",related:["rl-ui","rl-seo","rl-responsive"],prereqs:[],v:"9.1"},

  {id:"rl-onboarding",m:"/ralph-loop",mk:"claude",role:"User Onboarding",type:"command",icon:"\u{1F44B}",ac:"#10b981",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Onboarding flow для новых пользователей.\n\nFLOW:\n1. Welcome screen (имя, роль)\n2. Setup wizard (3-5 шагов, progress bar)\n3. First action prompt (создай первый X)\n4. Feature tour (tooltip highlights)\n5. Completion (celebrate!)\n\nPERSIST: onboarding_completed в user profile.\nSKIP: можно пропустить на любом шаге.\nRESUME: продолжить с последнего шага.\nA/B: track completion rate per variant.' + A + '" --completion-promise "DONE"',
   tags:["onboarding","wizard","tour","ux"],difficulty:"intermediate",output:"Onboarding flow",related:["rl-ui","rl-analytics"],prereqs:[],v:"9.1"},

  {id:"rl-pdf",m:"/ralph-loop",mk:"claude",role:"PDF Generation",type:"command",icon:"\u{1F4C4}",ac:"#dc2626",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Генерация PDF.\n\nLIBRARY: @react-pdf/renderer (React) / puppeteer (HTML→PDF) / jsPDF.\nТЕМПЛАТЫ: invoice, report, certificate.\nSTYLING: брендовые цвета, логотип, footer с номером страницы.\nDATA: динамические данные из API/DB.\nAPI: GET /api/export/pdf?type=invoice&id=123\nDOWNLOAD: Content-Disposition: attachment.\nPREVIEW: просмотр в браузере перед скачиванием.' + A + '" --completion-promise "DONE"',
   tags:["pdf","export","invoice","report","generation"],difficulty:"intermediate",output:"PDF generation",related:["rl-api","rl-email"],prereqs:[],v:"9.1"},

  {id:"rl-import-csv",m:"/ralph-loop",mk:"claude",role:"CSV/Excel Import",type:"command",icon:"\u{1F4E5}",ac:"#16a34a",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Импорт данных из CSV/Excel.\n\nUI: drag-drop зона, preview первых 5 строк, column mapping.\nPARSING: papaparse (CSV) / xlsx (Excel).\nVALIDATION: типы, required fields, duplicates, format.\nERROR REPORT: строка X, колонка Y, ошибка Z.\nIMPORT: batch insert через ORM, progress bar.\nROLLBACK: если >10% ошибок — отменить весь импорт.\nHISTORY: лог импортов (кто, когда, сколько записей).' + A + '" --completion-promise "DONE"',
   tags:["import","csv","excel","upload","validation"],difficulty:"intermediate",output:"CSV/Excel импорт",related:["rl-upload","rl-table"],prereqs:[],v:"9.1"},

  {id:"rl-changelog",m:"/ralph-loop",mk:"claude",role:"Changelog & Releases",type:"command",icon:"\u{1F4DD}",ac:"#475569",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Changelog + release workflow.\n\nCHANGELOG.md: conventional-changelog format.\nSECTIONS: Added, Changed, Fixed, Removed.\nAUTOMATION: changeset / standard-version / release-please.\nGIT TAGS: semantic versioning (v1.2.3).\nGITHUB: create release with notes from changelog.\nCI: auto-generate on merge to main.\nNOTIFY: post to Slack/TG on new release.' + A + '" --completion-promise "DONE"',
   tags:["changelog","release","versioning","semver"],difficulty:"beginner",output:"Changelog + release workflow",related:["rl-ci","cm-pr"],prereqs:[],v:"9.1"},
];

add.forEach(p => { p.compact = p.text.slice(0, 400); });
data.P = [...data.P, ...add];

// Add new combos
data.COMBOS.ru.push(
  { name:"Landing + Marketing", agents:["rl-landing","rl-seo","rl-analytics","rl-responsive"], ids:["rl-landing","rl-seo","rl-analytics","rl-responsive"], desc:"Landing + SEO + аналитика + адаптив" },
  { name:"Admin Panel", agents:["rl-dashboard","rl-table","rl-rbac","rl-forms"], ids:["rl-dashboard","rl-table","rl-rbac","rl-forms"], desc:"Dashboard + таблицы + роли + формы" },
  { name:"Data Operations", agents:["rl-seed","rl-import-csv","rl-pdf","rl-backup"], ids:["rl-seed","rl-import-csv","rl-pdf","rl-backup"], desc:"Сидинг + импорт + PDF + бэкапы" },
);
data.COMBOS.en.push(
  { name:"Landing + Marketing", agents:["rl-landing","rl-seo","rl-analytics","rl-responsive"], ids:["rl-landing","rl-seo","rl-analytics","rl-responsive"], desc:"Landing + SEO + analytics + responsive" },
  { name:"Admin Panel", agents:["rl-dashboard","rl-table","rl-rbac","rl-forms"], ids:["rl-dashboard","rl-table","rl-rbac","rl-forms"], desc:"Dashboard + tables + roles + forms" },
  { name:"Data Operations", agents:["rl-seed","rl-import-csv","rl-pdf","rl-backup"], ids:["rl-seed","rl-import-csv","rl-pdf","rl-backup"], desc:"Seeding + import + PDF + backups" },
);

const json = JSON.stringify(data);
const compressed = deflateSync(json).toString('base64');
const newSrc = src.replace(/const Z = "[^"]+"/, 'const Z = "' + compressed + '"');
fs.writeFileSync('src/App.jsx', newSrc);
console.log('Total prompts:', data.P.length);
console.log('Total combos:', data.COMBOS.ru.length);
console.log('New:', add.map(p => p.id).join(', '));
