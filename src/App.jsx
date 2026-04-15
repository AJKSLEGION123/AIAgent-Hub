import { useState, useCallback, useMemo, useEffect, useRef, memo, Component } from "react";

/* ═══════════════════════════════════════════════
   TRANSLATIONS
   ═══════════════════════════════════════════════ */
const T = {
  ru: {
    title: "AIAgent-Hub",
    subtitle: "Мультиагентная система разработки",
    copy: "Копировать", copied: "Скопировано ✓", show: "Развернуть", hide: "Свернуть", lines: "строк",
    search: "Поиск промтов...",
    expandAll: "Развернуть все", collapseAll: "Свернуть все",
    setup: "Git Worktree Setup", setupDesc: "Изоляция агентов через git worktree",
    launch: "Команды запуска", launchDesc: "Запуск каждого агента в своём терминале",
    tipTitle: "Быстрый старт",
    tip: "1. Выбери промт для задачи  2. Скопируй команду (начинается с /ralph-loop, /feature-dev и др.)  3. Вставь в Claude Code CLI  4. Агент изучит проект и работает автономно",
    all: "Все", byModel: "Модели", byRole: "Роли", byType: "Задачи",
    roles: "Роли", tasks: "Спец. задачи",
    prompts: "промтов", models: "модели", categories: "категорий",
    r: { "Feature Development":"Разработка фич","Guided Feature Dev":"Фичи (guided)","API Endpoints":"API эндпоинты","UI Components":"UI компоненты","Database & Migration":"БД и миграции","Authentication":"Аутентификация","PR Review":"Ревью PR","Code Review":"Ревью кода","Simplification":"Упрощение","TDD Development":"TDD разработка","Test Suite":"Набор тестов","E2E Tests":"E2E тесты","Bug Fix":"Исправление багов","Error Handling":"Обработка ошибок","Deep Refactoring":"Рефакторинг","Dead Code Removal":"Удаление мёртвого кода","Security Audit":"Security аудит","Security Fix":"Security фикс","Performance":"Производительность","CI/CD Pipeline":"CI/CD","Docker Setup":"Docker","Architecture Review":"Архитектура","Smart Commit":"Коммит","Commit + PR":"Коммит + PR","Auto Watch & Fix":"Авто-мониторинг","Overnight Work":"Ночная работа","Full Project Setup":"Настройка проекта","Multi-Agent":"Мульти-агент","i18n":"Локализация","Accessibility":"Доступность","Dependency Update":"Зависимости","Production Deploy":"Деплой","README + CLAUDE.md":"Документация","State Management":"State","Dark Mode":"Тёмная тема","Form System":"Формы","Search":"Поиск","Data Table":"Таблицы","AI/LLM Integration":"AI/LLM","WebSocket":"WebSocket","Environment Config":"Env конфиг","Framework Migration":"Миграция FW","Legacy Modernization":"Модернизация","Logging & Monitoring":"Логирование","Type Safety":"Типизация","PWA":"PWA","Payments":"Платежи","Caching":"Кэширование","Bundle Optimization":"Бандл","API Docs":"API Docs","Monorepo":"Монорепо","Email System":"Email","File Upload":"Загрузка файлов","Background Jobs":"Фоновые задачи","GraphQL":"GraphQL","Storybook":"Storybook","Hotfix":"Хотфикс","Responsive Design":"Адаптив","SEO":"SEO","RBAC Permissions":"RBAC/Роли","Analytics":"Аналитика","Notifications":"Уведомления","Data Seeding":"Сидинг данных","Infinite Scroll":"Бесконечный скролл","Project Scaffolding":"Scaffold","Error & Loading States":"Error/Loading","Rate Limiting":"Rate Limiting","Image Optimization":"Оптим. картинок","Multi-Environment":"Multi-Env","Backup & Restore":"Бэкапы","Loading Skeletons":"Скелетоны","Testing Strategy":"Тест-стратегия","API Client Layer":"API клиент","Data Migration":"Миграция данных","Admin Dashboard":"Админ-панель","Landing Page":"Лендинг","User Onboarding":"Онбординг","PDF Generation":"PDF генерация","CSV/Excel Import":"Импорт CSV","Changelog & Releases":"Релизы","Modal System":"Модалки","Toast / Snackbar":"Toast","Tabs & Navigation":"Табы","Breadcrumbs & Navigation":"Навигация","Design Tokens & Theme":"Дизайн-токены","Drag & Drop":"Drag & Drop","Kanban Board":"Kanban","Chat / Messaging":"Чат","Map Integration":"Карта","Calendar / Scheduler":"Календарь","Advanced Filters":"Фильтры","Settings Page":"Настройки","Multi-Step Wizard":"Wizard","Animations & Transitions":"Анимации","OAuth / Social Login":"OAuth","API Versioning":"Версионирование API","Microservice Setup":"Микросервис","Webhook System":"Вебхуки","CLI Tool":"CLI инструмент","Two-Factor Auth":"2FA","FastAPI App":"FastAPI","Django App":"Django","Python Package":"Python пакет","Go REST API":"Go API","Tailwind CSS Setup":"Tailwind","Next.js App Router":"Next.js","Code Review Checklist":"PR чеклист","Production Debugging":"Дебаг prod","Performance Audit":"Perf аудит","Database Optimization":"Оптим. БД","Rust App":"Rust","Vue 3 App":"Vue 3","SvelteKit App":"SvelteKit","tRPC Setup":"tRPC","React Testing":"React тесты","Supabase Integration":"Supabase","Docker Optimization":"Docker оптим.","Monitoring Stack":"Мониторинг","Terraform IaC":"Terraform","Kubernetes Deploy":"Kubernetes","Redis Integration":"Redis","MongoDB Setup":"MongoDB","PostgreSQL Advanced":"PostgreSQL","React Native App":"React Native","RAG Pipeline":"RAG","Multi-Tenancy":"Multi-tenant","Billing & Subscriptions":"Биллинг","Nginx Configuration":"Nginx","SSL / HTTPS Setup":"SSL/HTTPS","Message Queue":"Очереди","Event-Driven Architecture":"Event-Driven","GraphQL Subscriptions":"GQL Subscriptions","CQRS Pattern":"CQRS","Rich Text Editor":"Редактор","Data Visualization":"Визуализация","Advanced Table Features":"Таблицы Pro","Contract Testing":"Contract тесты","Load Testing":"Нагрузка","CORS Configuration":"CORS","Content Security Policy":"CSP","Dev Container":"Dev Container","Turborepo Optimization":"Turborepo","Feature Flags":"Feature Flags","Retry & Circuit Breaker":"Retry/CB","Visual Regression Testing":"Visual Regression","API Gateway":"API Gateway","CI/CD Advanced":"CI/CD Pro","OpenAPI Spec":"OpenAPI","Error Tracking":"Error Tracking","Caching Patterns":"Паттерны кэша" },
    teamSetup: "Полная установка команды", teamSetupDesc: "Копируй один скрипт — создаёт worktree, папки координации, конфиги и запускает агентов",
    configs: "Конфиг-файлы", configsDesc: "Шаблоны CLAUDE.md, GEMINI.md, AGENTS.md для проекта",
    combos: "Рекомендуемые команды", combosDesc: "Готовые комбинации агентов для разных сценариев",
    structure: "Структура проекта", structureDesc: "Шаблон файловой структуры для мультиагентной координации",
    copyFiltered: "Копировать все отфильтрованные",
  },
  en: {
    title: "AIAgent-Hub",
    subtitle: "Multi-agent development system",
    copy: "Copy", copied: "Copied ✓", show: "Expand", hide: "Collapse", lines: "lines",
    search: "Search prompts...",
    expandAll: "Expand all", collapseAll: "Collapse all",
    setup: "Git Worktree Setup", setupDesc: "Agent isolation via git worktree",
    launch: "Launch Commands", launchDesc: "Start each agent in its own terminal",
    tipTitle: "Quick Start",
    tip: "1. Pick a prompt for your task  2. Copy the command (/ralph-loop, /feature-dev, etc.)  3. Paste into Claude Code CLI  4. Agent explores the project and works autonomously",
    all: "All", byModel: "Models", byRole: "Roles", byType: "Tasks",
    roles: "Roles", tasks: "Special tasks",
    prompts: "prompts", models: "models", categories: "categories",
    r: { "Feature Development":"Feature Development","Guided Feature Dev":"Guided Feature Dev","API Endpoints":"API Endpoints","UI Components":"UI Components","Database & Migration":"Database & Migration","Authentication":"Authentication","PR Review":"PR Review","Code Review":"Code Review","Simplification":"Simplification","TDD Development":"TDD Development","Test Suite":"Test Suite","E2E Tests":"E2E Tests","Bug Fix":"Bug Fix","Error Handling":"Error Handling","Deep Refactoring":"Deep Refactoring","Dead Code Removal":"Dead Code Removal","Security Audit":"Security Audit","Security Fix":"Security Fix","Performance":"Performance","CI/CD Pipeline":"CI/CD Pipeline","Docker Setup":"Docker Setup","Architecture Review":"Architecture Review","Smart Commit":"Smart Commit","Commit + PR":"Commit + PR","Auto Watch & Fix":"Auto Watch & Fix","Overnight Work":"Overnight Work","Full Project Setup":"Full Project Setup","Multi-Agent":"Multi-Agent","i18n":"i18n","Accessibility":"Accessibility","Dependency Update":"Dependency Update","Production Deploy":"Production Deploy","README + CLAUDE.md":"README + CLAUDE.md","State Management":"State Management","Dark Mode":"Dark Mode","Form System":"Form System","Search":"Search","Data Table":"Data Table","AI/LLM Integration":"AI/LLM Integration","WebSocket":"WebSocket","Environment Config":"Environment Config","Framework Migration":"Framework Migration","Legacy Modernization":"Legacy Modernization","Logging & Monitoring":"Logging & Monitoring","Type Safety":"Type Safety","PWA":"PWA","Payments":"Payments","Caching":"Caching","Bundle Optimization":"Bundle Optimization","API Docs":"API Docs","Monorepo":"Monorepo","Email System":"Email System","File Upload":"File Upload","Background Jobs":"Background Jobs","GraphQL":"GraphQL","Storybook":"Storybook","Hotfix":"Hotfix","Responsive Design":"Responsive Design","SEO":"SEO","RBAC Permissions":"RBAC Permissions","Analytics":"Analytics","Notifications":"Notifications","Data Seeding":"Data Seeding","Infinite Scroll":"Infinite Scroll","Project Scaffolding":"Scaffolding","Error & Loading States":"Error/Loading","Rate Limiting":"Rate Limiting","Image Optimization":"Image Optim.","Multi-Environment":"Multi-Env","Backup & Restore":"Backup","Loading Skeletons":"Skeletons","Testing Strategy":"Test Strategy","API Client Layer":"API Client","Data Migration":"Data Migration","Admin Dashboard":"Admin Dashboard","Landing Page":"Landing Page","User Onboarding":"Onboarding","PDF Generation":"PDF Generation","CSV/Excel Import":"CSV Import","Changelog & Releases":"Releases","Modal System":"Modals","Toast / Snackbar":"Toast","Tabs & Navigation":"Tabs","Breadcrumbs & Navigation":"Navigation","Design Tokens & Theme":"Design Tokens","Drag & Drop":"Drag & Drop","Kanban Board":"Kanban","Chat / Messaging":"Chat","Map Integration":"Map","Calendar / Scheduler":"Calendar","Advanced Filters":"Filters","Settings Page":"Settings","Multi-Step Wizard":"Wizard","Animations & Transitions":"Animations","OAuth / Social Login":"OAuth","API Versioning":"API Versioning","Microservice Setup":"Microservice","Webhook System":"Webhooks","CLI Tool":"CLI Tool","Two-Factor Auth":"2FA","FastAPI App":"FastAPI","Django App":"Django","Python Package":"Python Package","Go REST API":"Go API","Tailwind CSS Setup":"Tailwind","Next.js App Router":"Next.js","Code Review Checklist":"PR Checklist","Production Debugging":"Prod Debug","Performance Audit":"Perf Audit","Database Optimization":"DB Optimization","Rust App":"Rust","Vue 3 App":"Vue 3","SvelteKit App":"SvelteKit","tRPC Setup":"tRPC","React Testing":"React Testing","Supabase Integration":"Supabase","Docker Optimization":"Docker Optim.","Monitoring Stack":"Monitoring","Terraform IaC":"Terraform","Kubernetes Deploy":"Kubernetes","Redis Integration":"Redis","MongoDB Setup":"MongoDB","PostgreSQL Advanced":"PostgreSQL","React Native App":"React Native","RAG Pipeline":"RAG","Multi-Tenancy":"Multi-Tenant","Billing & Subscriptions":"Billing","Nginx Configuration":"Nginx","SSL / HTTPS Setup":"SSL/HTTPS","Message Queue":"Queues","Event-Driven Architecture":"Event-Driven","GraphQL Subscriptions":"GQL Subs","CQRS Pattern":"CQRS","Rich Text Editor":"Rich Editor","Data Visualization":"Data Viz","Advanced Table Features":"Table Pro","Contract Testing":"Contract Tests","Load Testing":"Load Testing","CORS Configuration":"CORS","Content Security Policy":"CSP","Dev Container":"Dev Container","Turborepo Optimization":"Turborepo","Feature Flags":"Feature Flags","Retry & Circuit Breaker":"Retry/CB","Visual Regression Testing":"Visual Regression","API Gateway":"API Gateway","CI/CD Advanced":"CI/CD Advanced","OpenAPI Spec":"OpenAPI","Error Tracking":"Error Tracking","Caching Patterns":"Cache Patterns" },
    teamSetup: "Full Team Setup", teamSetupDesc: "Copy one script — creates worktrees, coordination folders, configs, and launches agents",
    configs: "Config Files", configsDesc: "CLAUDE.md, GEMINI.md, AGENTS.md templates for your project",
    combos: "Recommended Teams", combosDesc: "Ready-made agent combinations for different scenarios",
    structure: "Project Structure", structureDesc: "File structure template for multi-agent coordination",
    copyFiltered: "Copy all filtered",
  },
  kk: {
    title: "AIAgent-Hub",
    subtitle: "Мультиагентті әзірлеу жүйесі",
    copy: "Көшіру", copied: "Көшірілді ✓", show: "Ашу", hide: "Жабу", lines: "жол",
    search: "Промпттарды іздеу...",
    expandAll: "Барлығын ашу", collapseAll: "Барлығын жабу",
    setup: "Git Worktree Setup", setupDesc: "Git worktree арқылы агенттерді оқшаулау",
    launch: "Іске қосу командалары", launchDesc: "Әр агентті өз терминалында іске қосу",
    tipTitle: "Жылдам бастау",
    tip: "1. Git Worktree Setup орындаңыз  2. Әр агент үшін терминалдарды ашыңыз  3. Бірінші сұранысқа промпт қойыңыз  4. Агенттер толығымен автономды жұмыс істейді",
    all: "Барлық", byModel: "Модельдер", byRole: "Рөлдер", byType: "Тапсырмалар",
    roles: "Рөлдер", tasks: "Арнайы тапсырмалар",
    prompts: "промпт", models: "модель", categories: "категория",
    r: {},
    teamSetup: "Толық команда орнату", teamSetupDesc: "Бір скриптті көшіріңіз — worktree, үйлестіру қалталарын, конфигтерді жасайды",
    configs: "Конфиг файлдар", configsDesc: "CLAUDE.md, GEMINI.md, AGENTS.md үлгілері",
    combos: "Ұсынылған командалар", combosDesc: "Түрлі сценарийлерге дайын агент комбинациялары",
    structure: "Жоба құрылымы", structureDesc: "Мультиагентті үйлестіру үшін файл құрылымы үлгісі",
    copyFiltered: "Сүзілгендерді көшіру",
  },
};

/* ═══════════════════════════════════════════════
   THEME & CONSTANTS (task 2,5: style consolidation)
   ═══════════════════════════════════════════════ */
const TH = {
  dark: { bg:"#060609", bg2:"#0c0c12", card:"#0e0e16", cardH:"#12121c", brd:"#1a1a28", brdH:"#252538", text:"#ddddef", mut:"#8888a0", dim:"#555577", surf:"#0a0a10", glow:"rgba(99,102,241,0.04)", meta:"#060609" },
  light: { bg:"#f0f0f5", bg2:"#e8e8ef", card:"#ffffff", cardH:"#f8f8fc", brd:"#d8d8e4", brdH:"#c0c0d4", text:"#12122a", mut:"#555570", dim:"#8888a8", surf:"#eaeaf0", glow:"rgba(99,102,241,0.06)", meta:"#f0f0f5" },
};
const MC = { claude:"#f97316" };
const ML = { claude:"Claude Code" };
const MI = { claude:"C" };
const font = "'JetBrains Mono','IBM Plex Mono','Fira Code',monospace";
const alpha = (hex, a) => hex + Math.round(a*255).toString(16).padStart(2,'0');

/* ═══════════════════════════════════════════════
   COMPRESSED DATA
   ═══════════════════════════════════════════════ */
const Z = "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";

async function _d(b, onProgress) {
  if (typeof DecompressionStream === "undefined") throw new Error("Browser too old: DecompressionStream not supported. Use Chrome 80+, Firefox 113+, Safari 16.4+.");
  const r = Uint8Array.from(atob(b), c => c.charCodeAt(0));
  const totalBytes = r.length;
  if (onProgress) onProgress(0.1);
  const s = new DecompressionStream("deflate");
  const w = s.writable.getWriter();
  w.write(r); w.close();
  if (onProgress) onProgress(0.3);
  const rd = s.readable.getReader();
  const ch = [];
  let received = 0;
  for (;;) { 
    const { done, value } = await rd.read(); 
    if (done) break; 
    ch.push(value);
    received += value.length;
    if (onProgress) onProgress(0.3 + 0.6 * Math.min(1, received / (totalBytes * 2.5)));
  }
  if (onProgress) onProgress(0.95);
  const t = new Uint8Array(ch.reduce((a, c) => a + c.length, 0));
  let o = 0;
  for (const c of ch) { t.set(c, o); o += c.length; }
  const result = JSON.parse(new TextDecoder().decode(t));
  if (onProgress) onProgress(1);
  return result;
}

/* ═══════════════════════════════════════════════
   GLOBAL CSS (tasks: 003, 011, 013, 014, 015, 022, 025, 104)
   ═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{color-scheme:dark}
[data-theme="light"]{color-scheme:light}
::selection{background:#6366f140;color:inherit}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#333;border-radius:3px}
[data-theme="light"] ::-webkit-scrollbar-thumb{background:#ccc}
input:focus{border-color:var(--brdH)!important;box-shadow:0 0 0 3px rgba(99,102,241,0.1)}
button:focus-visible{outline:2px solid #6366f1;outline-offset:2px}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideDown{from{max-height:0;opacity:0}to{max-height:600px;opacity:1}}
@keyframes pulse{0%,100%{opacity:.3;width:30%}50%{opacity:1;width:80%}}
@keyframes toastIn{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes toastOut{from{opacity:1}to{opacity:0;transform:translateY(-10px)}}
@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
.skeleton{background:linear-gradient(90deg,#1a1a28 25%,#252538 50%,#1a1a28 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px}
[data-theme="light"] .skeleton{background:linear-gradient(90deg,#e8e8ef 25%,#d8d8e4 50%,#e8e8ef 75%);background-size:200% 100%}
.card-enter{animation:fadeIn .2s ease;will-change:opacity,transform}
.body-enter{animation:slideDown .25s ease;overflow:hidden;will-change:max-height,opacity}
.toast{position:fixed;top:12px;right:12px;z-index:999;padding:6px 14px;border-radius:6px;font-size:10px;font-weight:600;pointer-events:none;animation:toastIn .15s ease,toastOut .2s ease 1.2s forwards;will-change:transform,opacity;max-width:200px}
.sticky-bar{position:sticky;top:0;z-index:10;padding:12px 0 8px;margin:0 -16px;padding-left:16px;padding-right:16px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
@media(max-width:640px){
  .hide-mobile{display:none!important}
  .stack-mobile{flex-direction:column!important}
  .full-mobile{width:100%!important;min-width:0!important}
  .gap-mobile{gap:4px!important}
  .text-sm-mobile{font-size:10px!important}
  .pad-mobile{padding:8px 10px!important}
}
@media(prefers-reduced-motion:reduce){*{animation-duration:0s!important;transition-duration:0s!important}}
.skip-link{position:absolute;top:-40px;left:0;background:#6366f1;color:#fff;padding:8px 16px;z-index:100;border-radius:0 0 8px 0;font-size:12px;text-decoration:none}
.skip-link:focus{top:0}
@media(prefers-contrast:more){
  button,div,input{border-width:2px!important}
  [data-theme="dark"]{--text:#fff;--mut:#bbb;--dim:#999}
}
select{-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 6px center;padding-right:20px!important}
@media print{
  body{background:#fff!important;color:#000!important}
  .sticky-bar,.skip-link,button,select,.toast{display:none!important}
  [data-theme]{background:#fff!important;color:#000!important}
  pre{border:1px solid #ccc!important;background:#f5f5f5!important;color:#333!important;page-break-inside:avoid}
  [id^="card-"]{border:1px solid #ddd!important;background:#fff!important;page-break-inside:avoid;border-left:3px solid #999!important}
  h1{font-size:24px!important;color:#000!important}
}
[id^="card-"]:focus{outline:2px solid #6366f1;outline-offset:-2px;border-radius:12px}
[id^="card-"]:focus:not(:focus-visible){outline:none}
`;

/* ═══════════════════════════════════════════════
   MEMOIZED COMPONENTS (tasks: 001, 002, 082, 096, 098)
   ═══════════════════════════════════════════════ */
const Pill = memo(({ on, fn, lb, cl, c }) => (
  <button onClick={fn} aria-pressed={on} style={{ padding:"5px 14px", fontSize:11, fontFamily:font, border:`1px solid ${on?(cl||c.text):c.brd}`, borderRadius:20, background:on?(cl?alpha(cl,.08):c.text+"0d"):"transparent", color:on?(cl||c.text):c.mut, cursor:"pointer", transition:"all .15s", whiteSpace:"nowrap", fontWeight:on?600:400, outline:"none" }}>{lb}</button>
));

const CBtn = memo(({ id, txt, cl, sm, copied, cp, t, bg, skip }) => (
  <button onClick={() => cp(id, txt, skip)} aria-label={copied===id ? t.copied : `${t.copy}: ${id}`} style={{
    padding:sm?"5px 12px":"7px 18px", fontSize:11, fontFamily:font, fontWeight:600,
    border:`1.5px solid ${cl||"currentColor"}`, borderRadius:8,
    background:copied===id?"transparent":(cl||"currentColor"), color:copied===id?(cl||"currentColor"):bg,
    cursor:"pointer", transition:"all .15s", outline:"none",
  }}>{copied===id ? "✓" : t.copy}</button>
));

const Toast = memo(({ msg, c }) => msg ? (
  <div className="toast" role="status" aria-live="polite" style={{ background:"#10b981", color:"#fff", fontFamily:font }}>{msg}</div>
) : null);

/* ═══════════════════════════════════════════════
   HIGHLIGHT HELPER (task: 042)
   ═══════════════════════════════════════════════ */
function HL({ text, q, color }) {
  if (!q || q.length < 2) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'));
  return parts.map((p,i) => p.toLowerCase()===q.toLowerCase() ? <mark key={i} style={{background:alpha(color||"#6366f1",.25),color:"inherit",borderRadius:2,padding:"0 1px"}}>{p}</mark> : p);
}

/* ═══════════════════════════════════════════════
   ERROR BOUNDARY (task: 004)
   ═══════════════════════════════════════════════ */
class ErrBound extends Component {
  constructor(p){super(p);this.state={err:null}}
  static getDerivedStateFromError(e){return{err:e}}
  render(){
    if(this.state.err) return (
      <div style={{minHeight:"100vh",background:"#060609",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:font,color:"#ddddef",textAlign:"center",padding:32}}>
        <div>
          <div style={{fontSize:28,fontWeight:800,marginBottom:12}}>AIAgent-Hub</div>
          <div style={{fontSize:14,color:"#ef4444",marginBottom:8}}>Произошла ошибка</div>
          <div style={{fontSize:11,color:"#5e5e78",marginBottom:16,maxWidth:400}}>{this.state.err?.message}</div>
          {this.state.err?.stack && <details style={{marginBottom:16,textAlign:"left",maxWidth:500}}><summary style={{fontSize:10,color:"#5e5e78",cursor:"pointer"}}>Stack trace</summary><pre style={{fontSize:9,color:"#44445a",marginTop:8,padding:8,background:"#0a0a12",borderRadius:6,whiteSpace:"pre-wrap",wordBreak:"break-all",maxHeight:200,overflow:"auto"}}>{this.state.err.stack}</pre></details>}
          <button onClick={()=>this.setState({err:null})} style={{padding:"8px 24px",fontSize:12,fontFamily:font,fontWeight:600,border:"1.5px solid #6366f1",borderRadius:8,background:"#6366f1",color:"#fff",cursor:"pointer"}}>Перезагрузить</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

/* ═══════════════════════════════════════════════
   APP WRAPPER (tasks: 004, 026, 027, 091)
   ═══════════════════════════════════════════════ */
export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loadPct, setLoadPct] = useState(0);
  const [loadTime, setLoadTime] = useState(null);
  const dataRef = useRef(null);
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    if (dataRef.current) { setData(dataRef.current); return; }
    _d(Z, (pct) => setLoadPct(Math.round(pct * 100)))
      .then(d => { dataRef.current = d; setLoadTime(Math.round(performance.now() - startTime.current)); setData(d); })
      .catch(e => setErr(e));
  }, []);
  
  if (err) return (
    <div style={{minHeight:"100vh",background:"#060609",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:font,color:"#ddddef",textAlign:"center",padding:32}}>
      <div>
        <div style={{fontSize:28,fontWeight:800,marginBottom:12}}>AIAgent-Hub</div>
        <div style={{fontSize:14,color:"#ef4444",marginBottom:8}}>Ошибка загрузки данных</div>
        <div style={{fontSize:11,color:"#5e5e78",marginBottom:16}}>{err?.message}</div>
        <button onClick={()=>{setErr(null);setLoadPct(0);_d(Z,(pct)=>setLoadPct(Math.round(pct*100))).then(d=>{dataRef.current=d;setData(d)}).catch(e=>setErr(e))}} style={{padding:"8px 24px",fontSize:12,fontFamily:font,fontWeight:600,border:"1.5px solid #6366f1",borderRadius:8,background:"#6366f1",color:"#fff",cursor:"pointer"}}>Обновить</button>
      </div>
    </div>
  );
  
  if (!data) return (
    <div style={{minHeight:"100vh",background:"#060609",fontFamily:font}}>
      <style>{CSS}</style>
      <div style={{maxWidth:860,margin:"0 auto",padding:"32px 16px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:28,fontWeight:800,color:"#ddddef",marginBottom:8}}>AIAgent-Hub</div>
          <div style={{fontSize:11,color:"#5e5e78",letterSpacing:2,marginBottom:16}}>загрузка промтов...</div>
          <div style={{width:200,height:4,background:"#1a1a28",borderRadius:2,overflow:"hidden",margin:"0 auto"}}>
            <div style={{width:loadPct+"%",height:"100%",background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:2,transition:"width .3s ease"}} />
          </div>
          <div style={{fontSize:9,color:"#35354d",marginTop:8}}>{loadPct}%</div>
        </div>
        {/* Task 19: Skeleton cards */}
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{marginBottom:8,padding:"12px 16px",borderRadius:12,border:"1px solid #1a1a28",background:"#0e0e16",display:"flex",gap:10,alignItems:"center"}}>
            <div className="skeleton" style={{width:36,height:36,borderRadius:9,flexShrink:0}} />
            <div style={{flex:1}}>
              <div className="skeleton" style={{width:`${40+i*8}%`,height:12,marginBottom:6}} />
              <div className="skeleton" style={{width:`${60+i*4}%`,height:8}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  return <ErrBound><AgentHub data={data} loadTime={loadTime} /></ErrBound>;
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
/** @typedef {{ id:string, m:string, mk:string, role:string, type:string, icon:string, ac:string, time:string, text:string, tags?:string[], difficulty?:string, related?:string[], prereqs?:string[], output?:string, v?:string }} Prompt */
/** @typedef {{ id:string, icon:string, name:string, accent:string, desc:string, text:string }} Config */
/** @typedef {{ name:string, desc:string, ids:string[], color:string }} Combo */
/** @typedef {{ P:Prompt[], CONFIGS:Config[], TEAM_SETUP:string, COMBOS:{ru:Combo[],en:Combo[]}, FOLDER_STRUCTURE:string, GIT_SETUP:string, LAUNCH:string, CHEAT:Object, QUICK_CMDS:Object }} HubData */
/** @param {{ data:HubData }} props */
function AgentHub({ data, loadTime }) {
  // Task 7: destructure once, P is stable ref from decompression
  const { P, CONFIGS=[], TEAM_SETUP="", COMBOS={ru:[],en:[]}, FOLDER_STRUCTURE="", GIT_SETUP="", LAUNCH="", CHEAT={}, QUICK_CMDS={} } = data;
  
  // ── State (task 027: persist via storage API) ──
  const [lang, setLang] = useState(() => {
    try { const n = navigator.language; return n?.startsWith("ru") ? "ru" : "en"; } catch { return "ru"; }
  });
  const [theme, setTheme] = useState(() => {
    try { return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"; } catch { return "dark"; }
  });
  const [copied, setCopied] = useState(null);
  const [toast, setToast] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [fm, setFm] = useState("all");
  const [fv, setFv] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [favs, setFavs] = useState({});
  const [section, setSection] = useState(() => {
    try { const h = location.hash.slice(1); return ["prompts","combos","cheat","quick","setup"].includes(h) ? h : "prompts"; } catch { return "prompts"; }
  });
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [quickCopy, setQuickCopy] = useState(false); // task 74
  const [showCount, setShowCount] = useState(40); // task 81: pagination
  const [compareIds, setCompareIds] = useState([]); // task 69: compare mode
  const [compareMode, setCompareMode] = useState(false); // task 69
  const [usedPrompts, setUsedPrompts] = useState({}); // task 75: progress tracker
  const [searchHist, setSearchHist] = useState([]); // task 49
  const [searchFocused, setSearchFocused] = useState(false); // fix: track focus via state
  const [scrollPct, setScrollPct] = useState(0); // feat 5: scroll progress
  const [isOffline, setIsOffline] = useState(!navigator.onLine); // feat 6: offline
  const [copyCount, setCopyCount] = useState(0); // feat 7: session counter
  const [autoCollapse, setAutoCollapse] = useState(false); // feat 8: auto-collapse
  const [fontSize, setFontSize] = useState(100); // feat 9: font size %
  const [showNew, setShowNew] = useState(false); // feat 10: new only
  const [hideUsed, setHideUsed] = useState(false); // feat 11: hide used
  const [showShortcuts, setShowShortcuts] = useState(false); // feat 4: shortcuts overlay
  const [isFirstVisit, setIsFirstVisit] = useState(false); // feat 16: welcome
  const [copyHistory, setCopyHistory] = useState([]); // feat 17: copy history
  const [showCopyHistory, setShowCopyHistory] = useState(false); // feat 17
  const [focusPrompt, setFocusPrompt] = useState(null); // feat 18: focus mode
  const [showStats, setShowStats] = useState(false); // feat 24: stats modal
  const [viewMode, setViewMode] = useState("card"); // feat 26: card/table
  const [recentViewed, setRecentViewed] = useState([]); // feat 30: recently viewed
  const [sessionStart] = useState(Date.now()); // feat 33: session timer
  const [showDiff, setShowDiff] = useState(null); // feat 34: diff modal
  const [pinnedIds, setPinnedIds] = useState([]); // cycle 9: pinned prompts
  const [showGlossary, setShowGlossary] = useState(false); // cycle 9: glossary
  const [copyCounters, setCopyCounters] = useState({}); // cycle-3: per-prompt copy count
  const [customCombo, setCustomCombo] = useState([]); // task 114
  const [buildingCombo, setBuildingCombo] = useState(false); // task 114
  const [promptLang, setPromptLang] = useState("original"); // task 94: separate prompt language
  const [compactMode, setCompactMode] = useState(false); // compact prompts for Claude Code
  const [showConstructor, setShowConstructor] = useState(false); // task 66: prompt constructor
  const [constructorRole, setConstructorRole] = useState(""); // task 66
  const [constructorStack, setConstructorStack] = useState(""); // task 66
  const [constructorTasks, setConstructorTasks] = useState([]); // task 66
  const [importText, setImportText] = useState(""); // task 76: import prompt
  const [showImport, setShowImport] = useState(false); // task 76
  const [stackOverride, setStackOverride] = useState(""); // task 58: stack selector
  const [dragId, setDragId] = useState(null); // task 32: drag&drop
  const [workflow, setWorkflow] = useState([]); // task 70: workflow sequencer
  const [showWorkflow, setShowWorkflow] = useState(false); // task 70
  const searchRef = useRef(null);
  const loadMoreRef = useRef(null); // feat 27: infinite scroll sentinel
  
  // Task 92: lang cycle helper
  const nextLang = useCallback(() => {
    setLang(l => l==="ru"?"en":l==="en"?"kk":"ru");
  }, []);
  const langLabel = lang==="ru"?"EN":lang==="en"?"KK":"RU";

  // Task 93+94: Modify prompt text on copy based on promptLang and stack
  const modifyPrompt = useCallback((text) => {
    let result = text;
    if (promptLang === "en") {
      result = "IMPORTANT: Respond in English. All output, comments, reports — in English.\n\n" + result;
    }
    if (stackOverride) {
      result = result.replace(/Прочитай ВЕСЬ проект/g, `Прочитай ВЕСЬ проект (стек: ${stackOverride})`);
      result = result.replace(/Read the ENTIRE project/g, `Read the ENTIRE project (stack: ${stackOverride})`);
    }
    return result;
  }, [promptLang, stackOverride]);
  
  // Task 78: Prompt of the day (deterministic by date)
  const potd = useMemo(() => {
    const d = new Date(); const seed = d.getFullYear()*10000+d.getMonth()*100+d.getDate();
    return P[seed % P.length];
  }, [P]);

  // ── Persist settings (task 027) ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem("aiagent-hub-settings");
      if (raw) {
        const s = JSON.parse(raw);
        if (s.theme) setTheme(s.theme);
        if (s.lang) setLang(s.lang);
        if (s.favs) setFavs(s.favs);
        if (s.used) setUsedPrompts(s.used);
        if (s.hist) setSearchHist(s.hist);
        if (s.cc) setCopyCounters(s.cc);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const payload = JSON.stringify({ theme, lang, favs, used:usedPrompts, hist:searchHist, cc:copyCounters });
      if (payload.length > 4 * 1024 * 1024) { console.warn("AIAgent-Hub: localStorage near limit"); }
      localStorage.setItem("aiagent-hub-settings", payload);
    } catch {}
  }, [theme, lang, favs, usedPrompts, searchHist, copyCounters]);

  // Feat 5: Scroll progress (task 3: throttled via rAF)
  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          setScrollPct(h > 0 ? Math.round(window.scrollY / h * 100) : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Feat 6: Offline detection
  useEffect(() => {
    const on = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  // Cycle 2: Dynamic page title
  useEffect(() => {
    const titles = { prompts:lang==="ru"?"Промты":"Prompts", combos:lang==="ru"?"Команды":"Teams", cheat:lang==="ru"?"Шпаргалки":"Cheat", quick:"CLI", setup:"Setup" };
    document.title = `AIAgent-Hub — ${titles[section]||""}`;
  }, [section, lang]);

  // Task 5: Lock body scroll when overlays open
  useEffect(() => {
    const hasOverlay = showShortcuts || focusPrompt || showStats || showCopyHistory || showDiff || showGlossary;
    document.body.style.overflow = hasOverlay ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showShortcuts, focusPrompt, showStats, showCopyHistory, showDiff]);

  // Feat 16: First visit welcome
  useEffect(() => {
    try {
      if (!localStorage.getItem("aiagent-hub-visited")) {
        setIsFirstVisit(true);
        localStorage.setItem("aiagent-hub-visited", "1");
      }
    } catch {}
  }, []);

  // Task 16: Meta theme-color
  useEffect(() => {
    try {
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
      meta.content = TH[theme].meta;
    } catch {}
  }, [theme]);

  // ── Hash routing (task 026, 077) ──
  useEffect(() => {
    const h = location.hash.slice(1);
    // Task 77: Handle prompt deep links
    if (h.startsWith("prompt-")) {
      const pid = h.replace("prompt-", "");
      setSection("prompts");
      setExpanded(e => ({ ...e, [pid]: true }));
      setTimeout(() => document.getElementById(`card-${pid}`)?.scrollIntoView({behavior:"smooth",block:"center"}), 300);
    } else {
      try { history.replaceState(null, "", "#" + section); } catch {}
    }
  }, []);
  
  useEffect(() => {
    if (!location.hash.startsWith("#prompt-")) {
      try { history.replaceState(null, "", "#" + section); } catch {}
    }
  }, [section]);
  
  useEffect(() => {
    const fn = () => {
      const h = location.hash.slice(1);
      if (["prompts","combos","cheat","quick","setup"].includes(h)) setSection(h);
    };
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);

  // ── Debounced search (task 034) ──
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(t);
  }, [search]);

  // ── Callbacks (must be before keyboard effect) ──
  const toggle = useCallback((id) => {
    setExpanded(e => {
      const willOpen = !e[id];
      if (willOpen) setRecentViewed(rv => [id, ...rv.filter(x=>x!==id)].slice(0,5));
      if (autoCollapse) return { [id]: willOpen };
      return { ...e, [id]: willOpen };
    });
  }, [autoCollapse]);
  const toggleFav = useCallback((id) => setFavs(f => ({ ...f, [id]: !f[id] })), []);
  const favCount = useMemo(() => Object.values(favs).filter(Boolean).length, [favs]);
  const usedCount = useMemo(() => Object.values(usedPrompts).filter(Boolean).length, [usedPrompts]);

  // ── Keyboard shortcuts (task 028, 029: extended) ──
  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setSearch("");
        searchRef.current?.blur();
      }
      // Arrow key navigation between cards
      if (section === "prompts" && (e.key === "ArrowDown" || e.key === "ArrowUp") && !e.metaKey && !e.ctrlKey) {
        const cards = document.querySelectorAll('[id^="card-"]');
        if (!cards.length) return;
        const active = document.activeElement?.closest('[id^="card-"]');
        const idx = active ? Array.from(cards).indexOf(active) : -1;
        const next = e.key === "ArrowDown" ? Math.min(idx+1, cards.length-1) : Math.max(idx-1, 0);
        if (idx === -1 && e.key === "ArrowDown") { cards[0]?.focus(); e.preventDefault(); }
        else if (cards[next]) { cards[next].focus(); cards[next].scrollIntoView({behavior:"smooth",block:"nearest"}); e.preventDefault(); }
      }
      // 1-5 for section switching
      if (!e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        const sectionKeys = {"1":"prompts","2":"combos","3":"cheat","4":"quick","5":"setup"};
        if (sectionKeys[e.key]) { setSection(sectionKeys[e.key]); window.scrollTo({top:0,behavior:"smooth"}); e.preventDefault(); return; }
      }
      // T for theme toggle
      if (e.key === "t" && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        setTheme(th => th === "dark" ? "light" : "dark");
        e.preventDefault();
      }
      // V for view mode toggle
      if (e.key === "v" && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA" && section === "prompts") {
        setViewMode(vm => vm === "card" ? "table" : "card");
        e.preventDefault();
      }
      // R for random prompt
      if (e.key === "r" && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA" && section === "prompts") {
        const r = P[Math.floor(Math.random()*P.length)];
        setExpanded(ex=>({...ex,[r.id]:true}));
        setFm("all"); setFv("all"); setSearch(""); setShowFavsOnly(false);
        setTimeout(()=>document.getElementById("card-"+r.id)?.scrollIntoView({behavior:"smooth",block:"center"}),100);
        e.preventDefault();
      }
      // Ctrl+/ to toggle compact mode
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setCompactMode(m => !m);
      }
      // ? to show shortcuts
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setShowShortcuts(s => !s);
      }
      // F to toggle focus mode on active card
      if (e.key === "f" && !e.ctrlKey && !e.metaKey && document.activeElement?.id?.startsWith("card-")) {
        const pid = document.activeElement.id.replace("card-", "");
        const fp = P.find(x => x.id === pid);
        if (fp) { setFocusPrompt(fp); e.preventDefault(); }
      }
      // Escape closes overlays
      if (e.key === "Escape") {
        if (showShortcuts) { setShowShortcuts(false); e.preventDefault(); return; }
        if (focusPrompt) { setFocusPrompt(null); e.preventDefault(); return; }
        if (showStats) { setShowStats(false); e.preventDefault(); return; }
        if (showCopyHistory) { setShowCopyHistory(false); e.preventDefault(); return; }
        if (showDiff) { setShowDiff(null); e.preventDefault(); return; }
        if (showGlossary) { setShowGlossary(false); e.preventDefault(); return; }
        if (isFirstVisit) { setIsFirstVisit(false); e.preventDefault(); return; }
      }
      // Enter to toggle expand on focused card
      if (e.key === "Enter" && document.activeElement?.id?.startsWith("card-")) {
        const pid = document.activeElement.id.replace("card-", "");
        toggle(pid);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [section, toggle]);

  const t = T[lang] || T.en; const c = TH[theme];
  // Task 92: kk falls back to en for role names
  if (lang==="kk" && (!t.r || Object.keys(t.r).length===0)) { t.r = T.en.r; }

  // Cycle 2: O(1) prompt lookup map (must be after t/c)
  const pMap = useMemo(() => new Map(P.map(p => [p.id, p])), [P]);
  const pGet = useCallback((id) => pMap.get(id), [pMap]);
  const buildPromptBundle = useCallback((ids) => {
    return ids.map(id => pGet(id)).filter(Boolean).map(p => `═══ ${(t.r[p.role]||p.role).toUpperCase()} (${p.m}) ═══\n\n${p.text}`).join("\n\n\n");
  }, [pGet, t]);

  // ── Copy with toast (task 30, 31, 75: track used) ──
  const cp = useCallback(async (id, txt, skipModify) => {
    if (copied) return;
    const finalTxt = skipModify ? txt : modifyPrompt(txt);
    try { await navigator.clipboard.writeText(finalTxt); } catch {
      const a = document.createElement("textarea"); a.value = finalTxt; a.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(a); a.select(); document.execCommand("copy"); document.body.removeChild(a);
    }
    setCopied(id);
    setCopyCount(n => n + 1);
    setCopyCounters(cc => ({ ...cc, [id]: (cc[id]||0) + 1 }));
    const promptData = pGet(id);
    if (promptData) {
      setUsedPrompts(u=>({...u,[id]:true}));
      setCopyHistory(h => [{ id, name: t.r[promptData.role]||promptData.role, icon: promptData.icon, time: new Date().toLocaleTimeString() }, ...h].slice(0, 10));
    }
    const tokens = Math.round(finalTxt.length / 4);
    setToast(`${t.copied} · ~${(tokens/1000).toFixed(1)}K tokens`);
    setTimeout(() => setCopied(null), 2000);
    setTimeout(() => setToast(null), 2000);
  }, [t, copied, P, modifyPrompt]);

  // Task 49: Save search to history
  useEffect(() => {
    if (debouncedSearch.trim() && debouncedSearch.length >= 3) {
      setSearchHist(h => {
        const next = [debouncedSearch, ...h.filter(x=>x!==debouncedSearch)].slice(0,5);
        return next;
      });
    }
  }, [debouncedSearch]);

  // Task 37, 81: Reset pagination and smooth scroll on filter change
  useEffect(() => { setShowCount(40); }, [fm, fv, debouncedSearch, showFavsOnly, sortBy]);

  // ── Filtered list (tasks 041, 043, 045, 046, 125) ──
  const list = useMemo(() => {
    let f = P;
    if (showFavsOnly) f = f.filter(p => favs[p.id]);
    if (showNew) f = f.filter(p => p.v === "7.1");
    if (hideUsed) f = f.filter(p => !usedPrompts[p.id]);
    if (fm === "model" && fv !== "all") f = f.filter(p => p.mk === fv);
    else if (fm === "role" && fv !== "all") f = f.filter(p => p.role === fv);
    else if (fm === "type" && fv !== "all") f = f.filter(p => p.type === fv);
    else if (fm === "difficulty" && fv !== "all") f = f.filter(p => p.difficulty === fv);
    else if (fm === "tag" && fv !== "all") f = f.filter(p => p.tags && p.tags.includes(fv));
    else if (fm === "time" && fv !== "all") {
      f = f.filter(p => {
        const m = p.time?.match(/(\d+\.?\d*)(h|m)/);
        if (!m) return false;
        const hrs = m[2]==="h" ? parseFloat(m[1]) : parseFloat(m[1])/60;
        if (fv==="<1h") return hrs < 1;
        if (fv==="1-2h") return hrs >= 1 && hrs <= 2;
        if (fv===">2h") return hrs > 2;
        return true;
      });
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      const words = q.split(/\s+/).filter(Boolean);
      f = f.filter(p => {
        const hay = (p.text + " " + p.role + " " + p.m + " " + (t.r[p.role]||"") + " " + p.id + " " + (p.tags||[]).join(" ")).toLowerCase();
        return words.every(w => hay.includes(w));
      });
    }
    // Sort (task 045)
    if (sortBy === "name") f = [...f].sort((a,b) => (t.r[a.role]||a.role).localeCompare(t.r[b.role]||b.role));
    else if (sortBy === "length") f = [...f].sort((a,b) => b.text.length - a.text.length);
    else if (sortBy === "time") f = [...f].sort((a,b) => {
      const gt = s => { const m=s?.match(/(\d+\.?\d*)(h|m)/); return m?(m[2]==="h"?parseFloat(m[1])*60:parseFloat(m[1])):0; };
      return gt(b.time)-gt(a.time);
    });
    else if (sortBy === "model") f = [...f].sort((a,b) => a.mk.localeCompare(b.mk));
    // Cycle 9: Pinned prompts float to top
    if (pinnedIds.length > 0) {
      const pinned = f.filter(p => pinnedIds.includes(p.id));
      const rest = f.filter(p => !pinnedIds.includes(p.id));
      f = [...pinned, ...rest];
    }
    return f;
  }, [fm, fv, debouncedSearch, t, showFavsOnly, favs, P, sortBy, showNew, hideUsed, usedPrompts, pinnedIds]);

  const roles = useMemo(() => [...new Set(P.map(p => p.role))], [P]);
  // Feat 27: Infinite scroll (must be after list declaration)
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && list.length > showCount) setShowCount(s => s + 40);
    }, { rootMargin: "200px" });
    obs.observe(loadMoreRef.current);
    return () => obs.disconnect();
  }, [list.length, showCount]);

  const allTags = useMemo(() => {
    const tc = {};
    P.forEach(p => (p.tags||[]).forEach(t2 => { tc[t2] = (tc[t2]||0) + 1; }));
    return Object.entries(tc).sort((a,b) => b[1]-a[1]).slice(0, 25).map(([t2]) => t2);
  }, [P]);
  const allExpanded = list.length > 0 && list.every(p => expanded[p.id]);

  const toggleAll = () => {
    const next = {};
    list.forEach(p => { next[p.id] = !allExpanded; });
    setExpanded(e => ({ ...e, ...next }));
  };

  // ── Stats ──
  const stats = useMemo(() => {
    const totalTime = P.reduce((acc, p) => {
      if (!p.time) return acc;
      const m = p.time.match(/(\d+\.?\d*)(h|m)/);
      if (!m) return acc;
      return acc + (m[2] === "h" ? parseFloat(m[1]) * 60 : parseFloat(m[1]));
    }, 0);
    const totalChars = P.reduce((a, p) => a + p.text.length, 0);
    return {
      total: P.length, models: new Set(P.map(p => p.mk)).size,
      roles: new Set(P.map(p => p.role)).size,
      totalHours: Math.round(totalTime / 60 / 5) * 5,
      totalTokens: Math.round(totalChars / 4),
      byModel: Object.entries(P.reduce((a, p) => { a[p.mk] = (a[p.mk]||0) + 1; return a; }, {})),
      byDifficulty: P.reduce((a, p) => { if (p.difficulty) a[p.difficulty] = (a[p.difficulty]||0) + 1; return a; }, {}),
    };
  }, [P]);

  const filteredStats = useMemo(() => {
    const chars = list.reduce((a, p) => a + p.text.length, 0);
    return { count: list.length, tokens: Math.round(chars / 4) };
  }, [list]);

  // ── Clear filters (task 040, 106) ──
  const clearFilters = () => { setFm("all"); setFv("all"); setSearch(""); setShowFavsOnly(false); setShowNew(false); setHideUsed(false); };
  const hasFilters = fm !== "all" || search.trim() || showFavsOnly || showNew || hideUsed;

  return (
    <div data-theme={theme} style={{ minHeight:"100vh", background:c.bg, color:c.text, fontFamily:font, transition:"background .3s,color .3s", fontSize: fontSize + "%" }}>
      <style>{CSS}</style>
      <Toast msg={toast} c={c} />

      {/* Feat 5: Scroll progress bar */}
      <div style={{ position:"fixed", top:0, left:0, width:scrollPct+"%", height:2, background:"linear-gradient(90deg,#6366f1,#8b5cf6)", zIndex:9999, transition:"width .1s", opacity:scrollPct>0?1:0, willChange:"width" }} />

      {/* Feat 6: Offline banner */}
      {isOffline && <div role="alert" style={{ position:"fixed", top:0, left:0, right:0, padding:"6px 0", background:"#ef4444", color:"#fff", textAlign:"center", fontSize:11, fontFamily:font, fontWeight:600, zIndex:9998 }}>{lang==="ru"?"⚡ Нет подключения к интернету":"⚡ No internet connection"}</div>}

      {/* Cycle 25: Diff overlay — compact vs original */}
      {showDiff && (() => {
        const dp = pGet(showDiff);
        if (!dp || !dp.compact) return null;
        return <div onClick={()=>setShowDiff(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.8)", zIndex:9992, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div role="dialog" aria-modal="true" aria-label="Diff" onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:16, padding:"24px 28px", maxWidth:900, width:"100%", maxHeight:"90vh", overflowY:"auto", fontFamily:font }}>
            <div style={{ fontSize:16, fontWeight:800, marginBottom:16, color:c.text }}>{dp.icon} {t.r[dp.role]||dp.role} — {lang==="ru"?"Сравнение":"Diff"}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"#6366f1", marginBottom:8 }}>Original ({dp.text.length} chars)</div>
                <pre style={{ fontSize:9, lineHeight:1.6, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", padding:12, background:c.surf, borderRadius:8, border:`1px solid ${c.brd}`, maxHeight:400, overflowY:"auto" }}>{dp.text}</pre>
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"#10b981", marginBottom:8 }}>Compact ({dp.compact.length} chars, {Math.round((1-dp.compact.length/dp.text.length)*100)}% smaller)</div>
                <pre style={{ fontSize:9, lineHeight:1.6, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", padding:12, background:c.surf, borderRadius:8, border:`1px solid #10b98120`, maxHeight:400, overflowY:"auto" }}>{dp.compact}</pre>
              </div>
            </div>
            <button onClick={()=>setShowDiff(null)} style={{ marginTop:16, width:"100%", padding:"8px", fontSize:11, fontFamily:font, fontWeight:600, border:`1px solid ${c.brd}`, borderRadius:8, background:c.surf, color:c.text, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
          </div>
        </div>;
      })()}

      {/* Cycle 9: Glossary overlay */}
      {showGlossary && <div onClick={()=>setShowGlossary(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:9990, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label="Glossary" onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:16, padding:"24px 28px", maxWidth:480, width:"100%", maxHeight:"80vh", overflowY:"auto", fontFamily:font }}>
          <div style={{ fontSize:16, fontWeight:800, marginBottom:16, color:c.text }}>{lang==="ru"?"Глоссарий":"Glossary"}</div>
          {[
            ["АНТИ-ЛУП",lang==="ru"?"Защита от зацикливания: 3 похожих действия = смена подхода":"Loop protection: 3 similar actions = change approach"],
            ["АНТИ-ГАЛЛЮЦИНАЦИЯ",lang==="ru"?"Правило: прочитай файл перед изменением, не придумывай API":"Rule: read file before changing, don't invent APIs"],
            ["Worktree",lang==="ru"?"Git worktree — изолированная копия репозитория для параллельной работы":"Git worktree — isolated repo copy for parallel work"],
            ["Compact mode",lang==="ru"?"Сокращённые промты (~700 символов) для экономии контекста":"Shortened prompts (~700 chars) to save context window"],
            ["КРИТИЧНО",lang==="ru"?"Наивысший приоритет: баги, security, crashes":"Highest priority: bugs, security, crashes"],
            ["Story Points",lang==="ru"?"Оценка сложности: 1=5мин, 2=15мин, 3=30мин, 5=1ч":"Complexity estimate: 1=5min, 2=15min, 3=30min, 5=1hr"],
            ["♾️ Бесконечный",lang==="ru"?"Агент который не останавливается — самогенерирует задачи":"Agent that never stops — self-generates tasks"],
          ].map(([term,desc])=><div key={term} style={{ padding:"8px 0", borderBottom:`1px solid ${c.brd}` }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#6366f1" }}>{term}</div>
            <div style={{ fontSize:10, color:c.mut, marginTop:2 }}>{desc}</div>
          </div>)}
          <button onClick={()=>setShowGlossary(false)} style={{ marginTop:16, width:"100%", padding:"8px", fontSize:11, fontFamily:font, fontWeight:600, border:`1px solid ${c.brd}`, borderRadius:8, background:c.surf, color:c.text, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
        </div>
      </div>}

      {/* Feat 4: Keyboard shortcuts overlay */}
      {showShortcuts && <div onClick={()=>setShowShortcuts(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:9990, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label={lang==="ru"?"Горячие клавиши":"Keyboard Shortcuts"} onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:16, padding:"24px 32px", maxWidth:420, width:"100%", fontFamily:font }}>
          <div style={{ fontSize:16, fontWeight:800, marginBottom:16, color:c.text }}>{lang==="ru"?"Горячие клавиши":"Keyboard Shortcuts"}</div>
          {[
            ["Ctrl+K",lang==="ru"?"Фокус на поиск":"Focus search"],
            ["Escape",lang==="ru"?"Закрыть / очистить":"Close / clear"],
            ["↑ / ↓",lang==="ru"?"Навигация по карточкам":"Navigate cards"],
            ["Enter",lang==="ru"?"Открыть/закрыть карточку":"Toggle card"],
            ["F",lang==="ru"?"Focus mode (на карточке)":"Focus mode (on card)"],
            ["1-5",lang==="ru"?"Секции (Промты/Команды/CLI/Quick/Setup)":"Sections"],
            ["T",lang==="ru"?"Переключить тему":"Toggle theme"],
            ["V",lang==="ru"?"Карточки/таблица":"Card/table view"],
            ["R",lang==="ru"?"Случайный промт":"Random prompt"],
            ["Ctrl+/",lang==="ru"?"Compact mode":"Compact mode"],
            ["?",lang==="ru"?"Показать/скрыть подсказки":"Toggle this overlay"],
          ].map(([k,d])=><div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${c.brd}` }}><kbd style={{ padding:"2px 8px", borderRadius:4, background:c.surf, border:`1px solid ${c.brd}`, fontSize:11, color:c.text, fontFamily:font }}>{k}</kbd><span style={{ fontSize:11, color:c.mut }}>{d}</span></div>)}
          <button onClick={()=>setShowShortcuts(false)} style={{ marginTop:16, width:"100%", padding:"8px", fontSize:11, fontFamily:font, fontWeight:600, border:`1px solid ${c.brd}`, borderRadius:8, background:c.surf, color:c.text, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
        </div>
      </div>}

      {/* Feat 18: Focus mode */}
      {focusPrompt && <div onClick={()=>setFocusPrompt(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.85)", zIndex:9991, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label="Focus mode" onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${focusPrompt.ac}40`, borderRadius:16, padding:"24px 28px", maxWidth:720, width:"100%", maxHeight:"90vh", overflowY:"auto", fontFamily:font }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:24 }}>{focusPrompt.icon}</span>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:focusPrompt.ac }}>{t.r[focusPrompt.role]||focusPrompt.role}</div>
                <div style={{ fontSize:10, color:c.mut }}>{ML[focusPrompt.mk]} · {focusPrompt.time} · {focusPrompt.text.length} chars · ~{Math.ceil(focusPrompt.text.length/4)} tokens</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <CBtn id={"focus-"+focusPrompt.id} txt={focusPrompt.text} cl={focusPrompt.ac} copied={copied} cp={cp} t={t} bg={c.bg} />
              <button onClick={()=>setFocusPrompt(null)} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${c.brd}`, background:"transparent", color:c.mut, cursor:"pointer", fontSize:16, outline:"none" }}>×</button>
            </div>
          </div>
          <pre style={{ fontSize:11, lineHeight:1.7, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, fontFamily:font, padding:16, background:c.surf, borderRadius:10, border:`1px solid ${c.brd}` }}>{focusPrompt.text}</pre>
        </div>
      </div>}

      {/* Feat 24: Stats modal */}
      {showStats && <div onClick={()=>setShowStats(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:9990, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label={lang==="ru"?"Статистика":"Statistics"} onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:16, padding:"24px 28px", maxWidth:500, width:"100%", fontFamily:font }}>
          <div style={{ fontSize:16, fontWeight:800, marginBottom:16, color:c.text }}>{lang==="ru"?"Статистика":"Statistics"}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {[
              [stats.total, lang==="ru"?"Промтов":"Prompts", "#6366f1"],
              [stats.models, lang==="ru"?"Моделей":"Models", "#f97316"],
              [stats.roles, lang==="ru"?"Ролей":"Roles", "#8b5cf6"],
              [`~${stats.totalHours}h`, lang==="ru"?"Время":"Time", "#06b6d4"],
              [`~${(stats.totalTokens/1000).toFixed(0)}K`, "Tokens", "#10b981"],
              [copyCount, lang==="ru"?"Скопировано":"Copied", "#eab308"],
              [usedCount, lang==="ru"?"Использовано":"Used", "#10b981"],
              [favCount, lang==="ru"?"Избранных":"Favorites", "#eab308"],
            ].map(([v,l,cl])=><div key={l} style={{ padding:12, borderRadius:10, background:c.surf, border:`1px solid ${c.brd}`, textAlign:"center" }}><div style={{ fontSize:20, fontWeight:800, color:cl }}>{v}</div><div style={{ fontSize:9, color:c.mut, marginTop:2 }}>{l}</div></div>)}
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:600, color:c.mut, marginBottom:6 }}>{lang==="ru"?"По моделям":"By model"}</div>
            {stats.byModel.map(([mk,n])=><div key={mk} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:MC[mk] }} />
              <span style={{ fontSize:10, color:MC[mk], fontWeight:600, width:120 }}>{ML[mk]}</span>
              <div style={{ flex:1, height:6, borderRadius:3, background:c.surf, overflow:"hidden" }}><div style={{ width:`${n/stats.total*100}%`, height:"100%", background:MC[mk], borderRadius:3 }} /></div>
              <span style={{ fontSize:10, color:c.dim, minWidth:30, textAlign:"right" }}>{n}</span>
            </div>)}
          </div>
          {/* Cycle 26: Tag cloud in stats */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:600, color:c.mut, marginBottom:6 }}>{lang==="ru"?"Популярные теги":"Popular tags"}</div>
            <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
              {(() => { const tc = {}; P.forEach(p=>(p.tags||[]).forEach(tg=>{tc[tg]=(tc[tg]||0)+1})); return Object.entries(tc).sort((a,b)=>b[1]-a[1]).slice(0,15).map(([tg,n])=><span key={tg} style={{ fontSize:Math.max(8,Math.min(12,7+n/3)), padding:"2px 6px", borderRadius:6, background:"#6366f110", color:"#6366f1", border:"1px solid #6366f120", cursor:"pointer", fontFamily:font }} onClick={()=>{setFm("tag");setFv(tg);setSection("prompts");setShowStats(false)}}>{tg} <span style={{fontSize:8,color:c.dim}}>{n}</span></span>); })()}
            </div>
          </div>
          {/* Cycle 26: Most copied prompts */}
          {Object.keys(copyCounters).length > 0 && <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:600, color:c.mut, marginBottom:6 }}>{lang==="ru"?"Часто копируемые":"Most copied"}</div>
            {Object.entries(copyCounters).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([pid,n])=>{const pp=pGet(pid);return pp?<div key={pid} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"3px 0", fontSize:10 }}><span style={{ color:pp.ac }}>{pp.icon} {t.r[pp.role]||pp.role}</span><span style={{ color:c.dim }}>×{n}</span></div>:null})}
          </div>}
          {(() => { try { const used = localStorage.getItem("aiagent-hub-settings"); return used ? <div style={{ fontSize:9, color:c.dim, marginTop:8 }}>💾 localStorage: {(used.length/1024).toFixed(1)} KB</div> : null; } catch { return null; } })()}
          <button onClick={()=>setShowStats(false)} style={{ marginTop:12, width:"100%", padding:"8px", fontSize:11, fontFamily:font, fontWeight:600, border:`1px solid ${c.brd}`, borderRadius:8, background:c.surf, color:c.text, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
        </div>
      </div>}

      {/* Feat 17: Copy history sidebar */}
      {showCopyHistory && <div onClick={()=>setShowCopyHistory(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9989 }}>
        <div onClick={e=>e.stopPropagation()} style={{ position:"fixed", right:0, top:0, bottom:0, width:280, background:c.card, borderLeft:`1px solid ${c.brd}`, padding:"20px 16px", fontFamily:font, overflowY:"auto" }}>
          <div style={{ fontSize:14, fontWeight:800, marginBottom:16, color:c.text }}>{lang==="ru"?"История копирования":"Copy History"}</div>
          {copyHistory.length===0 && <div style={{ fontSize:11, color:c.dim }}>{lang==="ru"?"Ещё ничего не скопировано":"Nothing copied yet"}</div>}
          {copyHistory.map((h,i)=><div key={i} style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${c.brd}`, marginBottom:6, background:c.surf }}>
            <div style={{ fontSize:11, fontWeight:600, color:c.text }}>{h.icon} {h.name}</div>
            <div style={{ fontSize:9, color:c.dim, marginTop:2 }}>{h.time}</div>
          </div>)}
          <button onClick={()=>setShowCopyHistory(false)} style={{ marginTop:12, width:"100%", padding:"8px", fontSize:11, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:8, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
        </div>
      </div>}

      {/* Skip link (task 100) */}
      <a href="#main-content" className="skip-link">{lang==="ru"?"К содержимому":"Skip to content"}</a>
      
      {/* Glow */}
      <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:600, height:300, background:"radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div id="main-content" style={{ maxWidth:860, margin:"0 auto", padding:"32px 16px 80px", position:"relative", zIndex:1 }}>

        {/* ── HEADER ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }} className="stack-mobile">
          <div>
            <div style={{ fontSize:9, letterSpacing:6, color:c.dim, textTransform:"uppercase", marginBottom:6 }}>v9.0 · {stats.total} {t.prompts} · {stats.models} {t.models}{usedCount>0?` · ✓${usedCount}`:""}</div>
            <h1 style={{ fontSize:28, fontWeight:800, margin:0, lineHeight:1.1, letterSpacing:"-0.5px" }}>{t.title}</h1>
            <p style={{ fontSize:12, color:c.mut, marginTop:6, letterSpacing:0.3 }}>{t.subtitle}</p>
          </div>
          <div style={{ display:"flex", gap:6, marginTop:4, flexWrap:"wrap" }}>
            {/* Feat 24: Stats */}
            <button onClick={()=>setShowStats(true)} aria-label="Stats" title={lang==="ru"?"Статистика":"Statistics"} style={{ width:36, height:36, borderRadius:8, border:`1px solid ${c.brd}`, background:c.card, color:c.text, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", outline:"none", transition:"all .15s" }}>📊</button>
            {/* Feat 17: Copy history */}
            <button onClick={()=>setShowCopyHistory(true)} aria-label="Copy history" title={lang==="ru"?"История копирования":"Copy history"} style={{ position:"relative", width:36, height:36, borderRadius:8, border:`1px solid ${c.brd}`, background:c.card, color:c.text, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", outline:"none", transition:"all .15s" }}>📋{copyCount>0 && <span style={{ position:"absolute", top:-4, right:-4, background:"#6366f1", color:"#fff", fontSize:8, fontWeight:700, borderRadius:8, padding:"1px 4px", minWidth:14, textAlign:"center" }}>{copyCount}</span>}</button>
            {/* Cycle 9: Glossary */}
            <button onClick={()=>setShowGlossary(true)} aria-label="Glossary" title={lang==="ru"?"Глоссарий":"Glossary"} style={{ width:36, height:36, borderRadius:8, border:`1px solid ${c.brd}`, background:c.card, color:c.text, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", outline:"none", transition:"all .15s" }}>📖</button>
            {/* Feat 4: Shortcuts */}
            <button onClick={()=>setShowShortcuts(true)} aria-label="Shortcuts" title={lang==="ru"?"Горячие клавиши (?)":"Keyboard shortcuts (?)"} style={{ position:"relative", width:36, height:36, borderRadius:8, border:`1px solid ${c.brd}`, background:c.card, color:c.text, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", outline:"none", transition:"all .15s" }}>⌨<span style={{ position:"absolute", bottom:-2, right:-2, fontSize:8, color:c.dim, fontFamily:font, fontWeight:700 }}>?</span></button>
            <button onClick={()=>setTheme(theme==="dark"?"light":"dark")} aria-label={theme==="dark"?"Светлая тема":"Тёмная тема"} title={`${theme==="dark"?"Light":"Dark"} (T)`} style={{ width:36, height:36, borderRadius:8, border:`1px solid ${c.brd}`, background:c.card, color:c.text, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", outline:"none", transition:"all .15s" }}>{theme==="dark"?"☀":"☾"}</button>
            <button onClick={nextLang} aria-label={`Switch language to ${langLabel}`} style={{ height:36, padding:"0 12px", borderRadius:8, border:`1px solid ${c.brd}`, background:c.card, color:c.text, cursor:"pointer", fontSize:10, fontFamily:font, fontWeight:700, outline:"none", transition:"all .15s" }}>{langLabel}</button>
            {/* Feat 9: Font size */}
            <select value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} aria-label="Font size" style={{ height:36, padding:"0 8px", borderRadius:8, border:`1px solid ${c.brd}`, background:c.card, color:c.text, cursor:"pointer", fontSize:10, fontFamily:font, outline:"none" }}>
              <option value={85}>A-</option>
              <option value={100}>A</option>
              <option value={115}>A+</option>
            </select>
          </div>
        </div>

        {/* Feat 16: Welcome banner */}
        {isFirstVisit && <div style={{ marginBottom:16, padding:"16px 20px", borderRadius:12, border:`2px solid #6366f140`, background:"linear-gradient(135deg, #6366f10a, #8b5cf60a)", position:"relative" }}>
          <button onClick={()=>setIsFirstVisit(false)} style={{ position:"absolute", top:8, right:12, background:"none", border:"none", color:c.dim, cursor:"pointer", fontSize:16, outline:"none" }}>×</button>
          <div style={{ fontSize:14, fontWeight:800, color:"#6366f1", marginBottom:8 }}>👋 {lang==="ru"?"Добро пожаловать в AIAgent-Hub!":"Welcome to AIAgent-Hub!"}</div>
          <div style={{ fontSize:11, color:c.mut, lineHeight:1.8 }}>
            {lang==="ru"
              ? "Здесь 132+ промтов для автономных AI-агентов. Выбери промт → скопируй → вставь в терминал агента. Нажми ? для горячих клавиш."
              : "132+ prompts for autonomous AI agents. Pick a prompt → copy → paste into agent terminal. Press ? for keyboard shortcuts."}
          </div>
        </div>}

        {/* ── STATS BAR ── */}
        <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }} className="gap-mobile">
          {stats.byModel.map(([mk, count]) => (
            <div key={mk} title={`${ML[mk]}: ${count} ${t.prompts} (${Math.round(count/stats.total*100)}%)`} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8, background:alpha(MC[mk],.04), border:`1px solid ${alpha(MC[mk],.12)}`, cursor:"default" }} className="pad-mobile">
              <div style={{ width:6, height:6, borderRadius:"50%", background:MC[mk] }} />
              <span style={{ fontSize:10, color:MC[mk], fontWeight:600 }} className="text-sm-mobile">{ML[mk]}</span>
              <span style={{ fontSize:10, color:c.mut }}>{count}</span>
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8, background:c.card, border:`1px solid ${c.brd}` }} className="pad-mobile hide-mobile">
            <span style={{ fontSize:10, color:c.dim }}>~{(stats.totalTokens/1000).toFixed(0)}K tokens</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8, background:c.card, border:`1px solid ${c.brd}` }} className="pad-mobile hide-mobile">
            <span style={{ fontSize:10, color:c.dim }}>{stats.roles} {lang==="ru"?"ролей":"roles"}</span>
          </div>
        </div>

        {/* ── SECTION TABS (task 097: aria roles) ── */}
        <div role="tablist" aria-label="Sections" style={{ display:"flex", gap:4, marginBottom:20, overflowX:"auto", paddingBottom:4 }}>
          {[
            { k:"prompts", l:lang==="ru"?"Промты":"Prompts", n:P.length },
            { k:"combos", l:lang==="ru"?"Комбо":"Combos", n:(COMBOS[lang]||COMBOS.ru).length },
            { k:"cheat", l:lang==="ru"?"Шпаргалки":"Cheat Sheets", n:Object.keys(CHEAT).length },
            { k:"quick", l:lang==="ru"?"Команды CLI":"CLI Commands", n:(QUICK_CMDS[lang]||QUICK_CMDS.ru||[]).reduce((a,c)=>a+c.cmds.length,0) },
            { k:"setup", l:lang==="ru"?"Настройка":"Setup", n:CONFIGS.length },
          ].map(s => (
            <button key={s.k} role="tab" aria-selected={section===s.k} aria-current={section===s.k?"page":undefined} aria-controls={`panel-${s.k}`} onClick={()=>{setSection(s.k);window.scrollTo({top:0,behavior:"smooth"})}} style={{
              padding:"8px 16px", fontSize:11, fontFamily:font, fontWeight:section===s.k?700:400,
              border:`1px solid ${section===s.k?c.text+"30":c.brd}`, borderRadius:8,
              background:section===s.k?c.text+"0a":"transparent", color:section===s.k?c.text:c.mut,
              cursor:"pointer", transition:"all .15s", outline:"none", whiteSpace:"nowrap",
            }} className="text-sm-mobile">{s.l}{s.n ? ` (${s.n})` : ""}</button>
          ))}
        </div>

        {/* ════════════════ SECTION: PROMPTS ════════════════ */}
        {section === "prompts" && <div role="tabpanel" id="panel-prompts">

        {/* Feat 35: Breadcrumbs */}
        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:12, fontSize:10, color:c.dim }}>
          <span>AIAgent-Hub</span>
          <span>›</span>
          <span style={{ color:c.text, fontWeight:600 }}>{section==="prompts"?(lang==="ru"?"Промты":"Prompts"):section==="combos"?(lang==="ru"?"Команды":"Teams"):section==="cheat"?(lang==="ru"?"Шпаргалки":"Cheat"):section==="quick"?"CLI":(lang==="ru"?"Настройка":"Setup")}</span>
          {hasFilters && <><span>›</span><span style={{ color:"#6366f1" }}>{debouncedSearch?`"${debouncedSearch}"`:fm!=="all"?(fm==="model"?(ML[fv]||fv):fm==="role"?(t.r[fv]||fv):fv):(showNew?"NEW":hideUsed?"Hide ✓":"filter")}</span></>}
        </div>

        {/* ── MODEL BADGES (task 018: toggle) ── */}
        <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }} className="gap-mobile">
          {Object.entries(ML).map(([k,v]) => {
            const active = fm==="model"&&fv===k;
            return (
            <div key={k} onClick={()=>{if(active){setFm("all");setFv("all")}else{setFm("model");setFv(k)}}} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:10, border:`1px solid ${active?MC[k]+"50":c.brd}`, background:active?MC[k]+"0a":c.card, cursor:"pointer", transition:"all .15s" }} className="full-mobile pad-mobile" role="button" aria-pressed={active}>
              <div style={{ width:24, height:24, borderRadius:6, background:MC[k]+"20", color:MC[k], display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>{MI[k]}</div>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:active?MC[k]:c.text }} className="text-sm-mobile">{v}</div>
                <div style={{ fontSize:9, color:c.mut }}>{P.filter(p=>p.mk===k).length} {t.prompts}</div>
              </div>
            </div>
          );})}
        </div>

        {/* ── STICKY SEARCH + FILTERS (tasks 012, 035) ── */}
        <div className="sticky-bar" style={{ background:alpha(c.bg,.85) }}>
          {/* Search */}
          <div style={{ position:"relative", marginBottom:10 }}>
            <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSearchFocused(true)} onBlur={()=>setTimeout(()=>setSearchFocused(false),150)} type="search" placeholder={`${t.search} (Ctrl+K)`} aria-label={t.search} style={{
              width:"100%", padding:"10px 14px 10px 36px", fontSize:12, fontFamily:font,
              border:`1px solid ${c.brd}`, borderRadius:10, background:c.card, color:c.text,
              outline:"none", boxSizing:"border-box", transition:"border-color .15s,box-shadow .15s",
            }} />
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:c.dim, pointerEvents:"none" }}>⌕</span>
            {search && <button onClick={()=>setSearch("")} aria-label="Очистить поиск" style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:c.mut, cursor:"pointer", fontSize:16, padding:4, lineHeight:1, outline:"none" }}>×</button>}
          </div>

          {/* Filters */}
          <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
            {[{k:"all",l:t.all},{k:"model",l:t.byModel},{k:"role",l:t.byRole},{k:"type",l:t.byType},{k:"difficulty",l:lang==="ru"?"Сложность":"Difficulty"},{k:"time",l:lang==="ru"?"Время":"Time"},{k:"tag",l:lang==="ru"?"Теги":"Tags"}].map(f =>
              <Pill key={f.k} on={fm===f.k} fn={()=>{setFm(f.k);setFv("all");}} lb={f.l} c={c} />
            )}
            {hasFilters && <button onClick={clearFilters} style={{ padding:"5px 14px", fontSize:11, fontFamily:font, border:`1px solid #ef444440`, borderRadius:20, background:"#ef444408", color:"#ef4444", cursor:"pointer", outline:"none" }}>✕ {lang==="ru"?"Сброс":"Reset"}</button>}
            <div style={{ width:1, height:16, background:c.brd }} />
            {/* Feat 10: NEW only */}
            <Pill on={showNew} fn={()=>setShowNew(!showNew)} lb="NEW" cl="#10b981" c={c} />
            {/* Feat 11: Hide used */}
            {usedCount > 0 && <Pill on={hideUsed} fn={()=>setHideUsed(!hideUsed)} lb={lang==="ru"?"Скрыть ✓":"Hide ✓"} cl="#8888a0" c={c} />}
            {/* Feat 8: Auto-collapse */}
            <Pill on={autoCollapse} fn={()=>setAutoCollapse(!autoCollapse)} lb={lang==="ru"?"Авто-свёрт":"Auto-fold"} cl="#06b6d4" c={c} />
          </div>
          {/* Extra filter rows (tasks 044, 046) */}
          {fm==="difficulty" && <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
            <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
            <Pill on={fv==="beginner"} fn={()=>setFv("beginner")} lb={lang==="ru"?"Начальный":"Beginner"} cl="#10b981" c={c} />
            <Pill on={fv==="intermediate"} fn={()=>setFv("intermediate")} lb={lang==="ru"?"Средний":"Intermediate"} cl="#f59e0b" c={c} />
            <Pill on={fv==="advanced"} fn={()=>setFv("advanced")} lb={lang==="ru"?"Продвинутый":"Advanced"} cl="#ef4444" c={c} />
          </div>}
          {fm==="time" && <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
            <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
            <Pill on={fv==="<1h"} fn={()=>setFv("<1h")} lb="< 1h" cl="#10b981" c={c} />
            <Pill on={fv==="1-2h"} fn={()=>setFv("1-2h")} lb="1-2h" cl="#f59e0b" c={c} />
            <Pill on={fv===">2h"} fn={()=>setFv(">2h")} lb="> 2h" cl="#ef4444" c={c} />
          </div>}
          {fm==="tag" && <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
            <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
            {allTags.map(tag => <Pill key={tag} on={fv===tag} fn={()=>setFv(tag)} lb={tag} cl="#6366f1" c={c} />)}
          </div>}
        </div>

        {fm==="role" && <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
          <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
          {roles.map(r=>{const p=P.find(x=>x.role===r);return <Pill key={r} on={fv===r} fn={()=>setFv(r)} lb={t.r[r]||r} cl={p?.ac} c={c}/>;})}
        </div>}
        {fm==="type" && <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
          <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
          <Pill on={fv==="role"} fn={()=>setFv("role")} lb={lang==="ru"?"Роли":"Roles"} cl="#10b981" c={c} />
          <Pill on={fv==="task"} fn={()=>setFv("task")} lb={lang==="ru"?"Спец. задачи":"Tasks"} cl="#ef4444" c={c} />
        </div>}

        {/* ── TOOLBAR (tasks 045, 047, 069, 074, 075, 081) ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:c.dim }}>{debouncedSearch ? `${list.length} / ${P.length}` : list.length} {t.prompts} · ~{(filteredStats.tokens/1000).toFixed(0)}K</span>
            {/* Task 75: Progress tracker */}
            {usedCount > 0 && <span style={{ fontSize:10, color:"#10b981", fontWeight:600 }}>✓ {usedCount}/{P.length}</span>}
            {favCount > 0 && <button onClick={()=>setShowFavsOnly(!showFavsOnly)} aria-pressed={showFavsOnly} style={{
              padding:"3px 10px", fontSize:10, fontFamily:font, fontWeight:showFavsOnly?600:400,
              border:`1px solid ${showFavsOnly?"#eab308":c.brd}`, borderRadius:12,
              background:showFavsOnly?"#eab30812":"transparent", color:showFavsOnly?"#eab308":c.mut,
              cursor:"pointer", outline:"none",
            }}>★ {favCount}</button>}
            {/* Sort (task 045) */}
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} aria-label={lang==="ru"?"Сортировка":"Sort"} style={{ padding:"3px 8px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:8, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>
              <option value="default">{lang==="ru"?"По умолчанию":"Default"}</option>
              <option value="name">{lang==="ru"?"По имени":"By name"}</option>
              <option value="length">{lang==="ru"?"По длине":"By length"}</option>
              <option value="time">{lang==="ru"?"По времени":"By time"}</option>
              <option value="model">{lang==="ru"?"По модели":"By model"}</option>
            </select>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
            {/* Task 74: Quick copy mode */}
            <button onClick={()=>setQuickCopy(!quickCopy)} aria-pressed={quickCopy} title={lang==="ru"?"Быстрое копирование: клик = copy":"Quick copy: click = copy"} style={{ padding:"3px 10px", fontSize:10, fontFamily:font, border:`1px solid ${quickCopy?"#06b6d4":c.brd}`, borderRadius:8, background:quickCopy?"#06b6d412":"transparent", color:quickCopy?"#06b6d4":c.mut, cursor:"pointer", outline:"none" }}>⚡</button>
            {/* Task 69: Compare mode */}
            <button onClick={()=>{setCompareMode(!compareMode);if(compareMode)setCompareIds([]);}} aria-pressed={compareMode} title={lang==="ru"?"Выбрать промты (сравнение/экспорт)":"Select prompts (compare/export)"} style={{ padding:"3px 10px", fontSize:10, fontFamily:font, border:`1px solid ${compareMode?"#8b5cf6":c.brd}`, borderRadius:8, background:compareMode?"#8b5cf612":"transparent", color:compareMode?"#8b5cf6":c.mut, cursor:"pointer", outline:"none" }}>{compareMode ? `⊞ ${compareIds.length}` : "⊞"}</button>
            {/* Random (task 047) */}
            <button onClick={() => {
              const r = P[Math.floor(Math.random()*P.length)];
              setExpanded(e=>({...e,[r.id]:true}));
              setFm("all"); setFv("all"); setSearch(""); setShowFavsOnly(false);
              setTimeout(()=>{document.getElementById(`card-${r.id}`)?.scrollIntoView({behavior:"smooth",block:"center"})},100);
            }} aria-label={lang==="ru"?"Случайный промт":"Random"} style={{ padding:"3px 10px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:8, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>🎲</button>
            {list.length > 0 && hasFilters && <button onClick={() => {
              const allText = list.map(p => `═══ ${(t.r[p.role]||p.role).toUpperCase()} (${p.m}) ═══\n\n${compactMode && p.compact ? p.compact : p.text}`).join('\n\n\n');
              cp("copy-filtered", allText, true);
            }} style={{ padding:"3px 10px", fontSize:10, fontFamily:font, fontWeight:600, border:`1px solid ${copied==="copy-filtered"?"#10b981":c.brd}`, borderRadius:8, background:copied==="copy-filtered"?"#10b98112":"transparent", color:copied==="copy-filtered"?"#10b981":c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}>
              {copied==="copy-filtered" ? t.copied : t.copyFiltered} ({list.length})
            </button>}
            <button onClick={toggleAll} style={{ fontSize:10, fontFamily:font, color:c.mut, background:"none", border:"none", cursor:"pointer", padding:"4px 8px", outline:"none" }}>{allExpanded ? t.collapseAll : t.expandAll}</button>
            {/* Feat 26: View mode toggle */}
            <div style={{ display:"flex", border:`1px solid ${c.brd}`, borderRadius:6, overflow:"hidden" }}>
              {[{k:"card",l:"▤"},{k:"table",l:"☰"}].map(v=><button key={v.k} onClick={()=>setViewMode(v.k)} style={{ padding:"3px 8px", fontSize:10, background:viewMode===v.k?c.text+"10":"transparent", color:viewMode===v.k?c.text:c.dim, border:"none", cursor:"pointer", fontFamily:font, outline:"none" }}>{v.l}</button>)}
            </div>
          </div>
        </div>

        {/* Task 69: Compare panel */}
        {compareMode && compareIds.length >= 2 && (
          <div style={{ marginBottom:12, padding:12, borderRadius:10, border:`2px solid #8b5cf640`, background:"#8b5cf608" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#8b5cf6", marginBottom:8 }}>{lang==="ru"?"Сравнение":"Compare"} ({compareIds.length})</div>
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(compareIds.length, 3)}, 1fr)`, gap:8 }}>
              {compareIds.map(id => {
                const p = pGet(id);
                return p ? (
                  <div key={id} style={{ padding:10, borderRadius:8, border:`1px solid ${p.ac}30`, background:c.surf, fontSize:10 }}>
                    <div style={{ fontWeight:700, color:p.ac, marginBottom:4 }}>{p.icon} {t.r[p.role]||p.role}</div>
                    <div style={{ color:c.dim, fontSize:9, marginBottom:4 }}>{ML[p.mk]} · {p.time} · {p.difficulty}</div>
                    <div style={{ color:c.mut, maxHeight:200, overflowY:"auto", fontSize:9, lineHeight:1.5, whiteSpace:"pre-wrap" }}>{p.text.slice(0,500)}...</div>
                  </div>
                ) : null;
              })}
            </div>
            <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
              {/* Feat 21: Bulk export selected */}
              <button onClick={()=>{
                const allText = buildPromptBundle(compareIds);
                cp("bulk-export", allText, true);
              }} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, fontWeight:600, border:`1px solid #6366f1`, borderRadius:6, background:"#6366f1", color:"#fff", cursor:"pointer", outline:"none" }}>
                {copied==="bulk-export"?t.copied:(lang==="ru"?"Скопировать все":"Copy all")} ({compareIds.length})
              </button>
              <button onClick={()=>setCompareIds(list.map(p=>p.id))} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:6, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Выбрать все":"Select all"}</button>
              <button onClick={()=>setCompareIds([])} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:6, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Снять все":"Deselect"}</button>
              <button onClick={()=>{setCompareIds([]);setCompareMode(false)}} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:6, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
            </div>
          </div>
        )}

        {/* Task 78: Prompt of the day */}
        {!hasFilters && !showFavsOnly && potd && (
          <div style={{ marginBottom:12, padding:"10px 14px", borderRadius:10, border:`1px solid ${potd.ac}30`, background:`linear-gradient(135deg, ${potd.ac}06, ${potd.ac}02)` }}>
            <div style={{ fontSize:9, fontWeight:700, color:potd.ac, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>💡 {lang==="ru"?"Промт дня":"Prompt of the day"}</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"space-between" }}>
              <div style={{ fontSize:11, fontWeight:600, color:c.text }}>{potd.icon} {t.r[potd.role]||potd.role} <span style={{ fontSize:9, color:c.mut, fontWeight:400 }}>({ML[potd.mk]})</span></div>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={()=>{setExpanded(e=>({...e,[potd.id]:true}));setTimeout(()=>document.getElementById("card-"+potd.id)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, fontWeight:600, border:`1px solid ${potd.ac}40`, borderRadius:6, background:"transparent", color:potd.ac, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Открыть":"Open"}</button>
                <button onClick={()=>cp(potd.id,potd.text)} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, fontWeight:600, border:`1px solid ${potd.ac}`, borderRadius:6, background:potd.ac, color:c.bg, cursor:"pointer", outline:"none" }}>{copied===potd.id?t.copied:t.copy}</button>
              </div>
            </div>
          </div>
        )}

        {/* Task 66: Prompt Constructor */}
        {showConstructor && (
          <div style={{ marginBottom:16, padding:"16px 18px", borderRadius:12, border:`2px solid #6366f140`, background:"#6366f106" }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#6366f1", marginBottom:12 }}>🔧 {lang==="ru"?"Конструктор промта":"Prompt Constructor"}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }} className="stack-mobile">
              <div>
                <div style={{ fontSize:10, fontWeight:600, color:c.text, marginBottom:6 }}>{lang==="ru"?"Роль":"Role"}</div>
                <select value={constructorRole} onChange={e=>setConstructorRole(e.target.value)} style={{ width:"100%", padding:"6px 10px", fontSize:11, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:8, background:c.card, color:c.text, outline:"none" }}>
                  <option value="">{lang==="ru"?"Выбери роль...":"Choose role..."}</option>
                  {["frontend","backend","fullstack","tester","designer","devops","reviewer"].map(r => (
                    <option key={r} value={r}>{t.r[r]||r}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:600, color:c.text, marginBottom:6 }}>{lang==="ru"?"Стек":"Stack"}</div>
                <select value={constructorStack} onChange={e=>setConstructorStack(e.target.value)} style={{ width:"100%", padding:"6px 10px", fontSize:11, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:8, background:c.card, color:c.text, outline:"none" }}>
                  <option value="">---</option>
                  {["React + Next.js + TypeScript","Vue + Nuxt + TypeScript","Svelte + SvelteKit","Python + Django","Python + FastAPI","Go + Gin","Rust + Axum","Node.js + Express"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ fontSize:10, fontWeight:600, color:c.text, marginBottom:6 }}>{lang==="ru"?"Задачи (выбери несколько):":"Tasks (select multiple):"}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:12 }}>
              {["TypeScript strict","Тесты","Безопасность","Производительность","A11Y","SEO","Docker","CI/CD","Документация","Рефакторинг","Error handling","Мониторинг"].map(task => {
                const sel = constructorTasks.includes(task);
                return <button key={task} onClick={()=>setConstructorTasks(ts=>sel?ts.filter(x=>x!==task):[...ts,task])} style={{ fontSize:9, padding:"4px 10px", borderRadius:8, background:sel?"#6366f120":"transparent", color:sel?"#6366f1":c.mut, border:`1px solid ${sel?"#6366f140":c.brd}`, cursor:"pointer", fontFamily:font, outline:"none" }}>{task}</button>;
              })}
            </div>
            {constructorRole && (
              <div style={{ marginBottom:12 }}>
                <button onClick={()=>{
                  let prompt = `Ты старший ${constructorRole}. `;
                  if (constructorStack) prompt += `Стек: ${constructorStack}. `;
                  prompt += `\n\nАВТОНОМНОСТЬ: русский, без вопросов. Прочитай ВЕСЬ проект.\n\n`;
                  if (constructorTasks.length > 0) {
                    prompt += `ЗАДАЧИ:\n`;
                    constructorTasks.forEach((t2,i) => { prompt += `${i+1}. ${t2}\n`; });
                  }
                  prompt += `\nРЕЗУЛЬТАТ: .claude/reports/${constructorRole}.md\n\nАНТИ-ЛУП: 3 = смена подхода. 5 max.\n\nПЕРВЫЙ ШАГ: Прочитай проект → план → реализация.`;
                  cp("constructor", prompt);
                }} style={{ padding:"8px 20px", fontSize:11, fontFamily:font, fontWeight:600, border:"1.5px solid #6366f1", borderRadius:8, background:"#6366f1", color:"#fff", cursor:"pointer", outline:"none" }}>
                  {copied==="constructor" ? t.copied : (lang==="ru"?"Сгенерировать и скопировать":"Generate & Copy")}
                </button>
              </div>
            )}
            <button onClick={()=>setShowConstructor(false)} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:6, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
          </div>
        )}

        {/* Task 76: Import Custom Prompt */}
        {showImport && (
          <div style={{ marginBottom:16, padding:"16px 18px", borderRadius:12, border:`2px dashed ${c.brd}`, background:c.bg2 }}>
            <div style={{ fontSize:12, fontWeight:700, color:c.text, marginBottom:8 }}>📥 {lang==="ru"?"Импорт промта":"Import Prompt"}</div>
            <textarea value={importText} onChange={e=>setImportText(e.target.value)} placeholder={lang==="ru"?"Вставь текст промта здесь...":"Paste prompt text here..."} style={{ width:"100%", height:120, padding:12, fontSize:11, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:8, background:c.card, color:c.text, outline:"none", resize:"vertical", boxSizing:"border-box" }} />
            {importText.trim().length > 50 && (
              <div style={{ marginTop:8, display:"flex", gap:8 }}>
                <button onClick={()=>{cp("imported", importText); setToast(lang==="ru"?"Промт скопирован":"Prompt copied"); setShowImport(false); setImportText("");}} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, fontWeight:600, border:"1.5px solid #10b981", borderRadius:6, background:"#10b981", color:"#fff", cursor:"pointer", outline:"none" }}>{lang==="ru"?"Скопировать":"Copy"} ({Math.round(importText.length/4)} tokens)</button>
              </div>
            )}
            <button onClick={()=>{setShowImport(false);setImportText("")}} style={{ marginTop:8, padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:6, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
          </div>
        )}

        {/* Task 66,76: Constructor & Import buttons + Task 58,93,94: Stack & PromptLang */}
        {!showConstructor && !showImport && (
          <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
            <button onClick={()=>setShowConstructor(true)} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px dashed #6366f140`, borderRadius:8, background:"transparent", color:"#6366f1", cursor:"pointer", outline:"none" }}>🔧 {lang==="ru"?"Конструктор":lang==="kk"?"Конструктор":"Constructor"}</button>
            <button onClick={()=>setShowImport(true)} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px dashed ${c.brd}`, borderRadius:8, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>📥 {lang==="ru"?"Импорт":lang==="kk"?"Импорт":"Import"}</button>
            <div style={{ width:1, height:16, background:c.brd, margin:"0 2px" }} className="hide-mobile" />
            {/* Task 93+94: Prompt language */}
            <select value={promptLang} onChange={e=>setPromptLang(e.target.value)} aria-label="Prompt language" style={{ padding:"3px 8px", fontSize:9, fontFamily:font, border:`1px solid ${promptLang!=="original"?"#f97316":c.brd}`, borderRadius:8, background:promptLang!=="original"?"#f9731608":c.card, color:promptLang!=="original"?"#f97316":c.mut, cursor:"pointer", outline:"none" }}>
              <option value="original">🌐 Original</option>
              <option value="en">🇬🇧 English output</option>
            </select>
            {/* Compact mode for Claude Code */}
            <button onClick={()=>setCompactMode(!compactMode)} aria-pressed={compactMode} title={lang==="ru"?"Компактные промты для Claude Code (~700 символов)":"Compact prompts for Claude Code (~700 chars)"} style={{ padding:"3px 10px", fontSize:9, fontFamily:font, border:`1px solid ${compactMode?"#10b981":c.brd}`, borderRadius:8, background:compactMode?"#10b98110":"transparent", color:compactMode?"#10b981":c.mut, cursor:"pointer", outline:"none", fontWeight:compactMode?700:400 }}>
              {compactMode ? "⚡ Compact" : "📄 Full"}
            </button>
            {/* Task 58: Stack override */}
            <select value={stackOverride} onChange={e=>setStackOverride(e.target.value)} aria-label="Stack override" style={{ padding:"3px 8px", fontSize:9, fontFamily:font, border:`1px solid ${stackOverride?"#8b5cf6":c.brd}`, borderRadius:8, background:stackOverride?"#8b5cf608":c.card, color:stackOverride?"#8b5cf6":c.mut, cursor:"pointer", outline:"none" }}>
              <option value="">⚙ {lang==="ru"?"Стек":"Stack"}: Auto</option>
              <option value="React + Next.js + TypeScript">React + Next.js</option>
              <option value="Vue + Nuxt + TypeScript">Vue + Nuxt</option>
              <option value="Svelte + SvelteKit">SvelteKit</option>
              <option value="Python + Django">Django</option>
              <option value="Python + FastAPI">FastAPI</option>
              <option value="Go + Gin">Go + Gin</option>
              <option value="Rust + Axum">Rust + Axum</option>
            </select>
          </div>
        )}

        {/* Feat 26: Table view */}
        {viewMode === "table" && list.length > 0 && (
          <div style={{ overflowX:"auto", marginBottom:12 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10, fontFamily:font }}>
              <thead><tr style={{ borderBottom:`2px solid ${c.brd}`, textAlign:"left" }}>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }}>#</th>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }}>{lang==="ru"?"Роль":"Role"}</th>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }}>{lang==="ru"?"Модель":"Model"}</th>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }} className="hide-mobile">{lang==="ru"?"Время":"Time"}</th>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }} className="hide-mobile">{lang==="ru"?"Ур.":"Lvl"}</th>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }} className="hide-mobile">Tokens</th>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }}></th>
              </tr></thead>
              <tbody>{list.slice(0, showCount).map((p, i) => (
                <tr key={p.id} style={{ borderBottom:`1px solid ${c.brd}`, cursor:"pointer" }} onClick={()=>{setViewMode("card");setExpanded(e=>({...e,[p.id]:true}));setTimeout(()=>document.getElementById("card-"+p.id)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}}>
                  <td style={{ padding:"6px 8px", color:c.dim }}>{i+1}</td>
                  <td style={{ padding:"6px 8px" }}><span style={{ color:p.ac, fontWeight:600 }}>{p.icon} {t.r[p.role]||p.role}</span></td>
                  <td style={{ padding:"6px 8px" }}><span style={{ display:"inline-flex", alignItems:"center", gap:4 }}><span style={{ width:6, height:6, borderRadius:"50%", background:MC[p.mk], flexShrink:0 }} /><span style={{ color:MC[p.mk], fontSize:9 }}>{ML[p.mk]}</span></span></td>
                  <td style={{ padding:"6px 8px", color:c.mut }} className="hide-mobile">{p.time}</td>
                  <td style={{ padding:"6px 8px" }} className="hide-mobile">{p.difficulty && <span style={{ fontSize:8, padding:"1px 5px", borderRadius:6, background:({beginner:"#10b981",intermediate:"#f59e0b",advanced:"#ef4444"})[p.difficulty]+"15", color:({beginner:"#10b981",intermediate:"#f59e0b",advanced:"#ef4444"})[p.difficulty] }}>{p.difficulty}</span>}</td>
                  <td style={{ padding:"6px 8px", color:c.dim }} className="hide-mobile">~{Math.ceil(p.text.length/4)}</td>
                  <td style={{ padding:"6px 8px" }}><button onClick={(e)=>{e.stopPropagation();cp(p.id,p.text)}} style={{ padding:"3px 10px", fontSize:9, fontFamily:font, fontWeight:600, border:`1px solid ${p.ac}`, borderRadius:6, background:copied===p.id?"transparent":p.ac, color:copied===p.id?p.ac:c.bg, cursor:"pointer", outline:"none" }}>{copied===p.id?"✓":t.copy}</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* ── PROMPT CARDS (task 81: paginated) ── */}
        {viewMode === "card" && list.slice(0, showCount).map((p) => {
          const isO = expanded[p.id]; const ln = p.text.split("\n").length;
          const preview = p.text.split("\n").slice(0, 2).join(" ").slice(0, 100);
          const diffColors = {beginner:"#10b981",intermediate:"#f59e0b",advanced:"#ef4444"};
          const isUsed = usedPrompts[p.id];
          return (
            <div key={p.id} id={`card-${p.id}`} tabIndex={0} className={isO?"":"card-enter"}
              onClick={()=>{ if(quickCopy && !isO){ cp(p.id,p.text); return; } }}
              onDoubleClick={()=>cp(p.id,p.text)} style={{
              marginBottom:8, border:`1px solid ${isO?p.ac+"35":compareIds.includes(p.id)?"#8b5cf650":debouncedSearch?p.ac+"20":c.brd}`, borderRadius:12,
              background:isO?c.cardH:c.card, overflow:"hidden", transition:"all .2s",
              boxShadow:isO?`0 0 20px ${p.ac}08`:"none",
              borderLeft:`3px solid ${MC[p.mk]}`, contain:"content",
              cursor:quickCopy?"copy":"default",
            }}>
              {/* Header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", gap:8 }} className="pad-mobile">
                <div onClick={()=>toggle(p.id)} style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0, cursor:"pointer" }} role="button" aria-expanded={isO} aria-controls={`body-${p.id}`}>
                  <div style={{ width:36, height:36, borderRadius:9, background:p.ac+"12", border:`1px solid ${p.ac}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{p.icon}</div>
                  <div style={{ minWidth:0, flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:p.ac }}>{debouncedSearch ? <HL text={t.r[p.role]||p.role} q={debouncedSearch} color={p.ac}/> : (t.r[p.role]||p.role)}</span>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:MC[p.mk]+"12", color:MC[p.mk], border:`1px solid ${MC[p.mk]}25`, fontWeight:600 }}>{ML[p.mk]}</span>
                      {p.type==="task" && <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:"#ef444412", color:"#ef4444", border:"1px solid #ef444425", fontWeight:600 }}>{lang==="ru"?"задача":"task"}</span>}
                      {p.difficulty && <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:diffColors[p.difficulty]+"12", color:diffColors[p.difficulty], border:`1px solid ${diffColors[p.difficulty]}25`, fontWeight:500 }} className="hide-mobile">{p.difficulty}</span>}
                      {p.v==="7.1" && <span style={{ fontSize:8, padding:"1px 6px", borderRadius:6, background:"#10b98118", color:"#10b981", border:"1px solid #10b98130", fontWeight:700 }}>NEW</span>}
                      {p.time && <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:c.surf, color:c.mut, border:`1px solid ${c.brd}`, fontWeight:500 }} className="hide-mobile">{p.time}</span>}
                    </div>
                    {!isO && <div style={{ fontSize:10, color:c.dim, marginTop:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{preview}...</div>}
                    {isO && <div style={{ fontSize:10, color:c.mut, marginTop:3 }}>{compactMode ? (p.compact||"").split("\n").length : ln} {t.lines} · {(compactMode ? (p.compact||"") : p.text).split(/\s+/).length} {lang==="ru"?"слов":"words"} · ~{Math.ceil((compactMode ? (p.compact||"").length : p.text.length)/4)} tokens {compactMode && <span style={{color:"#10b981",fontWeight:600}}>⚡</span>}</div>}
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0, alignItems:"center" }}>
                  {/* Task 75: Used indicator */}
                  {/* Feat 18: Focus mode button */}
                  <button onClick={(e)=>{e.stopPropagation();setFocusPrompt(p)}} aria-label="Focus" title={lang==="ru"?"Focus mode (F)":"Focus mode (F)"} className="hide-mobile" style={{ width:30, height:30, borderRadius:7, border:`1px solid ${c.brd}`, background:"transparent", color:c.dim, cursor:"pointer", outline:"none", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>⛶</button>
                  {copyCounters[p.id] > 0 && <span style={{ fontSize:8, color:c.dim, fontWeight:600 }} title={lang==="ru"?`Скопировано ${copyCounters[p.id]}x`:`Copied ${copyCounters[p.id]}x`}>×{copyCounters[p.id]}</span>}
                  {isUsed && <span style={{ fontSize:10, color:"#10b981" }} title={lang==="ru"?"Использован":"Used"}>✓</span>}
                  {/* Task 69: Compare checkbox */}
                  {compareMode && <button onClick={(e)=>{e.stopPropagation();setCompareIds(ids=>ids.includes(p.id)?ids.filter(x=>x!==p.id):[...ids,p.id])}} style={{ width:24, height:24, borderRadius:6, border:`1px solid ${compareIds.includes(p.id)?"#8b5cf6":c.brd}`, background:compareIds.includes(p.id)?"#8b5cf6":"transparent", color:compareIds.includes(p.id)?"#fff":c.dim, cursor:"pointer", outline:"none", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center" }}>{compareIds.includes(p.id)?"✓":""}</button>}
                  <button onClick={(e)=>{e.stopPropagation();setPinnedIds(ids=>ids.includes(p.id)?ids.filter(x=>x!==p.id):[...ids,p.id])}} aria-label="Pin" title={lang==="ru"?"Закрепить наверху":"Pin to top"} className="hide-mobile" style={{ width:30, height:30, borderRadius:7, border:`1px solid ${pinnedIds.includes(p.id)?"#6366f140":c.brd}`, background:pinnedIds.includes(p.id)?"#6366f112":"transparent", color:pinnedIds.includes(p.id)?"#6366f1":c.dim, cursor:"pointer", outline:"none", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>{pinnedIds.includes(p.id)?"📌":"📍"}</button>
                  <button onClick={(e)=>{e.stopPropagation();toggleFav(p.id)}} aria-label={favs[p.id]?"Убрать":"Избранное"} aria-pressed={!!favs[p.id]} style={{ width:30, height:30, borderRadius:7, border:`1px solid ${favs[p.id]?"#eab30840":c.brd}`, background:favs[p.id]?"#eab30812":"transparent", color:favs[p.id]?"#eab308":c.dim, cursor:"pointer", outline:"none", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>{favs[p.id]?"★":"☆"}</button>
                  <button onClick={(e)=>{e.stopPropagation();toggle(p.id)}} aria-expanded={isO} className="hide-mobile" style={{ padding:"5px 11px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:7, background:"transparent", color:c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}>{isO ? t.hide : t.show}</button>
                  <CBtn id={p.id} txt={compactMode && p.compact ? p.compact : p.text} cl={p.ac} sm copied={copied} cp={cp} t={t} bg={c.bg} />
                  {/* Cycle 6: Copy as markdown */}
                  {isO && <button onClick={(e)=>{e.stopPropagation();const md=`## ${p.icon} ${t.r[p.role]||p.role} (${p.m})\n\n\`\`\`\n${p.text}\n\`\`\`\n`;cp("md-"+p.id,md,true)}} title={lang==="ru"?"Копировать как Markdown":"Copy as Markdown"} className="hide-mobile" style={{ width:30, height:30, borderRadius:7, border:`1px solid ${copied===("md-"+p.id)?"#10b981":c.brd}`, background:copied===("md-"+p.id)?"#10b98112":"transparent", color:copied===("md-"+p.id)?"#10b981":c.dim, cursor:"pointer", outline:"none", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", fontFamily:font, fontWeight:700 }}>{copied===("md-"+p.id)?"✓":"MD"}</button>}
                  {/* Cycle 25: Diff button */}
                  {isO && p.compact && <button onClick={(e)=>{e.stopPropagation();setShowDiff(p.id)}} title={lang==="ru"?"Сравнить original vs compact":"Diff original vs compact"} className="hide-mobile" style={{ width:30, height:30, borderRadius:7, border:`1px solid ${c.brd}`, background:"transparent", color:c.dim, cursor:"pointer", outline:"none", fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", fontFamily:font, fontWeight:700 }}>⇄</button>}
                  {/* Task 77: Share link */}
                  <button onClick={(e)=>{e.stopPropagation();const url=location.origin+location.pathname+`#prompt-${p.id}`;navigator.clipboard?.writeText(url);setCopied("share-"+p.id);setTimeout(()=>setCopied(null),2000)}} title={lang==="ru"?"Скопировать ссылку":"Copy link"} className="hide-mobile" style={{ width:30, height:30, borderRadius:7, border:`1px solid ${copied===("share-"+p.id)?"#10b981":c.brd}`, background:copied===("share-"+p.id)?"#10b98112":"transparent", color:copied===("share-"+p.id)?"#10b981":c.dim, cursor:"pointer", outline:"none", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>{copied===("share-"+p.id)?"✓":"🔗"}</button>
                </div>
              </div>
              {/* Body (task 084: lazy render) */}
              {isO && (
                <div id={`body-${p.id}`} className="body-enter" style={{ padding:"0 16px 14px" }}>
                  <div style={{ maxHeight:420, overflowY:"auto", padding:14, background:c.surf, borderRadius:9, border:`1px solid ${c.brd}` }}>
                    {compactMode && <div style={{ marginBottom:8, padding:"4px 10px", borderRadius:6, background:"#10b98110", border:"1px solid #10b98120", fontSize:9, color:"#10b981", fontWeight:600 }}>⚡ COMPACT MODE — {lang==="ru"?"оптимизировано для Claude Code (~700 символов)":"optimized for Claude Code (~700 chars)"}</div>}
                    <pre style={{ fontSize:10.5, lineHeight:1.65, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, fontFamily:font }}>{debouncedSearch ? <HL text={compactMode && p.compact ? p.compact : p.text} q={debouncedSearch} color={p.ac}/> : (compactMode && p.compact ? p.compact : p.text)}</pre>
                  </div>
                  {/* Task 033: Related prompts */}
                  {p.related && p.related.length > 0 && (
                    <div style={{ marginTop:10, display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
                      <span style={{ fontSize:9, color:c.dim, marginRight:4 }}>{lang==="ru"?"Похожие:":"Related:"}</span>
                      {p.related.slice(0,4).map(rid => {
                        const rp = pGet(rid);
                        return rp ? <button key={rid} onClick={()=>{toggle(p.id);setExpanded(e=>({...e,[rid]:true}));setTimeout(()=>document.getElementById(`card-${rid}`)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}} style={{ fontSize:9, padding:"2px 8px", borderRadius:8, background:rp.ac+"10", color:rp.ac, border:`1px solid ${rp.ac}20`, cursor:"pointer", fontFamily:font, outline:"none" }}>{rp.icon} {t.r[rp.role]||rp.role}</button> : null;
                      })}
                    </div>
                  )}
                  {/* Task 116: Output info */}
                  {p.output && <div style={{ marginTop:6, fontSize:9, color:c.dim }}>📄 {p.output}</div>}
                  {/* Prereqs display */}
                  {p.prereqs && p.prereqs.length > 0 && (
                    <div style={{ marginTop:6, display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
                      <span style={{ fontSize:9, color:c.dim }}>⚙ {lang==="ru"?"Требуется:":"Requires:"}</span>
                      {p.prereqs.map(pr => <span key={pr} style={{ fontSize:8, padding:"1px 6px", borderRadius:6, background:c.surf, color:c.mut, border:`1px solid ${c.brd}` }}>{pr}</span>)}
                    </div>
                  )}
                  {/* Feat 22: Similar by tags (only if no related defined) */}
                  {(!p.related || p.related.length === 0) && p.tags && p.tags.length > 0 && (() => {
                    const similar = P.filter(x => x.id !== p.id && x.tags && x.tags.some(t2 => p.tags.includes(t2))).slice(0, 3);
                    return similar.length > 0 ? (
                      <div style={{ marginTop:6, display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
                        <span style={{ fontSize:9, color:c.dim, marginRight:4 }}>{lang==="ru"?"Похожие:":"Similar:"}</span>
                        {similar.map(sp => <button key={sp.id} onClick={()=>{setExpanded(e=>({...e,[sp.id]:true}));setTimeout(()=>document.getElementById(`card-${sp.id}`)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}} style={{ fontSize:9, padding:"2px 8px", borderRadius:8, background:sp.ac+"10", color:sp.ac, border:`1px solid ${sp.ac}20`, cursor:"pointer", fontFamily:font, outline:"none" }}>{sp.icon} {t.r[sp.role]||sp.role}</button>)}
                      </div>
                    ) : null;
                  })()}
                  {/* Tags display */}
                  {p.tags && p.tags.length > 0 && (
                    <div style={{ marginTop:6, display:"flex", gap:3, flexWrap:"wrap" }}>
                      {p.tags.map(tag => <button key={tag} onClick={()=>{setFm("tag");setFv(tag)}} style={{ fontSize:8, padding:"1px 6px", borderRadius:6, background:"#6366f108", color:"#6366f1", border:`1px solid #6366f120`, cursor:"pointer", fontFamily:font, outline:"none" }}>#{tag}</button>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Feat 30: Recently viewed */}
        {!hasFilters && recentViewed.length > 0 && viewMode === "card" && (
          <div style={{ marginBottom:12, padding:"8px 12px", borderRadius:8, border:`1px solid ${c.brd}`, background:c.bg2 }}>
            <div style={{ fontSize:9, color:c.dim, marginBottom:4, fontWeight:600 }}>{lang==="ru"?"Недавно просмотренные":"Recently viewed"}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {recentViewed.map(rid => { const rp = pGet(rid); return rp ? <button key={rid} onClick={()=>{setExpanded(e=>({...e,[rid]:true}));setTimeout(()=>document.getElementById("card-"+rid)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}} style={{ fontSize:9, padding:"3px 8px", borderRadius:6, background:rp.ac+"10", color:rp.ac, border:`1px solid ${rp.ac}20`, cursor:"pointer", fontFamily:font, outline:"none" }}>{rp.icon} {t.r[rp.role]||rp.role}</button> : null; })}
            </div>
          </div>
        )}

        {list.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 0", color:c.dim, fontSize:12 }}>
            {lang==="ru" ? "Ничего не найдено" : "Nothing found"}
            {hasFilters && <div style={{marginTop:8}}><button onClick={clearFilters} style={{padding:"6px 16px",fontSize:11,fontFamily:font,border:`1px solid ${c.brd}`,borderRadius:8,background:c.card,color:c.text,cursor:"pointer",outline:"none"}}>{lang==="ru"?"Очистить фильтры":"Clear filters"}</button></div>}
          </div>
        )}

        {/* Feat 27: Infinite scroll sentinel */}
        {list.length > showCount && (
          <div ref={loadMoreRef} style={{ textAlign:"center", padding:"16px 0" }}>
            <div style={{ fontSize:10, color:c.dim }}>{lang==="ru"?"Загрузка...":"Loading..."} ({list.length - showCount} {lang==="ru"?"осталось":"remaining"})</div>
          </div>
        )}

        {/* Task 49: Search history */}
        {!search && searchHist.length > 0 && searchFocused && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:9, color:c.dim, marginBottom:4, letterSpacing:1 }}>{lang==="ru"?"НЕДАВНИЕ":"RECENT"}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {searchHist.map((h,i) => (
                <button key={i} onClick={()=>setSearch(h)} style={{ padding:"3px 10px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:12, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>{h}</button>
              ))}
            </div>
          </div>
        )}
        </div>}

        {/* ════════════════ SECTION: COMBOS ════════════════ */}
        {section === "combos" && <div role="tabpanel" id="panel-combos">
        <div style={{ fontSize:10, color:c.dim, marginBottom:14, paddingLeft:4 }}>{t.combosDesc}</div>
        
        {/* Task 70: Workflow Sequencer */}
        <details style={{ marginBottom:16 }}>
          <summary style={{ fontSize:11, fontWeight:700, color:"#8b5cf6", cursor:"pointer", padding:"8px 0" }}>🔀 {lang==="ru"?"Конструктор workflow":"Workflow Builder"}</summary>
          <div style={{ marginTop:8, padding:"14px 16px", borderRadius:10, border:`2px solid #8b5cf630`, background:"#8b5cf606" }}>
            <div style={{ fontSize:10, color:c.dim, marginBottom:10 }}>{lang==="ru"?"Перетаскивай промты для создания последовательности выполнения:":"Drag prompts to create execution sequence:"}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:12 }}>
              {P.filter(p=>!workflow.includes(p.id)).slice(0,30).map(p => (
                <button key={p.id} onClick={()=>setWorkflow(w=>[...w,p.id])} style={{ fontSize:9, padding:"3px 8px", borderRadius:6, background:c.surf, color:p.ac, border:`1px solid ${p.ac}20`, cursor:"pointer", fontFamily:font, outline:"none" }}>{p.icon} {(t.r[p.role]||p.role).slice(0,12)}</button>
              ))}
            </div>
            {workflow.length > 0 && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, fontWeight:600, color:c.text, marginBottom:8 }}>{lang==="ru"?"Последовательность":"Sequence"} ({workflow.length}):</div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
                  {workflow.map((wid,wi) => {
                    const wp = pGet(wid);
                    return wp ? (
                      <div key={wi} style={{ display:"flex", alignItems:"center", gap:4 }}>
                        {wi > 0 && <span style={{ color:c.dim, fontSize:14 }}>→</span>}
                        <div style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:8, background:wp.ac+"15", border:`1px solid ${wp.ac}30` }}>
                          <span style={{ fontSize:10, fontWeight:600, color:wp.ac }}>{wi+1}. {wp.icon} {(t.r[wp.role]||wp.role).slice(0,10)}</span>
                          <button onClick={()=>setWorkflow(w=>w.filter((_,i)=>i!==wi))} style={{ background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:12, padding:0, lineHeight:1 }}>×</button>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
                <div style={{ display:"flex", gap:8, marginTop:10 }}>
                  <button onClick={()=>{
                    const wfText = workflow.map((wid,i)=>{
                      const wp = pGet(wid);
                      return wp ? `═══ ШАГ ${i+1}: ${(t.r[wp.role]||wp.role).toUpperCase()} (${wp.m}) ═══\n\n${wp.text}` : null;
                    }).filter(Boolean).join("\n\n\n");
                    cp("workflow", wfText, true);
                  }} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, fontWeight:600, border:"1.5px solid #8b5cf6", borderRadius:6, background:"#8b5cf6", color:"#fff", cursor:"pointer", outline:"none" }}>
                    {copied==="workflow"?t.copied:(lang==="ru"?"Скопировать workflow":"Copy workflow")} ({workflow.length})
                  </button>
                  <button onClick={()=>setWorkflow([])} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:6, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Очистить":"Clear"}</button>
                </div>
              </div>
            )}
          </div>
        </details>
        
        {/* Task 114: Custom combo builder */}
        <div style={{ marginBottom:16, padding:"12px 16px", borderRadius:10, border:`1px dashed ${buildingCombo?'#6366f1':c.brd}`, background:buildingCombo?'#6366f108':c.card }}>
          {!buildingCombo ? (
            <button onClick={()=>setBuildingCombo(true)} style={{ width:"100%", padding:"8px", fontSize:11, fontFamily:font, fontWeight:600, border:"none", background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>
              + {lang==="ru"?"Создать свою команду":"Build custom team"}
            </button>
          ) : (
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#6366f1", marginBottom:8 }}>{lang==="ru"?"Выбери промты для команды":"Select prompts for team"}</div>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
                {P.filter(p=>p.type==="role"||customCombo.includes(p.id)).map(p => {
                  const sel = customCombo.includes(p.id);
                  return <button key={p.id} onClick={()=>setCustomCombo(cc=>sel?cc.filter(x=>x!==p.id):[...cc,p.id])} style={{ fontSize:9, padding:"4px 10px", borderRadius:8, background:sel?p.ac+"20":c.surf, color:sel?p.ac:c.mut, border:`1px solid ${sel?p.ac+"40":c.brd}`, cursor:"pointer", fontFamily:font, outline:"none", fontWeight:sel?600:400 }}>{p.icon} {t.r[p.role]||p.role}</button>;
                })}
              </div>
              {customCombo.length > 0 && (
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                  <div style={{ fontSize:9, color:c.dim }}>{lang==="ru"?"Можно добавить задачи:":"Add tasks:"}</div>
                  {P.filter(p=>p.type==="task"&&!customCombo.includes(p.id)).slice(0,20).map(p => (
                    <button key={p.id} onClick={()=>setCustomCombo(cc=>[...cc,p.id])} style={{ fontSize:8, padding:"2px 6px", borderRadius:6, background:c.surf, color:c.dim, border:`1px solid ${c.brd}`, cursor:"pointer", fontFamily:font, outline:"none" }}>{p.icon} {t.r[p.role]||p.role}</button>
                  ))}
                </div>
              )}
              <div style={{ display:"flex", gap:6 }}>
                {customCombo.length >= 2 && <button onClick={()=>{
                  const allText = buildPromptBundle(customCombo);
                  cp("custom-combo", allText);
                }} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, fontWeight:600, border:"1.5px solid #6366f1", borderRadius:6, background:"#6366f1", color:"#fff", cursor:"pointer", outline:"none" }}>
                  {copied==="custom-combo" ? t.copied : (lang==="ru"?"Скопировать":"Copy")} ({customCombo.length})
                </button>}
                <button onClick={()=>{setBuildingCombo(false);setCustomCombo([])}} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:6, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Отмена":"Cancel"}</button>
              </div>
            </div>
          )}
        </div>

        {/* Task 122: Difficulty distribution */}
        <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center" }}>
          <span style={{ fontSize:9, color:c.dim }}>{lang==="ru"?"Сложность:":"Difficulty:"}</span>
          {[{k:"beginner",l:lang==="ru"?"Начальный":"Beginner",cl:"#10b981"},{k:"intermediate",l:lang==="ru"?"Средний":"Intermediate",cl:"#f59e0b"},{k:"advanced",l:lang==="ru"?"Продвинутый":"Advanced",cl:"#ef4444"}].map(d => {
            const n = P.filter(p=>p.difficulty===d.k).length;
            return <div key={d.k} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:Math.max(16, n*1.5), height:6, borderRadius:3, background:d.cl+"60" }} />
              <span style={{ fontSize:9, color:d.cl }}>{n}</span>
            </div>;
          })}
        </div>

        {debouncedSearch && <div style={{ fontSize:10, color:c.dim, marginBottom:8 }}>{lang==="ru"?"Фильтр":"Filter"}: "{debouncedSearch}"</div>}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(250px, 1fr))", gap:8 }}>
          {(COMBOS[lang]||COMBOS.ru).filter(cb => !debouncedSearch || (cb.name + " " + cb.desc).toLowerCase().includes(debouncedSearch.toLowerCase())).map((cb, i) => {
            // Task 71: detect conflicts (multiple prompts for same role type)
            const agents = (cb.ids||[]).map(id=>pGet(id)).filter(Boolean);
            const roleTypes = agents.map(a=>a.mk+"-"+a.type);
            const hasConflict = roleTypes.length !== new Set(roleTypes).size;
            return (
            <div key={i} className="card-enter" style={{
              padding:"14px 16px", borderRadius:10, border:`1px solid ${c.brd}`,
              background:c.card, cursor:"pointer", transition:"all .15s",
              borderLeft:`3px solid ${cb.color}`, animationDelay:`${i*30}ms`,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <div style={{ fontSize:12, fontWeight:700, color:c.text }}>{cb.name}</div>
                {hasConflict && <span style={{ fontSize:8, padding:"1px 6px", borderRadius:6, background:"#f59e0b18", color:"#f59e0b", border:"1px solid #f59e0b30" }}>⚠</span>}
                <span style={{ fontSize:9, color:c.dim }}>{(cb.ids||[]).length} {lang==="ru"?"агентов":"agents"}</span>
              </div>
              <div style={{ fontSize:10, color:c.dim, lineHeight:1.5, marginBottom:8 }}>{cb.desc}</div>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
                {(cb.ids||[]).map(id => {
                  const p = pGet(id);
                  return p ? <span key={id} style={{ fontSize:8, padding:"2px 6px", borderRadius:8, background:p.ac+"12", color:p.ac, border:`1px solid ${p.ac}20` }}>{p.icon} {t.r[p.role]||p.role}</span> : null;
                })}
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <div onClick={(e)=>{
                  e.stopPropagation();
                  const allText = buildPromptBundle(cb.ids);
                  cp("combo-"+i, allText);
                }} style={{ flex:1, fontSize:9, padding:"6px 10px", borderRadius:6, border:`1px solid ${c.brd}`, background:c.surf, color:copied===("combo-"+i)?"#10b981":c.mut, cursor:"pointer", textAlign:"center", fontWeight:600, fontFamily:font, transition:"all .15s" }}>
                  {copied===("combo-"+i) ? t.copied : (lang==="ru"?"Скопировать":"Copy prompts")}
                </div>
                <div onClick={(e)=>{
                  e.stopPropagation();
                  const agents = (cb.ids||[]).map(id => pGet(id)).filter(Boolean);
                  let script = "#!/bin/bash\n# Team: " + cb.name + "\n\n";
                  agents.forEach(a => {
                    const launcher = a.mk==="claude"?"claude --dangerously-skip-permissions":a.mk==="gemini"?"gemini --model gemini-3.1-pro-preview --yolo":"codex --full-auto";
                    script += `# ${(t.r[a.role]||a.role)} (${a.m})\n# ${launcher}\n\n`;
                  });
                  cp("launch-"+i, script);
                }} style={{ flex:1, fontSize:9, padding:"6px 10px", borderRadius:6, border:`1px solid ${c.brd}`, background:c.surf, color:copied===("launch-"+i)?"#10b981":c.mut, cursor:"pointer", textAlign:"center", fontWeight:600, fontFamily:font, transition:"all .15s" }}>
                  {copied===("launch-"+i) ? t.copied : (lang==="ru"?"Скрипт":"Script")}
                </div>
              </div>
            </div>
          );})}
        </div>
        </div>}

        {/* ════════════════ SECTION: CHEAT SHEETS ════════════════ */}
        {section === "cheat" && <div role="tabpanel" id="panel-cheat">
        {/* Cycle 20: Search in cheat sheets */}
        {debouncedSearch && <div style={{ fontSize:10, color:c.dim, marginBottom:8 }}>{lang==="ru"?"Фильтр":"Filter"}: "{debouncedSearch}"</div>}
        {Object.entries(CHEAT).map(([key, sheet]) => {
          const filteredCmds = debouncedSearch ? sheet.cmds.filter(c2 => (c2.cmd + " " + c2.desc).toLowerCase().includes(debouncedSearch.toLowerCase())) : sheet.cmds;
          if (debouncedSearch && filteredCmds.length === 0) return null;
          return (
          <div key={key} style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:24, height:24, borderRadius:6, background:sheet.color+"20", color:sheet.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>{MI[key]||key[0].toUpperCase()}</div>
              <span style={{ fontSize:14, fontWeight:700, color:sheet.color }}>{sheet.name}</span>
              <span style={{ fontSize:9, color:c.dim }}>{filteredCmds.length}</span>
            </div>
            {filteredCmds.map((c2, i) => (
              <div key={i} onClick={()=>cp(`cheat-${key}-${i}`, c2.cmd)} className="card-enter" style={{
                display:"flex", alignItems:"center", justifyContent:"space-between", gap:12,
                padding:"8px 14px", marginBottom:4, borderRadius:8,
                border:`1px solid ${c.brd}`, background:c.card, cursor:"pointer", transition:"all .15s",
              }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <code style={{ fontSize:11, color:sheet.color, fontFamily:font, wordBreak:"break-all" }}>{c2.cmd}</code>
                  <div style={{ fontSize:10, color:c.mut, marginTop:2 }}>{c2.desc}</div>
                </div>
                <span style={{ fontSize:10, color:copied===`cheat-${key}-${i}`?"#10b981":c.dim, flexShrink:0, fontWeight:600 }}>
                  {copied===`cheat-${key}-${i}` ? "✓" : "⎘"}
                </span>
              </div>
            ))}
          </div>
        );})}
        </div>}

        {/* ════════════════ SECTION: QUICK COMMANDS ════════════════ */}
        {section === "quick" && <div role="tabpanel" id="panel-quick">
        {debouncedSearch && <div style={{ fontSize:10, color:c.dim, marginBottom:8 }}>{lang==="ru"?"Фильтр":"Filter"}: "{debouncedSearch}"</div>}
        {(QUICK_CMDS[lang]||QUICK_CMDS.ru||[]).map((cat, ci) => {
          const filteredQC = debouncedSearch ? cat.cmds.filter(cmd => (cmd.cmd + " " + cmd.label).toLowerCase().includes(debouncedSearch.toLowerCase())) : cat.cmds;
          if (debouncedSearch && filteredQC.length === 0) return null;
          return (
          <div key={ci} style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:c.text, marginBottom:8, paddingLeft:4, letterSpacing:1 }}>{cat.cat} <span style={{ fontSize:9, color:c.dim, fontWeight:400 }}>({filteredQC.length})</span></div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:6 }}>
              {filteredQC.map((cmd, i) => (
                <div key={i} onClick={()=>cp(`qc-${ci}-${i}`, cmd.cmd)} className="card-enter" style={{
                  padding:"10px 14px", borderRadius:8, border:`1px solid ${c.brd}`,
                  background:c.card, cursor:"pointer", transition:"all .15s",
                }}>
                  <div style={{ fontSize:10, color:c.mut, marginBottom:4 }}>{cmd.label}</div>
                  <code style={{ fontSize:11, color:c.text, fontFamily:font, wordBreak:"break-all" }}>{cmd.cmd}</code>
                  {copied===`qc-${ci}-${i}` && <div style={{ fontSize:9, color:"#10b981", marginTop:4, fontWeight:600 }}>{t.copied}</div>}
                </div>
              ))}
            </div>
          </div>
        );})}
        </div>}

        {/* ════════════════ SECTION: SETUP ════════════════ */}
        {section === "setup" && <div role="tabpanel" id="panel-setup">
        {/* Full team setup */}
        <div style={{ marginBottom:16, padding:"16px 18px", borderRadius:12, border:`2px solid #6366f140`, background:"linear-gradient(135deg, #6366f108, #8b5cf608)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, right:0, width:120, height:120, background:"radial-gradient(circle, #6366f110, transparent 70%)", pointerEvents:"none" }} />
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }} className="stack-mobile">
            <div style={{ width:40, height:40, borderRadius:10, background:"#6366f120", border:"1px solid #6366f130", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🚀</div>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:c.text }}>{t.teamSetup}</div>
              <div style={{ fontSize:10, color:c.mut, marginTop:2 }}>{t.teamSetupDesc}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button onClick={()=>cp("team-setup", TEAM_SETUP)} style={{
              padding:"9px 22px", fontSize:12, fontFamily:font, fontWeight:700,
              border:"1.5px solid #6366f1", borderRadius:8,
              background:copied==="team-setup"?"transparent":"#6366f1",
              color:copied==="team-setup"?"#6366f1":"#fff",
              cursor:"pointer", transition:"all .15s", outline:"none",
            }}>{copied==="team-setup" ? t.copied : (lang==="ru"?"Копировать setup-agents.sh":"Copy setup-agents.sh")}</button>
          </div>
        </div>

        {/* Setup commands */}
        <div style={{ marginBottom:6 }}>
          <div style={{ fontSize:9, letterSpacing:4, color:c.dim, textTransform:"uppercase", marginBottom:10, paddingLeft:4 }}>{lang==="ru"?"Настройка и запуск":"Setup & Launch"}</div>
        </div>
        {[
          { id:"git", icon:"📂", title:t.setup, desc:t.setupDesc, text:GIT_SETUP },
          { id:"launch", icon:"▶", title:t.launch, desc:t.launchDesc, text:LAUNCH },
        ].map(s => (
          <div key={s.id} style={{ marginBottom:8, border:`1px solid ${c.brd}`, borderRadius:12, background:c.card }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:c.surf, border:`1px solid ${c.brd}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{s.icon}</div>
                <div><div style={{ fontSize:13, fontWeight:600 }}>{s.title}</div><div style={{ fontSize:10, color:c.mut, marginTop:2 }}>{s.desc}</div></div>
              </div>
              <CBtn id={s.id} txt={s.text} copied={copied} cp={cp} t={t} bg={c.bg} skip />
            </div>
          </div>
        ))}

        {/* Structure */}
        <div style={{ marginTop:16, marginBottom:8, border:`1px solid ${c.brd}`, borderRadius:12, background:c.card }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:c.surf, border:`1px solid ${c.brd}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🗂</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{t.structure}</div>
                <div style={{ fontSize:10, color:c.mut, marginTop:2 }}>{t.structureDesc}</div>
              </div>
            </div>
            <CBtn id="structure" txt={FOLDER_STRUCTURE} copied={copied} cp={cp} t={t} bg={c.bg} skip />
          </div>
        </div>

        {/* Feat 25: Quick launch generator */}
        <div style={{ marginBottom:16, padding:"14px 18px", borderRadius:12, border:`1px dashed ${c.brd}`, background:c.bg2 }}>
          <div style={{ fontSize:12, fontWeight:700, color:c.mut, marginBottom:10 }}>⚡ {lang==="ru"?"Быстрый запуск одного агента":"Quick Launch Single Agent"}</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {P.filter(p=>p.type==="role").slice(0,12).map(p => (
              <button key={p.id} onClick={()=>{
                const launcher = p.mk==="claude"?"claude --dangerously-skip-permissions":p.mk==="gemini"?"gemini --model gemini-3.1-pro-preview --yolo":"codex --full-auto";
                const script = `#!/bin/bash\n# ${t.r[p.role]||p.role} (${p.m})\n${launcher}\n\n# Промт (вставь при первом запросе):\n# ${(t.r[p.role]||p.role)}`;
                cp("ql-"+p.id, script, true);
              }} style={{ fontSize:9, padding:"5px 10px", borderRadius:8, background:p.ac+"10", color:p.ac, border:`1px solid ${p.ac}20`, cursor:"pointer", fontFamily:font, outline:"none", fontWeight:600 }}>
                {p.icon} {(t.r[p.role]||p.role).slice(0,15)} {copied===("ql-"+p.id) ? "✓" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Config files */}
        <div style={{ marginTop:20, marginBottom:6 }}>
          <div style={{ fontSize:9, letterSpacing:4, color:c.dim, textTransform:"uppercase", marginBottom:10, paddingLeft:4 }}>{t.configs}</div>
        </div>
        <div style={{ fontSize:10, color:c.dim, marginBottom:10, paddingLeft:4 }}>{t.configsDesc}</div>
        {CONFIGS.map(cfg => {
          const isO = expanded[cfg.id];
          return (
            <div key={cfg.id} style={{ marginBottom:8, border:`1px solid ${isO?cfg.accent+"35":c.brd}`, borderRadius:12, background:c.card, overflow:"hidden", transition:"all .2s" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", gap:8 }}>
                <div onClick={()=>toggle(cfg.id)} style={{ display:"flex", alignItems:"center", gap:10, flex:1, cursor:"pointer" }} role="button" aria-expanded={isO}>
                  <div style={{ width:36, height:36, borderRadius:9, background:cfg.accent+"12", border:`1px solid ${cfg.accent}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{cfg.icon}</div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:cfg.accent }}>{cfg.name}</span>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:10, background:cfg.accent+"12", color:cfg.accent, border:`1px solid ${cfg.accent}25`, fontWeight:600 }}>config</span>
                    </div>
                    <div style={{ fontSize:10, color:c.mut, marginTop:2 }}>{cfg.desc}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={()=>toggle(cfg.id)} style={{ padding:"5px 11px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:7, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{isO?t.hide:t.show}</button>
                  <CBtn id={cfg.id} txt={cfg.text} cl={cfg.accent} sm copied={copied} cp={cp} t={t} bg={c.bg} skip />
                </div>
              </div>
              {isO && (
                <div className="body-enter" style={{ padding:"0 16px 14px" }}>
                  <div style={{ maxHeight:380, overflowY:"auto", padding:14, background:c.surf, borderRadius:9, border:`1px solid ${c.brd}` }}>
                    <pre style={{ fontSize:10.5, lineHeight:1.65, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, fontFamily:font }}>{cfg.text}</pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>}

        {/* ── TIP + STATS + FAQ ── */}
        <div style={{ marginTop:20, padding:"16px 18px", background:c.bg2, borderRadius:10, border:`1px solid ${c.brd}` }}>
          {/* Stats visualization (task 121) */}
          <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:14, flexWrap:"wrap" }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              {(() => {
                const counts = stats.byModel.map(([mk,n])=>({mk,n}));
                const total = counts.reduce((a,c)=>a+c.n,0);
                let cum = 0;
                return counts.map(({mk,n},i) => {
                  const start = cum/total*360;
                  cum += n;
                  const end = cum/total*360;
                  const sr = start*Math.PI/180, er = end*Math.PI/180;
                  const x1=24+20*Math.sin(sr), y1=24-20*Math.cos(sr);
                  const x2=24+20*Math.sin(er), y2=24-20*Math.cos(er);
                  const large = (end-start)>180?1:0;
                  return <path key={mk} d={`M24,24 L${x1},${y1} A20,20 0 ${large},1 ${x2},${y2} Z`} fill={MC[mk]} opacity={0.85}/>;
                });
              })()}
            </svg>
            <div style={{ flex:1, display:"flex", gap:12, flexWrap:"wrap" }}>
              {stats.byModel.map(([mk,n]) => (
                <div key={mk} style={{ fontSize:10 }}>
                  <span style={{ color:MC[mk], fontWeight:700 }}>{ML[mk]}</span>
                  <span style={{ color:c.dim, marginLeft:4 }}>{n} ({Math.round(n/stats.total*100)}%)</span>
                </div>
              ))}
              <div style={{ fontSize:10 }}>
                <span style={{ color:c.mut, fontWeight:600 }}>{lang==="ru"?"Сложность":"Difficulty"}</span>
                <span style={{ color:"#10b981", marginLeft:6 }}>●{stats.byDifficulty?.beginner||0}</span>
                <span style={{ color:"#f59e0b", marginLeft:4 }}>●{stats.byDifficulty?.intermediate||0}</span>
                <span style={{ color:"#ef4444", marginLeft:4 }}>●{stats.byDifficulty?.advanced||0}</span>
              </div>
            </div>
          </div>
          
          <div style={{ fontSize:10, fontWeight:700, color:c.mut, marginBottom:6, letterSpacing:1, textTransform:"uppercase" }}>{t.tipTitle}</div>
          <div style={{ fontSize:11, color:c.dim, lineHeight:1.8, marginBottom:12 }}>{t.tip}</div>
          
          {/* Task 068: Changelog */}
          <details style={{ marginTop:8 }}>
            <summary style={{ fontSize:10, fontWeight:600, color:c.mut, cursor:"pointer", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{lang==="ru"?"История версий":"Changelog"}</summary>
            <div style={{ fontSize:10, color:c.dim, lineHeight:1.8, paddingLeft:8, borderLeft:`2px solid ${c.brd}`, marginTop:8 }}>
              <div><strong>v9.0</strong> — {lang==="ru"?"165 промтов, 46 комбо, 10 хоткеев. 12 мега-промтов (ночной режим 100+ задач), ♾️ бесконечный режим, глобальный поиск, table view, infinite scroll, focus mode, glossary, pin промтов, copy counters, FAB, 43 теста, CSP, aria-modal, focus-visible.":"165 prompts, 46 combos, 10 shortcuts. 12 mega prompts (overnight 100+ tasks), ♾️ infinite mode, global search, table view, infinite scroll, focus mode, glossary, pin prompts, copy counters, FAB, 43 tests, CSP, aria-modal, focus-visible."}</div>
              <div style={{marginTop:4}}><strong>v8.0</strong> — {lang==="ru"?"132 промта, 14 конфигов, 35 комбо. Теги, сложность, related. Sticky поиск, сортировка, random, toast, CSS анимации, a11y, mobile responsive, ErrorBoundary, persistent storage, URL routing.":"132 prompts, 14 configs, 35 combos. Tags, difficulty, related. Sticky search, sorting, random, toast, CSS animations, a11y, mobile responsive, ErrorBoundary, persistent storage, URL routing."}</div>
              <div style={{marginTop:4}}><strong>v6.0</strong> — {lang==="ru"?"127 промтов. Все промты имеют АНТИ-ЛУП, РЕЗУЛЬТАТ, ПЕРВЫЙ ШАГ. Stats bar, copy filtered, DevTools промт.":"127 prompts. All prompts have ANTI-LOOP, RESULT, FIRST STEP. Stats bar, copy filtered, DevTools prompt."}</div>
              <div style={{marginTop:4}}><strong>v5.0</strong> — {lang==="ru"?"55 промтов. Начальная версия с 3 моделями, конфигами, шпаргалками.":"55 prompts. Initial version with 3 models, configs, cheat sheets."}</div>
            </div>
          </details>
          
          {/* Tasks 128-131: FAQ/Docs */}
          <details style={{ marginTop:8 }}>
            <summary style={{ fontSize:10, fontWeight:600, color:c.mut, cursor:"pointer", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>FAQ</summary>
            <div style={{ fontSize:10, color:c.dim, lineHeight:1.8, paddingLeft:8, borderLeft:`2px solid ${c.brd}`, marginTop:8 }}>
              <div><strong>{lang==="ru"?"Как запустить агента?":"How to start an agent?"}</strong> — {lang==="ru"?"Скопируй промт → откройте терминал в git worktree → вставь при первом запросе → агент работает автономно.":"Copy prompt → open terminal in git worktree → paste on first request → agent works autonomously."}</div>
              <div style={{marginTop:6}}><strong>{lang==="ru"?"Что такое АНТИ-ЛУП?":"What is ANTI-LOOP?"}</strong> — {lang==="ru"?"Защита от зацикливания: если агент делает 3 похожих действия подряд — он меняет подход. Максимум 5 попыток на одну подзадачу.":"Loop protection: if agent does 3 similar actions — it changes approach. Maximum 5 attempts per subtask."}</div>
              <div style={{marginTop:6}}><strong>{lang==="ru"?"Можно ли запускать несколько агентов?":"Can I run multiple agents?"}</strong> — {lang==="ru"?"Да! Используй git worktree для изоляции. Каждый агент в своей worktree не мешает другим. Координация через .claude/logs/ и .gemini/bugs/.":"Yes! Use git worktree for isolation. Each agent in its own worktree. Coordination via .claude/logs/ and .gemini/bugs/."}</div>
              <div style={{marginTop:6}}><strong>{lang==="ru"?"Где документация CLI?":"CLI documentation?"}</strong> — Claude Code: <span style={{color:"#f97316"}}>docs.anthropic.com</span> · Gemini CLI: <span style={{color:"#8b5cf6"}}>github.com/google-gemini/gemini-cli</span> · Codex CLI: <span style={{color:"#06b6d4"}}>github.com/openai/codex</span></div>
              <div style={{marginTop:6}}><strong>{lang==="ru"?"Claude Code вылетает/зависает?":"Claude Code crashes/hangs?"}</strong> — {lang==="ru"?"Контекст 200K токенов, но реально ~120K-140K после системных промтов. Используй Compact режим (⚡). Коммить каждые 15 минут. Bash timeout = 2 мин (увеличь: BASH_DEFAULT_TIMEOUT_MS=1800000 в ~/.claude/settings.json). Не более 30-45 мин на сессию.":"Context is 200K tokens but only ~120-140K usable. Use Compact mode (⚡). Commit every 15 min. Bash timeout = 2 min (increase: BASH_DEFAULT_TIMEOUT_MS=1800000 in ~/.claude/settings.json). Keep sessions under 30-45 min."}</div>
              <div style={{marginTop:6}}><strong>{lang==="ru"?"Что такое CLAUDE.md?":"What is CLAUDE.md?"}</strong> — {lang==="ru"?"Файл инструкций в корне проекта. Claude Code читает его автоматически. Держи < 200 строк. Загружается после каждой компактизации контекста.":"Project root instruction file. Claude Code reads it automatically. Keep under 200 lines. Reloaded after every context compaction."}</div>
            </div>
          </details>

          {/* Task 123: Timeline visualization */}
          <details style={{ marginTop:8 }}>
            <summary style={{ fontSize:10, fontWeight:600, color:c.mut, cursor:"pointer", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{lang==="ru"?"Эволюция":"Evolution"}</summary>
            <div style={{ marginTop:8, padding:"8px 0" }}>
              <svg width="100%" height="80" viewBox="0 0 600 80">
                {[
                  { x:10, v:"v1", n:15, d:"Nov 2024" },
                  { x:120, v:"v3", n:34, d:"Jan 2025" },
                  { x:230, v:"v5", n:100, d:"Feb 2025" },
                  { x:340, v:"v6", n:127, d:"Mar 2025" },
                  { x:480, v:"v7", n:132, d:"Mar 2025" },
                ].map((p,i,a) => (
                  <g key={i}>
                    {i > 0 && <line x1={a[i-1].x+24} y1={40} x2={p.x} y2={40} stroke={c.brd} strokeWidth={2} />}
                    <circle cx={p.x+12} cy={40} r={Math.max(6, p.n/10)} fill="#6366f1" opacity={0.3+i*0.15} />
                    <circle cx={p.x+12} cy={40} r={4} fill="#6366f1" />
                    <text x={p.x+12} y={18} fill={c.text} fontSize={11} fontWeight={700} textAnchor="middle" fontFamily={font}>{p.v}</text>
                    <text x={p.x+12} y={62} fill={c.dim} fontSize={8} textAnchor="middle" fontFamily={font}>{p.n} промтов</text>
                    <text x={p.x+12} y={74} fill={c.dim} fontSize={7} textAnchor="middle" fontFamily={font} opacity={0.6}>{p.d}</text>
                  </g>
                ))}
              </svg>
            </div>
          </details>

          {/* Task 124: Coverage heatmap */}
          <details style={{ marginTop:8 }}>
            <summary style={{ fontSize:10, fontWeight:600, color:c.mut, cursor:"pointer", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{lang==="ru"?"Покрытие":"Coverage"}</summary>
            <div style={{ marginTop:8, display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(80px, 1fr))", gap:4 }}>
              {(() => {
                const cats = [
                  {k:"Frontend",tags:["react","css","components"],cl:"#3b82f6"},
                  {k:"Backend",tags:["nodejs","api","database"],cl:"#10b981"},
                  {k:"Testing",tags:["testing","playwright","qa"],cl:"#f59e0b"},
                  {k:"Security",tags:["security","auth"],cl:"#ef4444"},
                  {k:"DevOps",tags:["docker","ci-cd","kubernetes"],cl:"#8b5cf6"},
                  {k:"Performance",tags:["performance","bundle"],cl:"#ea580c"},
                  {k:"Database",tags:["postgresql","redis","sql"],cl:"#06b6d4"},
                  {k:"UI/UX",tags:["ui","ux","design-system"],cl:"#ec4899"},
                  {k:"Docs",tags:["documentation","readme"],cl:"#6366f1"},
                  {k:"Infra",tags:["infrastructure","nginx","ssl"],cl:"#14b8a6"},
                  {k:"Monitoring",tags:["monitoring","logging","sentry"],cl:"#d946ef"},
                  {k:"Mobile",tags:["mobile","responsive","pwa"],cl:"#f97316"},
                ];
                return cats.map(cat => {
                  const n = P.filter(p => p.tags && p.tags.some(t2 => cat.tags.includes(t2))).length;
                  const pct = Math.round(n / P.length * 100);
                  return (
                    <div key={cat.k} style={{ padding:"6px 8px", borderRadius:6, border:`1px solid ${c.brd}`, background:c.card, textAlign:"center" }}>
                      <div style={{ fontSize:9, fontWeight:600, color:cat.cl }}>{cat.k}</div>
                      <div style={{ marginTop:4, height:4, borderRadius:2, background:c.surf, overflow:"hidden" }}>
                        <div style={{ width:`${Math.min(100,pct*3)}%`, height:"100%", background:cat.cl, borderRadius:2 }} />
                      </div>
                      <div style={{ fontSize:8, color:c.dim, marginTop:2 }}>{n}</div>
                    </div>
                  );
                });
              })()}
            </div>
          </details>
        </div>

        {/* ── EXPORT ── */}
        <div style={{ marginTop:12, display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap" }}>
          <button onClick={() => {
            const items = section==="prompts" && hasFilters ? list : P;
            const totalTokens = items.reduce((a,p)=>a+Math.round(p.text.length/4),0);
            let md = `# AIAgent-Hub v9.0\n\n> ${items.length} ${t.prompts} · ${stats.models} ${t.models} · ~${(totalTokens/1000).toFixed(0)}K tokens\n\n`;
            const grouped = {};
            items.forEach(p => { (grouped[p.mk] = grouped[p.mk]||[]).push(p); });
            Object.entries(grouped).forEach(([mk, grp]) => {
              md += `## ${ML[mk]} (${grp.length})\n\n`;
              grp.forEach(p => {
                md += `### ${p.icon} ${(t.r[p.role]||p.role)} ${p.type==="task"?"(task)":"(role)"} — ${p.time||""} ${p.difficulty||""}\n`;
                if (p.tags) md += `Tags: ${p.tags.join(", ")}\n`;
                md += "\n```\n" + p.text + "\n```\n\n";
              });
            });
            const blob = new Blob([md], { type:"text/markdown" });
            const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "aiagent-hub-prompts.md"; a.click(); URL.revokeObjectURL(url);
          }} style={{
            padding:"8px 24px", fontSize:11, fontFamily:font, fontWeight:600,
            border:`1.5px solid ${c.brd}`, borderRadius:8, background:c.card, color:c.mut,
            cursor:"pointer", transition:"all .15s", outline:"none",
          }}>{lang==="ru"?"Экспорт .md":"Export .md"} ({section==="prompts"&&hasFilters?list.length:P.length})</button>
          {/* Feat 19: CSV export */}
          <button onClick={() => {
            const items = section==="prompts" && hasFilters ? list : P;
            let csv = "ID,Role,Model,Type,Difficulty,Time,Tags,Chars,Tokens\n";
            items.forEach(p => {
              const esc = s => (s||"").replace(/"/g,'""');
              csv += `"${esc(p.id)}","${esc(t.r[p.role]||p.role)}","${esc(p.m)}","${p.type}","${esc(p.difficulty)}","${esc(p.time)}","${esc((p.tags||[]).join(";"))}",${p.text.length},${Math.ceil(p.text.length/4)}\n`;
            });
            const blob = new Blob([csv], { type:"text/csv" });
            const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "aiagent-hub-prompts.csv"; a.click(); URL.revokeObjectURL(url);
          }} style={{
            padding:"8px 24px", fontSize:11, fontFamily:font, fontWeight:600,
            border:`1.5px solid ${c.brd}`, borderRadius:8, background:c.card, color:c.mut,
            cursor:"pointer", transition:"all .15s", outline:"none",
          }}>{lang==="ru"?"Экспорт CSV":"Export CSV"}</button>
          <button onClick={() => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type:"application/json" });
            const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "aiagent-hub-data.json"; a.click(); URL.revokeObjectURL(url);
          }} style={{
            padding:"8px 24px", fontSize:11, fontFamily:font, fontWeight:600,
            border:`1.5px solid ${c.brd}`, borderRadius:8, background:c.card, color:c.mut,
            cursor:"pointer", transition:"all .15s", outline:"none",
          }}>{lang==="ru"?"Экспорт JSON":"Export JSON"}</button>
          {/* Export as self-contained HTML */}
          <button onClick={() => {
            const items = section==="prompts" && hasFilters ? list : P;
            let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>AIAgent-Hub v9.0</title><style>body{font-family:monospace;background:#060609;color:#ddd;padding:20px;max-width:800px;margin:0 auto}h1{color:#6366f1}h2{color:#f97316;border-bottom:1px solid #222;padding-bottom:8px}h3{color:#8b5cf6;margin-top:24px}pre{background:#111;padding:12px;border-radius:8px;white-space:pre-wrap;font-size:12px;line-height:1.6;overflow-x:auto;border:1px solid #222}.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:10px;background:#1a1a28;color:#888;margin:2px}</style></head><body><h1>AIAgent-Hub v9.0</h1><p>${items.length} prompts · ${stats.models} models · ~${stats.totalHours}h</p>`;
            items.forEach(p => {
              html += `<h3>${p.icon} ${t.r[p.role]||p.role} <small>(${p.m} · ${p.time||""} · ${p.difficulty||""})</small></h3>`;
              if (p.tags) html += `<div>${p.tags.map(t2=>`<span class="tag">#${t2}</span>`).join(" ")}</div>`;
              html += `<pre>${p.text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}</pre>`;
            });
            html += `</body></html>`;
            const blob = new Blob([html], { type:"text/html" });
            const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "aiagent-hub.html"; a.click(); URL.revokeObjectURL(url);
          }} style={{
            padding:"8px 24px", fontSize:11, fontFamily:font, fontWeight:600,
            border:`1.5px solid ${c.brd}`, borderRadius:8, background:c.card, color:c.mut,
            cursor:"pointer", transition:"all .15s", outline:"none",
          }}>{lang==="ru"?"Экспорт HTML":"Export HTML"}</button>
          {/* Feat 36: Settings backup/restore */}
          <button onClick={() => {
            try {
              const settings = localStorage.getItem("aiagent-hub-settings");
              if (settings) {
                const blob = new Blob([settings], { type:"application/json" });
                const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "aiagent-hub-settings.json"; a.click(); URL.revokeObjectURL(url);
              }
            } catch {}
          }} style={{ padding:"8px 24px", fontSize:11, fontFamily:font, fontWeight:600, border:`1.5px solid ${c.brd}`, borderRadius:8, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>💾 {lang==="ru"?"Бэкап":"Backup"}</button>
          <button onClick={() => {
            const input = document.createElement("input"); input.type = "file"; input.accept = ".json";
            input.onchange = (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                try {
                  const s = JSON.parse(ev.target.result);
                  localStorage.setItem("aiagent-hub-settings", JSON.stringify(s));
                  if (s.theme) setTheme(s.theme);
                  if (s.lang) setLang(s.lang);
                  if (s.favs) setFavs(s.favs);
                  if (s.used) setUsedPrompts(s.used);
                  if (s.hist) setSearchHist(s.hist);
                  if (s.cc) setCopyCounters(s.cc);
                  setToast(lang==="ru"?"Настройки восстановлены":"Settings restored");
                } catch {}
              };
              reader.readAsText(file);
            };
            input.click();
          }} style={{ padding:"8px 24px", fontSize:11, fontFamily:font, fontWeight:600, border:`1.5px solid ${c.brd}`, borderRadius:8, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>📂 {lang==="ru"?"Восстановить":"Restore"}</button>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ marginTop:24, paddingTop:16, borderTop:`1px solid ${c.brd}`, display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center" }}>
            {Object.entries(ML).map(([k,v]) => (
              <div key={k} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:MC[k] }} />
                <span style={{ fontSize:10, color:c.dim }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:9, color:c.dim, letterSpacing:2 }}>AIAgent-Hub v9.0 · {P.length} {t.prompts} · {(COMBOS[lang]||COMBOS.ru).length} combos · {stats.roles} {lang==="ru"?"ролей":"roles"}{loadTime ? ` · ${loadTime}ms` : ""}{copyCount > 0 ? ` · ${copyCount} ${lang==="ru"?"скопировано":"copied"}` : ""}</div>
          {scrollPct > 10 && <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} aria-label="Scroll to top" style={{ marginTop:8, padding:"6px 20px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:8, background:c.card, color:c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}>↑ {lang==="ru"?"Наверх":"Top"}</button>}
        </div>
      </div>

      {/* Cycle 3: FAB for quick copy on mobile */}
      {(() => {
        const openId = Object.entries(expanded).find(([,v]) => v)?.[0];
        const openP = openId ? pGet(openId) : null;
        return openP && section === "prompts" ? (
          <button className="hide-desktop" onClick={()=>cp(openP.id, compactMode && openP.compact ? openP.compact : openP.text)} style={{ position:"fixed", bottom:70, right:16, width:56, height:56, borderRadius:"50%", background:openP.ac, color:"#fff", border:"none", cursor:"pointer", fontSize:20, fontWeight:800, boxShadow:`0 4px 20px ${openP.ac}40`, zIndex:8999, display:"none", alignItems:"center", justifyContent:"center", outline:"none" }}>{copied===openP.id?"✓":"⎘"}</button>
        ) : null;
      })()}

      {/* Feat 20: Mobile bottom nav */}
      <nav className="mobile-bottom-nav" style={{ display:"none", position:"fixed", bottom:0, left:0, right:0, background:c.card, borderTop:`1px solid ${c.brd}`, padding:"6px 0", zIndex:9000, fontFamily:font }}>
        <div style={{ display:"flex", justifyContent:"space-around", maxWidth:500, margin:"0 auto" }}>
          {[
            { k:"prompts", i:"📝", l:lang==="ru"?"Промты":"Prompts" },
            { k:"combos", i:"👥", l:lang==="ru"?"Команды":"Teams" },
            { k:"cheat", i:"📋", l:lang==="ru"?"CLI":"CLI" },
            { k:"setup", i:"⚙", l:lang==="ru"?"Setup":"Setup" },
          ].map(n=><button key={n.k} onClick={()=>{setSection(n.k);window.scrollTo({top:0,behavior:"smooth"})}} style={{ background:"none", border:"none", color:section===n.k?c.text:c.dim, cursor:"pointer", outline:"none", textAlign:"center", padding:"4px 8px", fontSize:10, fontFamily:font, fontWeight:section===n.k?700:400 }}><div style={{ fontSize:16, marginBottom:2 }}>{n.i}</div>{n.l}</button>)}
        </div>
      </nav>
    </div>
  );
}
