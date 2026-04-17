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
    r: { "Feature Development":"Мүмкіндік әзірлеу","Guided Feature Dev":"Мүмкіндік (guided)","API Endpoints":"API эндпоинттер","UI Components":"UI компоненттер","Database & Migration":"ДБ және миграция","Authentication":"Аутентификация","PR Review":"PR шолу","Code Review":"Код шолу","Simplification":"Жеңілдету","TDD Development":"TDD әзірлеу","Test Suite":"Тест жинағы","E2E Tests":"E2E тесттер","Bug Fix":"Қателерді түзету","Error Handling":"Қателерді өңдеу","Deep Refactoring":"Рефакторинг","Dead Code Removal":"Өлі кодты жою","Security Audit":"Қауіпсіздік аудиті","Security Fix":"Қауіпсіздік түзету","Performance":"Өнімділік","CI/CD Pipeline":"CI/CD","Docker Setup":"Docker","Architecture Review":"Архитектура","Smart Commit":"Коммит","Commit + PR":"Коммит + PR","Auto Watch & Fix":"Авто-бақылау","Overnight Work":"Түнгі жұмыс","Full Project Setup":"Жоба баптау","Multi-Agent":"Мульти-агент","i18n":"Локализация","Accessibility":"Қолжетімділік","Dependency Update":"Тәуелділіктер","Production Deploy":"Деплой","README + CLAUDE.md":"Құжаттама","State Management":"State","Dark Mode":"Қараңғы тақырып","Form System":"Формалар","Search":"Іздеу","Data Table":"Кестелер","AI/LLM Integration":"AI/LLM","WebSocket":"WebSocket","Environment Config":"Env конфиг","Framework Migration":"FW миграция","Legacy Modernization":"Модернизация","Logging & Monitoring":"Логтау","Type Safety":"Типтеу","PWA":"PWA","Payments":"Төлемдер","Caching":"Кэштеу","Bundle Optimization":"Бандл","API Docs":"API Docs","Monorepo":"Монорепо","Email System":"Email","File Upload":"Файл жүктеу","Background Jobs":"Фондық тапсырмалар","GraphQL":"GraphQL","Storybook":"Storybook","Hotfix":"Хотфикс","Responsive Design":"Адаптивті","SEO":"SEO","RBAC Permissions":"RBAC/Рөлдер","Analytics":"Аналитика","Notifications":"Хабарламалар","Data Seeding":"Деректер сидинг","Infinite Scroll":"Шексіз скролл","Project Scaffolding":"Scaffold","Error & Loading States":"Error/Loading","Rate Limiting":"Rate Limiting","Image Optimization":"Сурет оптим.","Multi-Environment":"Multi-Env","Backup & Restore":"Сақтық көшірме","Loading Skeletons":"Скелетондар","Testing Strategy":"Тест стратегия","API Client Layer":"API клиент","Data Migration":"Деректер миграция","Admin Dashboard":"Админ-панель","Landing Page":"Лендинг","User Onboarding":"Онбординг","PDF Generation":"PDF генерация","CSV/Excel Import":"CSV импорт","Changelog & Releases":"Релиздер","Modal System":"Модалдар","Toast / Snackbar":"Toast","Tabs & Navigation":"Табтар","Breadcrumbs & Navigation":"Навигация","Design Tokens & Theme":"Дизайн-токендер","Drag & Drop":"Drag & Drop","Kanban Board":"Kanban","Chat / Messaging":"Чат","Map Integration":"Карта","Calendar / Scheduler":"Күнтізбе","Advanced Filters":"Сүзгілер","Settings Page":"Баптаулар","Multi-Step Wizard":"Wizard","Animations & Transitions":"Анимациялар","OAuth / Social Login":"OAuth","API Versioning":"API нұсқалау","Microservice Setup":"Микросервис","Webhook System":"Вебхуктар","CLI Tool":"CLI құрал","Two-Factor Auth":"2FA","FastAPI App":"FastAPI","Django App":"Django","Python Package":"Python пакет","Go REST API":"Go API","Tailwind CSS Setup":"Tailwind","Next.js App Router":"Next.js","Code Review Checklist":"PR чеклист","Production Debugging":"Prod дебаг","Performance Audit":"Perf аудит","Database Optimization":"ДБ оптим.","Rust App":"Rust","Vue 3 App":"Vue 3","SvelteKit App":"SvelteKit","tRPC Setup":"tRPC","React Testing":"React тесттер","Supabase Integration":"Supabase","Docker Optimization":"Docker оптим.","Monitoring Stack":"Мониторинг","Terraform IaC":"Terraform","Kubernetes Deploy":"Kubernetes","Redis Integration":"Redis","MongoDB Setup":"MongoDB","PostgreSQL Advanced":"PostgreSQL","React Native App":"React Native","RAG Pipeline":"RAG","Multi-Tenancy":"Multi-tenant","Billing & Subscriptions":"Биллинг","Nginx Configuration":"Nginx","SSL / HTTPS Setup":"SSL/HTTPS","Message Queue":"Кезектер","Event-Driven Architecture":"Event-Driven","GraphQL Subscriptions":"GQL Subscriptions","CQRS Pattern":"CQRS","Rich Text Editor":"Редактор","Data Visualization":"Визуализация","Advanced Table Features":"Кестелер Pro","Contract Testing":"Contract тесттер","Load Testing":"Жүктеме тесті","CORS Configuration":"CORS","Content Security Policy":"CSP","Dev Container":"Dev Container","Turborepo Optimization":"Turborepo","Feature Flags":"Feature Flags","Retry & Circuit Breaker":"Retry/CB","Visual Regression Testing":"Visual Regression","API Gateway":"API Gateway","CI/CD Advanced":"CI/CD Pro","OpenAPI Spec":"OpenAPI","Error Tracking":"Error Tracking","Caching Patterns":"Кэш паттерндер","Registry & Data Audit":"Реестр аудиті","Auth System":"Auth жүйесі","Dependency Updater":"Тәуелділік жаңарту" },
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
/** Russian pluralization: pl(5,"модель","модели","моделей") → "моделей" */
const pl = (n, one, few, many) => { const m=Math.abs(n)%100, d=m%10; return d===1&&m!==11?one:d>=2&&d<=4&&(m<12||m>14)?few:many; };

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
.combo-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.15)}
[id^="card-"]:hover{box-shadow:0 2px 12px rgba(0,0,0,.1)}
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
  .search-row{flex-direction:column!important;gap:8px!important}
  .search-row>div:last-child{min-width:0!important;width:100%!important}
  .steps-grid{grid-template-columns:1fr 1fr!important}
  .mobile-bottom-nav{display:flex!important}
  #main-content{padding-bottom:120px!important}
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
  [id^="card-"]{border-top:1px solid #ddd!important;border-right:1px solid #ddd!important;border-bottom:1px solid #ddd!important;border-left:3px solid #999!important;background:#fff!important;page-break-inside:avoid}
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
  const [comboSearch, setComboSearch] = useState("");
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
        if (el) { el.scrollIntoView({behavior:"smooth",block:"center"}); el.style.outline="2px solid #6366f1"; setTimeout(()=>{el.style.outline=""},2000); }
        else if (attempts < 8) setTimeout(() => tryScroll(attempts + 1), 200);
      };
      setTimeout(() => tryScroll(), 300);
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
            <div style={{ fontSize:9, letterSpacing:6, color:c.dim, textTransform:"uppercase", marginBottom:6 }}>v9.1 · {stats.total} {lang==="ru"?pl(stats.total,"промт","промта","промтов"):t.prompts} · {stats.models} {lang==="ru"?pl(stats.models,"модель","модели","моделей"):t.models}{usedCount>0?` · ✓${usedCount}`:""}</div>
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
            <select value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} aria-label="Font size" className="hide-mobile" style={{ height:36, padding:"0 8px", borderRadius:8, border:`1px solid ${c.brd}`, background:c.card, color:c.text, cursor:"pointer", fontSize:10, fontFamily:font, outline:"none", WebkitAppearance:"none", MozAppearance:"none", appearance:"none", textAlign:"center", width:36 }}>
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
              ? `${stats.total} промтов для автономных AI-агентов. Выбери промт → скопируй → вставь в терминал агента. Нажми ? для горячих клавиш.`
              : `${stats.total} prompts for autonomous AI agents. Pick a prompt → copy → paste into agent terminal. Press ? for keyboard shortcuts.`}
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
              marginBottom:8, borderTop:`1px solid ${isO?p.ac+"35":compareIds.includes(p.id)?"#8b5cf650":debouncedSearch?p.ac+"20":c.brd}`, borderRight:`1px solid ${isO?p.ac+"35":compareIds.includes(p.id)?"#8b5cf650":debouncedSearch?p.ac+"20":c.brd}`, borderBottom:`1px solid ${isO?p.ac+"35":compareIds.includes(p.id)?"#8b5cf650":debouncedSearch?p.ac+"20":c.brd}`, borderRadius:12,
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
                  <button onClick={(e)=>{e.stopPropagation();toggleFav(p.id)}} aria-label={favs[p.id]?(lang==="ru"?"Убрать":lang==="kk"?"Алып тастау":"Remove"):(lang==="ru"?"Избранное":lang==="kk"?"Таңдаулы":"Favorite")} aria-pressed={!!favs[p.id]} style={{ width:30, height:30, borderRadius:7, border:`1px solid ${favs[p.id]?"#eab30840":c.brd}`, background:favs[p.id]?"#eab30812":"transparent", color:favs[p.id]?"#eab308":c.dim, cursor:"pointer", outline:"none", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>{favs[p.id]?"★":"☆"}</button>
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
        <div className="search-row" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ fontSize:10, color:c.dim, flex:1 }}>{t.combosDesc}</div>
          <div style={{ position:"relative", minWidth:200 }}>
            <input type="search" value={comboSearch} onChange={e=>setComboSearch(e.target.value)} placeholder={lang==="ru"?"Поиск комбо...":lang==="kk"?"Комбо іздеу...":"Search combos..."} style={{ width:"100%", height:32, padding:"0 30px 0 10px", fontSize:11, fontFamily:font, borderRadius:8, border:`1px solid ${c.brd}`, background:c.surf, color:c.text, outline:"none", transition:"border .15s" }} />
            {comboSearch && <button onClick={()=>setComboSearch("")} style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:c.dim, cursor:"pointer", fontSize:12, padding:0, lineHeight:1 }}>×</button>}
          </div>
        </div>
        
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

        {comboSearch && <div style={{ fontSize:10, color:c.dim, marginBottom:8 }}>{lang==="ru"?"Фильтр":"Filter"}: "{comboSearch}" — {(COMBOS[lang]||COMBOS.ru).filter(cb => (cb.name + " " + cb.desc + " " + (cb.ids||[]).map(id=>{const p=pGet(id);return p?(t.r[p.role]||p.role):""}).join(" ")).toLowerCase().includes(comboSearch.toLowerCase())).length} / {(COMBOS[lang]||COMBOS.ru).length}</div>}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(250px, 1fr))", gap:8 }}>
          {(COMBOS[lang]||COMBOS.ru).filter(cb => !comboSearch || (cb.name + " " + cb.desc + " " + (cb.ids||[]).map(id=>{const p=pGet(id);return p?(t.r[p.role]||p.role):""}).join(" ")).toLowerCase().includes(comboSearch.toLowerCase())).map((cb, i) => {
            // Task 71: detect conflicts (multiple prompts for same role)
            const agents = (cb.ids||[]).map(id=>pGet(id)).filter(Boolean);
            const roles = agents.map(a=>a.role);
            const hasConflict = roles.length !== new Set(roles).size;
            return (
            <div key={i} className="card-enter combo-card" style={{
              padding:"14px 16px", borderRadius:10, borderTop:`1px solid ${c.brd}`,
              borderRight:`1px solid ${c.brd}`, borderBottom:`1px solid ${c.brd}`,
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
        <div className="search-row" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ fontSize:10, color:c.dim, flex:1 }}>{lang==="ru"?"Быстрые команды и сниппеты":"Quick commands and snippets"}</div>
          <div style={{ position:"relative", minWidth:200 }}>
            <input type="search" value={cheatSearch} onChange={e=>setCheatSearch(e.target.value)} placeholder={lang==="ru"?"Поиск команд...":lang==="kk"?"Команда іздеу...":"Search commands..."} style={{ width:"100%", height:32, padding:"0 30px 0 10px", fontSize:11, fontFamily:font, borderRadius:8, border:`1px solid ${c.brd}`, background:c.surf, color:c.text, outline:"none", transition:"border .15s" }} />
            {cheatSearch && <button onClick={()=>setCheatSearch("")} style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:c.dim, cursor:"pointer", fontSize:12, padding:0, lineHeight:1 }}>×</button>}
          </div>
        </div>
        {cheatSearch && <div style={{ fontSize:10, color:c.dim, marginBottom:8 }}>{lang==="ru"?"Фильтр":"Filter"}: "{cheatSearch}"</div>}
        {Object.entries(CHEAT).map(([key, sheet]) => {
          const filteredCmds = cheatSearch ? sheet.cmds.filter(c2 => (c2.cmd + " " + c2.desc).toLowerCase().includes(cheatSearch.toLowerCase())) : sheet.cmds;
          if (cheatSearch && filteredCmds.length === 0) return null;
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
        <div className="search-row" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ flex:1 }} />
          <div style={{ position:"relative", minWidth:200 }}>
            <input type="search" value={quickSearch} onChange={e=>setQuickSearch(e.target.value)} placeholder={lang==="ru"?"Поиск CLI команд...":lang==="kk"?"CLI команда іздеу...":"Search CLI commands..."} style={{ width:"100%", height:32, padding:"0 30px 0 10px", fontSize:11, fontFamily:font, borderRadius:8, border:`1px solid ${c.brd}`, background:c.surf, color:c.text, outline:"none", transition:"border .15s" }} />
            {quickSearch && <button onClick={()=>setQuickSearch("")} style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:c.dim, cursor:"pointer", fontSize:12, padding:0, lineHeight:1 }}>×</button>}
          </div>
        </div>
        {quickSearch && <div style={{ fontSize:10, color:c.dim, marginBottom:8 }}>{lang==="ru"?"Фильтр":"Filter"}: "{quickSearch}"</div>}
        {(QUICK_CMDS[lang]||QUICK_CMDS.ru||[]).map((cat, ci) => {
          const cmds = cat.cmds || [];
          const filteredQC = quickSearch ? cmds.filter(cmd => (cmd.cmd + " " + cmd.label).toLowerCase().includes(quickSearch.toLowerCase())) : cmds;
          if (quickSearch && filteredQC.length === 0) return null;
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
          <div style={{ fontSize:10, letterSpacing:3, color:c.mut, textTransform:"uppercase", marginBottom:10, paddingLeft:4, fontWeight:600, borderBottom:`1px solid ${c.brd}`, paddingBottom:8 }}>{lang==="ru"?"Настройка и запуск":"Setup & Launch"}</div>
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
          <div style={{ fontSize:10, letterSpacing:3, color:c.mut, textTransform:"uppercase", marginBottom:10, paddingLeft:4, fontWeight:600, borderBottom:`1px solid ${c.brd}`, paddingBottom:8 }}>{t.configs}</div>
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
          
          <div style={{ fontSize:10, fontWeight:700, color:c.mut, marginBottom:8, letterSpacing:1, textTransform:"uppercase" }}>{t.tipTitle}</div>
          <div className="steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:6, marginBottom:12 }}>
            {(lang==="ru"?[
              {n:"1", t:"Выбери промт", d:"для своей задачи"},
              {n:"2", t:"Скопируй команду", d:"/ralph-loop, /feature-dev..."},
              {n:"3", t:"Вставь в CLI", d:"Claude Code терминал"},
              {n:"4", t:"Агент работает", d:"автономно изучит проект"},
            ]:[
              {n:"1", t:"Pick a prompt", d:"for your task"},
              {n:"2", t:"Copy command", d:"/ralph-loop, /feature-dev..."},
              {n:"3", t:"Paste in CLI", d:"Claude Code terminal"},
              {n:"4", t:"Agent works", d:"autonomously explores project"},
            ]).map(s => (
              <div key={s.n} style={{ display:"flex", gap:8, alignItems:"flex-start", padding:"8px 10px", borderRadius:8, background:c.surf, border:`1px solid ${c.brd}` }}>
                <div style={{ width:20, height:20, borderRadius:6, background:"#6366f115", color:"#6366f1", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.n}</div>
                <div><div style={{ fontSize:10, fontWeight:700, color:c.text }}>{s.t}</div><div style={{ fontSize:9, color:c.dim }}>{s.d}</div></div>
              </div>
            ))}
          </div>
          
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
                  { x:400, v:"v7", n:132, d:"Mar 2025" },
                  { x:520, v:"v9.1", n:188, d:"Apr 2025" },
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
          <div style={{ fontSize:9, color:c.dim, letterSpacing:2 }}>AIAgent-Hub v9.1 · {P.length} {lang==="ru"?pl(P.length,"промт","промта","промтов"):t.prompts} · {(COMBOS[lang]||COMBOS.ru).length} {lang==="ru"?pl((COMBOS[lang]||COMBOS.ru).length,"комбо","комбо","комбо"):"combos"} · {stats.roles} {lang==="ru"?pl(stats.roles,"роль","роли","ролей"):"roles"}{loadTime ? ` · ${loadTime}ms` : ""}{copyCount > 0 ? ` · ${copyCount} ${lang==="ru"?"скопировано":"copied"}` : ""}</div>
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
