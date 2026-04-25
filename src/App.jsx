import { useState, useCallback, useMemo, useEffect, useRef, Fragment } from "react";
import {
  IconStats, IconLog, IconBook, IconKeyboard, IconMoon, IconSun, IconLang,
  IconTextSize, IconDice, IconStar, IconStarOutline, IconZap, IconGrid,
  IconDownload, IconUpload, IconPencil, IconX, IconCopy, IconCheck,
  IconExpand, IconCollapse, IconFocus, IconPin, IconPinOutline, IconLink,
  IconList, IconCards,
} from "./icons.jsx";
import { font, fontDisplay, alpha, textOn } from "./theme-utils.js";
import { Pill, CBtn, Toast, EmptyState, HL } from "./components.jsx";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
import { TH, MC, ML, MI, pl } from "./constants.js";
import { T } from "./translations.js";
import { decompress } from "./utils/decompress.ts";
import { Z } from "./data.js";
import { detectLanguage } from "./utils/i18n.ts";

// TH/MC/ML/MI/pl extracted to ./constants.js (iter118).
// T (translations ru/en/kk) extracted to ./translations.js (iter119).
// Typography stacks + color helpers in ./theme-utils.js (iter114).

/* ═══════════════════════════════════════════════
   COMPRESSED DATA
   ═══════════════════════════════════════════════ */


// every JSX site that uses them.

// Pill, CBtn, Toast, EmptyState, HL extracted to ./components.jsx (iter115).

// Inline ErrBound removed in iter117 — replaced with the polished ErrorBoundary
// from ./ErrorBoundary.jsx (lang-aware, click-to-reload, 5 unit tests).

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
  const bootLang = detectLanguage();
  
  useEffect(() => {
    if (dataRef.current) { setData(dataRef.current); return; }
    decompress(Z, (pct) => setLoadPct(Math.round(pct * 100)))
      .then(d => { dataRef.current = d; setLoadTime(Math.round(performance.now() - startTime.current)); setData(d); })
      .catch(e => setErr(e));
  }, []);
  
  if (err) return (
    <div style={{minHeight:"100vh",background:"#060609",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:font,color:"#ddddef",textAlign:"center",padding:32}}>
      <div>
        <div style={{fontSize:28,fontWeight:800,marginBottom:12}}>AIAgent-Hub</div>
        <div style={{fontSize:14,color:"#ef4444",marginBottom:8}}>{bootLang==="ru"?"Ошибка загрузки данных":bootLang==="kk"?"Деректерді жүктеу қатесі":"Failed to load data"}</div>
        <div style={{fontSize:11,color:"#5e5e78",marginBottom:16}}>{err?.message}</div>
        <button onClick={()=>{setErr(null);setLoadPct(0);decompress(Z,(pct)=>setLoadPct(Math.round(pct*100))).then(d=>{dataRef.current=d;setData(d)}).catch(e=>setErr(e))}} style={{padding:"8px 24px",fontSize:12,fontFamily:font,fontWeight:600,border:"1.5px solid #e86a2a",borderRadius:0,background:"#e86a2a",color:"#fff",cursor:"pointer"}}>{bootLang==="ru"?"Обновить":bootLang==="kk"?"Жаңарту":"Reload"}</button>
      </div>
    </div>
  );
  
  if (!data) return (
    <div style={{minHeight:"100vh",background:"#060609",fontFamily:font}}>
      
      <div style={{maxWidth:860,margin:"0 auto",padding:"32px 16px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:28,fontWeight:800,color:"#ddddef",marginBottom:8}}>AIAgent-Hub</div>
          <div style={{fontSize:11,color:"#5e5e78",letterSpacing:2,marginBottom:16}}>{bootLang==="ru"?"загрузка промтов...":bootLang==="kk"?"промттар жүктелуде...":"loading prompts..."}</div>
          <div style={{width:200,height:4,background:"#1a1a28",borderRadius:2,overflow:"hidden",margin:"0 auto"}}>
            <div style={{width:loadPct+"%",height:"100%",background:"linear-gradient(90deg,#e86a2a,#c4541d)",borderRadius:2,transition:"width .3s ease"}} />
          </div>
          <div style={{fontSize:9,color:"#35354d",marginTop:8}}>{loadPct}%</div>
        </div>
        {/* Task 19: Skeleton cards */}
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{marginBottom:8,padding:"12px 16px",borderRadius:0,border:"1px solid #1a1a28",background:"#0e0e16",display:"flex",gap:10,alignItems:"center"}}>
            <div className="skeleton" style={{width:36,height:36,borderRadius:0,flexShrink:0}} />
            <div style={{flex:1}}>
              <div className="skeleton" style={{width:`${40+i*8}%`,height:12,marginBottom:6}} />
              <div className="skeleton" style={{width:`${60+i*4}%`,height:8}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  return <ErrorBoundary><AgentHub data={data} loadTime={loadTime} /></ErrorBoundary>;
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
  const [toastKey, setToastKey] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [fm, setFm] = useState("all");
  const [fv, setFv] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [comboSearch, setComboSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [cheatSearch, setCheatSearch] = useState("");
  const [quickSearch, setQuickSearch] = useState("");
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
  const [workflow, setWorkflow] = useState([]); // task 70: workflow sequencer
  const searchRef = useRef(null);
  const loadMoreRef = useRef(null); // feat 27: infinite scroll sentinel
  
  // Task 92: lang cycle helper
  const nextLang = useCallback(() => {
    setLang(l => l==="ru"?"en":l==="en"?"kk":"ru");
  }, []);
  // Cycle label: shows the NEXT language. Object lookup avoids the
  // binary-ternary linter false-positive while staying readable.
  const langLabel = {ru:"EN", en:"KK", kk:"RU"}[lang] ?? "EN";

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
        if (s.viewMode) setViewMode(s.viewMode);
        if (typeof s.compactMode === "boolean") setCompactMode(s.compactMode);
        if (s.fontSize) setFontSize(s.fontSize);
        if (s.stackOverride) setStackOverride(s.stackOverride);
        if (s.promptLang) setPromptLang(s.promptLang);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const payload = JSON.stringify({ theme, lang, favs, used:usedPrompts, hist:searchHist, cc:copyCounters, viewMode, compactMode, fontSize, stackOverride, promptLang });
      if (payload.length > 4 * 1024 * 1024) { console.warn("AIAgent-Hub: localStorage near limit"); }
      localStorage.setItem("aiagent-hub-settings", payload);
    } catch {}
  }, [theme, lang, favs, usedPrompts, searchHist, copyCounters, viewMode, compactMode, fontSize, stackOverride, promptLang]);

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

  // Cycle 2: Dynamic page title — labels MUST match the editorial tab bar
  // (line 1202-1206) so bookmarks / browser tab history / screen-reader
  // page-title-on-navigation matches what the user clicked. Previous values
  // (combos="Команды/Teams", setup="Setup") drifted from tab bar
  // (combos="Комбо/Combos", setup="Настройка/Setup") — fixed.
  useEffect(() => {
    const titles = {
      prompts: lang==="ru"?"Промты":lang==="kk"?"Промттер":"Prompts",
      combos:  lang==="ru"?"Комбо":lang==="kk"?"Комбо":"Combos",
      cheat:   lang==="ru"?"Шпаргалки":lang==="kk"?"Парақтар":"Cheat",
      quick:   "CLI",
      setup:   lang==="ru"?"Настройка":lang==="kk"?"Баптау":"Setup",
    };
    document.title = `AIAgent-Hub — ${titles[section]||""}`;
  }, [section, lang]);

  // Task 5: Lock body scroll when overlays open
  useEffect(() => {
    const hasOverlay = showShortcuts || focusPrompt || showStats || showCopyHistory || showDiff || showGlossary;
    document.body.style.overflow = hasOverlay ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showShortcuts, focusPrompt, showStats, showCopyHistory, showDiff, showGlossary]);

  // Feat 16: First visit welcome
  useEffect(() => {
    try {
      if (!localStorage.getItem("aiagent-hub-visited")) {
        setIsFirstVisit(true);
        localStorage.setItem("aiagent-hub-visited", "1");
      }
    } catch {}
  }, []);

  // A11y: sync <html lang> with the in-app language switcher so screen
  // readers pick the correct pronunciation rules. index.html ships
  // <html lang="ru"> as the default; this effect updates it on every
  // user toggle (ru/en/kk) — without it, NVDA/VoiceOver/JAWS announce
  // English/Kazakh content with Russian voice rules.
  useEffect(() => {
    try { document.documentElement.lang = lang; } catch {}
  }, [lang]);

  // SEO: index.html JSON-LD declares SearchAction at "/?q={search_term_string}",
  // so honor it — read ?q= once on mount and seed the search input. Enables
  // shareable / bookmarkable search URLs (e.g. https://…/?q=rag) and aligns
  // the structured data with reality (Google Rich Results would otherwise
  // flag the SearchAction as misleading on validation).
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) setSearch(q);
    } catch {}
  }, []);

  // Task 16: Meta theme-color
  // index.html ships TWO static meta tags (dark + light, media-scoped) so the
  // browser can pick the right one for first paint based on system preference,
  // before this effect runs. When the user explicitly toggles theme in-app, we
  // overwrite EVERY tag's content with the chosen color so the system-pref
  // media query no longer fights the user's choice.
  useEffect(() => {
    try {
      const metas = document.querySelectorAll('meta[name="theme-color"]');
      if (metas.length === 0) {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
        meta.content = TH[theme].meta;
      } else {
        metas.forEach(m => { m.content = TH[theme].meta; });
      }
    } catch {}
  }, [theme]);

  // ── Hash routing (task 026, 077) ──
  useEffect(() => {
    const h = location.hash.slice(1);
    // Task 77: Handle prompt deep links (#prompt-ID or direct #ID)
    const pid = h.startsWith("prompt-") ? h.replace("prompt-", "") : null;
    const directId = !pid && h && !["prompts","combos","cheat","quick","setup"].includes(h) ? h : null;
    const targetId = pid || directId;
    if (targetId) {
      setSection("prompts");
      setExpanded(e => ({ ...e, [targetId]: true }));
      setShowCount(999);
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(`card-${targetId}`);
        if (el) { el.scrollIntoView({behavior:"smooth",block:"center"}); el.style.outline="2px solid #e86a2a"; setTimeout(()=>{el.style.outline=""},2000); }
        else if (attempts < 8) setTimeout(() => tryScroll(attempts + 1), 200);
      };
      setTimeout(() => tryScroll(), 300);
    } else {
      try { history.replaceState(null, "", "#" + section); } catch {}
    }
    // mount-only initial scroll — `section` read here is the captured initial value, not subsequent changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [section, toggle, P, focusPrompt, isFirstVisit, showCopyHistory, showDiff, showGlossary, showShortcuts, showStats]);

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
    setToast(`${t.copied} · ${tokens >= 1000 ? (tokens/1000).toFixed(1)+"K" : tokens} tok`);
    setToastKey(k => k + 1);
    setTimeout(() => setCopied(null), 1600);
    setTimeout(() => setToast(null), 1700);
  }, [t, copied, pGet, modifyPrompt]);

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

  // Single source of truth for "what is the latest batch" — used by
  // both the NEW filter pill and the per-card NEW badge. Auto-tracks
  // max version so future batches don't require code edits.
  const maxV = useMemo(() => {
    let m = 0;
    for (const p of P) { const pv = parseFloat(p.v); if (!isNaN(pv) && pv > m) m = pv; }
    return m;
  }, [P]);

  // ── Filtered list (tasks 041, 043, 045, 046, 125) ──
  const list = useMemo(() => {
    let f = P;
    if (showFavsOnly) f = f.filter(p => favs[p.id]);
    if (showNew) f = f.filter(p => parseFloat(p.v) === maxV);
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
      // No regex escape — query is used in String.prototype.includes(), not regex.
      // Escaping here corrupts substring matches for ".", "()", "*", "?", etc.
      const words = debouncedSearch.toLowerCase().split(/\s+/).filter(Boolean);
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
  }, [fm, fv, debouncedSearch, t, showFavsOnly, favs, P, sortBy, showNew, hideUsed, usedPrompts, pinnedIds, categories, maxV]);

  const roles = useMemo(() => {
    const rc = {};
    P.forEach(p => { rc[p.role] = (rc[p.role]||0) + 1; });
    return Object.entries(rc).sort((a,b) => b[1] - a[1]).map(([r,n]) => ({ role:r, count:n }));
  }, [P]);
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
    return Object.entries(tc).sort((a,b) => b[1]-a[1]).map(([tag,count]) => ({ tag, count }));
  }, [P]);

  const CAT_ICONS = {"AI / LLM":"\u{1F9E0}","Security":"\u{1F6E1}","Testing / QA":"\u{1F9EA}","Performance":"\u26A1","DevOps / CI":"\u2699","Frontend / UI":"\u{1F3A8}","Backend / API":"\u{1F4E6}","Data & Files":"\u{1F4CA}","Integrations":"\u{1F514}","Architecture":"\u{1F3D7}","Documentation":"\u{1F4D6}","Project Setup":"\u{1F680}"};
  const CAT_COLORS = {"AI / LLM":"#d47132","Security":"#ef4444","Testing / QA":"#c084fc","Performance":"#f59e0b","DevOps / CI":"#60a5fa","Frontend / UI":"#ec4899","Backend / API":"#34d399","Data & Files":"#22d3ee","Integrations":"#f97316","Architecture":"#e86a2a","Documentation":"#67e8f9","Project Setup":"#38bdf8"};

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
      
      <Toast key={toastKey} msg={toast} />

      {/* Feat 5: Scroll progress bar */}
      <div style={{ position:"fixed", top:0, left:0, width:scrollPct+"%", height:2, background:"linear-gradient(90deg,#e86a2a,#c4541d)", zIndex:9999, transition:"width .1s", opacity:scrollPct>0?1:0, willChange:"width" }} />

      {/* Feat 6: Offline banner */}
      {isOffline && <div role="alert" style={{ position:"fixed", top:0, left:0, right:0, padding:"6px 0", background:"#ef4444", color:"#fff", textAlign:"center", fontSize:11, fontFamily:font, fontWeight:600, zIndex:9998 }}>{lang==="ru"?"⚡ Нет подключения к интернету":lang==="kk"?"⚡ Интернет байланыс жоқ":"⚡ No internet connection"}</div>}

      {/* Cycle 25: Diff overlay — compact vs original */}
      {showDiff && (() => {
        const dp = pGet(showDiff);
        if (!dp || !dp.compact) return null;
        return <div onClick={()=>setShowDiff(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.8)", zIndex:9992, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div role="dialog" aria-modal="true" aria-label={lang==="ru"?"Сравнение":lang==="kk"?"Салыстыру":"Diff"} onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:0, padding:"24px 28px", maxWidth:900, width:"100%", maxHeight:"90vh", overflowY:"auto", fontFamily:font }}>
            <div style={{ fontSize:16, fontWeight:800, marginBottom:16, color:c.text }}>{dp.icon} {t.r[dp.role]||dp.role} — {lang==="ru"?"Сравнение":lang==="kk"?"Салыстыру":"Diff"}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"#e86a2a", marginBottom:8 }}>Original ({dp.text.length} chars)</div>
                <pre style={{ fontSize:9, lineHeight:1.6, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", padding:12, background:c.surf, borderRadius:0, border:`1px solid ${c.brd}`, maxHeight:400, overflowY:"auto" }}>{dp.text}</pre>
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"#10b981", marginBottom:8 }}>Compact ({dp.compact.length} chars, {Math.round((1-dp.compact.length/dp.text.length)*100)}% smaller)</div>
                <pre style={{ fontSize:9, lineHeight:1.6, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", padding:12, background:c.surf, borderRadius:0, border:`1px solid #10b98120`, maxHeight:400, overflowY:"auto" }}>{dp.compact}</pre>
              </div>
            </div>
            <button onClick={()=>setShowDiff(null)} style={{ marginTop:16, width:"100%", padding:"8px", fontSize:11, fontFamily:font, fontWeight:600, border:`1px solid ${c.brd}`, borderRadius:0, background:c.surf, color:c.text, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":lang==="kk"?"Жабу":"Close"}</button>
          </div>
        </div>;
      })()}

      {/* Cycle 9: Glossary overlay */}
      {showGlossary && <div onClick={()=>setShowGlossary(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:9990, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label={lang==="ru"?"Глоссарий":lang==="kk"?"Глоссарий":"Glossary"} onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:0, padding:"24px 28px", maxWidth:480, width:"100%", maxHeight:"80vh", overflowY:"auto", fontFamily:font }}>
          <div style={{ marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${c.brd}` }}>
            <div className="label-tech-sm" style={{ color:c.mut, marginBottom:6 }}>§ Reference</div>
            <div className="display-serif" style={{ fontSize:28, fontWeight:400, color:c.ink, lineHeight:1, letterSpacing:"-.5px", fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>{lang==="ru"?"Глоссарий":lang==="kk"?"Глоссарий":"Glossary"}</div>
          </div>
          {[
            ["АНТИ-ЛУП",lang==="ru"?"Защита от зацикливания: 3 похожих действия = смена подхода":lang==="kk"?"Циклден қорғау: 3 ұқсас әрекет = тәсіл өзгерту":"Loop protection: 3 similar actions = change approach"],
            ["АНТИ-ГАЛЛЮЦИНАЦИЯ",lang==="ru"?"Правило: прочитай файл перед изменением, не придумывай API":lang==="kk"?"Ереже: өзгертпес бұрын файлды оқы, API ойлап таппа":"Rule: read file before changing, don't invent APIs"],
            ["Worktree",lang==="ru"?"Git worktree — изолированная копия репозитория для параллельной работы":lang==="kk"?"Git worktree — параллель жұмыс үшін репозиторийдің оқшауланған көшірмесі":"Git worktree — isolated repo copy for parallel work"],
            ["Compact mode",lang==="ru"?"Сокращённые промты (~700 символов) для экономии контекста":lang==="kk"?"Контексті үнемдеуге арналған қысқартылған промттар (~700 таңба)":"Shortened prompts (~700 chars) to save context window"],
            ["КРИТИЧНО",lang==="ru"?"Наивысший приоритет: баги, security, crashes":lang==="kk"?"Ең жоғары басымдық: баг, security, crashes":"Highest priority: bugs, security, crashes"],
            ["Story Points",lang==="ru"?"Оценка сложности: 1=5мин, 2=15мин, 3=30мин, 5=1ч":lang==="kk"?"Күрделілік бағасы: 1=5мин, 2=15мин, 3=30мин, 5=1с":"Complexity estimate: 1=5min, 2=15min, 3=30min, 5=1hr"],
            ["♾️ Бесконечный",lang==="ru"?"Агент который не останавливается — самогенерирует задачи":lang==="kk"?"Тоқтамайтын агент — өзі тапсырмалар жасайды":"Agent that never stops — self-generates tasks"],
          ].map(([term,desc])=><div key={term} style={{ padding:"12px 0", borderBottom:`1px solid ${c.brd}` }}>
            <div className="label-tech-sm" style={{ color:c.accent, marginBottom:4 }}>{term}</div>
            <div className="body-serif" style={{ fontSize:15, color:c.text, lineHeight:1.4 }}>{desc}</div>
          </div>)}
          <button onClick={()=>setShowGlossary(false)} style={{ marginTop:18, width:"100%", padding:"10px", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:700, border:`1px solid ${c.accent}`, borderRadius:0, background:"transparent", color:c.accent, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":lang==="kk"?"Жабу":"Close"}</button>
        </div>
      </div>}

      {/* Feat 4: Keyboard shortcuts overlay */}
      {showShortcuts && <div onClick={()=>setShowShortcuts(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:9990, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label={lang==="ru"?"Горячие клавиши":lang==="kk"?"Хоткейлер":"Keyboard Shortcuts"} onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:0, padding:"24px 32px", maxWidth:420, width:"100%", fontFamily:font }}>
          <div style={{ marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${c.brd}` }}>
            <div className="label-tech-sm" style={{ color:c.mut, marginBottom:6 }}>⌨ Keyboard</div>
            <div className="display-serif" style={{ fontSize:28, fontWeight:400, color:c.ink, lineHeight:1, letterSpacing:"-.5px", fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>{lang==="ru"?"Горячие клавиши":lang==="kk"?"Хоткейлер":"Shortcuts"}</div>
          </div>
          {[
            ["Ctrl+K",lang==="ru"?"Фокус на поиск":lang==="kk"?"Іздеуге назар":"Focus search"],
            ["Escape",lang==="ru"?"Закрыть / очистить":lang==="kk"?"Жабу / тазалау":"Close / clear"],
            ["↑ / ↓",lang==="ru"?"Навигация по карточкам":lang==="kk"?"Карточкалар бойынша навигация":"Navigate cards"],
            ["Enter",lang==="ru"?"Открыть/закрыть карточку":lang==="kk"?"Карточканы ашу/жабу":"Toggle card"],
            ["F",lang==="ru"?"Focus mode (на карточке)":lang==="kk"?"Focus режим (карточкада)":"Focus mode (on card)"],
            ["1-5",lang==="ru"?"Секции (Промты/Команды/CLI/Quick/Setup)":lang==="kk"?"Бөлімдер (Промттер/Командалар/CLI/Quick/Баптау)":"Sections"],
            ["T",lang==="ru"?"Переключить тему":lang==="kk"?"Тақырыпты ауыстыру":"Toggle theme"],
            ["V",lang==="ru"?"Карточки/таблица":lang==="kk"?"Карточкалар/кесте":"Card/table view"],
            ["R",lang==="ru"?"Случайный промт":lang==="kk"?"Кездейсоқ промт":"Random prompt"],
            ["Ctrl+/",lang==="ru"?"Compact mode":lang==="kk"?"Compact режим":"Compact mode"],
            ["?",lang==="ru"?"Показать/скрыть подсказки":lang==="kk"?"Кеңестерді көрсету/жасыру":"Toggle this overlay"],
          ].map(([k,d])=><div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${c.brd}` }}><kbd style={{ padding:"4px 10px", borderRadius:0, background:c.surf, border:`1px solid ${c.brd}`, borderBottom:`2px solid ${c.brd}`, fontSize:11, color:c.text, fontFamily:font, fontWeight:700, letterSpacing:0.5 }}>{k}</kbd><span className="body-serif" style={{ fontSize:15, color:c.text, textAlign:"right", lineHeight:1.3 }}>{d}</span></div>)}
          <button onClick={()=>setShowShortcuts(false)} style={{ marginTop:18, width:"100%", padding:"10px", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:700, border:`1px solid ${c.accent}`, borderRadius:0, background:"transparent", color:c.accent, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":lang==="kk"?"Жабу":"Close"}</button>
        </div>
      </div>}

      {/* Feat 18: Focus mode */}
      {focusPrompt && <div onClick={()=>setFocusPrompt(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.85)", zIndex:9991, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label={lang==="ru"?"Режим фокуса":lang==="kk"?"Фокус режимі":"Focus mode"} onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${focusPrompt.ac}40`, borderRadius:0, padding:"24px 28px", maxWidth:720, width:"100%", maxHeight:"90vh", overflowY:"auto", fontFamily:font }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:24 }}>{focusPrompt.icon}</span>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:focusPrompt.ac }}>{t.r[focusPrompt.role]||focusPrompt.role}</div>
                <div style={{ fontSize:10, color:c.mut }}>{ML[focusPrompt.mk]} · {focusPrompt.time} · {focusPrompt.text.length} chars · ~{Math.ceil(focusPrompt.text.length/4)} tokens</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <CBtn id={"focus-"+focusPrompt.id} txt={focusPrompt.text} cl={focusPrompt.ac} copied={copied} cp={cp} t={t} bg={c.onAccent} />
              <button onClick={()=>setFocusPrompt(null)} aria-label={lang==="ru"?"Закрыть":lang==="kk"?"Жабу":"Close"} style={{ width:32, height:32, borderRadius:0, border:`1px solid ${c.brd}`, background:"transparent", color:c.mut, cursor:"pointer", outline:"none", display:"inline-flex", alignItems:"center", justifyContent:"center" }}><IconX /></button>
            </div>
          </div>
          <pre style={{ fontSize:11, lineHeight:1.7, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, fontFamily:font, padding:16, background:c.surf, borderRadius:0, border:`1px solid ${c.brd}` }}>{focusPrompt.text}</pre>
        </div>
      </div>}

      {/* Feat 24: Stats modal */}
      {showStats && <div onClick={()=>setShowStats(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:9990, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label={lang==="ru"?"Статистика":lang==="kk"?"Статистика":"Statistics"} onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:0, padding:"24px 28px", maxWidth:500, width:"100%", fontFamily:font }}>
          <div style={{ marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${c.brd}` }}>
            <div className="label-tech-sm" style={{ color:c.mut, marginBottom:6 }}>◈ Index</div>
            <div className="display-serif" style={{ fontSize:28, fontWeight:400, color:c.ink, lineHeight:1, letterSpacing:"-.5px", fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>{lang==="ru"?"Статистика":lang==="kk"?"Статистика":"Statistics"}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {[
              [stats.total, lang==="ru"?"Промтов":lang==="kk"?"Промттер":"Prompts", "#e86a2a"],
              [(COMBOS[lang]||COMBOS.ru).length, lang==="ru"?"Комбо":lang==="kk"?"Комбо":"Combos", "#f97316"],
              [Object.keys(CHEAT).length, lang==="ru"?"Шпаргалок":lang==="kk"?"Парақтар":"Cheats", "#c4541d"],
              [Object.keys(categories.counts).length, lang==="ru"?"Категорий":lang==="kk"?"Санаттар":"Categories", "#06b6d4"],
              [`~${(stats.totalTokens/1000).toFixed(0)}K`, "Tokens", "#10b981"],
              [copyCount, lang==="ru"?"Скопировано":lang==="kk"?"Көшірілді":"Copied", "#eab308"],
              [usedCount, lang==="ru"?"Использовано":lang==="kk"?"Қолданылды":"Used", "#10b981"],
              [favCount, lang==="ru"?"Избранных":lang==="kk"?"Таңдаулылар":"Favorites", "#eab308"],
            ].map(([v,l,cl])=><div key={l} style={{ padding:"14px 12px 10px", borderRadius:0, background:"transparent", border:`1px solid ${c.brd}`, textAlign:"left" }}><div className="display-serif numeric" style={{ fontSize:32, fontWeight:300, color:cl, lineHeight:.9, letterSpacing:"-1px", fontVariationSettings:"'SOFT' 30,'opsz' 144" }}>{v}</div><div className="label-tech-sm" style={{ color:c.mut, marginTop:6 }}>{l}</div></div>)}
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:600, color:c.mut, marginBottom:6 }}>{lang==="ru"?"По моделям":lang==="kk"?"Модельдер бойынша":"By model"}</div>
            {stats.byModel.map(([mk,n])=><div key={mk} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:MC[mk] }} />
              <span style={{ fontSize:10, color:MC[mk], fontWeight:600, width:120 }}>{ML[mk]}</span>
              <div style={{ flex:1, height:6, borderRadius:3, background:c.surf, overflow:"hidden" }}><div style={{ width:`${n/stats.total*100}%`, height:"100%", background:MC[mk], borderRadius:3 }} /></div>
              <span style={{ fontSize:10, color:c.dim, minWidth:30, textAlign:"right" }}>{n}</span>
            </div>)}
          </div>
          {/* Cycle 26: Tag cloud in stats */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:600, color:c.mut, marginBottom:6 }}>{lang==="ru"?"Популярные теги":lang==="kk"?"Танымал тегтер":"Popular tags"}</div>
            <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
              {(() => { const tc = {}; P.forEach(p=>(p.tags||[]).forEach(tg=>{tc[tg]=(tc[tg]||0)+1})); return Object.entries(tc).sort((a,b)=>b[1]-a[1]).slice(0,15).map(([tg,n])=><span key={tg} style={{ fontSize:Math.max(8,Math.min(12,7+n/3)), padding:"2px 6px", borderRadius:0, background:"#e86a2a10", color:"#e86a2a", border:"1px solid #e86a2a20", cursor:"pointer", fontFamily:font }} onClick={()=>{setFm("tag");setFv(tg);setSection("prompts");setShowStats(false)}}>{tg} <span style={{fontSize:8,color:c.dim}}>{n}</span></span>); })()}
            </div>
          </div>
          {/* Cycle 26: Most copied prompts */}
          {Object.keys(copyCounters).length > 0 && <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:600, color:c.mut, marginBottom:6 }}>{lang==="ru"?"Часто копируемые":lang==="kk"?"Жиі көшірілетін":"Most copied"}</div>
            {Object.entries(copyCounters).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([pid,n])=>{const pp=pGet(pid);return pp?<div key={pid} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"3px 0", fontSize:10 }}><span style={{ color:pp.ac }}>{pp.icon} {t.r[pp.role]||pp.role}</span><span style={{ color:c.dim }}>×{n}</span></div>:null})}
          </div>}
          {(() => { try { const used = localStorage.getItem("aiagent-hub-settings"); return used ? <div className="label-tech-sm" style={{ color:c.dim, marginTop:10 }}>⇩ localStorage · {(used.length/1024).toFixed(1)} KB</div> : null; } catch { return null; } })()}
          <button onClick={()=>setShowStats(false)} style={{ marginTop:18, width:"100%", padding:"10px", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:700, border:`1px solid ${c.accent}`, borderRadius:0, background:"transparent", color:c.accent, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":lang==="kk"?"Жабу":"Close"}</button>
        </div>
      </div>}

      {/* Feat 17: Copy history sidebar */}
      {showCopyHistory && <div onClick={()=>setShowCopyHistory(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9989 }}>
        <div onClick={e=>e.stopPropagation()} style={{ position:"fixed", right:0, top:0, bottom:0, width:280, background:c.card, borderLeft:`1px solid ${c.brd}`, padding:"20px 16px", fontFamily:font, overflowY:"auto" }}>
          <div style={{ marginBottom:18, paddingBottom:10, borderBottom:`1px solid ${c.brd}` }}>
            <div className="label-tech-sm" style={{ color:c.mut, marginBottom:6 }}>≣ Log</div>
            <div className="display-serif" style={{ fontSize:22, fontWeight:400, color:c.ink, lineHeight:1.1, letterSpacing:"-.3px" }}>{lang==="ru"?"История копирования":lang==="kk"?"Көшіру тарихы":"Copy History"}</div>
          </div>
          {copyHistory.length===0 && <div style={{ fontSize:11, color:c.dim }}>{lang==="ru"?"Ещё ничего не скопировано":lang==="kk"?"Әлі ештеңе көшірілмеген":"Nothing copied yet"}</div>}
          {copyHistory.map((h,i)=><div key={i} style={{ padding:"8px 10px", borderRadius:0, border:`1px solid ${c.brd}`, marginBottom:6, background:c.surf }}>
            <div style={{ fontSize:11, fontWeight:600, color:c.text }}>{h.icon} {h.name}</div>
            <div style={{ fontSize:9, color:c.dim, marginTop:2 }}>{h.time}</div>
          </div>)}
          <button onClick={()=>setShowCopyHistory(false)} style={{ marginTop:18, width:"100%", padding:"10px", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:700, border:`1px solid ${c.accent}`, borderRadius:0, background:"transparent", color:c.accent, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":lang==="kk"?"Жабу":"Close"}</button>
        </div>
      </div>}

      {/* Skip link (task 100) */}
      <a href="#main-content" className="skip-link">{lang==="ru"?"К содержимому":lang==="kk"?"Мазмұнға өту":"Skip to content"}</a>
      
      {/* Grain texture */}
      <div className="grain" />
      {/* Warm glow */}
      <div style={{ position:"fixed", top:-40, left:"50%", transform:"translateX(-50%)", width:720, height:340, background:`radial-gradient(ellipse, ${c.glow} 0%, transparent 65%)`, pointerEvents:"none", zIndex:0 }} />

      <main id="main-content" style={{ maxWidth:880, margin:"0 auto", padding:"32px 20px 80px", position:"relative", zIndex:1, display:"block" }}>

        {/* ══════════════════ EDITORIAL MASTHEAD ══════════════════ */}
        <header style={{ position:"relative", paddingTop:32, paddingBottom:28, marginBottom:36, color:c.text }}>
          {/* Double-rule top */}
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6 }} />
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6, marginTop:2 }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0" }}>
            <span className="label-tech-sm" style={{ color:c.mut }}>№ v12 · {new Date().toLocaleDateString(lang==="ru"?"ru-RU":lang==="kk"?"kk-KZ":"en-US",{month:"short",year:"numeric"}).toUpperCase()}</span>
            <span className="label-tech-sm" style={{ color:c.mut }}>An Almanac of Autonomous Development</span>
          </div>
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6 }} />
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6, marginTop:2 }} />

          {/* Main heading row */}
          <div className="masthead-grid" style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:32, alignItems:"end", padding:"32px 0 8px" }}>
            <div>
              <h1 className="display-serif masthead-title" style={{ fontSize:64, lineHeight:.95, letterSpacing:"-2.5px", fontWeight:400, margin:0, color:c.ink, fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>
                <span style={{ color:c.accent, fontStyle:"italic", fontWeight:300 }}>AI</span>Agent<span style={{ color:c.mut }}>·</span>Hub
              </h1>
              <p className="body-serif" style={{ fontSize:19, lineHeight:1.4, color:c.mut, marginTop:14, maxWidth:480, fontStyle:"italic" }}>
                {lang==="ru" ? "Полевой справочник автономной разработки с Claude Code — промты, комбо, шпаргалки." : lang==="kk" ? "Claude Code көмегімен автономды әзірлеудің далалық нұсқаулығы." : "A field guide to autonomous development with Claude Code — prompts, combos, cheat sheets."}
              </p>
            </div>
            {/* Statistical display */}
            <div className="masthead-stat" style={{ textAlign:"right", minWidth:130 }}>
              <div className="display-serif masthead-stat-num numeric" style={{ fontSize:88, lineHeight:.85, fontWeight:300, letterSpacing:"-4px", color:c.accent, fontVariationSettings:"'SOFT' 30,'opsz' 144" }}>
                {stats.total}
              </div>
              <div className="label-tech" style={{ color:c.mut, marginTop:10 }}>{lang==="ru"?"промтов":lang==="kk"?"промт":"prompts"}</div>
              <div className="label-tech-sm" style={{ color:c.dim, marginTop:8 }}>{(COMBOS[lang]||COMBOS.ru).length} {lang==="ru"?"комбо":lang==="kk"?"комбо":"combos"} · {Object.keys(CHEAT).length} {lang==="ru"?"шпаргалок":lang==="kk"?"парақ":"cheats"} · ~{Math.round(stats.totalTokens/1000)}K tok{usedCount>0?` · ✓${usedCount}`:""}</div>
            </div>
          </div>

          {/* Double-rule bottom */}
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6, marginTop:8 }} />
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6, marginTop:2 }} />

          {/* Control row */}
          <div style={{ display:"flex", justifyContent:"flex-end", gap:6, marginTop:14, flexWrap:"wrap" }}>
            <button onClick={()=>setShowStats(true)} aria-label={lang==="ru"?"Статистика":lang==="kk"?"Статистика":"Statistics"} title={lang==="ru"?"Статистика":lang==="kk"?"Статистика":"Statistics"} className="nav-btn" data-active={showStats} style={{ borderColor: showStats?c.accent:c.brd, color: showStats?c.accent:c.text }}>
              <IconStats />
            </button>
            <button onClick={()=>setShowCopyHistory(true)} aria-label={lang==="ru"?"История копирования":lang==="kk"?"Көшіру тарихы":"Copy history"} title={lang==="ru"?"История копирования":lang==="kk"?"Көшіру тарихы":"Copy history"} className="nav-btn" data-active={showCopyHistory} style={{ borderColor: showCopyHistory?c.accent:c.brd, color: showCopyHistory?c.accent:c.text }}>
              <IconLog />
              {copyCount>0 && <span className="dot" style={{ background:c.accent, color:c.onAccent }}>{copyCount}</span>}
            </button>
            <button onClick={()=>setShowGlossary(true)} aria-label={lang==="ru"?"Глоссарий":lang==="kk"?"Глоссарий":"Glossary"} title={lang==="ru"?"Глоссарий":lang==="kk"?"Глоссарий":"Glossary"} className="nav-btn" data-active={showGlossary} style={{ borderColor: showGlossary?c.accent:c.brd, color: showGlossary?c.accent:c.text }}>
              <IconBook />
            </button>
            <button onClick={()=>setShowShortcuts(true)} aria-label={lang==="ru"?"Горячие клавиши":lang==="kk"?"Хоткейлер":"Keyboard shortcuts"} title={lang==="ru"?"Горячие клавиши (?)":lang==="kk"?"Хоткейлер (?)":"Keyboard shortcuts (?)"} className="nav-btn" data-active={showShortcuts} style={{ borderColor: showShortcuts?c.accent:c.brd, color: showShortcuts?c.accent:c.text }}>
              <IconKeyboard />
              <span className="kbd-hint" style={{ color: showShortcuts?c.accent:c.dim }}>?</span>
            </button>
            <button onClick={()=>setTheme(theme==="dark"?"light":"dark")} aria-label={theme==="dark"?(lang==="ru"?"Светлая тема":lang==="kk"?"Жарық тақырып":"Light theme"):(lang==="ru"?"Тёмная тема":lang==="kk"?"Қараңғы тақырып":"Dark theme")} title={theme==="dark"?(lang==="ru"?"Светлая тема (T)":lang==="kk"?"Жарық тақырып (T)":"Light theme (T)"):(lang==="ru"?"Тёмная тема (T)":lang==="kk"?"Қараңғы тақырып (T)":"Dark theme (T)")} className="nav-btn" data-active={theme==="light"} style={{ borderColor: theme==="light"?c.accent:c.brd, color: theme==="light"?c.accent:c.text }}>
              {theme==="dark" ? <IconMoon /> : <IconSun />}
            </button>
            <button onClick={nextLang} aria-label={lang==="ru"?"Сменить язык":lang==="kk"?"Тілді ауыстыру":"Switch language"} title={lang==="ru"?"Сменить язык":lang==="kk"?"Тілді ауыстыру":"Switch language"} className="nav-btn" style={{ borderColor:c.accent, color:c.accent, width:"auto", padding:"0 10px", gap:6, display:"inline-flex", alignItems:"center", justifyContent:"center", fontFamily:font, fontSize:10, letterSpacing:2, textTransform:"uppercase", fontWeight:700 }}>
              <IconLang />
              <span>{langLabel}</span>
            </button>
            <div className="hide-mobile" role="radiogroup" aria-label={lang==="ru"?"Размер шрифта":lang==="kk"?"Қаріп өлшемі":"Font size"} style={{ display:"inline-flex", border:`1px solid ${fontSize!==100?c.accent:c.brd}`, borderRadius:0, overflow:"hidden", height:32 }}>
              {[{v:85,Icon:(p)=><svg {...p} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l1.5-5L8 12M5.8 10h1.4M10 8h4"/></svg>,t:lang==="ru"?"Меньше":lang==="kk"?"Кіші":"Smaller"},
                {v:100,Icon:(p)=><svg {...p} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13l2-7 2 7M5 11h2M10 7v6M10 7h2M9 13h2"/></svg>,t:lang==="ru"?"Обычный":lang==="kk"?"Қалыпты":"Normal"},
                {v:115,Icon:(p)=><svg {...p} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14l3-10 3 10M4.2 11h3.6M10 5v9M10 5h4"/></svg>,t:lang==="ru"?"Больше":lang==="kk"?"Үлкен":"Larger"}].map(({v,Icon,t:tt}) => (
                <button key={v} onClick={()=>setFontSize(v)} title={tt} role="radio" aria-checked={fontSize===v} aria-label={tt} style={{ width:32, height:30, border:"none", background:fontSize===v?(c.accent+"18"):"transparent", color:fontSize===v?c.accent:c.mut, cursor:"pointer", outline:"none", display:"inline-flex", alignItems:"center", justifyContent:"center", transition:"background .15s ease, color .15s ease" }}><Icon/></button>
              ))}
            </div>
          </div>
        </header>

        {/* Feat 16: Welcome banner — editorial style */}
        {isFirstVisit && <div style={{ marginBottom:24, padding:"20px 24px", border:`1px solid ${c.accent}40`, borderLeft:`3px solid ${c.accent}`, background:`${c.accent}06`, position:"relative" }}>
          <button onClick={()=>setIsFirstVisit(false)} aria-label={lang==="ru"?"Закрыть":lang==="kk"?"Жабу":"Close"} style={{ position:"absolute", top:12, right:14, background:"none", border:"none", color:c.mut, cursor:"pointer", outline:"none", padding:4, display:"inline-flex", alignItems:"center", justifyContent:"center" }}><IconX /></button>
          <div className="label-tech-sm" style={{ color:c.accent, marginBottom:10 }}>Ed. Note · {lang==="ru"?"Добро пожаловать":lang==="kk"?"Қош келдіңіз":"Welcome"}</div>
          <div className="display-serif" style={{ fontSize:20, fontWeight:400, color:c.ink, marginBottom:10, lineHeight:1.25, fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>
            {lang==="ru"?"Полевой справочник":lang==="kk"?"Далалық нұсқаулық":"A Field Guide"}
          </div>
          <div style={{ fontSize:12, color:c.mut, lineHeight:1.7, fontFamily:fontDisplay, fontStyle:"italic" }}>
            {lang==="ru"
              ? `${stats.total} промтов для автономных AI-агентов. Выбери → скопируй → вставь в терминал. Нажми ? для горячих клавиш.`
              : `${stats.total} prompts for autonomous AI agents. Pick → copy → paste into terminal. Press ? for shortcuts.`}
          </div>
        </div>}

        {/* ── MODEL READOUT STRIP ── */}
        <div style={{ display:"flex", gap:24, marginBottom:28, paddingBottom:14, borderBottom:`1px solid ${c.brd}`, flexWrap:"wrap" }} className="gap-mobile">
          {stats.byModel.map(([mk, count]) => (
            <div key={mk} title={`${ML[mk]}: ${count} ${t.prompts} (${Math.round(count/stats.total*100)}%)`} style={{ display:"flex", alignItems:"baseline", gap:8, cursor:"default" }}>
              <span style={{ fontSize:22, fontWeight:300, color:MC[mk], fontFamily:fontDisplay, lineHeight:1 }}>{count}</span>
              <span className="label-tech-sm" style={{ color:c.mut }}>{ML[mk]}</span>
            </div>
          ))}
          <div style={{ flex:1, minWidth:20 }} />
          <div style={{ display:"flex", alignItems:"baseline", gap:8 }} className="hide-mobile">
            <span className="label-tech-sm" style={{ color:c.dim }}>{lang==="ru"?"категорий":lang==="kk"?"санаттар":"categories"}</span>
            <span style={{ fontSize:16, fontWeight:400, color:c.text, fontFamily:fontDisplay }}>{Object.keys(categories.counts).length}</span>
          </div>
        </div>

        {/* ══════════════ EDITORIAL TAB BAR ══════════════ */}
        <nav role="tablist" aria-label={lang==="ru"?"Разделы":lang==="kk"?"Бөлімдер":"Sections"} style={{ display:"flex", gap:28, marginBottom:28, overflowX:"auto", borderBottom:`1px solid ${c.brd}`, paddingBottom:0 }}>
          {[
            { k:"prompts", l:lang==="ru"?"Промты":lang==="kk"?"Промттер":"Prompts", n:P.length },
            { k:"combos", l:lang==="ru"?"Комбо":lang==="kk"?"Комбо":"Combos", n:(COMBOS[lang]||COMBOS.ru).length },
            { k:"cheat", l:lang==="ru"?"Шпаргалки":lang==="kk"?"Парақтар":"Cheat", n:Object.keys(CHEAT).length },
            { k:"quick", l:"CLI", n:(QUICK_CMDS[lang]||QUICK_CMDS.ru||[]).reduce((a,c)=>a+(c.cmds||[]).length,0) },
            { k:"setup", l:lang==="ru"?"Настройка":lang==="kk"?"Баптау":"Setup", n:CONFIGS.length },
          ].map(s => (
            <button key={s.k} role="tab" aria-selected={section===s.k} aria-current={section===s.k?"page":undefined} aria-controls={`panel-${s.k}`} onClick={()=>{setSection(s.k);window.scrollTo({top:0,behavior:"smooth"})}} className="tab-editorial" style={{
              color: section===s.k ? c.ink : c.mut,
              borderBottomColor: section===s.k ? c.accent : "transparent",
              borderBottomWidth: section===s.k ? "2px" : "1px",
              marginBottom: section===s.k ? "-1px" : "0",
              fontWeight: section===s.k ? 700 : 500,
            }}>{s.l}{s.n ? <span className="count" style={{color: section===s.k ? c.accent : c.dim}}>{String(s.n).padStart(3,"0")}</span> : null}</button>
          ))}
        </nav>

        {/* ════════════════ SECTION: PROMPTS ════════════════ */}
        {section === "prompts" && <div role="tabpanel" id="panel-prompts">

        {/* Feat 35: Breadcrumbs */}
        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:12, fontSize:10, color:c.dim }}>
          <span>AIAgent-Hub</span>
          <span>›</span>
          <span style={{ color:c.text, fontWeight:600 }}>{section==="prompts"?(lang==="ru"?"Промты":lang==="kk"?"Промттер":"Prompts"):section==="combos"?(lang==="ru"?"Команды":lang==="kk"?"Командалар":"Teams"):section==="cheat"?(lang==="ru"?"Шпаргалки":lang==="kk"?"Парақтар":"Cheat"):section==="quick"?"CLI":(lang==="ru"?"Настройка":lang==="kk"?"Баптау":"Setup")}</span>
          {hasFilters && <><span>›</span><span style={{ color:"#e86a2a" }}>{debouncedSearch?`"${debouncedSearch}"`:fm!=="all"?(fm==="model"?(ML[fv]||fv):fm==="role"?(t.r[fv]||fv):fv):(showNew?"NEW":hideUsed?"Hide ✓":"filter")}</span></>}
        </div>

        {/* ── MODEL BADGES (task 018: toggle) ── */}
        <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }} className="gap-mobile">
          {Object.entries(ML).map(([k,v]) => {
            const active = fm==="model"&&fv===k;
            return (
            <div key={k} onClick={()=>{if(active){setFm("all");setFv("all")}else{setFm("model");setFv(k)}}} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:0, border:`1px solid ${active?MC[k]+"50":c.brd}`, background:active?MC[k]+"0a":c.card, cursor:"pointer", transition:"all .15s" }} className="full-mobile pad-mobile" role="button" aria-pressed={active}>
              <div style={{ width:24, height:24, borderRadius:0, background:MC[k]+"20", color:MC[k], display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>{MI[k]}</div>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:active?MC[k]:c.text }} className="text-sm-mobile">{v}</div>
                <div style={{ fontSize:9, color:c.mut }}>{P.filter(p=>p.mk===k).length} {t.prompts}</div>
              </div>
            </div>
          );})}
        </div>

        {/* ── CATEGORY GRID (landing, shown when no filters active) ── */}
        {!hasFilters && !debouncedSearch && (
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:10 }}>
              <span className="label-tech-sm" style={{ color:c.mut }}>{lang==="ru"?"Обзор по категориям":lang==="kk"?"Санаттар бойынша шолу":"Browse by category"}</span>
              <span style={{ fontSize:9, color:c.dim, fontFamily:font }}>{lang==="ru"?`${Object.keys(categories.counts).length} категорий · ${P.length} промтов`:lang==="kk"?`${Object.keys(categories.counts).length} санат · ${P.length} промт`:`${Object.keys(categories.counts).length} categories · ${P.length} prompts`}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(170px, 1fr))", gap:6 }}>
              {Object.entries(categories.counts).sort((a,b)=>b[1]-a[1]).map(([cat, n]) => {
                const col = CAT_COLORS[cat] || "#e86a2a";
                return (
                  <button key={cat} onClick={()=>{ setFm("category"); setFv(cat); window.scrollTo({top:0, behavior:"smooth"}); }} style={{
                    display:"flex", alignItems:"center", gap:10, padding:"14px 14px", textAlign:"left",
                    border:`1px solid ${c.brd}`, borderLeft:`3px solid ${col}`, borderRadius:0,
                    background:"transparent", cursor:"pointer", outline:"none",
                    transition:"background .2s ease, border-color .2s ease"
                  }} onMouseEnter={e=>{e.currentTarget.style.background=`${col}08`;e.currentTarget.style.borderColor=col+"60";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=c.brd;e.currentTarget.style.borderLeftColor=col;}}>
                    <span style={{ fontSize:22, lineHeight:1, flexShrink:0, opacity:.85 }}>{CAT_ICONS[cat]||"◈"}</span>
                    <div style={{ minWidth:0, flex:1 }}>
                      <div style={{ fontSize:11, color:col, fontWeight:700, fontFamily:font, letterSpacing:0.3, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{cat}</div>
                      <div className="label-tech-sm" style={{ color:c.dim }}>{n}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STICKY SEARCH + FILTERS (tasks 012, 035) ── */}
        <div className="sticky-bar" style={{ background:alpha(c.bg,.85) }}>
          {/* Search */}
          <div style={{ position:"relative", marginBottom:10 }}>
            <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSearchFocused(true)} onBlur={()=>setTimeout(()=>setSearchFocused(false),150)} type="search" placeholder={`${t.search} (Ctrl+K)`} aria-label={t.search} style={{
              width:"100%", padding:"12px 14px 12px 36px", fontSize:12, fontFamily:font, letterSpacing:0.3,
              border:0, borderBottom:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.text,
              outline:"none", boxSizing:"border-box", transition:"border-color .15s",
            }} />
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:c.dim, pointerEvents:"none" }}>⌕</span>
            {search && <button onClick={()=>setSearch("")} aria-label={lang==="ru"?"Очистить поиск":lang==="kk"?"Іздеуді тазалау":"Clear search"} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:c.mut, cursor:"pointer", fontSize:16, padding:4, lineHeight:1, outline:"none" }}>×</button>}
          </div>

          {/* Filters */}
          <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
            {[{k:"all",l:t.all},{k:"category",l:lang==="ru"?"Категории":"Categories"},{k:"model",l:t.byModel},{k:"role",l:t.byRole},{k:"type",l:t.byType},{k:"difficulty",l:lang==="ru"?"Сложность":lang==="kk"?"Күрделілік":"Difficulty"},{k:"time",l:lang==="ru"?"Время":"Time"},{k:"tag",l:lang==="ru"?"Теги":"Tags"}].map(f =>
              <Pill key={f.k} on={fm===f.k} fn={()=>{setFm(f.k);setFv("all");}} lb={f.l} c={c} />
            )}
            {hasFilters && <button onClick={clearFilters} style={{ padding:"6px 2px", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:600, border:0, borderBottom:`1.5px solid #ef4444`, background:"transparent", color:"#ef4444", cursor:"pointer", outline:"none", marginRight:12 }}>✕ {lang==="ru"?"Сброс":lang==="kk"?"Қалпына келтіру":"Reset"}</button>}
            <div style={{ width:1, height:16, background:c.brd }} />
            {/* Feat 10: NEW only */}
            <Pill on={showNew} fn={()=>setShowNew(!showNew)} lb="NEW" cl="#10b981" c={c} />
            {/* Feat 11: Hide used */}
            {usedCount > 0 && <Pill on={hideUsed} fn={()=>setHideUsed(!hideUsed)} lb={lang==="ru"?"Скрыть ✓":lang==="kk"?"Жасыру ✓":"Hide ✓"} cl="#8888a0" c={c} />}
            {/* Feat 8: Auto-collapse */}
            <Pill on={autoCollapse} fn={()=>setAutoCollapse(!autoCollapse)} lb={lang==="ru"?"Авто-свёрт":lang==="kk"?"Авто-бүктеу":"Auto-fold"} cl="#06b6d4" c={c} />
          </div>
          {/* Extra filter rows (tasks 044, 046) */}
          {fm==="difficulty" && <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
            <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
            <Pill on={fv==="beginner"} fn={()=>setFv("beginner")} lb={lang==="ru"?"Начальный":lang==="kk"?"Бастапқы":"Beginner"} cl="#10b981" c={c} />
            <Pill on={fv==="intermediate"} fn={()=>setFv("intermediate")} lb={lang==="ru"?"Средний":lang==="kk"?"Орташа":"Intermediate"} cl="#f59e0b" c={c} />
            <Pill on={fv==="advanced"} fn={()=>setFv("advanced")} lb={lang==="ru"?"Продвинутый":lang==="kk"?"Жетілдірілген":"Advanced"} cl="#ef4444" c={c} />
          </div>}
          {fm==="category" && <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
            <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
            {Object.entries(categories.counts).map(([cat,n]) => <button key={cat} onClick={()=>setFv(cat)} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", fontSize:10, fontFamily:font, fontWeight:fv===cat?700:400, border:`1px solid ${fv===cat?(CAT_COLORS[cat]||"#e86a2a")+"60":c.brd}`, borderRadius:0, background:fv===cat?(CAT_COLORS[cat]||"#e86a2a")+"12":"transparent", color:fv===cat?(CAT_COLORS[cat]||"#e86a2a"):c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}><span>{CAT_ICONS[cat]||""}</span> {cat} <span style={{fontSize:8,opacity:.6}}>{n}</span></button>)}
          </div>}
          {fm==="time" && <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
            <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
            <Pill on={fv==="<1h"} fn={()=>setFv("<1h")} lb="< 1h" cl="#10b981" c={c} />
            <Pill on={fv==="1-2h"} fn={()=>setFv("1-2h")} lb="1-2h" cl="#f59e0b" c={c} />
            <Pill on={fv===">2h"} fn={()=>setFv(">2h")} lb="> 2h" cl="#ef4444" c={c} />
          </div>}
          {fm==="tag" && (() => {
            const q = tagFilter.toLowerCase().trim();
            const filtered = q ? allTags.filter(x => x.tag.toLowerCase().includes(q)) : allTags;
            const MAX = 60;
            const shown = filtered.slice(0, MAX);
            return <div style={{marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <input type="search" value={tagFilter} onChange={e=>setTagFilter(e.target.value)} placeholder={lang==="ru"?`Поиск тегов (всего ${allTags.length})...`:lang==="kk"?`Тегтерді іздеу (барлығы ${allTags.length})...`:`Search tags (${allTags.length} total)...`} style={{flex:1,maxWidth:300,height:28,padding:"0 10px",fontSize:11,fontFamily:font,letterSpacing:0.3,border:0,borderBottom:`1px solid ${c.brd}`,borderRadius:0,background:"transparent",color:c.text,outline:"none"}} />
                <span className="label-tech-sm" style={{color:c.dim}}>{filtered.length === allTags.length ? `${filtered.length}` : `${filtered.length}/${allTags.length}`}</span>
                {tagFilter && <button onClick={()=>setTagFilter("")} aria-label={lang==="ru"?"Очистить":lang==="kk"?"Тазалау":"Clear"} style={{width:20,height:20,border:0,background:"none",color:c.dim,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}><IconX /></button>}
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
                {shown.map(({tag, count}) => <button key={tag} onClick={()=>setFv(tag)} aria-pressed={fv===tag} style={{
                  display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",fontSize:10,letterSpacing:0.3,
                  fontFamily:font,fontWeight:fv===tag?700:500,border:`1px solid ${fv===tag?"#e86a2a":c.brd}`,borderRadius:0,
                  background:fv===tag?"#e86a2a15":"transparent",color:fv===tag?"#e86a2a":c.mut,
                  cursor:"pointer",outline:"none",whiteSpace:"nowrap"
                }}>#{tag}<span style={{opacity:.55,fontSize:9}}>{count}</span></button>)}
                {filtered.length > MAX && <span style={{fontSize:10,color:c.dim,alignSelf:"center",padding:"4px 8px"}}>+{filtered.length - MAX} {lang==="ru"?"ещё":lang==="kk"?"тағы":"more"}</span>}
              </div>
            </div>;
          })()}
        </div>

        {fm==="role" && (() => {
          const q = roleFilter.toLowerCase().trim();
          const filtered = q ? roles.filter(r => r.role.toLowerCase().includes(q) || (t.r[r.role]||"").toLowerCase().includes(q)) : roles;
          const MAX = 60;
          const shown = filtered.slice(0, MAX);
          return <div style={{marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <input type="search" value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} placeholder={lang==="ru"?`Поиск ролей (всего ${roles.length})...`:lang==="kk"?`Рөлдерді іздеу (барлығы ${roles.length})...`:`Search roles (${roles.length} total)...`} style={{flex:1,maxWidth:300,height:28,padding:"0 10px",fontSize:11,fontFamily:font,letterSpacing:0.3,border:0,borderBottom:`1px solid ${c.brd}`,borderRadius:0,background:"transparent",color:c.text,outline:"none"}} />
              <span className="label-tech-sm" style={{color:c.dim}}>{filtered.length === roles.length ? `${filtered.length}` : `${filtered.length}/${roles.length}`}</span>
              {roleFilter && <button onClick={()=>setRoleFilter("")} aria-label={lang==="ru"?"Очистить":lang==="kk"?"Тазалау":"Clear"} style={{width:20,height:20,border:0,background:"none",color:c.dim,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}><IconX /></button>}
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
              {shown.map(({role:r, count:n})=>{
                const p=P.find(x=>x.role===r);
                return <button key={r} onClick={()=>setFv(r)} aria-pressed={fv===r} style={{
                  display:"inline-flex",alignItems:"center",gap:6,padding:"4px 10px",fontSize:10,letterSpacing:0.5,
                  fontFamily:font,fontWeight:fv===r?700:500,border:`1px solid ${fv===r?(p?.ac||c.accent):c.brd}`,borderRadius:0,
                  background:fv===r?(p?.ac||c.accent)+"15":"transparent",color:fv===r?(p?.ac||c.accent):c.mut,
                  cursor:"pointer",outline:"none",transition:"all .15s",whiteSpace:"nowrap"
                }}>{t.r[r]||r}<span style={{opacity:.55,fontSize:9}}>{n}</span></button>;
              })}
              {filtered.length > MAX && <span style={{fontSize:10,color:c.dim,alignSelf:"center",padding:"4px 8px"}}>+{filtered.length - MAX} {lang==="ru"?"ещё":lang==="kk"?"тағы":"more"}</span>}
            </div>
          </div>;
        })()}
        {fm==="type" && <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
          <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
          <Pill on={fv==="role"} fn={()=>setFv("role")} lb={lang==="ru"?"Роли":lang==="kk"?"Рөлдер":"Roles"} cl="#10b981" c={c} />
          <Pill on={fv==="task"} fn={()=>setFv("task")} lb={lang==="ru"?"Спец. задачи":lang==="kk"?"Арнайы тапсырмалар":"Tasks"} cl="#ef4444" c={c} />
        </div>}

        {/* ── TOOLBAR (tasks 045, 047, 069, 074, 075, 081) ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:c.dim }}>{debouncedSearch ? `${list.length} / ${P.length}` : list.length} {t.prompts} · ~{(filteredStats.tokens/1000).toFixed(0)}K</span>
            {/* Task 75: Progress tracker */}
            {usedCount > 0 && <span style={{ fontSize:10, color:"#10b981", fontWeight:600 }}>✓ {usedCount}/{P.length}</span>}
            <button onClick={randomPrompt} aria-label={lang==="ru"?"Случайный промпт":lang==="kk"?"Кездейсоқ промт":"Random prompt"} title={lang==="ru"?"Случайный промпт":lang==="kk"?"Кездейсоқ промт":"Random prompt"} style={{ width:28, height:28, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none", transition:"all .15s", display:"inline-flex", alignItems:"center", justifyContent:"center" }}><IconDice /></button>
            {favCount > 0 && <button onClick={()=>setShowFavsOnly(!showFavsOnly)} aria-pressed={showFavsOnly} aria-label={lang==="ru"?"Показать избранные":lang==="kk"?"Таңдаулыларды көрсету":"Show favorites"} title={lang==="ru"?"Избранные":lang==="kk"?"Таңдаулылар":"Favorites"} style={{
              display:"inline-flex", alignItems:"center", justifyContent:"center", gap:5, padding:"0 8px", height:28, fontSize:9, fontWeight:700, fontFamily:font,
              border:`1px solid ${showFavsOnly?"#eab308":c.brd}`, borderRadius:0,
              background:showFavsOnly?"#eab30812":"transparent", color:showFavsOnly?"#eab308":c.mut,
              cursor:"pointer", outline:"none",
            }}><IconStar />{favCount}</button>}
            {/* Sort (task 045) */}
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} aria-label={lang==="ru"?"Сортировка":lang==="kk"?"Сұрыптау":"Sort"} style={{ padding:"3px 8px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>
              <option value="default">{lang==="ru"?"По умолчанию":lang==="kk"?"Әдепкі":"Default"}</option>
              <option value="name">{lang==="ru"?"По имени":lang==="kk"?"Атау бойынша":"By name"}</option>
              <option value="length">{lang==="ru"?"По длине":lang==="kk"?"Ұзындығы бойынша":"By length"}</option>
              <option value="time">{lang==="ru"?"По времени":lang==="kk"?"Уақыт бойынша":"By time"}</option>
              <option value="model">{lang==="ru"?"По модели":lang==="kk"?"Модель бойынша":"By model"}</option>
            </select>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
            {/* Task 74: Quick copy mode */}
            <button onClick={()=>setQuickCopy(!quickCopy)} aria-pressed={quickCopy} title={lang==="ru"?"Быстрое копирование: клик = copy":lang==="kk"?"Жылдам көшіру: клик = көшіру":"Quick copy: click = copy"} style={{ width:28, height:28, border:`1px solid ${quickCopy?"#06b6d4":c.brd}`, borderRadius:0, background:quickCopy?"#06b6d412":"transparent", color:quickCopy?"#06b6d4":c.mut, cursor:"pointer", outline:"none", display:"inline-flex", alignItems:"center", justifyContent:"center" }}><IconZap /></button>
            {/* Task 69: Compare mode */}
            <button onClick={()=>{setCompareMode(!compareMode);if(compareMode)setCompareIds([]);}} aria-pressed={compareMode} title={lang==="ru"?"Выбрать промты (сравнение/экспорт)":lang==="kk"?"Промттарды таңдау (салыстыру/экспорт)":"Select prompts (compare/export)"} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:5, minWidth:28, height:28, padding: compareMode && compareIds.length ? "0 8px" : 0, fontSize:9, fontWeight:700, fontFamily:font, border:`1px solid ${compareMode?"#c4541d":c.brd}`, borderRadius:0, background:compareMode?"#c4541d12":"transparent", color:compareMode?"#c4541d":c.mut, cursor:"pointer", outline:"none" }}><IconGrid />{compareMode && compareIds.length > 0 && compareIds.length}</button>
            {/* Random (task 047) */}
            <button onClick={() => {
              const r = P[Math.floor(Math.random()*P.length)];
              setExpanded(e=>({...e,[r.id]:true}));
              setFm("all"); setFv("all"); setSearch(""); setShowFavsOnly(false);
              setTimeout(()=>{document.getElementById(`card-${r.id}`)?.scrollIntoView({behavior:"smooth",block:"center"})},100);
            }} aria-label={lang==="ru"?"Случайный промт":lang==="kk"?"Кездейсоқ промт":"Random"} title={lang==="ru"?"Случайный":lang==="kk"?"Кездейсоқ":"Random"} style={{ width:28, height:28, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none", display:"inline-flex", alignItems:"center", justifyContent:"center" }}><IconDice /></button>
            {list.length > 0 && hasFilters && <button onClick={() => {
              const allText = list.map(p => `═══ ${(t.r[p.role]||p.role).toUpperCase()} (${p.m}) ═══\n\n${compactMode && p.compact ? p.compact : p.text}`).join('\n\n\n');
              cp("copy-filtered", allText, true);
            }} style={{ padding:"3px 10px", fontSize:10, fontFamily:font, fontWeight:600, border:`1px solid ${copied==="copy-filtered"?"#10b981":c.brd}`, borderRadius:0, background:copied==="copy-filtered"?"#10b98112":"transparent", color:copied==="copy-filtered"?"#10b981":c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}>
              {copied==="copy-filtered" ? t.copied : t.copyFiltered} ({list.length})
            </button>}
            <button onClick={toggleAll} style={{ fontSize:10, fontFamily:font, color:c.mut, background:"none", border:"none", cursor:"pointer", padding:"4px 8px", outline:"none" }}>{allExpanded ? t.collapseAll : t.expandAll}</button>
            {/* Feat 26: View mode toggle */}
            <div style={{ display:"flex", border:`1px solid ${c.brd}`, borderRadius:0, overflow:"hidden" }}>
              {[{k:"card",I:IconCards,t:lang==="ru"?"Карточки":lang==="kk"?"Карточкалар":"Cards"},{k:"table",I:IconList,t:lang==="ru"?"Таблица":lang==="kk"?"Кесте":"Table"}].map(v=><button key={v.k} onClick={()=>setViewMode(v.k)} aria-pressed={viewMode===v.k} title={v.t} style={{ width:28, height:28, background:viewMode===v.k?c.accent+"15":"transparent", color:viewMode===v.k?c.accent:c.dim, border:"none", cursor:"pointer", outline:"none", display:"inline-flex", alignItems:"center", justifyContent:"center" }}><v.I/></button>)}
            </div>
          </div>
        </div>

        {/* Task 69: Compare panel */}
        {compareMode && compareIds.length >= 2 && (
          <div style={{ marginBottom:12, padding:12, borderRadius:0, border:`2px solid #c4541d40`, background:"#c4541d08" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#c4541d", marginBottom:8 }}>{lang==="ru"?"Сравнение":lang==="kk"?"Салыстыру":"Compare"} ({compareIds.length})</div>
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(compareIds.length, 3)}, 1fr)`, gap:8 }}>
              {compareIds.map(id => {
                const p = pGet(id);
                return p ? (
                  <div key={id} style={{ padding:10, borderRadius:0, border:`1px solid ${p.ac}30`, background:c.surf, fontSize:10 }}>
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
              }} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, fontWeight:600, border:`1px solid #e86a2a`, borderRadius:0, background:"#e86a2a", color:"#fff", cursor:"pointer", outline:"none" }}>
                {copied==="bulk-export"?t.copied:(lang==="ru"?"Скопировать все":lang==="kk"?"Барлығын көшіру":"Copy all")} ({compareIds.length})
              </button>
              <button onClick={()=>setCompareIds(list.map(p=>p.id))} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Выбрать все":lang==="kk"?"Барлығын таңдау":"Select all"}</button>
              <button onClick={()=>setCompareIds([])} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Снять все":lang==="kk"?"Бәрін алып тастау":"Deselect"}</button>
              <button onClick={()=>{setCompareIds([]);setCompareMode(false)}} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":lang==="kk"?"Жабу":"Close"}</button>
            </div>
          </div>
        )}

        {/* Task 78: Prompt of the day */}
        {!hasFilters && !showFavsOnly && potd && (
          <div style={{ marginBottom:12, padding:"10px 14px", borderRadius:0, border:`1px solid ${potd.ac}30`, background:`linear-gradient(135deg, ${potd.ac}06, ${potd.ac}02)` }}>
            <div style={{ fontSize:9, fontWeight:700, color:potd.ac, letterSpacing:4, textTransform:"uppercase", marginBottom:4, fontFamily:font }}>⊛ {lang==="ru"?"Промт дня":lang==="kk"?"Күн промты":"Prompt of the day"}</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"space-between" }}>
              <div style={{ fontSize:11, fontWeight:600, color:c.text }}>{potd.icon} {t.r[potd.role]||potd.role} <span style={{ fontSize:9, color:c.mut, fontWeight:400 }}>({ML[potd.mk]})</span></div>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={()=>{setExpanded(e=>({...e,[potd.id]:true}));setTimeout(()=>document.getElementById("card-"+potd.id)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, fontWeight:600, border:`1px solid ${potd.ac}40`, borderRadius:0, background:"transparent", color:potd.ac, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Открыть":lang==="kk"?"Ашу":"Open"}</button>
                <button onClick={()=>cp(potd.id,potd.text)} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, fontWeight:600, border:`1px solid ${potd.ac}`, borderRadius:0, background:potd.ac, color:textOn(potd.ac), cursor:"pointer", outline:"none" }}>{copied===potd.id?t.copied:t.copy}</button>
              </div>
            </div>
          </div>
        )}

        {/* Task 66: Prompt Constructor */}
        {showConstructor && (
          <div style={{ marginBottom:16, padding:"16px 18px", borderRadius:0, border:`2px solid #e86a2a40`, background:"#e86a2a06" }}>
            <div style={{ fontSize:10, letterSpacing:4, textTransform:"uppercase", fontWeight:700, color:"#e86a2a", marginBottom:12, fontFamily:font }}>✎ {lang==="ru"?"Конструктор промта":lang==="kk"?"Промт конструкторы":"Prompt Constructor"}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }} className="stack-mobile">
              <div>
                <div style={{ fontSize:10, fontWeight:600, color:c.text, marginBottom:6 }}>{lang==="ru"?"Роль":lang==="kk"?"Рөл":"Role"}</div>
                <select value={constructorRole} onChange={e=>setConstructorRole(e.target.value)} style={{ width:"100%", padding:"6px 10px", fontSize:11, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.text, outline:"none" }}>
                  <option value="">{lang==="ru"?"Выбери роль...":lang==="kk"?"Рөлді таңда...":"Choose role..."}</option>
                  {["frontend","backend","fullstack","tester","designer","devops","reviewer"].map(r => (
                    <option key={r} value={r}>{t.r[r]||r}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:600, color:c.text, marginBottom:6 }}>{lang==="ru"?"Стек":lang==="kk"?"Стек":"Stack"}</div>
                <select value={constructorStack} onChange={e=>setConstructorStack(e.target.value)} style={{ width:"100%", padding:"6px 10px", fontSize:11, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.text, outline:"none" }}>
                  <option value="">---</option>
                  {["React + Next.js + TypeScript","Vue + Nuxt + TypeScript","Svelte + SvelteKit","Python + Django","Python + FastAPI","Go + Gin","Rust + Axum","Node.js + Express"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ fontSize:10, fontWeight:600, color:c.text, marginBottom:6 }}>{lang==="ru"?"Задачи (выбери несколько):":lang==="kk"?"Тапсырмалар (бірнешеуін таңда):":"Tasks (select multiple):"}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:12 }}>
              {["TypeScript strict","Тесты","Безопасность","Производительность","A11Y","SEO","Docker","CI/CD","Документация","Рефакторинг","Error handling","Мониторинг"].map(task => {
                const sel = constructorTasks.includes(task);
                return <button key={task} onClick={()=>setConstructorTasks(ts=>sel?ts.filter(x=>x!==task):[...ts,task])} style={{ fontSize:9, padding:"4px 10px", borderRadius:0, background:sel?"#e86a2a20":"transparent", color:sel?"#e86a2a":c.mut, border:`1px solid ${sel?"#e86a2a40":c.brd}`, cursor:"pointer", fontFamily:font, outline:"none" }}>{task}</button>;
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
                }} style={{ padding:"8px 20px", fontSize:11, fontFamily:font, fontWeight:600, border:"1.5px solid #e86a2a", borderRadius:0, background:"#e86a2a", color:"#fff", cursor:"pointer", outline:"none" }}>
                  {copied==="constructor" ? t.copied : (lang==="ru"?"Сгенерировать и скопировать":lang==="kk"?"Жасап шығарып көшіру":"Generate & Copy")}
                </button>
              </div>
            )}
            <button onClick={()=>setShowConstructor(false)} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":lang==="kk"?"Жабу":"Close"}</button>
          </div>
        )}

        {/* Task 76: Import Custom Prompt */}
        {showImport && (
          <div style={{ marginBottom:16, padding:"16px 18px", borderRadius:0, border:`2px dashed ${c.brd}`, background:c.bg2 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <span style={{ color:c.accent, display:"inline-flex" }}><IconUpload /></span>
              <span className="label-tech-sm" style={{ color:c.mut }}>{lang==="ru"?"Импорт промта":lang==="kk"?"Промт импорты":"Import Prompt"}</span>
            </div>
            <textarea value={importText} onChange={e=>setImportText(e.target.value)} placeholder={lang==="ru"?"Вставь текст промта здесь...":lang==="kk"?"Промт мәтінін осында енгізіңіз...":"Paste prompt text here..."} style={{ width:"100%", height:120, padding:12, fontSize:11, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.text, outline:"none", resize:"vertical", boxSizing:"border-box" }} />
            {importText.trim().length > 50 && (
              <div style={{ marginTop:8, display:"flex", gap:8 }}>
                <button onClick={()=>{cp("imported", importText); setToast(lang==="ru"?"Промт скопирован":lang==="kk"?"Промт көшірілді":"Prompt copied"); setShowImport(false); setImportText("");}} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, fontWeight:600, border:"1.5px solid #10b981", borderRadius:0, background:"#10b981", color:"#fff", cursor:"pointer", outline:"none" }}>{lang==="ru"?"Скопировать":lang==="kk"?"Көшіру":"Copy"} ({Math.round(importText.length/4)} tokens)</button>
              </div>
            )}
            <button onClick={()=>{setShowImport(false);setImportText("")}} style={{ marginTop:8, padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":lang==="kk"?"Жабу":"Close"}</button>
          </div>
        )}

        {/* Task 66,76: Constructor & Import buttons + Task 58,93,94: Stack & PromptLang */}
        {!showConstructor && !showImport && (
          <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
            <button onClick={()=>setShowConstructor(true)} aria-label={lang==="ru"?"Конструктор промта":"Prompt Constructor"} title={lang==="ru"?"Конструктор промта":"Prompt Constructor"} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, padding:"5px 12px", fontSize:9, letterSpacing:2, textTransform:"uppercase", fontWeight:700, fontFamily:font, border:`1px dashed #e86a2a60`, borderRadius:0, background:"transparent", color:"#e86a2a", cursor:"pointer", outline:"none" }}><IconPencil />{lang==="ru"?"Конструктор":lang==="kk"?"Конструктор":"Constructor"}</button>
            <button onClick={()=>setShowImport(true)} aria-label={lang==="ru"?"Импорт промта":"Import prompt"} title={lang==="ru"?"Импорт промта":"Import prompt"} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, padding:"4px 12px", fontSize:9, letterSpacing:2, textTransform:"uppercase", fontWeight:700, fontFamily:font, border:`1px dashed ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}><IconUpload />{lang==="ru"?"Импорт":lang==="kk"?"Импорт":"Import"}</button>
            <div style={{ width:1, height:16, background:c.brd, margin:"0 2px" }} className="hide-mobile" />
            {/* Task 93+94: Prompt language */}
            <select value={promptLang} onChange={e=>setPromptLang(e.target.value)} aria-label={lang==="ru"?"Язык промта":lang==="kk"?"Промт тілі":"Prompt language"} style={{ padding:"3px 8px", fontSize:9, fontFamily:font, border:`1px solid ${promptLang!=="original"?"#f97316":c.brd}`, borderRadius:0, background:promptLang!=="original"?"#f9731608":c.card, color:promptLang!=="original"?"#f97316":c.mut, cursor:"pointer", outline:"none" }}>
              <option value="original">🌐 Original</option>
              <option value="en">🇬🇧 English output</option>
            </select>
            {/* Compact mode for Claude Code */}
            <button onClick={()=>setCompactMode(!compactMode)} aria-pressed={compactMode} title={lang==="ru"?"Компактные промты для Claude Code (~700 символов)":lang==="kk"?"Claude Code үшін қысқа промттар (~700 таңба)":"Compact prompts for Claude Code (~700 chars)"} style={{ padding:"3px 10px", fontSize:9, fontFamily:font, border:`1px solid ${compactMode?"#10b981":c.brd}`, borderRadius:0, background:compactMode?"#10b98110":"transparent", color:compactMode?"#10b981":c.mut, cursor:"pointer", outline:"none", fontWeight:compactMode?700:400 }}>
              {compactMode ? "⇣ Compact" : "≡ Full"}
            </button>
            {/* Task 58: Stack override */}
            <select value={stackOverride} onChange={e=>setStackOverride(e.target.value)} aria-label={lang==="ru"?"Замена стека":lang==="kk"?"Стек ауыстыру":"Stack override"} style={{ padding:"3px 8px", fontSize:9, fontFamily:font, border:`1px solid ${stackOverride?"#c4541d":c.brd}`, borderRadius:0, background:stackOverride?"#c4541d08":c.card, color:stackOverride?"#c4541d":c.mut, cursor:"pointer", outline:"none" }}>
              <option value="">◎ {lang==="ru"?"Стек":lang==="kk"?"Стек":"Stack"}: Auto</option>
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
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }}>{lang==="ru"?"Роль":lang==="kk"?"Рөл":"Role"}</th>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }}>{lang==="ru"?"Модель":lang==="kk"?"Модель":"Model"}</th>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }} className="hide-mobile">{lang==="ru"?"Время":lang==="kk"?"Уақыт":"Time"}</th>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }} className="hide-mobile">{lang==="ru"?"Ур.":lang==="kk"?"Дең.":"Lvl"}</th>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }} className="hide-mobile">Tokens</th>
                <th style={{ padding:"6px 8px", color:c.dim, fontWeight:600 }}></th>
              </tr></thead>
              <tbody>{list.slice(0, showCount).map((p, i) => (
                <tr key={p.id} style={{ borderBottom:`1px solid ${c.brd}`, cursor:"pointer" }} onClick={()=>{setViewMode("card");setExpanded(e=>({...e,[p.id]:true}));setTimeout(()=>document.getElementById("card-"+p.id)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}}>
                  <td style={{ padding:"6px 8px", color:c.dim }}>{i+1}</td>
                  <td style={{ padding:"6px 8px" }}><span style={{ color:p.ac, fontWeight:600 }}>{p.icon} {t.r[p.role]||p.role}</span></td>
                  <td style={{ padding:"6px 8px" }}><span style={{ display:"inline-flex", alignItems:"center", gap:4 }}><span style={{ width:6, height:6, borderRadius:"50%", background:MC[p.mk], flexShrink:0 }} /><span style={{ color:MC[p.mk], fontSize:9 }}>{ML[p.mk]}</span></span></td>
                  <td style={{ padding:"6px 8px", color:c.mut }} className="hide-mobile">{p.time}</td>
                  <td style={{ padding:"6px 8px" }} className="hide-mobile">{p.difficulty && <span style={{ fontSize:8, padding:"1px 5px", borderRadius:0, background:({beginner:"#10b981",intermediate:"#f59e0b",advanced:"#ef4444"})[p.difficulty]+"15", color:({beginner:"#10b981",intermediate:"#f59e0b",advanced:"#ef4444"})[p.difficulty] }}>{p.difficulty}</span>}</td>
                  <td style={{ padding:"6px 8px", color:c.dim }} className="hide-mobile">~{Math.ceil(p.text.length/4)}</td>
                  <td style={{ padding:"6px 8px" }}><button onClick={(e)=>{e.stopPropagation();cp(p.id,p.text)}} style={{ padding:"3px 10px", fontSize:9, fontFamily:font, fontWeight:600, border:`1px solid ${p.ac}`, borderRadius:0, background:copied===p.id?"transparent":p.ac, color:copied===p.id?p.ac:c.bg, cursor:"pointer", outline:"none" }}>{copied===p.id?"✓":t.copy}</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* ── PROMPT CARDS (task 81: paginated) ── */}
        {viewMode === "card" && list.slice(0, showCount).map((p) => {
          const isO = expanded[p.id]; const ln = p.text.split("\n").length;
          const preview = (p.desc || p.text.split("\n").slice(0, 2).join(" ")).slice(0, 110);
          const diffColors = {beginner:"#10b981",intermediate:"#f59e0b",advanced:"#ef4444"};
          const isUsed = usedPrompts[p.id];
          return (
            <div key={p.id} id={`card-${p.id}`} tabIndex={0} className={isO?"":"card-enter"}
              onClick={()=>{ if(quickCopy && !isO){ cp(p.id,p.text); return; } }}
              onDoubleClick={()=>cp(p.id,p.text)} style={{
              marginBottom:-1, borderTop:`1px solid ${isO?p.ac+"35":compareIds.includes(p.id)?"#c4541d50":debouncedSearch?p.ac+"20":c.brd}`, borderRight:0, borderBottom:`1px solid ${isO?p.ac+"35":compareIds.includes(p.id)?"#c4541d50":debouncedSearch?p.ac+"20":c.brd}`, borderRadius:0,
              background:isO?c.cardH:c.card, overflow:"hidden", transition:"background .2s, border-color .2s",
              boxShadow:isO?`inset 3px 0 0 ${p.ac}`:"none",
              borderLeft:`2px solid ${isO?p.ac:"transparent"}`, contain:"content",
              cursor:quickCopy?"copy":"default",
            }}>
              {/* Header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", gap:8 }} className="pad-mobile">
                <div onClick={()=>toggle(p.id)} tabIndex={0} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(p.id)}}} style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0, cursor:"pointer" }} role="button" aria-expanded={isO} {...(isO?{'aria-controls':`body-${p.id}`}:{})}>
                  <div style={{ width:32, height:32, borderRadius:0, background:"transparent", border:0, borderRight:`1px solid ${c.brd}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, paddingRight:10 }}>{p.icon}</div>
                  <div style={{ minWidth:0, flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                      <span className="body-serif" style={{ fontSize:19, fontWeight:500, color:p.ac, letterSpacing:-0.1, lineHeight:1.15 }}>{debouncedSearch ? <HL text={t.r[p.role]||p.role} q={debouncedSearch} color={p.ac}/> : (t.r[p.role]||p.role)}</span>
                      <span style={{ fontSize:8, letterSpacing:1.5, textTransform:"uppercase", color:MC[p.mk], fontWeight:700, fontFamily:font }}>{ML[p.mk]}</span>
                      {p.type==="task" && <span style={{ fontSize:8, letterSpacing:1.5, textTransform:"uppercase", color:"#ef4444", fontWeight:700, fontFamily:font }}>· {lang==="ru"?"задача":lang==="kk"?"тапсырма":"task"}</span>}
                      {p.difficulty && <span style={{ fontSize:8, letterSpacing:1.5, textTransform:"uppercase", color:diffColors[p.difficulty], fontWeight:600, fontFamily:font }} className="hide-mobile">· {p.difficulty}</span>}
                      {parseFloat(p.v)===maxV && <span style={{ fontSize:8, letterSpacing:1.5, textTransform:"uppercase", color:"#10b981", fontWeight:700, fontFamily:font }}>· new</span>}
                      {p.time && <span style={{ fontSize:8, letterSpacing:1.5, color:c.dim, fontFamily:font }} className="hide-mobile">· {p.time}</span>}
                    </div>
                    {!isO && <div style={{ fontSize:10, color:c.dim, marginTop:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{preview}...</div>}
                    {isO && <div style={{ fontSize:10, color:c.mut, marginTop:3 }}>{compactMode ? (p.compact||"").split("\n").length : ln} {t.lines} · {(compactMode ? (p.compact||"") : p.text).split(/\s+/).length} {lang==="ru"?"слов":lang==="kk"?"сөз":"words"} · ~{Math.ceil((compactMode ? (p.compact||"").length : p.text.length)/4)} tokens {compactMode && <span style={{color:"#10b981",fontWeight:600}}>⚡</span>}</div>}
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0, alignItems:"center" }}>
                  {/* Task 75: Used indicator */}
                  {/* Feat 18: Focus mode button */}
                  <button onClick={(e)=>{e.stopPropagation();setFocusPrompt(p)}} aria-label={lang==="ru"?"Фокус":lang==="kk"?"Фокус":"Focus"} title={lang==="ru"?"Режим фокуса (F)":lang==="kk"?"Фокус режимі (F)":"Focus mode (F)"} className="hide-mobile" style={{ width:28, height:28, borderRadius:0, border:`1px solid ${c.brd}`, background:"transparent", color:c.dim, cursor:"pointer", outline:"none", display:"inline-flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}><IconFocus /></button>
                  {copyCounters[p.id] > 0 && <span style={{ fontSize:8, color:c.dim, fontWeight:600 }} title={lang==="ru"?`Скопировано ${copyCounters[p.id]}x`:lang==="kk"?`Көшірілді ${copyCounters[p.id]}x`:`Copied ${copyCounters[p.id]}x`}>×{copyCounters[p.id]}</span>}
                  {isUsed && <span style={{ fontSize:10, color:"#10b981" }} title={lang==="ru"?"Использован":lang==="kk"?"Қолданылған":"Used"}>✓</span>}
                  {/* Task 69: Compare checkbox */}
                  {compareMode && <button onClick={(e)=>{e.stopPropagation();setCompareIds(ids=>ids.includes(p.id)?ids.filter(x=>x!==p.id):[...ids,p.id])}} style={{ width:24, height:24, borderRadius:0, border:`1px solid ${compareIds.includes(p.id)?"#c4541d":c.brd}`, background:compareIds.includes(p.id)?"#c4541d":"transparent", color:compareIds.includes(p.id)?"#fff":c.dim, cursor:"pointer", outline:"none", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center" }}>{compareIds.includes(p.id)?"✓":""}</button>}
                  <button onClick={(e)=>{e.stopPropagation();setPinnedIds(ids=>ids.includes(p.id)?ids.filter(x=>x!==p.id):[...ids,p.id])}} aria-label={lang==="ru"?"Закрепить":lang==="kk"?"Бекіту":"Pin"} title={lang==="ru"?"Закрепить наверху":lang==="kk"?"Жоғарыға бекіту":"Pin to top"} className="hide-mobile" style={{ width:28, height:28, borderRadius:0, border:`1px solid ${pinnedIds.includes(p.id)?"#e86a2a40":c.brd}`, background:pinnedIds.includes(p.id)?"#e86a2a12":"transparent", color:pinnedIds.includes(p.id)?"#e86a2a":c.dim, cursor:"pointer", outline:"none", display:"inline-flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>{pinnedIds.includes(p.id)?<IconPin/>:<IconPinOutline/>}</button>
                  <button onClick={(e)=>{e.stopPropagation();toggleFav(p.id)}} aria-label={favs[p.id]?(lang==="ru"?"Убрать":lang==="kk"?"Алып тастау":"Remove"):(lang==="ru"?"Избранное":lang==="kk"?"Таңдаулы":"Favorite")} aria-pressed={!!favs[p.id]} style={{ width:28, height:28, borderRadius:0, border:`1px solid ${favs[p.id]?"#eab30840":c.brd}`, background:favs[p.id]?"#eab30812":"transparent", color:favs[p.id]?"#eab308":c.dim, cursor:"pointer", outline:"none", display:"inline-flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>{favs[p.id]?<IconStar/>:<IconStarOutline/>}</button>
                  <button onClick={(e)=>{e.stopPropagation();toggle(p.id)}} aria-expanded={isO} className="hide-mobile" style={{ padding:"4px 12px", fontSize:9, letterSpacing:2, textTransform:"uppercase", fontWeight:600, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}>{isO ? t.hide : t.show}</button>
                  <CBtn id={p.id} txt={compactMode && p.compact ? p.compact : p.text} cl={p.ac} sm copied={copied} cp={cp} t={t} bg={c.onAccent} />
                  {/* Cycle 6: Copy as markdown */}
                  {isO && <button onClick={(e)=>{e.stopPropagation();const md=`## ${p.icon} ${t.r[p.role]||p.role} (${p.m})\n\n\`\`\`\n${p.text}\n\`\`\`\n`;cp("md-"+p.id,md,true)}} title={lang==="ru"?"Копировать как Markdown":lang==="kk"?"Markdown ретінде көшіру":"Copy as Markdown"} className="hide-mobile" style={{ width:28, height:28, borderRadius:0, border:`1px solid ${copied===("md-"+p.id)?"#10b981":c.brd}`, background:copied===("md-"+p.id)?"#10b98112":"transparent", color:copied===("md-"+p.id)?"#10b981":c.dim, cursor:"pointer", outline:"none", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", fontFamily:font, fontWeight:700 }}>{copied===("md-"+p.id)?"✓":"MD"}</button>}
                  {isO && p.compact && <button onClick={(e)=>{e.stopPropagation();setShowDiff(p.id)}} title={lang==="ru"?"Сравнить original vs compact":lang==="kk"?"Оригинал мен compact салыстыру":"Diff original vs compact"} className="hide-mobile" style={{ width:28, height:28, borderRadius:0, border:`1px solid ${c.brd}`, background:"transparent", color:c.dim, cursor:"pointer", outline:"none", fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", fontFamily:font, fontWeight:700 }}>⇄</button>}
                  <button onClick={(e)=>{e.stopPropagation();const url=location.origin+location.pathname+`#prompt-${p.id}`;navigator.clipboard?.writeText(url);setCopied("share-"+p.id);setTimeout(()=>setCopied(null),2000)}} aria-label={lang==="ru"?"Скопировать ссылку":lang==="kk"?"Сілтемені көшіру":"Copy link"} title={lang==="ru"?"Скопировать ссылку":lang==="kk"?"Сілтемені көшіру":"Copy link"} style={{ width:28, height:28, borderRadius:0, border:`1px solid ${copied===("share-"+p.id)?"#10b981":c.brd}`, background:copied===("share-"+p.id)?"#10b98112":"transparent", color:copied===("share-"+p.id)?"#10b981":c.dim, cursor:"pointer", outline:"none", display:"inline-flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>{copied===("share-"+p.id)?<IconCheck/>:<IconLink/>}</button>
                </div>
              </div>
              {/* Body (task 084: lazy render) */}
              {isO && (
                <div id={`body-${p.id}`} className="body-enter" style={{ padding:"0 16px 14px" }}>
                  {p.desc && p.desc.length > 5 && (
                    <div style={{ marginBottom:12, padding:"12px 16px", borderLeft:`2px solid ${p.ac}60`, background:p.ac+"08" }}>
                      <div className="label-tech-sm" style={{ color:p.ac, marginBottom:6 }}>{lang==="ru"?"Описание":lang==="kk"?"Сипаттама":"Description"}</div>
                      <div className="body-serif" style={{ fontSize:15, color:c.text, lineHeight:1.5 }}>{p.desc}</div>
                    </div>
                  )}
                  <div className="label-tech-sm" style={{ color:c.mut, marginBottom:6 }}>{lang==="ru"?"Полный промт":lang==="kk"?"Толық промт":"Full prompt"}</div>
                  <div style={{ maxHeight:420, overflowY:"auto", padding:16, background:c.surf, borderRadius:0, border:`1px solid ${c.brd}`, borderLeft:`2px solid ${p.ac}40` }}>
                    {compactMode && <div style={{ marginBottom:8, padding:"4px 10px", borderRadius:0, background:"#10b98110", border:"1px solid #10b98120", fontSize:9, color:"#10b981", fontWeight:600 }}>⚡ COMPACT MODE — {lang==="ru"?"оптимизировано для Claude Code (~700 символов)":lang==="kk"?"Claude Code үшін оңтайландырылған (~700 таңба)":"optimized for Claude Code (~700 chars)"}</div>}
                    <pre style={{ fontSize:10.5, lineHeight:1.65, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, fontFamily:font }}>{debouncedSearch ? <HL text={compactMode && p.compact ? p.compact : p.text} q={debouncedSearch} color={p.ac}/> : (compactMode && p.compact ? p.compact : p.text)}</pre>
                  </div>
                  {/* Task 033: Related prompts */}
                  {p.related && p.related.length > 0 && (
                    <div style={{ marginTop:10, display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
                      <span style={{ fontSize:9, color:c.dim, marginRight:4 }}>{lang==="ru"?"Похожие:":lang==="kk"?"Ұқсас:":"Related:"}</span>
                      {p.related.slice(0,4).map(rid => {
                        const rp = pGet(rid);
                        return rp ? <button key={rid} onClick={()=>{toggle(p.id);setExpanded(e=>({...e,[rid]:true}));setTimeout(()=>document.getElementById(`card-${rid}`)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}} style={{ fontSize:9, padding:"2px 8px", borderRadius:0, background:rp.ac+"10", color:rp.ac, border:`1px solid ${rp.ac}20`, cursor:"pointer", fontFamily:font, outline:"none" }}>{rp.icon} {t.r[rp.role]||rp.role}</button> : null;
                      })}
                    </div>
                  )}
                  {/* Task 116: Output info */}
                  {p.output && <div style={{ marginTop:6, fontSize:9, color:c.dim }}>📄 {p.output}</div>}
                  {/* Prereqs display */}
                  {p.prereqs && p.prereqs.length > 0 && (
                    <div style={{ marginTop:6, display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
                      <span style={{ fontSize:9, color:c.dim }}>⚙ {lang==="ru"?"Требуется:":lang==="kk"?"Қажет:":"Requires:"}</span>
                      {p.prereqs.map(pr => <span key={pr} style={{ fontSize:8, padding:"1px 6px", borderRadius:0, background:c.surf, color:c.mut, border:`1px solid ${c.brd}` }}>{pr}</span>)}
                    </div>
                  )}
                  {/* Feat 22: Similar by tags (only if no related defined) */}
                  {(!p.related || p.related.length === 0) && p.tags && p.tags.length > 0 && (() => {
                    const similar = P.filter(x => x.id !== p.id && x.tags && x.tags.some(t2 => p.tags.includes(t2))).slice(0, 3);
                    return similar.length > 0 ? (
                      <div style={{ marginTop:6, display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
                        <span style={{ fontSize:9, color:c.dim, marginRight:4 }}>{lang==="ru"?"Похожие:":lang==="kk"?"Ұқсас:":"Similar:"}</span>
                        {similar.map(sp => <button key={sp.id} onClick={()=>{setExpanded(e=>({...e,[sp.id]:true}));setTimeout(()=>document.getElementById(`card-${sp.id}`)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}} style={{ fontSize:9, padding:"2px 8px", borderRadius:0, background:sp.ac+"10", color:sp.ac, border:`1px solid ${sp.ac}20`, cursor:"pointer", fontFamily:font, outline:"none" }}>{sp.icon} {t.r[sp.role]||sp.role}</button>)}
                      </div>
                    ) : null;
                  })()}
                  {/* Tags display */}
                  {p.tags && p.tags.length > 0 && (
                    <div style={{ marginTop:6, display:"flex", gap:3, flexWrap:"wrap" }}>
                      {p.tags.map(tag => <button key={tag} onClick={()=>{setFm("tag");setFv(tag)}} style={{ fontSize:8, padding:"1px 6px", borderRadius:0, background:"#e86a2a08", color:"#e86a2a", border:`1px solid #e86a2a20`, cursor:"pointer", fontFamily:font, outline:"none" }}>#{tag}</button>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Feat 30: Recently viewed */}
        {!hasFilters && recentViewed.length > 0 && viewMode === "card" && (
          <div style={{ marginBottom:12, padding:"8px 12px", borderRadius:0, border:`1px solid ${c.brd}`, background:c.bg2 }}>
            <div style={{ fontSize:9, color:c.dim, marginBottom:4, fontWeight:600 }}>{lang==="ru"?"Недавно просмотренные":lang==="kk"?"Жуырда қаралған":"Recently viewed"}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {recentViewed.map(rid => { const rp = pGet(rid); return rp ? <button key={rid} onClick={()=>{setExpanded(e=>({...e,[rid]:true}));setTimeout(()=>document.getElementById("card-"+rid)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}} style={{ fontSize:9, padding:"3px 8px", borderRadius:0, background:rp.ac+"10", color:rp.ac, border:`1px solid ${rp.ac}20`, cursor:"pointer", fontFamily:font, outline:"none" }}>{rp.icon} {t.r[rp.role]||rp.role}</button> : null; })}
            </div>
          </div>
        )}

        {list.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 0", color:c.dim, fontSize:12 }}>
            {lang==="ru" ? "Ничего не найдено" : lang==="kk" ? "Ештеңе табылмады" : "Nothing found"}
            {hasFilters && <div style={{marginTop:8}}><button onClick={clearFilters} style={{padding:"6px 16px",fontSize:11,fontFamily:font,border:`1px solid ${c.brd}`,borderRadius:0,background:c.card,color:c.text,cursor:"pointer",outline:"none"}}>{lang==="ru"?"Очистить фильтры":lang==="kk"?"Сүзгілерді тазалау":"Clear filters"}</button></div>}
          </div>
        )}

        {/* Feat 27: Infinite scroll sentinel */}
        {list.length > showCount && (
          <div ref={loadMoreRef} style={{ textAlign:"center", padding:"16px 0" }}>
            <div style={{ fontSize:10, color:c.dim }}>{lang==="ru"?"Загрузка...":lang==="kk"?"Жүктелуде...":"Loading..."} ({list.length - showCount} {lang==="ru"?"осталось":lang==="kk"?"қалды":"remaining"})</div>
          </div>
        )}

        {/* Task 49: Search history */}
        {!search && searchHist.length > 0 && searchFocused && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:9, color:c.dim, marginBottom:4, letterSpacing:1 }}>{lang==="ru"?"НЕДАВНИЕ":lang==="kk"?"СОҢҒЫЛАР":"RECENT"}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {searchHist.map((h,i) => (
                <button key={i} onClick={()=>setSearch(h)} style={{ padding:"3px 10px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>{h}</button>
              ))}
            </div>
          </div>
        )}
        </div>}

        {/* ════════════════ SECTION: COMBOS ════════════════ */}
        {section === "combos" && <div role="tabpanel" id="panel-combos">
        <div className="search-row" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ fontSize:10, color:c.dim, flex:1 }}>{t.combosDesc}</div>
          <div style={{ position:"relative", minWidth:200 }}>
            <input type="search" value={comboSearch} onChange={e=>setComboSearch(e.target.value)} placeholder={lang==="ru"?"Поиск комбо...":lang==="kk"?"Комбо іздеу...":"Search combos..."} style={{ width:"100%", height:32, padding:"0 30px 0 10px", fontSize:11, fontFamily:font, letterSpacing:0.3, borderRadius:0, border:0, borderBottom:`1px solid ${c.brd}`, background:"transparent", color:c.text, outline:"none", transition:"border-color .15s" }} />
            {comboSearch && <button onClick={()=>setComboSearch("")} style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:c.dim, cursor:"pointer", fontSize:12, padding:0, lineHeight:1 }}>×</button>}
          </div>
        </div>
        
        {/* Task 70: Workflow Sequencer */}
        <details style={{ marginBottom:16 }}>
          <summary style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"#c4541d", cursor:"pointer", padding:"10px 0", fontFamily:font }}>⇄ {lang==="ru"?"Конструктор workflow":lang==="kk"?"Workflow конструкторы":"Workflow Builder"}</summary>
          <div style={{ marginTop:8, padding:"14px 16px", borderRadius:0, border:`2px solid #c4541d30`, background:"#c4541d06" }}>
            <div style={{ fontSize:10, color:c.dim, marginBottom:10 }}>{lang==="ru"?"Перетаскивай промты для создания последовательности выполнения:":lang==="kk"?"Орындау тізбегін жасау үшін промттарды сүйреңіз:":"Drag prompts to create execution sequence:"}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:12 }}>
              {P.filter(p=>!workflow.includes(p.id)).slice(0,30).map(p => (
                <button key={p.id} onClick={()=>setWorkflow(w=>[...w,p.id])} style={{ fontSize:9, padding:"3px 8px", borderRadius:0, background:c.surf, color:p.ac, border:`1px solid ${p.ac}20`, cursor:"pointer", fontFamily:font, outline:"none" }}>{p.icon} {(t.r[p.role]||p.role).slice(0,12)}</button>
              ))}
            </div>
            {workflow.length > 0 && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, fontWeight:600, color:c.text, marginBottom:8 }}>{lang==="ru"?"Последовательность":lang==="kk"?"Тізбек":"Sequence"} ({workflow.length}):</div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
                  {workflow.map((wid,wi) => {
                    const wp = pGet(wid);
                    return wp ? (
                      <div key={wi} style={{ display:"flex", alignItems:"center", gap:4 }}>
                        {wi > 0 && <span style={{ color:c.dim, fontSize:14 }}>→</span>}
                        <div style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:0, background:wp.ac+"15", border:`1px solid ${wp.ac}30` }}>
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
                  }} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, fontWeight:600, border:"1.5px solid #c4541d", borderRadius:0, background:"#c4541d", color:"#fff", cursor:"pointer", outline:"none" }}>
                    {copied==="workflow"?t.copied:(lang==="ru"?"Скопировать workflow":lang==="kk"?"Workflow көшіру":"Copy workflow")} ({workflow.length})
                  </button>
                  <button onClick={()=>setWorkflow([])} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Очистить":lang==="kk"?"Тазалау":"Clear"}</button>
                </div>
              </div>
            )}
          </div>
        </details>
        
        {/* Task 114: Custom combo builder */}
        <div style={{ marginBottom:16, padding:"12px 16px", borderRadius:0, border:`1px dashed ${buildingCombo?'#e86a2a':c.brd}`, background:buildingCombo?'#e86a2a08':c.card }}>
          {!buildingCombo ? (
            <button onClick={()=>setBuildingCombo(true)} style={{ width:"100%", padding:"10px", fontSize:10, letterSpacing:3, textTransform:"uppercase", fontFamily:font, fontWeight:700, border:"none", background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>
              + {lang==="ru"?"Создать свою команду":lang==="kk"?"Өз командаңды құру":"Build custom team"}
            </button>
          ) : (
            <div>
              <div style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"#e86a2a", marginBottom:10, fontFamily:font }}>{lang==="ru"?"Выбери промты для команды":lang==="kk"?"Команда үшін промттарды таңда":"Select prompts for team"}</div>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
                {P.filter(p=>p.type==="role"||customCombo.includes(p.id)).map(p => {
                  const sel = customCombo.includes(p.id);
                  return <button key={p.id} onClick={()=>setCustomCombo(cc=>sel?cc.filter(x=>x!==p.id):[...cc,p.id])} style={{ fontSize:9, padding:"4px 10px", borderRadius:0, background:sel?p.ac+"20":c.surf, color:sel?p.ac:c.mut, border:`1px solid ${sel?p.ac+"40":c.brd}`, cursor:"pointer", fontFamily:font, outline:"none", fontWeight:sel?600:400 }}>{p.icon} {t.r[p.role]||p.role}</button>;
                })}
              </div>
              {customCombo.length > 0 && (
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                  <div style={{ fontSize:9, color:c.dim }}>{lang==="ru"?"Можно добавить задачи:":lang==="kk"?"Тапсырмалар қосуға болады:":"Add tasks:"}</div>
                  {P.filter(p=>p.type==="task"&&!customCombo.includes(p.id)).slice(0,20).map(p => (
                    <button key={p.id} onClick={()=>setCustomCombo(cc=>[...cc,p.id])} style={{ fontSize:8, padding:"2px 6px", borderRadius:0, background:c.surf, color:c.dim, border:`1px solid ${c.brd}`, cursor:"pointer", fontFamily:font, outline:"none" }}>{p.icon} {t.r[p.role]||p.role}</button>
                  ))}
                </div>
              )}
              <div style={{ display:"flex", gap:6 }}>
                {customCombo.length >= 2 && <button onClick={()=>{
                  const allText = buildPromptBundle(customCombo);
                  cp("custom-combo", allText);
                }} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, fontWeight:600, border:"1.5px solid #e86a2a", borderRadius:0, background:"#e86a2a", color:"#fff", cursor:"pointer", outline:"none" }}>
                  {copied==="custom-combo" ? t.copied : (lang==="ru"?"Скопировать":lang==="kk"?"Көшіру":"Copy")} ({customCombo.length})
                </button>}
                <button onClick={()=>{setBuildingCombo(false);setCustomCombo([])}} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Отмена":lang==="kk"?"Болдырмау":"Cancel"}</button>
              </div>
            </div>
          )}
        </div>

        {/* Task 122: Difficulty distribution — segmented bar */}
        {(() => {
          const diffs = [
            {k:"beginner",l:lang==="ru"?"Начальный":lang==="kk"?"Бастапқы":"Beginner",cl:"#10b981"},
            {k:"intermediate",l:lang==="ru"?"Средний":lang==="kk"?"Орташа":"Intermediate",cl:"#f59e0b"},
            {k:"advanced",l:lang==="ru"?"Продвинутый":lang==="kk"?"Жетілдірілген":"Advanced",cl:"#ef4444"},
          ];
          const counts = diffs.map(d => ({ ...d, n: P.filter(p=>p.difficulty===d.k).length }));
          const total = counts.reduce((s,d)=>s+d.n, 0) || 1;
          return (
            <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"center", flexWrap:"wrap" }}>
              <span className="label-tech-sm" style={{ color:c.mut }}>{lang==="ru"?"Сложность":lang==="kk"?"Күрделілік":"Difficulty"}</span>
              <div style={{ display:"flex", flex:1, minWidth:200, height:4, background:c.brd, overflow:"hidden" }}>
                {counts.map(d => (
                  <div key={d.k} title={`${d.l}: ${d.n} (${Math.round(d.n/total*100)}%)`} style={{ width:`${d.n/total*100}%`, height:"100%", background:d.cl, transition:"width .2s ease" }} />
                ))}
              </div>
              <div style={{ display:"flex", gap:14, fontFamily:font, fontSize:10 }}>
                {counts.map(d => (
                  <span key={d.k} style={{ display:"inline-flex", alignItems:"center", gap:5, color:c.mut }} title={d.l}>
                    <span style={{ width:8, height:8, background:d.cl, display:"inline-block" }} />
                    <span style={{ color:d.cl, fontWeight:700 }}>{d.n}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {comboSearch && <div style={{ fontSize:10, color:c.dim, marginBottom:8 }}>{lang==="ru"?"Фильтр":lang==="kk"?"Сүзгі":"Filter"}: "{comboSearch}" — {(COMBOS[lang]||COMBOS.ru).filter(cb => (cb.name + " " + cb.desc + " " + (cb.ids||[]).map(id=>{const p=pGet(id);return p?(t.r[p.role]||p.role):""}).join(" ")).toLowerCase().includes(comboSearch.toLowerCase())).length} / {(COMBOS[lang]||COMBOS.ru).length}</div>}
        {comboSearch && (COMBOS[lang]||COMBOS.ru).filter(cb => (cb.name + " " + cb.desc + " " + (cb.ids||[]).map(id=>{const p=pGet(id);return p?(t.r[p.role]||p.role):""}).join(" ")).toLowerCase().includes(comboSearch.toLowerCase())).length === 0 && <EmptyState c={c} lang={lang} />}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:12 }}>
          {(COMBOS[lang]||COMBOS.ru).filter(cb => !comboSearch || (cb.name + " " + cb.desc + " " + (cb.ids||[]).map(id=>{const p=pGet(id);return p?(t.r[p.role]||p.role):""}).join(" ")).toLowerCase().includes(comboSearch.toLowerCase())).map((cb, i) => {
            const agents = (cb.ids||[]).map(id=>pGet(id)).filter(Boolean);
            const roles = agents.map(a=>a.role);
            const hasConflict = roles.length !== new Set(roles).size;
            const diffCount = agents.reduce((acc,a)=>{ acc[a.difficulty||"—"]=(acc[a.difficulty||"—"]||0)+1; return acc; },{});
            const diffDot = (diff) => ({beginner:"#10b981",intermediate:"#f59e0b",advanced:"#ef4444"}[diff]||c.dim);
            return (
            <div key={i} className="card-enter combo-card" style={{
              display:"flex", flexDirection:"column",
              padding:"16px 18px 14px", borderRadius:0,
              borderTop:`1px solid ${c.brd}`, borderRight:`1px solid ${c.brd}`, borderBottom:`1px solid ${c.brd}`,
              background:c.card, cursor:"default", transition:"all .2s ease",
              borderLeft:`3px solid ${cb.color}`, animationDelay:`${i*30}ms`, minHeight:210,
            }}>
              {/* header: meta line + name */}
              <div className="label-tech-sm" style={{ color:cb.color, marginBottom:6, display:"flex", alignItems:"center", gap:8 }}>
                <span>№{String(i+1).padStart(2,"0")}</span>
                <span style={{ opacity:.4 }}>·</span>
                <span style={{ color:c.mut }}>{(cb.ids||[]).length} {lang==="ru"?"агентов":lang==="kk"?"агент":"agents"}</span>
                {hasConflict && <><span style={{ opacity:.4 }}>·</span><span style={{ color:"#f59e0b", fontWeight:700 }}>⚠ {lang==="ru"?"конфликт":lang==="kk"?"қайшылық":"conflict"}</span></>}
              </div>
              <h3 className="display-serif" style={{ fontSize:24, fontWeight:400, color:c.ink, margin:0, lineHeight:1.1, letterSpacing:"-.5px", fontVariationSettings:"'SOFT' 50,'opsz' 144", textWrap:"balance" }}>{cb.name}</h3>
              {/* description block */}
              <div style={{ margin:"12px 0 14px", padding:"10px 12px", borderLeft:`2px solid ${cb.color}50`, background:cb.color+"08" }}>
                <div className="label-tech-sm" style={{ color:cb.color, marginBottom:5 }}>{lang==="ru"?"Описание":lang==="kk"?"Сипаттама":"Description"}</div>
                <p className="body-serif" style={{ fontSize:15, color:c.text, lineHeight:1.45, margin:0 }}>{cb.desc}</p>
              </div>
              {/* difficulty dots */}
              <div style={{ display:"flex", gap:8, marginBottom:10, fontSize:9, fontFamily:font, color:c.dim }}>
                {Object.entries(diffCount).map(([diff,n]) => (
                  <span key={diff} style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:6, height:6, background:diffDot(diff), display:"inline-block" }} />
                    {n}
                  </span>
                ))}
              </div>
              {/* agent list — text chips with dot separators, clickable → open prompt */}
              <div style={{ fontSize:10, lineHeight:1.7, marginBottom:12, flex:1, fontFamily:font }}>
                {(cb.ids||[]).map((id, ix) => {
                  const p = pGet(id);
                  if (!p) return null;
                  const name = t.r[p.role]||p.role;
                  return (
                    <Fragment key={id}>
                      {ix > 0 && <span style={{ color:c.dim, margin:"0 6px", opacity:.6 }}>·</span>}
                      <button onClick={(e)=>{ e.stopPropagation(); setSection("prompts"); setFm("all"); setFv("all"); setSearch(""); setTimeout(()=>{setExpanded(ex=>({...ex,[p.id]:true})); setTimeout(()=>document.getElementById(`card-${p.id}`)?.scrollIntoView({behavior:"smooth",block:"center"}), 100);}, 100); }}
                        title={lang==="ru"?`Открыть промт: ${name}`:lang==="kk"?`Промтты ашу: ${name}`:`Open prompt: ${name}`}
                        style={{ background:"none", border:"none", padding:0, fontFamily:"inherit", fontSize:"inherit", color:p.ac, cursor:"pointer", outline:"none", textDecoration:"none" }}
                        onMouseEnter={e=>{e.currentTarget.style.textDecoration="underline";}} onMouseLeave={e=>{e.currentTarget.style.textDecoration="none";}}>
                        <span style={{ opacity:.8 }}>{p.icon}</span> {name}
                      </button>
                    </Fragment>
                  );
                })}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={(e)=>{
                  e.stopPropagation();
                  const allText = buildPromptBundle(cb.ids);
                  cp("combo-"+i, allText);
                }} style={{ flex:1, padding:"7px 10px", fontSize:9, letterSpacing:1.8, textTransform:"uppercase", borderRadius:0,
                  border:`1px solid ${copied===("combo-"+i)?"#10b981":cb.color}`,
                  background:copied===("combo-"+i)?"transparent":cb.color,
                  color:copied===("combo-"+i)?"#10b981":textOn(cb.color),
                  cursor:"pointer", textAlign:"center", fontWeight:700, fontFamily:font, transition:"all .15s", outline:"none" }}>
                  {copied===("combo-"+i) ? (lang==="ru"?"✓ Готово":"✓ Copied") : (lang==="ru"?"Копировать":lang==="kk"?"Көшіру":"Copy")}
                </button>
                <button onClick={(e)=>{
                  e.stopPropagation();
                  const agents = (cb.ids||[]).map(id => pGet(id)).filter(Boolean);
                  const header = lang==="ru"
                    ? `# ${cb.name}\n\n> ${cb.desc}\n\n**Агенты:** ${agents.length} · **Claude Opus 4.7 · 1M context**\n\n---\n\n`
                    : `# ${cb.name}\n\n> ${cb.desc}\n\n**Agents:** ${agents.length} · **Claude Opus 4.7 · 1M context**\n\n---\n\n`;
                  let md = header;
                  agents.forEach((a, idx) => {
                    const title = t.r[a.role]||a.role;
                    const sect = lang==="ru"
                      ? `## ${idx+1}. ${a.icon} ${title}\n\n- **Сложность:** ${a.difficulty||"—"}\n- **Время:** ${a.time||"—"}\n- **Команда:** \`${a.m}\`\n\n${a.desc ? `> ${a.desc}\n\n` : ""}\`\`\`\n${a.text}\n\`\`\`\n\n`
                      : `## ${idx+1}. ${a.icon} ${title}\n\n- **Difficulty:** ${a.difficulty||"—"}\n- **Time:** ${a.time||"—"}\n- **Command:** \`${a.m}\`\n\n${a.desc ? `> ${a.desc}\n\n` : ""}\`\`\`\n${a.text}\n\`\`\`\n\n`;
                    md += sect;
                  });
                  cp("md-combo-"+i, md, true);
                }} title={lang==="ru"?"Скопировать как Markdown документ (вставь в Notion/Obsidian/README)":lang==="kk"?"Markdown ретінде көшіру (Notion/Obsidian/README ішіне қой)":"Copy as Markdown document (paste into Notion/Obsidian/README)"} style={{ padding:"7px 12px", fontSize:9, letterSpacing:1.8, textTransform:"uppercase", borderRadius:0,
                  border:`1px solid ${copied===("md-combo-"+i)?"#10b981":c.brd}`,
                  background:"transparent",
                  color:copied===("md-combo-"+i)?"#10b981":c.mut,
                  cursor:"pointer", textAlign:"center", fontWeight:600, fontFamily:font, transition:"all .15s", outline:"none" }}>
                  {copied===("md-combo-"+i) ? "✓" : "MD"}
                </button>
              </div>
            </div>
          );})}
        </div>
        </div>}

        {/* ════════════════ SECTION: CHEAT SHEETS ════════════════ */}
        {section === "cheat" && <div role="tabpanel" id="panel-cheat">
        {/* Cycle 20: Search in cheat sheets */}
        <div className="search-row" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ fontSize:10, color:c.dim, flex:1 }}>{lang==="ru"?"Быстрые команды и сниппеты":lang==="kk"?"Жылдам командалар мен сниппеттер":"Quick commands and snippets"}</div>
          <div style={{ position:"relative", minWidth:200 }}>
            <input type="search" value={cheatSearch} onChange={e=>setCheatSearch(e.target.value)} placeholder={lang==="ru"?"Поиск команд...":lang==="kk"?"Команда іздеу...":"Search commands..."} style={{ width:"100%", height:32, padding:"0 30px 0 10px", fontSize:11, fontFamily:font, letterSpacing:0.3, borderRadius:0, border:0, borderBottom:`1px solid ${c.brd}`, background:"transparent", color:c.text, outline:"none", transition:"border-color .15s" }} />
            {cheatSearch && <button onClick={()=>setCheatSearch("")} style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:c.dim, cursor:"pointer", fontSize:12, padding:0, lineHeight:1 }}>×</button>}
          </div>
        </div>
        {cheatSearch && <div style={{ fontSize:10, color:c.dim, marginBottom:8 }}>{lang==="ru"?"Фильтр":lang==="kk"?"Сүзгі":"Filter"}: "{cheatSearch}"</div>}
        {cheatSearch && Object.values(CHEAT).every(sheet => (sheet.cmds||[]).filter(c2 => (c2.cmd + " " + c2.desc).toLowerCase().includes(cheatSearch.toLowerCase())).length === 0) && <EmptyState c={c} lang={lang} />}
        {Object.entries(CHEAT).map(([key, sheet]) => {
          const filteredCmds = cheatSearch ? sheet.cmds.filter(c2 => (c2.cmd + " " + c2.desc).toLowerCase().includes(cheatSearch.toLowerCase())) : sheet.cmds;
          if (cheatSearch && filteredCmds.length === 0) return null;
          return (
          <div key={key} style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:12, paddingBottom:8, borderBottom:`1px solid ${sheet.color}25` }}>
              <h3 className="display-serif" style={{ fontSize:22, fontWeight:400, margin:0, color:sheet.color, lineHeight:1, letterSpacing:"-.3px", fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>{sheet.name}</h3>
              <span className="label-tech-sm numeric" style={{ color:c.dim }}>{filteredCmds.length} {lang==="ru"?"команд":lang==="kk"?"командалар":"cmds"}</span>
            </div>
            {filteredCmds.map((c2, i) => (
              <div key={i} onClick={()=>cp(`cheat-${key}-${i}`, c2.cmd)} className="card-enter" style={{
                display:"flex", alignItems:"center", justifyContent:"space-between", gap:14,
                padding:"10px 14px", marginBottom:3, borderRadius:0,
                borderTop:`1px solid ${c.brd}`, borderBottom:`1px solid ${c.brd}`,
                borderLeft:`2px solid ${sheet.color}30`, borderRight:"none",
                background:c.card, cursor:"pointer", transition:"background .2s ease, border-color .2s ease",
              }} onMouseEnter={e=>{e.currentTarget.style.background=sheet.color+"08";e.currentTarget.style.borderLeftColor=sheet.color;}} onMouseLeave={e=>{e.currentTarget.style.background=c.card;e.currentTarget.style.borderLeftColor=sheet.color+"30";}}>
                <div style={{ flex:1, minWidth:0 }}>
                  <code style={{ fontSize:12, color:sheet.color, fontFamily:font, wordBreak:"break-all", fontFeatureSettings:"'liga','calt','ss01','ss02'" }}>{c2.cmd}</code>
                  <div className="body-serif" style={{ fontSize:14, color:c.mut, marginTop:4, lineHeight:1.35 }}>{c2.desc}</div>
                </div>
                <span style={{ color:copied===`cheat-${key}-${i}`?"#10b981":c.dim, flexShrink:0, display:"inline-flex", alignItems:"center" }}>
                  {copied===`cheat-${key}-${i}` ? <IconCheck /> : <IconCopy />}
                </span>
              </div>
            ))}
          </div>
        );})}
        </div>}

        {/* ════════════════ SECTION: QUICK COMMANDS ════════════════ */}
        {section === "quick" && <div role="tabpanel" id="panel-quick">
        <div className="search-row" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ flex:1 }} />
          <div style={{ position:"relative", minWidth:200 }}>
            <input type="search" value={quickSearch} onChange={e=>setQuickSearch(e.target.value)} placeholder={lang==="ru"?"Поиск CLI команд...":lang==="kk"?"CLI команда іздеу...":"Search CLI commands..."} style={{ width:"100%", height:32, padding:"0 30px 0 10px", fontSize:11, fontFamily:font, letterSpacing:0.3, borderRadius:0, border:0, borderBottom:`1px solid ${c.brd}`, background:"transparent", color:c.text, outline:"none", transition:"border-color .15s" }} />
            {quickSearch && <button onClick={()=>setQuickSearch("")} style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:c.dim, cursor:"pointer", fontSize:12, padding:0, lineHeight:1 }}>×</button>}
          </div>
        </div>
        {quickSearch && <div style={{ fontSize:10, color:c.dim, marginBottom:8 }}>{lang==="ru"?"Фильтр":lang==="kk"?"Сүзгі":"Filter"}: "{quickSearch}"</div>}
        {quickSearch && (QUICK_CMDS[lang]||QUICK_CMDS.ru||[]).every(cat => (cat.cmds||[]).filter(cmd => (cmd.cmd + " " + cmd.label).toLowerCase().includes(quickSearch.toLowerCase())).length === 0) && <EmptyState c={c} lang={lang} />}
        {(QUICK_CMDS[lang]||QUICK_CMDS.ru||[]).map((cat, ci) => {
          const cmds = cat.cmds || [];
          const filteredQC = quickSearch ? cmds.filter(cmd => (cmd.cmd + " " + cmd.label).toLowerCase().includes(quickSearch.toLowerCase())) : cmds;
          if (quickSearch && filteredQC.length === 0) return null;
          return (
          <div key={ci} style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:12, paddingBottom:8, borderBottom:`1px solid ${c.brd}` }}>
              <h3 className="display-serif" style={{ fontSize:22, fontWeight:400, margin:0, color:c.ink, lineHeight:1, letterSpacing:"-.3px", fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>{cat.cat}</h3>
              <span className="label-tech-sm numeric" style={{ color:c.dim }}>{filteredQC.length}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:8 }}>
              {filteredQC.map((cmd, i) => (
                <div key={i} onClick={()=>cp(`qc-${ci}-${i}`, cmd.cmd)} className="card-enter" style={{
                  padding:"12px 14px", borderRadius:0, borderTop:`1px solid ${c.brd}`, borderRight:`1px solid ${c.brd}`, borderBottom:`1px solid ${c.brd}`,
                  borderLeft:`2px solid ${copied===`qc-${ci}-${i}`?"#10b981":c.accent+"35"}`,
                  background:copied===`qc-${ci}-${i}`?"#10b98108":c.card, cursor:"pointer",
                  transition:"background .2s ease, border-color .2s ease",
                }} onMouseEnter={e=>{if(copied!==`qc-${ci}-${i}`){e.currentTarget.style.background=c.accent+"06";e.currentTarget.style.borderLeftColor=c.accent;}}} onMouseLeave={e=>{if(copied!==`qc-${ci}-${i}`){e.currentTarget.style.background=c.card;e.currentTarget.style.borderLeftColor=c.accent+"35";}}}>
                  <div className="body-serif" style={{ fontSize:13, color:c.mut, marginBottom:6, lineHeight:1.3 }}>{cmd.label}</div>
                  <code style={{ fontSize:11.5, color:c.text, fontFamily:font, wordBreak:"break-all", fontFeatureSettings:"'liga','calt','ss01','ss02'" }}>{cmd.cmd}</code>
                  {copied===`qc-${ci}-${i}` && <div className="label-tech-sm" style={{ color:"#10b981", marginTop:6, display:"flex", alignItems:"center", gap:4 }}><IconCheck /><span>{t.copied}</span></div>}
                </div>
              ))}
            </div>
          </div>
        );})}
        </div>}

        {/* ════════════════ SECTION: SETUP ════════════════ */}
        {section === "setup" && <div role="tabpanel" id="panel-setup">
        {/* Full team setup — hero card */}
        <div style={{ marginBottom:20, padding:"22px 24px", borderRadius:0, border:`1px solid ${c.accent}40`, borderLeft:`3px solid ${c.accent}`, background:c.accent+"08", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, right:0, width:160, height:160, background:`radial-gradient(circle, ${c.accent}12, transparent 65%)`, pointerEvents:"none" }} />
          <div className="label-tech-sm" style={{ color:c.accent, marginBottom:8 }}>01 · Hero</div>
          <h3 className="display-serif" style={{ fontSize:24, fontWeight:400, color:c.ink, margin:0, lineHeight:1.1, letterSpacing:"-.4px" }}>{t.teamSetup}</h3>
          <p className="body-serif" style={{ fontSize:15, color:c.mut, marginTop:8, marginBottom:16, lineHeight:1.4 }}>{t.teamSetupDesc}</p>
          <button onClick={()=>cp("team-setup", TEAM_SETUP)} style={{
            padding:"9px 22px", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:700,
            border:`1px solid ${c.accent}`, borderRadius:0,
            background:copied==="team-setup"?"transparent":c.accent,
            color:copied==="team-setup"?c.accent:textOn(c.accent),
            cursor:"pointer", transition:"all .15s", outline:"none",
          }}>{copied==="team-setup" ? (lang==="ru"?"✓ Готово":lang==="kk"?"✓ Дайын":"✓ Copied") : "setup-agents.sh"}</button>
        </div>

        {/* Setup commands section label */}
        <div style={{ marginBottom:14, paddingBottom:8, borderBottom:`1px solid ${c.brd}`, display:"flex", alignItems:"baseline", gap:12 }}>
          <h3 className="display-serif" style={{ fontSize:22, fontWeight:400, margin:0, color:c.ink, lineHeight:1, letterSpacing:"-.3px" }}>{lang==="ru"?"Настройка и запуск":lang==="kk"?"Баптау және іске қосу":"Setup & Launch"}</h3>
          <span className="label-tech-sm" style={{ color:c.dim }}>02 · Setup</span>
        </div>
        {[
          { id:"git", Icon:IconDownload, title:t.setup, desc:t.setupDesc, text:GIT_SETUP, col:"#10b981" },
          { id:"launch", Icon:IconZap, title:t.launch, desc:t.launchDesc, text:LAUNCH, col:"#06b6d4" },
        ].map(s => (
          <div key={s.id} style={{ marginBottom:6, border:`1px solid ${c.brd}`, borderLeft:`2px solid ${s.col}40`, borderRadius:0, background:c.card }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:0 }}>
                <span style={{ color:s.col, display:"inline-flex", flexShrink:0 }}><s.Icon /></span>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:c.text }}>{s.title}</div>
                  <div className="body-serif" style={{ fontSize:13, color:c.mut, marginTop:3, lineHeight:1.3 }}>{s.desc}</div>
                </div>
              </div>
              <CBtn id={s.id} txt={s.text} cl={s.col} copied={copied} cp={cp} t={t} bg={c.onAccent} skip />
            </div>
          </div>
        ))}

        {/* Structure */}
        <div style={{ marginTop:14, marginBottom:8, border:`1px solid ${c.brd}`, borderLeft:`2px solid #f59e0b40`, borderRadius:0, background:c.card }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:0 }}>
              <span style={{ color:"#f59e0b", display:"inline-flex", flexShrink:0 }}><IconCards /></span>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, color:c.text }}>{t.structure}</div>
                <div className="body-serif" style={{ fontSize:13, color:c.mut, marginTop:3, lineHeight:1.3 }}>{t.structureDesc}</div>
              </div>
            </div>
            <CBtn id="structure" txt={FOLDER_STRUCTURE} cl="#f59e0b" copied={copied} cp={cp} t={t} bg={c.onAccent} skip />
          </div>
        </div>

        {/* Feat 25: Quick launch generator */}
        <div style={{ marginBottom:16, padding:"14px 18px", borderRadius:0, border:`1px dashed ${c.brd}`, background:c.bg2 }}>
          <div style={{ fontSize:12, fontWeight:700, color:c.mut, marginBottom:10 }}>⚡ {lang==="ru"?"Быстрый запуск одного агента":lang==="kk"?"Бір агентті жылдам іске қосу":"Quick Launch Single Agent"}</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {P.filter(p=>p.type==="role").slice(0,12).map(p => (
              <button key={p.id} onClick={()=>{
                const launcher = p.mk==="claude"?"claude --dangerously-skip-permissions":p.mk==="gemini"?"gemini --model gemini-3.1-pro-preview --yolo":"codex --full-auto";
                const script = `#!/bin/bash\n# ${t.r[p.role]||p.role} (${p.m})\n${launcher}\n\n# Промт (вставь при первом запросе):\n# ${(t.r[p.role]||p.role)}`;
                cp("ql-"+p.id, script, true);
              }} style={{ fontSize:9, padding:"5px 10px", borderRadius:0, background:p.ac+"10", color:p.ac, border:`1px solid ${p.ac}20`, cursor:"pointer", fontFamily:font, outline:"none", fontWeight:600 }}>
                {p.icon} {(t.r[p.role]||p.role).slice(0,15)} {copied===("ql-"+p.id) ? "✓" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Config files */}
        <div style={{ marginTop:20, marginBottom:6 }}>
          <div style={{ fontSize:10, letterSpacing:3, color:c.mut, textTransform:"uppercase", marginBottom:10, paddingLeft:4, fontWeight:600, borderBottom:`1px solid ${c.brd}`, paddingBottom:8 }}>{t.configs}</div>
        </div>
        <div style={{ fontSize:10, color:c.dim, marginBottom:10, paddingLeft:4 }}>{t.configsDesc}</div>
        {CONFIGS.map(cfg => {
          const isO = expanded[cfg.id];
          return (
            <div key={cfg.id} style={{ marginBottom:8, border:`1px solid ${isO?cfg.accent+"35":c.brd}`, borderRadius:0, background:c.card, overflow:"hidden", transition:"all .2s" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", gap:8 }}>
                <div onClick={()=>toggle(cfg.id)} tabIndex={0} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(cfg.id)}}} style={{ display:"flex", alignItems:"center", gap:10, flex:1, cursor:"pointer" }} role="button" aria-expanded={isO}>
                  <div style={{ width:36, height:36, borderRadius:0, background:cfg.accent+"12", border:`1px solid ${cfg.accent}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{cfg.icon}</div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:cfg.accent }}>{cfg.name}</span>
                      <span style={{ fontSize:9, padding:"2px 7px", borderRadius:0, background:cfg.accent+"12", color:cfg.accent, border:`1px solid ${cfg.accent}25`, fontWeight:600 }}>config</span>
                    </div>
                    <div style={{ fontSize:10, color:c.mut, marginTop:2 }}>{cfg.desc}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={()=>toggle(cfg.id)} style={{ padding:"5px 11px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{isO?t.hide:t.show}</button>
                  <CBtn id={cfg.id} txt={cfg.text} cl={cfg.accent} sm copied={copied} cp={cp} t={t} bg={c.onAccent} skip />
                </div>
              </div>
              {isO && (
                <div className="body-enter" style={{ padding:"0 16px 14px" }}>
                  <div style={{ maxHeight:380, overflowY:"auto", padding:14, background:c.surf, borderRadius:0, border:`1px solid ${c.brd}` }}>
                    <pre style={{ fontSize:10.5, lineHeight:1.65, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, fontFamily:font }}>{cfg.text}</pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>}

        {/* ── TIP + STATS + FAQ ── */}
        <div style={{ marginTop:20, padding:"16px 18px", background:c.bg2, borderRadius:0, border:`1px solid ${c.brd}` }}>
          {/* Stats visualization (task 121) */}
          <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:14, flexWrap:"wrap" }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              {(() => {
                const counts = stats.byModel.map(([mk,n])=>({mk,n}));
                const total = counts.reduce((a,c)=>a+c.n,0);
                let cum = 0;
                return counts.map(({mk,n},_i) => {
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
                <span style={{ color:c.mut, fontWeight:600 }}>{lang==="ru"?"Сложность":lang==="kk"?"Күрделілік":"Difficulty"}</span>
                <span style={{ color:"#10b981", marginLeft:6 }}>●{stats.byDifficulty?.beginner||0}</span>
                <span style={{ color:"#f59e0b", marginLeft:4 }}>●{stats.byDifficulty?.intermediate||0}</span>
                <span style={{ color:"#ef4444", marginLeft:4 }}>●{stats.byDifficulty?.advanced||0}</span>
              </div>
            </div>
          </div>
          
          <div style={{ fontSize:10, fontWeight:700, color:c.mut, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>{t.tipTitle}</div>
          <div className="steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:6, marginBottom:12 }}>
            {(lang==="ru"?[
              {n:"1", t:"Выбери промт", d:"для своей задачи"},
              {n:"2", t:"Скопируй команду", d:"/ralph-loop, /feature-dev..."},
              {n:"3", t:"Вставь в CLI", d:"Claude Code терминал"},
              {n:"4", t:"Агент работает", d:"автономно изучит проект"},
            ]:lang==="kk"?[
              {n:"1", t:"Промт таңда", d:"өз тапсырмаң үшін"},
              {n:"2", t:"Команданы көшір", d:"/ralph-loop, /feature-dev..."},
              {n:"3", t:"CLI ішіне қой", d:"Claude Code терминал"},
              {n:"4", t:"Агент жұмыс істейді", d:"жобаны автономды зерттейді"},
            ]:[
              {n:"1", t:"Pick a prompt", d:"for your task"},
              {n:"2", t:"Copy command", d:"/ralph-loop, /feature-dev..."},
              {n:"3", t:"Paste in CLI", d:"Claude Code terminal"},
              {n:"4", t:"Agent works", d:"autonomously explores project"},
            ]).map(s => (
              <div key={s.n} style={{ display:"flex", gap:8, alignItems:"flex-start", padding:"8px 10px", borderRadius:0, background:c.surf, border:`1px solid ${c.brd}` }}>
                <div style={{ width:20, height:20, borderRadius:0, background:"#e86a2a15", color:"#e86a2a", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.n}</div>
                <div><div style={{ fontSize:10, fontWeight:700, color:c.text }}>{s.t}</div><div style={{ fontSize:9, color:c.dim }}>{s.d}</div></div>
              </div>
            ))}
          </div>
          
          {/* Task 068: Changelog */}
          <details style={{ marginTop:8 }}>
            <summary style={{ fontSize:10, fontWeight:600, color:c.mut, cursor:"pointer", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{lang==="ru"?"История версий":lang==="kk"?"Версиялар тарихы":"Changelog"}</summary>
            <div style={{ fontSize:10, color:c.dim, lineHeight:1.8, paddingLeft:8, borderLeft:`2px solid ${c.brd}`, marginTop:8 }}>
              <div><strong>v9.0</strong> — {lang==="ru"?"165 промтов, 46 комбо, 10 хоткеев. 12 мега-промтов (ночной режим 100+ задач), ♾️ бесконечный режим, глобальный поиск, table view, infinite scroll, focus mode, glossary, pin промтов, copy counters, FAB, 43 теста, CSP, aria-modal, focus-visible.":lang==="kk"?"165 промт, 46 комбо, 10 хоткей. 12 мега-промт (түнгі режим 100+ тапсырма), ♾️ шексіз режим, жаhандық іздеу, кесте көрінісі, шексіз скролл, focus режим, глоссарий, промт бекіту, көшіру есептегіштері, FAB, 43 тест, CSP, aria-modal, focus-visible.":"165 prompts, 46 combos, 10 shortcuts. 12 mega prompts (overnight 100+ tasks), ♾️ infinite mode, global search, table view, infinite scroll, focus mode, glossary, pin prompts, copy counters, FAB, 43 tests, CSP, aria-modal, focus-visible."}</div>
              <div style={{marginTop:4}}><strong>v8.0</strong> — {lang==="ru"?"132 промта, 14 конфигов, 35 комбо. Теги, сложность, related. Sticky поиск, сортировка, random, toast, CSS анимации, a11y, mobile responsive, ErrorBoundary, persistent storage, URL routing.":lang==="kk"?"132 промт, 14 конфиг, 35 комбо. Тегтер, күрделілік, related. Жабысқақ іздеу, сұрыптау, random, toast, CSS анимациялар, a11y, mobile responsive, ErrorBoundary, persistent storage, URL routing.":"132 prompts, 14 configs, 35 combos. Tags, difficulty, related. Sticky search, sorting, random, toast, CSS animations, a11y, mobile responsive, ErrorBoundary, persistent storage, URL routing."}</div>
              <div style={{marginTop:4}}><strong>v6.0</strong> — {lang==="ru"?"127 промтов. Все промты имеют АНТИ-ЛУП, РЕЗУЛЬТАТ, ПЕРВЫЙ ШАГ. Stats bar, copy filtered, DevTools промт.":lang==="kk"?"127 промт. Барлық промттарда АНТИ-ЛУП, НӘТИЖЕ, БІРІНШІ ҚАДАМ. Stats bar, copy filtered, DevTools промт.":"127 prompts. All prompts have ANTI-LOOP, RESULT, FIRST STEP. Stats bar, copy filtered, DevTools prompt."}</div>
              <div style={{marginTop:4}}><strong>v5.0</strong> — {lang==="ru"?"55 промтов. Начальная версия с 3 моделями, конфигами, шпаргалками.":lang==="kk"?"55 промт. 3 модельмен, конфигтермен, шпаргалкалармен бастапқы нұсқа.":"55 prompts. Initial version with 3 models, configs, cheat sheets."}</div>
            </div>
          </details>
          
          {/* Tasks 128-131: FAQ/Docs */}
          <details style={{ marginTop:8 }}>
            <summary style={{ fontSize:10, fontWeight:600, color:c.mut, cursor:"pointer", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>FAQ</summary>
            <div style={{ fontSize:10, color:c.dim, lineHeight:1.8, paddingLeft:8, borderLeft:`2px solid ${c.brd}`, marginTop:8 }}>
              <div><strong>{lang==="ru"?"Как запустить агента?":lang==="kk"?"Агентті қалай іске қосу керек?":"How to start an agent?"}</strong> — {lang==="ru"?"Скопируй промт → откройте терминал в git worktree → вставь при первом запросе → агент работает автономно.":lang==="kk"?"Промтты көшіріп алыңыз → git worktree ішінде терминал ашыңыз → бірінші сұраудың жауабына енгізіңіз → агент автономды жұмыс істейді.":"Copy prompt → open terminal in git worktree → paste on first request → agent works autonomously."}</div>
              <div style={{marginTop:6}}><strong>{lang==="ru"?"Что такое АНТИ-ЛУП?":lang==="kk"?"АНТИ-ЛУП деген не?":"What is ANTI-LOOP?"}</strong> — {lang==="ru"?"Защита от зацикливания: если агент делает 3 похожих действия подряд — он меняет подход. Максимум 5 попыток на одну подзадачу.":lang==="kk"?"Циклден қорғау: агент қатарынан 3 ұқсас әрекет жасаса — тәсілін өзгертеді. Бір ішкі тапсырмаға максимум 5 әрекет.":"Loop protection: if agent does 3 similar actions — it changes approach. Maximum 5 attempts per subtask."}</div>
              <div style={{marginTop:6}}><strong>{lang==="ru"?"Можно ли запускать несколько агентов?":lang==="kk"?"Бірнеше агентті іске қосуға бола ма?":"Can I run multiple agents?"}</strong> — {lang==="ru"?"Да! Используй git worktree для изоляции. Каждый агент в своей worktree не мешает другим. Координация через .claude/logs/ и .gemini/bugs/.":lang==="kk"?"Иә! Оқшаулау үшін git worktree пайдаланыңыз. Әр агент өз worktree-де басқаларға кедергі жасамайды. Үйлестіру .claude/logs/ және .gemini/bugs/ арқылы.":"Yes! Use git worktree for isolation. Each agent in its own worktree. Coordination via .claude/logs/ and .gemini/bugs/."}</div>
              <div style={{marginTop:6}}><strong>{lang==="ru"?"Где документация CLI?":lang==="kk"?"CLI құжаттамасы қайда?":"CLI documentation?"}</strong> — Claude Code: <span style={{color:"#f97316"}}>docs.anthropic.com</span> · Gemini CLI: <span style={{color:"#c4541d"}}>github.com/google-gemini/gemini-cli</span> · Codex CLI: <span style={{color:"#06b6d4"}}>github.com/openai/codex</span></div>
              <div style={{marginTop:6}}><strong>{lang==="ru"?"Claude Code вылетает/зависает?":lang==="kk"?"Claude Code құлайды/қатып қалады ма?":"Claude Code crashes/hangs?"}</strong> — {lang==="ru"?"Контекст 200K токенов, но реально ~120K-140K после системных промтов. Используй Compact режим (⚡). Коммить каждые 15 минут. Bash timeout = 2 мин (увеличь: BASH_DEFAULT_TIMEOUT_MS=1800000 в ~/.claude/settings.json). Не более 30-45 мин на сессию.":lang==="kk"?"Контекст 200K токен, бірақ жүйелік промттардан кейін шын мәнінде ~120K-140K. Compact режимін (⚡) пайдаланыңыз. Әр 15 минут сайын commit жасаңыз. Bash timeout = 2 мин (арттыру: ~/.claude/settings.json ішінде BASH_DEFAULT_TIMEOUT_MS=1800000). Бір сеансқа 30-45 минуттан артық емес.":"Context is 200K tokens but only ~120-140K usable. Use Compact mode (⚡). Commit every 15 min. Bash timeout = 2 min (increase: BASH_DEFAULT_TIMEOUT_MS=1800000 in ~/.claude/settings.json). Keep sessions under 30-45 min."}</div>
              <div style={{marginTop:6}}><strong>{lang==="ru"?"Что такое CLAUDE.md?":lang==="kk"?"CLAUDE.md деген не?":"What is CLAUDE.md?"}</strong> — {lang==="ru"?"Файл инструкций в корне проекта. Claude Code читает его автоматически. Держи < 200 строк. Загружается после каждой компактизации контекста.":lang==="kk"?"Жоба түбіріндегі нұсқаулар файлы. Claude Code оны автоматты түрде оқиды. < 200 жолда сақтаңыз. Контекст компакцияланғаннан кейін қайта жүктеледі.":"Project root instruction file. Claude Code reads it automatically. Keep under 200 lines. Reloaded after every context compaction."}</div>
            </div>
          </details>

          {/* Task 123: Timeline visualization */}
          <details style={{ marginTop:8 }}>
            <summary style={{ fontSize:10, fontWeight:600, color:c.mut, cursor:"pointer", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{lang==="ru"?"Эволюция":lang==="kk"?"Эволюция":"Evolution"}</summary>
            <div style={{ marginTop:8, padding:"8px 0" }}>
              <svg width="100%" height="90" viewBox="0 0 600 90">
                {(() => {
                  const data = [
                    { v:"v1", n:15, d:"Nov 2024" },
                    { v:"v3", n:34, d:"Jan 2025" },
                    { v:"v5", n:100, d:"Feb 2025" },
                    { v:"v7", n:132, d:"Mar 2025" },
                    { v:"v9.1", n:188, d:"Apr 2025" },
                    { v:"v11", n:296, d:"Apr 2026" },
                    { v:"v11.5", n:1024, d:"Apr 2026" },
                    { v:"v12", n:10036, d:"Apr 2026" },
                    { v:"v13", n:3299, d:"Apr 2026" },
                  ];
                  const maxN = data[data.length-1].n;
                  const step = 580 / (data.length - 1);
                  return data.map((p, i, _a) => {
                    const x = 10 + i * step;
                    const prevX = i > 0 ? 10 + (i-1) * step : x;
                    const r = Math.max(4, Math.min(14, Math.sqrt(p.n/maxN) * 14));
                    return (
                      <g key={i}>
                        {i > 0 && <line x1={prevX} y1={42} x2={x} y2={42} stroke={c.brd} strokeWidth={1.5} />}
                        <circle cx={x} cy={42} r={r+3} fill="#e86a2a" opacity={0.15} />
                        <circle cx={x} cy={42} r={r} fill="#e86a2a" opacity={0.9} />
                        <text x={x} y={18} fill={c.text} fontSize={10} fontWeight={700} textAnchor="middle" fontFamily={font}>{p.v}</text>
                        <text x={x} y={70} fill="#e86a2a" fontSize={9} fontWeight={700} textAnchor="middle" fontFamily={font}>{p.n >= 1000 ? (p.n/1000).toFixed(1)+"K" : p.n}</text>
                        <text x={x} y={82} fill={c.dim} fontSize={7} textAnchor="middle" fontFamily={font} opacity={0.6}>{p.d}</text>
                      </g>
                    );
                  });
                })()}
              </svg>
            </div>
          </details>

          {/* Task 124: Coverage heatmap */}
          <details style={{ marginTop:8 }}>
            <summary style={{ fontSize:10, fontWeight:600, color:c.mut, cursor:"pointer", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{lang==="ru"?"Покрытие":lang==="kk"?"Қамту":"Coverage"}</summary>
            <div style={{ marginTop:8, display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(80px, 1fr))", gap:4 }}>
              {(() => {
                const cats = [
                  {k:"Frontend",tags:["react","css","components"],cl:"#3b82f6"},
                  {k:"Backend",tags:["nodejs","api","database"],cl:"#10b981"},
                  {k:"Testing",tags:["testing","playwright","qa"],cl:"#f59e0b"},
                  {k:"Security",tags:["security","auth"],cl:"#ef4444"},
                  {k:"DevOps",tags:["docker","ci-cd","kubernetes"],cl:"#c4541d"},
                  {k:"Performance",tags:["performance","bundle"],cl:"#ea580c"},
                  {k:"Database",tags:["postgresql","redis","sql"],cl:"#06b6d4"},
                  {k:"UI/UX",tags:["ui","ux","design-system"],cl:"#ec4899"},
                  {k:"Docs",tags:["documentation","readme"],cl:"#e86a2a"},
                  {k:"Infra",tags:["infrastructure","nginx","ssl"],cl:"#14b8a6"},
                  {k:"Monitoring",tags:["monitoring","logging","sentry"],cl:"#d946ef"},
                  {k:"Mobile",tags:["mobile","responsive","pwa"],cl:"#f97316"},
                ];
                return cats.map(cat => {
                  const n = P.filter(p => p.tags && p.tags.some(t2 => cat.tags.includes(t2))).length;
                  const pct = Math.round(n / P.length * 100);
                  return (
                    <div key={cat.k} style={{ padding:"6px 8px", borderRadius:0, border:`1px solid ${c.brd}`, background:c.card, textAlign:"center" }}>
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
            border:`1.5px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut,
            cursor:"pointer", transition:"all .15s", outline:"none",
          }}>{lang==="ru"?"Экспорт .md":lang==="kk"?"Экспорт .md":"Export .md"} ({section==="prompts"&&hasFilters?list.length:P.length})</button>
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
            border:`1.5px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut,
            cursor:"pointer", transition:"all .15s", outline:"none",
          }}>{lang==="ru"?"Экспорт CSV":lang==="kk"?"Экспорт CSV":"Export CSV"}</button>
          <button onClick={() => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type:"application/json" });
            const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "aiagent-hub-data.json"; a.click(); URL.revokeObjectURL(url);
          }} style={{
            padding:"8px 24px", fontSize:11, fontFamily:font, fontWeight:600,
            border:`1.5px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut,
            cursor:"pointer", transition:"all .15s", outline:"none",
          }}>{lang==="ru"?"Экспорт JSON":lang==="kk"?"Экспорт JSON":"Export JSON"}</button>
          {/* Export as self-contained HTML */}
          <button onClick={() => {
            const items = section==="prompts" && hasFilters ? list : P;
            let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>AIAgent-Hub v9.0</title><style>body{font-family:monospace;background:#060609;color:#ddd;padding:20px;max-width:800px;margin:0 auto}h1{color:#e86a2a}h2{color:#f97316;border-bottom:1px solid #222;padding-bottom:8px}h3{color:#c4541d;margin-top:24px}pre{background:#111;padding:12px;border-radius:8px;white-space:pre-wrap;font-size:12px;line-height:1.6;overflow-x:auto;border:1px solid #222}.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:10px;background:#1a1a28;color:#888;margin:2px}</style></head><body><h1>AIAgent-Hub v9.0</h1><p>${items.length} prompts · ${stats.models} models · ~${stats.totalHours}h</p>`;
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
            border:`1.5px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut,
            cursor:"pointer", transition:"all .15s", outline:"none",
          }}>{lang==="ru"?"Экспорт HTML":lang==="kk"?"Экспорт HTML":"Export HTML"}</button>
          {/* Feat 36: Settings backup/restore */}
          <button onClick={() => {
            try {
              const settings = localStorage.getItem("aiagent-hub-settings");
              if (settings) {
                const blob = new Blob([settings], { type:"application/json" });
                const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "aiagent-hub-settings.json"; a.click(); URL.revokeObjectURL(url);
              }
            } catch {}
          }} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, padding:"8px 20px", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:700, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}><IconDownload />{lang==="ru"?"Бэкап":lang==="kk"?"Бэкап":"Backup"}</button>
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
                  setToast(lang==="ru"?"Настройки восстановлены":lang==="kk"?"Баптаулар қалпына келтірілді":"Settings restored");
                } catch {}
              };
              reader.readAsText(file);
            };
            input.click();
          }} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, padding:"8px 20px", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:700, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}><IconUpload />{lang==="ru"?"Восстановить":lang==="kk"?"Қалпына келтіру":"Restore"}</button>
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
          <div style={{ fontSize:9, color:c.dim, letterSpacing:2 }}>AIAgent-Hub v12 · {P.length} {lang==="ru"?pl(P.length,"промт","промта","промтов"):lang==="kk"?"промт":t.prompts} · {(COMBOS[lang]||COMBOS.ru).length} {lang==="ru"?pl((COMBOS[lang]||COMBOS.ru).length,"комбо","комбо","комбо"):lang==="kk"?"комбо":"combos"} · {stats.roles} {lang==="ru"?pl(stats.roles,"роль","роли","ролей"):lang==="kk"?"рөлдер":"roles"}{loadTime ? ` · ${loadTime}ms` : ""}{copyCount > 0 ? ` · ${copyCount} ${lang==="ru"?"скопировано":lang==="kk"?"көшірілді":"copied"}` : ""}</div>
          {scrollPct > 10 && <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} aria-label={lang==="ru"?"Наверх":lang==="kk"?"Жоғары":"Scroll to top"} style={{ marginTop:8, padding:"6px 20px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}>↑ {lang==="ru"?"Наверх":lang==="kk"?"Жоғары":"Top"}</button>}
        </div>
      </main>

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
            { k:"prompts", i:"¶", l:lang==="ru"?"Промты":lang==="kk"?"Промттер":"Prompts" },
            { k:"combos", i:"⧉", l:lang==="ru"?"Комбо":lang==="kk"?"Комбо":"Combos" },
            { k:"cheat", i:"≣", l:lang==="ru"?"Шпаргалки":lang==="kk"?"Парақтар":"Cheat" },
            { k:"setup", i:"◎", l:lang==="ru"?"Настройка":lang==="kk"?"Баптау":"Setup" },
          ].map(n=><button key={n.k} data-active={section===n.k ? "true" : "false"} onClick={()=>{setSection(n.k);window.scrollTo({top:0,behavior:"smooth"})}} style={{ background:"none", border:"none", color:section===n.k?c.text:c.dim, cursor:"pointer", outline:"none", textAlign:"center", padding:"4px 8px", fontSize:10, fontFamily:font, fontWeight:section===n.k?700:400 }}><div style={{ fontSize:16, marginBottom:2 }}>{n.i}</div>{n.l}</button>)}
        </div>
      </nav>
    </div>
  );
}
