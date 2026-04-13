const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 ПОЛНАЯ РАЗВЕДКА ПРОЕКТА:\nПрочитай ВЕСЬ проект рекурсивно. Изучи структуру, package.json, README, CLAUDE.md, конфиги, точки входа, схему БД, API, тесты, CI/CD, git log. Построй ментальную карту.\n\n";
const A = "\n\nАНТИ-ЛУП: 3 одинаковых ошибки = кардинальная смена подхода.";

const add = [
  {id:"rl-modal",m:"/ralph-loop",mk:"claude",role:"Modal System",type:"command",icon:"\u{1F5D4}",ac:"#8b5cf6",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Переиспользуемая modal система.\n\nCOMPONENT: <Modal open onClose title size={\"sm\"|\"md\"|\"lg\"|\"full\"}>\nFEATURES: focus trap, Escape close, backdrop click close, scroll lock body, portal (createPortal), animation (fade+scale), nested modals stack.\nVARIANTS: Dialog, Drawer (side), Sheet (bottom), Confirm (yes/no).\nA11Y: role=dialog, aria-modal, aria-labelledby, return focus on close.\nHOOK: useModal() => { open, close, isOpen, Modal }.' + A + '" --completion-promise "DONE"',
   tags:["modal","dialog","drawer","ui"],difficulty:"intermediate",output:"Modal система",related:["rl-ui"],prereqs:[],v:"9.2"},

  {id:"rl-toast-sys",m:"/ralph-loop",mk:"claude",role:"Toast / Snackbar",type:"command",icon:"\u{1F4AC}",ac:"#10b981",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Toast notification система.\n\nAPI: toast.success(msg), toast.error(msg), toast.info(msg), toast.promise(promise, {loading, success, error}).\nUI: stack в углу (top-right), auto-dismiss 3s, progress bar, close button.\nVARIANTS: success (green), error (red), warning (yellow), info (blue).\nANIMATION: slide-in + slide-out.\nA11Y: role=alert, aria-live=polite.\nLIMIT: max 5 visible, queue остальные.' + A + '" --completion-promise "DONE"',
   tags:["toast","notification","snackbar","ui"],difficulty:"beginner",output:"Toast система",related:["rl-ui"],prereqs:[],v:"9.2"},

  {id:"rl-tabs",m:"/ralph-loop",mk:"claude",role:"Tabs & Navigation",type:"command",icon:"\u{1F4D1}",ac:"#0ea5e9",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Tab navigation система.\n\nCOMPONENT: <Tabs>, <TabList>, <Tab>, <TabPanel>.\nFEATURES: URL sync (#tab=name), lazy render panels, animated indicator, overflow scroll, vertical variant.\nA11Y: role=tablist/tab/tabpanel, aria-selected, arrow key navigation, Home/End.\nRESPONSIVE: horizontal scroll на mobile, dropdown на narrow.\nROUTER: интеграция с router (optional).' + A + '" --completion-promise "DONE"',
   tags:["tabs","navigation","ui","a11y"],difficulty:"beginner",output:"Tab компоненты",related:["rl-ui","rl-a11y"],prereqs:[],v:"9.2"},

  {id:"rl-breadcrumb",m:"/ralph-loop",mk:"claude",role:"Breadcrumbs & Navigation",type:"command",icon:"\u{1F9ED}",ac:"#64748b",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Навигация: breadcrumbs + sidebar + mobile nav.\n\nBREADCRUMBS: auto-generate из route path, truncate на mobile.\nSIDEBAR: collapsible, active state, nested groups, responsive (drawer на mobile).\nMOBILE NAV: bottom tab bar, hamburger menu.\nA11Y: nav landmarks, aria-current, skip nav link.\nACTIVE STATE: highlight current route.' + A + '" --completion-promise "DONE"',
   tags:["breadcrumbs","sidebar","navigation","mobile"],difficulty:"beginner",output:"Navigation система",related:["rl-ui","rl-responsive"],prereqs:[],v:"9.2"},

  {id:"rl-theme",m:"/ralph-loop",mk:"claude",role:"Design Tokens & Theme",type:"command",icon:"\u{1F3A8}",ac:"#ec4899",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Design tokens + theme система.\n\nTOKENS: colors (primary, secondary, neutral, semantic), spacing (4/8/12/16/24/32/48/64), typography (sizes, weights, line-heights), radii, shadows, breakpoints.\nFORMAT: CSS custom properties + TypeScript constants.\nTHEME: light + dark, easy to add custom themes.\nCOMPONENTS: все используют tokens, не хардкод.\nDOCS: storybook или standalone page с visual reference.' + A + '" --completion-promise "DONE"',
   tags:["design-tokens","theme","css-variables","design-system"],difficulty:"intermediate",output:"Design tokens + theme",related:["rl-dark","rl-ui","rl-storybook"],prereqs:[],v:"9.2"},

  {id:"rl-drag",m:"/ralph-loop",mk:"claude",role:"Drag & Drop",type:"command",icon:"\u{1F91A}",ac:"#f97316",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Drag and drop.\n\nLIBRARY: @dnd-kit/core (React) или native HTML5 DnD.\nUSE CASES: reorder list, kanban board, file drop zone.\nFEATURES: drag handle, drop indicator, auto-scroll at edges, touch support.\nA11Y: keyboard reorder (Space to grab, Arrow to move, Space to drop).\nPERSIST: сохранять порядок в DB/localStorage.\nANIMATION: smooth transition при перемещении.' + A + '" --completion-promise "DONE"',
   tags:["drag-drop","dnd","kanban","reorder"],difficulty:"intermediate",output:"Drag & Drop",related:["rl-ui","rl-table"],prereqs:[],v:"9.2"},

  {id:"rl-kanban",m:"/ralph-loop",mk:"claude",role:"Kanban Board",type:"command",icon:"\u{1F4CB}",ac:"#6366f1",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Kanban board.\n\nCOLUMNS: configurable (Todo, In Progress, Review, Done).\nCARDS: title, description, assignee, priority, labels, due date.\nDRAG: between columns + reorder within column.\nFILTERS: by assignee, priority, label.\nAPI: PATCH /api/tasks/:id { status, order }.\nREAL-TIME: optimistic update + server sync.\nRESPONSIVE: horizontal scroll, card stack на mobile.' + A + '" --completion-promise "DONE"',
   tags:["kanban","board","tasks","drag-drop","project-management"],difficulty:"advanced",output:"Kanban board",related:["rl-drag","rl-ui","rl-ws"],prereqs:[],v:"9.2"},

  {id:"rl-chat",m:"/ralph-loop",mk:"claude",role:"Chat / Messaging",type:"command",icon:"\u{1F4AC}",ac:"#0891b2",time:"~2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Chat / messaging.\n\nDB: conversations, messages (senderId, text, createdAt, readAt).\nAPI: GET conversations, GET messages (cursor pagination), POST message.\nWEBSOCKET: real-time delivery, typing indicator, online status.\nUI: conversation list, message thread, input with attachments, read receipts.\nFEATURES: emoji picker, file sharing, reply to message, search.\nNOTIFICATIONS: unread badge, push notification.' + A + '" --completion-promise "DONE"',
   tags:["chat","messaging","real-time","websocket"],difficulty:"advanced",output:"Chat система",related:["rl-ws","rl-ui","rl-upload"],prereqs:[],v:"9.2"},

  {id:"rl-map",m:"/ralph-loop",mk:"claude",role:"Map Integration",type:"command",icon:"\u{1F5FA}",ac:"#059669",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Карта с маркерами.\n\nLIBRARY: Leaflet / Mapbox GL / Google Maps.\nFEATURES: markers с popup, clustering, current location, search address (geocoding), draw areas.\nRESPONSIVE: full width, touch zoom/pan.\nPERF: lazy load map library, virtual markers для 1000+.\nA11Y: keyboard navigation, alt text для markers.' + A + '" --completion-promise "DONE"',
   tags:["map","leaflet","mapbox","geocoding","markers"],difficulty:"intermediate",output:"Map интеграция",related:["rl-ui"],prereqs:[],v:"9.2"},

  {id:"rl-calendar",m:"/ralph-loop",mk:"claude",role:"Calendar / Scheduler",type:"command",icon:"\u{1F4C5}",ac:"#dc2626",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Calendar / scheduler.\n\nVIEWS: month, week, day, agenda.\nFEATURES: create/edit/delete events, drag to resize, drag to move, recurring events, all-day events.\nAPI: CRUD events with start/end datetime.\nUI: color-coded categories, today highlight, mini calendar.\nTIMEZONE: user timezone, display in local time.\nEXPORT: iCal format.' + A + '" --completion-promise "DONE"',
   tags:["calendar","scheduler","events","date-picker"],difficulty:"advanced",output:"Calendar",related:["rl-ui","rl-drag"],prereqs:[],v:"9.2"},

  {id:"rl-filter",m:"/ralph-loop",mk:"claude",role:"Advanced Filters",type:"command",icon:"\u{1F50E}",ac:"#8b5cf6",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Продвинутая система фильтров.\n\nUI: filter bar с chips, each filter = dropdown/range/date/multi-select.\nURL SYNC: filters в URL query params (?status=active&sort=date).\nPRESETS: saved filter combinations.\nCOUNT: показывать количество результатов при выборе.\nCLEAR: clear all / clear individual.\nMOBILE: bottom sheet с фильтрами.\nAPI: передавать filters как query params, серверная фильтрация.' + A + '" --completion-promise "DONE"',
   tags:["filters","search","url-params","chips"],difficulty:"intermediate",output:"Фильтры + URL sync",related:["rl-search","rl-table","rl-ui"],prereqs:[],v:"9.2"},

  {id:"rl-settings",m:"/ralph-loop",mk:"claude",role:"Settings Page",type:"command",icon:"\u{2699}",ac:"#475569",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Страница настроек.\n\nSECTIONS: Profile, Account, Notifications, Appearance, Security, Integrations.\nPROFILE: avatar upload, name, email, bio.\nACCOUNT: change password, delete account (danger zone).\nNOTIFICATIONS: toggle per type (email, push, in-app).\nAPPEARANCE: theme (light/dark/system), language, density.\nSECURITY: 2FA, sessions, API keys.\nSAVE: auto-save per section или explicit save button.' + A + '" --completion-promise "DONE"',
   tags:["settings","profile","preferences","account"],difficulty:"intermediate",output:"Settings page",related:["rl-ui","rl-forms","rl-auth"],prereqs:[],v:"9.2"},

  {id:"rl-wizard",m:"/ralph-loop",mk:"claude",role:"Multi-Step Wizard",type:"command",icon:"\u{1F9D9}",ac:"#7c3aed",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Multi-step wizard / form.\n\nCOMPONENT: <Wizard steps={[...]}> с progress bar.\nSTEPS: each step = separate form section.\nNAVIGATION: next/prev, step indicator, click on completed step.\nVALIDATION: validate per step before allowing next.\nSTATE: persist between steps (context/zustand), save draft.\nRESUME: return to last incomplete step.\nSUBMIT: final review step before submit.' + A + '" --completion-promise "DONE"',
   tags:["wizard","multi-step","form","stepper"],difficulty:"intermediate",output:"Multi-step wizard",related:["rl-forms","rl-ui","rl-onboarding"],prereqs:[],v:"9.2"},

  {id:"rl-animation",m:"/ralph-loop",mk:"claude",role:"Animations & Transitions",type:"command",icon:"\u{2728}",ac:"#f59e0b",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Анимации и переходы.\n\nPAGE TRANSITIONS: fade/slide between routes.\nLIST ANIMATIONS: stagger enter, exit animation (AnimatePresence).\nSCROLL: parallax, reveal on scroll (IntersectionObserver).\nMICRO: button press, hover lift, input focus glow.\nLOADING: skeleton shimmer, spinner, progress bar.\nLIBRARY: framer-motion / CSS transitions / Web Animations API.\nPERF: GPU-accelerated (transform, opacity), prefers-reduced-motion.' + A + '" --completion-promise "DONE"',
   tags:["animation","transitions","framer-motion","ux"],difficulty:"intermediate",output:"Анимации",related:["rl-ui","rl-perf"],prereqs:[],v:"9.2"},

  {id:"rl-oauth",m:"/ralph-loop",mk:"claude",role:"OAuth / Social Login",type:"command",icon:"\u{1F511}",ac:"#1e40af",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: OAuth / social login.\n\nPROVIDERS: Google, GitHub, (Discord/Apple optional).\nFLOW: redirect → callback → create/link user → session.\nDB: accounts table (provider, providerAccountId, userId).\nUI: \"Sign in with Google\" buttons, link/unlink in settings.\nSECURITY: state parameter (CSRF), PKCE, secure token storage.\nLIBRARY: arctic / next-auth / lucia-auth / passport.' + A + '" --completion-promise "DONE"',
   tags:["oauth","social-login","google","github","auth"],difficulty:"advanced",output:"OAuth login",related:["rl-auth"],prereqs:[],v:"9.2"},

  {id:"rl-api-versioning",m:"/ralph-loop",mk:"claude",role:"API Versioning",type:"command",icon:"\u{1F522}",ac:"#d97706",time:"~30m",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: API versioning.\n\nSTRATEGY: URL prefix (/api/v1/, /api/v2/) или header (Accept: application/vnd.app.v2+json).\nSTRUCTURE: src/api/v1/, src/api/v2/ — раздельные route files.\nBACKWARDS COMPAT: v1 работает пока не deprecated.\nMIGRATION: guide для клиентов при переходе.\nDEPRECATION: Sunset header, warning в response.\nDOCS: версионированная документация.' + A + '" --completion-promise "DONE"',
   tags:["api-versioning","backwards-compat","deprecation"],difficulty:"intermediate",output:"Versioned API",related:["rl-api","rl-api-doc"],prereqs:[],v:"9.2"},

  {id:"rl-microservice",m:"/ralph-loop",mk:"claude",role:"Microservice Setup",type:"command",icon:"\u{1F300}",ac:"#6366f1",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Микросервис.\n\nSTRUCTURE: src/ с handlers, services, models, config.\nAPI: REST или gRPC, health check, graceful shutdown.\nCONFIG: env-based, validated at startup.\nDB: собственная БД (database per service).\nMESSAGING: event bus (Redis pub/sub, RabbitMQ, Kafka).\nDOCKER: Dockerfile + docker-compose для local dev.\nMONITORING: structured logging, metrics endpoint, tracing.\nTESTS: unit + integration + contract tests.' + A + '" --completion-promise "DONE"',
   tags:["microservice","architecture","event-bus","docker"],difficulty:"advanced",output:"Микросервис",related:["rl-docker","rl-api","rl-logging"],prereqs:[],v:"9.2"},

  {id:"rl-webhook",m:"/ralph-loop",mk:"claude",role:"Webhook System",type:"command",icon:"\u{1F4E1}",ac:"#0891b2",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Webhook система (отправка).\n\nDB: webhooks (url, events, secret, active), webhook_logs (attempt, status, response).\nAPI: CRUD webhooks, test webhook, view logs.\nSENDING: POST с JSON payload, HMAC signature (X-Webhook-Signature).\nRETRY: exponential backoff (1s, 5s, 30s, 5m), max 5 attempts.\nUI: управление webhooks, logs с status.\nSECURITY: signature verification example в docs.' + A + '" --completion-promise "DONE"',
   tags:["webhook","events","integration","api"],difficulty:"intermediate",output:"Webhook система",related:["rl-api","rl-cron"],prereqs:[],v:"9.2"},

  {id:"rl-cli-tool",m:"/ralph-loop",mk:"claude",role:"CLI Tool",type:"command",icon:"\u{1F4BB}",ac:"#22c55e",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: CLI инструмент.\n\nFRAMEWORK: commander / yargs / citty (Node) / click (Python).\nCOMMANDS: init, create, build, deploy, config.\nUI: chalk colors, ora spinners, inquirer prompts, table output.\nCONFIG: .toolrc.json в home dir.\nERROR HANDLING: friendly error messages, --verbose flag.\nTEST: unit tests для каждой команды.\nPUBLISH: npx support, npm publish, bin field в package.json.' + A + '" --completion-promise "DONE"',
   tags:["cli","command-line","tool","npm","publish"],difficulty:"intermediate",output:"CLI tool",related:["rl-feat"],prereqs:[],v:"9.2"},

  {id:"rl-2fa",m:"/ralph-loop",mk:"claude",role:"Two-Factor Auth",type:"command",icon:"\u{1F512}",ac:"#dc2626",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Two-factor authentication (2FA).\n\nTOTP: otpauth library, QR code generation (qrcode).\nFLOW: enable 2FA → scan QR → verify code → save secret.\nLOGIN: password → 2FA code → session.\nBACKUP CODES: generate 10, hash stored, one-time use.\nDB: user.twoFactorSecret, user.twoFactorEnabled, backup_codes table.\nUI: setup wizard, QR display, code input (6 digits, auto-submit).\nSECURITY: rate limit attempts, brute force protection.' + A + '" --completion-promise "DONE"',
   tags:["2fa","totp","security","authentication","qr"],difficulty:"advanced",output:"2FA система",related:["rl-auth","sc-audit"],prereqs:[],v:"9.2"},
];

add.forEach(p => { p.compact = p.text.slice(0, 400); });
data.P = [...data.P, ...add];

// Add more combos
data.COMBOS.ru.push(
  { name:"UI Kit", agents:["rl-modal","rl-toast-sys","rl-tabs","rl-skeleton","rl-theme"], ids:["rl-modal","rl-toast-sys","rl-tabs","rl-skeleton","rl-theme"], desc:"Modal + toast + tabs + skeleton + theme" },
  { name:"Interactive App", agents:["rl-kanban","rl-drag","rl-calendar","rl-chat"], ids:["rl-kanban","rl-drag","rl-calendar","rl-chat"], desc:"Kanban + drag&drop + calendar + chat" },
  { name:"Auth Complete", agents:["rl-auth","rl-oauth","rl-2fa","rl-rbac"], ids:["rl-auth","rl-oauth","rl-2fa","rl-rbac"], desc:"Auth + OAuth + 2FA + RBAC" },
);
data.COMBOS.en.push(
  { name:"UI Kit", agents:["rl-modal","rl-toast-sys","rl-tabs","rl-skeleton","rl-theme"], ids:["rl-modal","rl-toast-sys","rl-tabs","rl-skeleton","rl-theme"], desc:"Modal + toast + tabs + skeleton + theme" },
  { name:"Interactive App", agents:["rl-kanban","rl-drag","rl-calendar","rl-chat"], ids:["rl-kanban","rl-drag","rl-calendar","rl-chat"], desc:"Kanban + drag&drop + calendar + chat" },
  { name:"Auth Complete", agents:["rl-auth","rl-oauth","rl-2fa","rl-rbac"], ids:["rl-auth","rl-oauth","rl-2fa","rl-rbac"], desc:"Auth + OAuth + 2FA + RBAC" },
);

const json = JSON.stringify(data);
const compressed = deflateSync(json).toString('base64');
const newSrc = src.replace(/const Z = "[^"]+"/, 'const Z = "' + compressed + '"');
fs.writeFileSync('src/App.jsx', newSrc);
console.log('Total prompts:', data.P.length);
console.log('Total combos:', data.COMBOS.ru.length);
