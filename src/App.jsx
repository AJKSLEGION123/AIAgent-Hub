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

  // ── Categories (auto-classified from tags) ──
  const categories = useMemo(() => {
    const CAT_MAP = {
      "AI / LLM": ["rag","ai","llm","embeddings","prompt-engineering","agent","tool-use","function-calling","vector-db"],
      "Security": ["security","audit","owasp","vulnerability","auth","2fa","rbac","jwt","login","registration"],
      "Testing / QA": ["testing","tdd","e2e","qa","supervisor","verification","quality","quality-gate","inspection","watcher"],
      "Performance": ["performance","optimization","caching","bundle","redis","ttl","cache"],
      "DevOps / CI": ["ci-cd","docker","kubernetes","k8s","deploy","monitoring","github-actions","containers","scaling","devops"],
      "Frontend / UI": ["ui","dashboard","forms","dark-mode","animation","tabs","modal","skeleton","drag","calendar","charts"],
      "Backend / API": ["api","crud","rest","graphql","database","websocket","backend","microservices","proxy","gateway"],
      "Data & Files": ["data","parsing","csv","registry","migration","import","export","pdf","seed","1c","erp","gap-analysis"],
      "Integrations": ["webhooks","email","notifications","upload","smtp","sendgrid","webhook","search","map"],
      "Architecture": ["architecture","monorepo","microservices","api-versioning","patterns","refactor","clean-code"],
      "Documentation": ["readme","documentation","docs","markdown","api-docs","codegen","spec","openapi","swagger"],
      "Project Setup": ["setup","init","project","boilerplate","scaffold","config","env","environment","secrets","git"],
    };
    const cats = {};
    for (const [cat, tags] of Object.entries(CAT_MAP)) {
      const matching = P.filter(p => (p.tags||[]).some(t2 => tags.includes(t2)));
      if (matching.length > 0) cats[cat] = matching.length;
    }
    return { map: CAT_MAP, counts: cats };
  }, [P]);

  // ── Filtered list (tasks 041, 043, 045, 046, 125) ──
  const list = useMemo(() => {
    let f = P;
    if (showFavsOnly) f = f.filter(p => favs[p.id]);
    if (showNew) f = f.filter(p => p.v === "7.1");
    if (hideUsed) f = f.filter(p => !usedPrompts[p.id]);
    if (fm === "model" && fv !== "all") f = f.filter(p => p.mk === fv);
    else if (fm === "category" && fv !== "all") {
      const catTags = categories.map[fv] || [];
      f = f.filter(p => (p.tags||[]).some(t2 => catTags.includes(t2)));
    }
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
  }, [fm, fv, debouncedSearch, t, showFavsOnly, favs, P, sortBy, showNew, hideUsed, usedPrompts, pinnedIds, categories]);

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

  const CAT_ICONS = {"AI / LLM":"\u{1F9E0}","Security":"\u{1F6E1}","Testing / QA":"\u{1F9EA}","Performance":"\u26A1","DevOps / CI":"\u2699","Frontend / UI":"\u{1F3A8}","Backend / API":"\u{1F4E6}","Data & Files":"\u{1F4CA}","Integrations":"\u{1F514}","Architecture":"\u{1F3D7}","Documentation":"\u{1F4D6}","Project Setup":"\u{1F680}"};
  const CAT_COLORS = {"AI / LLM":"#8b5cf6","Security":"#ef4444","Testing / QA":"#a855f7","Performance":"#f59e0b","DevOps / CI":"#2563eb","Frontend / UI":"#ec4899","Backend / API":"#10b981","Data & Files":"#0891b2","Integrations":"#f97316","Architecture":"#6366f1","Documentation":"#06b6d4","Project Setup":"#0ea5e9"};

  const randomPrompt = useCallback(() => {
    const r = P[Math.floor(Math.random() * P.length)];
    if (r) {
      setExpanded(e => ({ ...e, [r.id]: true }));
      setSearch("");
      setFm("all"); setFv("all");
      setTimeout(() => document.getElementById(`card-${r.id}`)?.scrollIntoView({ behavior:"smooth", block:"center" }), 100);
    }
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
            { k:"quick", l:lang==="ru"?"Команды CLI":"CLI Commands", n:(QUICK_CMDS[lang]||QUICK_CMDS.ru||[]).reduce((a,c)=>a+(c.cmds||[]).length,0) },
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
            {[{k:"all",l:t.all},{k:"category",l:lang==="ru"?"Категории":"Categories"},{k:"model",l:t.byModel},{k:"role",l:t.byRole},{k:"type",l:t.byType},{k:"difficulty",l:lang==="ru"?"Сложность":"Difficulty"},{k:"time",l:lang==="ru"?"Время":"Time"},{k:"tag",l:lang==="ru"?"Теги":"Tags"}].map(f =>
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
          {fm==="category" && <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
            <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
            {Object.entries(categories.counts).map(([cat,n]) => <button key={cat} onClick={()=>setFv(cat)} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", fontSize:10, fontFamily:font, fontWeight:fv===cat?700:400, border:`1px solid ${fv===cat?(CAT_COLORS[cat]||"#6366f1")+"60":c.brd}`, borderRadius:8, background:fv===cat?(CAT_COLORS[cat]||"#6366f1")+"12":"transparent", color:fv===cat?(CAT_COLORS[cat]||"#6366f1"):c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}><span>{CAT_ICONS[cat]||""}</span> {cat} <span style={{fontSize:8,opacity:.6}}>{n}</span></button>)}
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
            <button onClick={randomPrompt} title={lang==="ru"?"Случайный промпт":"Random prompt"} style={{ padding:"3px 10px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:12, background:"transparent", color:c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}>{lang==="ru"?"🎲 Случайный":"🎲 Random"}</button>
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
                  <button onClick={(e)=>{e.stopPropagation();const url=location.origin+location.pathname+`#prompt-${p.id}`;navigator.clipboard?.writeText(url);setCopied("share-"+p.id);setTimeout(()=>setCopied(null),2000)}} title={lang==="ru"?"Скопировать ссылку":"Copy link"} style={{ width:30, height:30, borderRadius:7, border:`1px solid ${copied===("share-"+p.id)?"#10b981":c.brd}`, background:copied===("share-"+p.id)?"#10b98112":"transparent", color:copied===("share-"+p.id)?"#10b981":c.dim, cursor:"pointer", outline:"none", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>{copied===("share-"+p.id)?"✓":"🔗"}</button>
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
          const cmds = cat.cmds || [];
          const filteredQC = debouncedSearch ? cmds.filter(cmd => (cmd.cmd + " " + cmd.label).toLowerCase().includes(debouncedSearch.toLowerCase())) : cmds;
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
