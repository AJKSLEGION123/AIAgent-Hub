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
    r: { "Feature Development":"Разработка фич","Guided Feature Dev":"Фичи (guided)","API Endpoints":"API эндпоинты","UI Components":"UI компоненты","Database & Migration":"БД и миграции","Authentication":"Аутентификация","PR Review":"Ревью PR","Code Review":"Ревью кода","Simplification":"Упрощение","TDD Development":"TDD разработка","Test Suite":"Набор тестов","E2E Tests":"E2E тесты","Bug Fix":"Исправление багов","Error Handling":"Обработка ошибок","Deep Refactoring":"Рефакторинг","Dead Code Removal":"Удаление мёртвого кода","Security Audit":"Security аудит","Security Fix":"Security фикс","Performance":"Производительность","CI/CD Pipeline":"CI/CD","Docker Setup":"Docker","Architecture Review":"Архитектура","Smart Commit":"Коммит","Commit + PR":"Коммит + PR","Auto Watch & Fix":"Авто-мониторинг","Overnight Work":"Ночная работа","Full Project Setup":"Настройка проекта","Multi-Agent":"Мульти-агент","i18n":"Локализация","Accessibility":"Доступность","Dependency Update":"Зависимости","Production Deploy":"Деплой","README + CLAUDE.md":"Документация","State Management":"State","Dark Mode":"Тёмная тема","Form System":"Формы","Search":"Поиск","Data Table":"Таблицы","AI/LLM Integration":"AI/LLM","WebSocket":"WebSocket","Environment Config":"Env конфиг","Framework Migration":"Миграция FW","Legacy Modernization":"Модернизация","Logging & Monitoring":"Логирование","Type Safety":"Типизация","PWA":"PWA","Payments":"Платежи","Caching":"Кэширование","Bundle Optimization":"Бандл","API Docs":"API Docs","Monorepo":"Монорепо","Email System":"Email","File Upload":"Загрузка файлов","Background Jobs":"Фоновые задачи","GraphQL":"GraphQL","Storybook":"Storybook","Hotfix":"Хотфикс","Responsive Design":"Адаптив","SEO":"SEO","RBAC Permissions":"RBAC/Роли","Analytics":"Аналитика","Notifications":"Уведомления","Data Seeding":"Сидинг данных","Infinite Scroll":"Бесконечный скролл","Project Scaffolding":"Scaffold","Error & Loading States":"Error/Loading","Rate Limiting":"Rate Limiting","Image Optimization":"Оптим. картинок","Multi-Environment":"Multi-Env","Backup & Restore":"Бэкапы","Loading Skeletons":"Скелетоны","Testing Strategy":"Тест-стратегия","API Client Layer":"API клиент","Data Migration":"Миграция данных","Admin Dashboard":"Админ-панель","Landing Page":"Лендинг","User Onboarding":"Онбординг","PDF Generation":"PDF генерация","CSV/Excel Import":"Импорт CSV","Changelog & Releases":"Релизы" },
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
    r: { "Feature Development":"Feature Development","Guided Feature Dev":"Guided Feature Dev","API Endpoints":"API Endpoints","UI Components":"UI Components","Database & Migration":"Database & Migration","Authentication":"Authentication","PR Review":"PR Review","Code Review":"Code Review","Simplification":"Simplification","TDD Development":"TDD Development","Test Suite":"Test Suite","E2E Tests":"E2E Tests","Bug Fix":"Bug Fix","Error Handling":"Error Handling","Deep Refactoring":"Deep Refactoring","Dead Code Removal":"Dead Code Removal","Security Audit":"Security Audit","Security Fix":"Security Fix","Performance":"Performance","CI/CD Pipeline":"CI/CD Pipeline","Docker Setup":"Docker Setup","Architecture Review":"Architecture Review","Smart Commit":"Smart Commit","Commit + PR":"Commit + PR","Auto Watch & Fix":"Auto Watch & Fix","Overnight Work":"Overnight Work","Full Project Setup":"Full Project Setup","Multi-Agent":"Multi-Agent","i18n":"i18n","Accessibility":"Accessibility","Dependency Update":"Dependency Update","Production Deploy":"Production Deploy","README + CLAUDE.md":"README + CLAUDE.md","State Management":"State Management","Dark Mode":"Dark Mode","Form System":"Form System","Search":"Search","Data Table":"Data Table","AI/LLM Integration":"AI/LLM Integration","WebSocket":"WebSocket","Environment Config":"Environment Config","Framework Migration":"Framework Migration","Legacy Modernization":"Legacy Modernization","Logging & Monitoring":"Logging & Monitoring","Type Safety":"Type Safety","PWA":"PWA","Payments":"Payments","Caching":"Caching","Bundle Optimization":"Bundle Optimization","API Docs":"API Docs","Monorepo":"Monorepo","Email System":"Email System","File Upload":"File Upload","Background Jobs":"Background Jobs","GraphQL":"GraphQL","Storybook":"Storybook","Hotfix":"Hotfix","Responsive Design":"Responsive Design","SEO":"SEO","RBAC Permissions":"RBAC Permissions","Analytics":"Analytics","Notifications":"Notifications","Data Seeding":"Data Seeding","Infinite Scroll":"Infinite Scroll","Project Scaffolding":"Scaffolding","Error & Loading States":"Error/Loading","Rate Limiting":"Rate Limiting","Image Optimization":"Image Optim.","Multi-Environment":"Multi-Env","Backup & Restore":"Backup","Loading Skeletons":"Skeletons","Testing Strategy":"Test Strategy","API Client Layer":"API Client","Data Migration":"Data Migration","Admin Dashboard":"Admin Dashboard","Landing Page":"Landing Page","User Onboarding":"Onboarding","PDF Generation":"PDF Generation","CSV/Excel Import":"CSV Import","Changelog & Releases":"Releases" },
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
