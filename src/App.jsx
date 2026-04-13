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
    r: { "Feature Development":"Разработка фич","Guided Feature Dev":"Фичи (guided)","API Endpoints":"API эндпоинты","UI Components":"UI компоненты","Database & Migration":"БД и миграции","Authentication":"Аутентификация","PR Review":"Ревью PR","Code Review":"Ревью кода","Simplification":"Упрощение","TDD Development":"TDD разработка","Test Suite":"Набор тестов","E2E Tests":"E2E тесты","Bug Fix":"Исправление багов","Error Handling":"Обработка ошибок","Deep Refactoring":"Рефакторинг","Dead Code Removal":"Удаление мёртвого кода","Security Audit":"Security аудит","Security Fix":"Security фикс","Performance":"Производительность","CI/CD Pipeline":"CI/CD","Docker Setup":"Docker","Architecture Review":"Архитектура","Smart Commit":"Коммит","Commit + PR":"Коммит + PR","Auto Watch & Fix":"Авто-мониторинг","Overnight Work":"Ночная работа","Full Project Setup":"Настройка проекта","Multi-Agent":"Мульти-агент","i18n":"Локализация","Accessibility":"Доступность","Dependency Update":"Зависимости","Production Deploy":"Деплой","README + CLAUDE.md":"Документация","State Management":"State","Dark Mode":"Тёмная тема","Form System":"Формы","Search":"Поиск","Data Table":"Таблицы","AI/LLM Integration":"AI/LLM","WebSocket":"WebSocket","Environment Config":"Env конфиг","Framework Migration":"Миграция FW","Legacy Modernization":"Модернизация","Logging & Monitoring":"Логирование","Type Safety":"Типизация","PWA":"PWA","Payments":"Платежи","Caching":"Кэширование","Bundle Optimization":"Бандл","API Docs":"API Docs","Monorepo":"Монорепо","Email System":"Email","File Upload":"Загрузка файлов","Background Jobs":"Фоновые задачи","GraphQL":"GraphQL","Storybook":"Storybook","Hotfix":"Хотфикс","Responsive Design":"Адаптив","SEO":"SEO","RBAC Permissions":"RBAC/Роли","Analytics":"Аналитика","Notifications":"Уведомления","Data Seeding":"Сидинг данных","Infinite Scroll":"Бесконечный скролл" },
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
    r: { "Feature Development":"Feature Development","Guided Feature Dev":"Guided Feature Dev","API Endpoints":"API Endpoints","UI Components":"UI Components","Database & Migration":"Database & Migration","Authentication":"Authentication","PR Review":"PR Review","Code Review":"Code Review","Simplification":"Simplification","TDD Development":"TDD Development","Test Suite":"Test Suite","E2E Tests":"E2E Tests","Bug Fix":"Bug Fix","Error Handling":"Error Handling","Deep Refactoring":"Deep Refactoring","Dead Code Removal":"Dead Code Removal","Security Audit":"Security Audit","Security Fix":"Security Fix","Performance":"Performance","CI/CD Pipeline":"CI/CD Pipeline","Docker Setup":"Docker Setup","Architecture Review":"Architecture Review","Smart Commit":"Smart Commit","Commit + PR":"Commit + PR","Auto Watch & Fix":"Auto Watch & Fix","Overnight Work":"Overnight Work","Full Project Setup":"Full Project Setup","Multi-Agent":"Multi-Agent","i18n":"i18n","Accessibility":"Accessibility","Dependency Update":"Dependency Update","Production Deploy":"Production Deploy","README + CLAUDE.md":"README + CLAUDE.md","State Management":"State Management","Dark Mode":"Dark Mode","Form System":"Form System","Search":"Search","Data Table":"Data Table","AI/LLM Integration":"AI/LLM Integration","WebSocket":"WebSocket","Environment Config":"Environment Config","Framework Migration":"Framework Migration","Legacy Modernization":"Legacy Modernization","Logging & Monitoring":"Logging & Monitoring","Type Safety":"Type Safety","PWA":"PWA","Payments":"Payments","Caching":"Caching","Bundle Optimization":"Bundle Optimization","API Docs":"API Docs","Monorepo":"Monorepo","Email System":"Email System","File Upload":"File Upload","Background Jobs":"Background Jobs","GraphQL":"GraphQL","Storybook":"Storybook","Hotfix":"Hotfix","Responsive Design":"Responsive Design","SEO":"SEO","RBAC Permissions":"RBAC Permissions","Analytics":"Analytics","Notifications":"Notifications","Data Seeding":"Data Seeding","Infinite Scroll":"Infinite Scroll" },
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
