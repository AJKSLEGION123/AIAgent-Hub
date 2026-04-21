const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 ПОЛНАЯ РАЗВЕДКА ПРОЕКТА:\nПрочитай ВЕСЬ проект рекурсивно. Изучи структуру, package.json, README, CLAUDE.md, конфиги, точки входа, схему БД, API, тесты, CI/CD, git log. Построй ментальную карту.\n\n";
const A = "\n\nАНТИ-ЛУП: 3 одинаковых ошибки = кардинальная смена подхода.";

const add = [
  {id:"rl-hotfix",m:"/ralph-loop",mk:"claude",role:"Hotfix",type:"command",icon:"\u{1F6A8}",ac:"#dc2626",time:"~15-30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Срочный hotfix.\n\n1. git stash (если есть незакоммиченное)\n2. git checkout main && git pull\n3. git checkout -b hotfix/описание\n4. Найди и исправь баг (минимальное изменение)\n5. Напиши тест воспроизводящий баг\n6. Тесты зелёные, билд ОК\n7. /commit-push-pr' + A + '" --completion-promise "DONE"',
   tags:["hotfix","urgent","bugfix","git"],difficulty:"intermediate",output:"Hotfix PR",related:["rl-bug","cm-pr"],prereqs:[],v:"9.0"},
  {id:"rl-responsive",m:"/ralph-loop",mk:"claude",role:"Responsive Design",type:"command",icon:"\u{1F4F1}",ac:"#0891b2",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Адаптивный дизайн.\n\nBREAKPOINTS: 320px mobile, 768px tablet, 1024px desktop, 1440px wide.\nMobile first. Grid 2-3 колонки. Touch 44x44px. clamp() typography. srcset images. Hamburger/sidebar nav. Tables: scroll/cards на mobile.\nТЕСТ: каждый breakpoint в DevTools.' + A + '" --completion-promise "DONE"',
   tags:["responsive","mobile","css"],difficulty:"intermediate",output:"Адаптивный UI",related:["rl-ui","rl-a11y"],prereqs:[],v:"9.0"},
  {id:"rl-seo",m:"/ralph-loop",mk:"claude",role:"SEO",type:"command",icon:"\u{1F50D}",ac:"#16a34a",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: SEO.\n\nMETA: title 60ch, description 160ch, og:image, twitter:card.\nHTML: semantic, h1 один, alt, lang.\nPERF: LCP<2.5s, CLS<0.1.\nTECH: sitemap.xml, robots.txt, canonical, JSON-LD.\nSSR: pre-render статику.' + A + '" --completion-promise "DONE"',
   tags:["seo","meta","performance"],difficulty:"intermediate",output:"SEO optimized",related:["rl-perf","rl-pwa"],prereqs:[],v:"9.0"},
  {id:"rl-rbac",m:"/ralph-loop",mk:"claude",role:"RBAC Permissions",type:"command",icon:"\u{1F510}",ac:"#7c3aed",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: RBAC.\n\nМОДЕЛЬ: Role (admin/editor/viewer), Permission (CRUD), Resource.\nDB: users, roles, permissions, role_permissions.\nMIDDLEWARE: checkPermission(resource, action).\nUI: скрывать элементы по роли.\nADMIN: управление ролями.\nТЕСТЫ: admin=all, viewer=read, unauthorized=403.' + A + '" --completion-promise "DONE"',
   tags:["rbac","permissions","roles","authorization"],difficulty:"advanced",output:"RBAC система",related:["rl-auth","rl-api"],prereqs:[],v:"9.0"},
  {id:"rl-analytics",m:"/ralph-loop",mk:"claude",role:"Analytics",type:"command",icon:"\u{1F4C8}",ac:"#0ea5e9",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Аналитика.\n\nSETUP: PostHog/Plausible/Umami.\nEVENTS: page_view, click, form_submit, error, sign_up.\nDASHBOARD: DAU/MAU, retention, funnel.\nPRIVACY: GDPR consent, anonymize IP.\nIMPL: trackEvent(name, props), useTrack() hook.' + A + '" --completion-promise "DONE"',
   tags:["analytics","posthog","tracking"],difficulty:"intermediate",output:"Аналитика",related:["rl-deploy"],prereqs:[],v:"9.0"},
  {id:"rl-notif",m:"/ralph-loop",mk:"claude",role:"Notifications",type:"command",icon:"\u{1F514}",ac:"#f59e0b",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Уведомления.\n\nDB: notifications (userId, type, title, body, read, createdAt).\nAPI: GET list, PATCH mark-read, DELETE.\nUI: bell + badge, dropdown, mark all read.\nREAL-TIME: WebSocket/polling 30s.\nEMAIL: critical на email.\nPUSH: Web Push (PWA).\nPREFS: настройки получения.' + A + '" --completion-promise "DONE"',
   tags:["notifications","push","real-time"],difficulty:"intermediate",output:"Notification система",related:["rl-ws","rl-email"],prereqs:[],v:"9.0"},
  {id:"rl-seed",m:"/ralph-loop",mk:"claude",role:"Data Seeding",type:"command",icon:"\u{1F331}",ac:"#22c55e",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Seed data.\n\nСКРИПТ: scripts/seed.ts (faker.js).\nДАННЫЕ: admin + 5 users, 20-50 entities, правильные FK, placeholder images.\nКОМАНДА: pnpm seed.\nIDEMPOTENT: upsert.\nCI: auto seed в test env.' + A + '" --completion-promise "DONE"',
   tags:["seed","database","faker"],difficulty:"beginner",output:"Seed script",related:["rl-db"],prereqs:[],v:"9.0"},
  {id:"rl-infinite",m:"/ralph-loop",mk:"claude",role:"Infinite Scroll",type:"command",icon:"\u{1F503}",ac:"#6366f1",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Infinite scroll.\n\nBACKEND: cursor pagination (GET /items?cursor=X&limit=20).\nFRONTEND: IntersectionObserver + sentinel.\nREACT QUERY: useInfiniteQuery.\nVIRTUAL: @tanstack/react-virtual для 1000+.\nUX: skeleton, pull-to-refresh, scroll-to-top.\nA11Y: aria-live, focus management.' + A + '" --completion-promise "DONE"',
   tags:["infinite-scroll","virtualization","pagination"],difficulty:"intermediate",output:"Infinite scroll",related:["rl-ui","rl-api"],prereqs:[],v:"9.0"},
];

add.forEach(p => { p.compact = p.text.slice(0, 400); });
data.P = [...data.P, ...add];

const json = JSON.stringify(data);
const compressed = deflateSync(json).toString('base64');
const newSrc = src.replace(/const Z = "[^"]+"/, 'const Z = "' + compressed + '"');
fs.writeFileSync('src/App.jsx', newSrc);
console.log('Total prompts:', data.P.length);
console.log('New roles:', add.map(p => p.role).join(', '));
