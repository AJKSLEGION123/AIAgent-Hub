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
  dark: { bg:"#0a0806", bg2:"#120e09", card:"#15110b", cardH:"#1c1811", brd:"#221d15", brdH:"#2e281e", text:"#ece3ce", mut:"#a09584", dim:"#6e6656", surf:"#120e09", glow:"rgba(232,106,42,0.05)", meta:"#0a0806", accent:"#e86a2a", ink:"#f5efdd" },
  light: { bg:"#f5f0e6", bg2:"#ebe5d6", card:"#fffcf4", cardH:"#f8f3e6", brd:"#d9cfb8", brdH:"#b8ab90", text:"#1a140a", mut:"#57503e", dim:"#8a826c", surf:"#f0e9d6", glow:"rgba(232,106,42,0.08)", meta:"#f5f0e6", accent:"#a84a12", ink:"#0a0806" },
};
const MC = { claude:"#f97316" };
const ML = { claude:"Claude Code" };
const MI = { claude:"C" };
const font = "'JetBrains Mono','IBM Plex Mono','Fira Code',monospace";
const fontDisplay = "'Fraunces','Cormorant Garamond','Times New Roman',serif";
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
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.display-serif{font-family:'Fraunces','Cormorant Garamond','Times New Roman',serif;font-variation-settings:'SOFT' 60,'opsz' 144;font-feature-settings:'ss01','ss02'}
.display-italic{font-style:italic;font-variation-settings:'SOFT' 100,'opsz' 144,'wonk' 1}
.label-tech{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:5px;text-transform:uppercase;font-weight:500}
.label-tech-sm{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:3px;text-transform:uppercase;font-weight:500}
.rule-double{border:0;border-top:1px solid currentColor;border-bottom:1px solid currentColor;height:3px;opacity:.35}
.ornament::before{content:"§";font-family:'Fraunces',serif;font-style:italic;opacity:.35;margin-right:6px}
.grain{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.04;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.tab-editorial{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:4px;text-transform:uppercase;font-weight:500;padding:14px 2px;background:transparent;border:0;border-bottom:1px solid transparent;cursor:pointer;outline:none;transition:color .2s ease,border-color .2s ease;white-space:nowrap;position:relative}
.tab-editorial .count{opacity:.45;margin-left:8px;font-size:9px;letter-spacing:1px}
.tab-editorial[aria-selected="true"] .count{opacity:1}
.masthead{position:relative;padding:32px 0 28px;margin-bottom:32px}
.masthead::before,.masthead::after{content:"";display:block;height:3px}
.masthead::before{border-top:1px solid currentColor;border-bottom:1px solid currentColor;opacity:.35;margin-bottom:28px}
.masthead::after{border-top:1px solid currentColor;border-bottom:1px solid currentColor;opacity:.35;margin-top:24px}
.icon-btn{width:36px;height:36px;border-radius:0;border:1px solid;background:transparent;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;outline:none;transition:all .2s;font-family:'JetBrains Mono',monospace}
.card-editorial{position:relative;padding:18px 20px 16px;border:0;border-top:1px solid;transition:background .2s ease,border-color .2s ease}
.card-editorial::before{content:attr(data-idx);position:absolute;top:12px;right:16px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;opacity:.35}
.card-editorial:hover{background:rgba(232,106,42,.03)}
@media(max-width:640px){.masthead-stat-num{font-size:56px!important}.masthead-title{font-size:38px!important}}

:root{color-scheme:dark}
[data-theme="light"]{color-scheme:light}
::selection{background:#e86a2a40;color:inherit}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#333;border-radius:3px}
[data-theme="light"] ::-webkit-scrollbar-thumb{background:#ccc}
input:focus{border-color:var(--brdH)!important;box-shadow:0 0 0 3px rgba(232,106,42,0.1)}
button:focus-visible{outline:2px solid #e86a2a;outline-offset:2px}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideDown{from{max-height:0;opacity:0}to{max-height:600px;opacity:1}}
@keyframes pulse{0%,100%{opacity:.3;width:30%}50%{opacity:1;width:80%}}
@keyframes toastIn{from{transform:translate(-50%,-12px);opacity:0}to{transform:translate(-50%,0);opacity:1}}
@keyframes toastOut{from{transform:translate(-50%,0);opacity:1}to{transform:translate(-50%,-8px);opacity:0}}
@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
.skeleton{background:linear-gradient(90deg,#1a1a28 25%,#252538 50%,#1a1a28 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px}
[data-theme="light"] .skeleton{background:linear-gradient(90deg,#e8e8ef 25%,#d8d8e4 50%,#e8e8ef 75%);background-size:200% 100%}
.card-enter{animation:fadeIn .2s ease;will-change:opacity,transform}
.combo-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(232,106,42,.12)}
.body-enter{animation:slideDown .25s ease;overflow:hidden;will-change:max-height,opacity}
.toast{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:9999;padding:8px 16px;border-radius:8px;font-size:11px;font-weight:600;pointer-events:none;max-width:min(90vw,320px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 6px 24px rgba(0,0,0,.25);animation:toastIn .18s cubic-bezier(.16,.84,.44,1),toastOut .22s ease 1.28s forwards;will-change:transform,opacity}
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
.skip-link{position:absolute;top:-40px;left:0;background:#e86a2a;color:#fff;padding:8px 16px;z-index:100;border-radius:0 0 8px 0;font-size:12px;text-decoration:none}
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
[id^="card-"]:focus{outline:2px solid #e86a2a;outline-offset:-2px;border-radius:12px}
[id^="card-"]:focus:not(:focus-visible){outline:none}
`;

/* ═══════════════════════════════════════════════
   MEMOIZED COMPONENTS (tasks: 001, 002, 082, 096, 098)
   ═══════════════════════════════════════════════ */
const Pill = memo(({ on, fn, lb, cl, c }) => (
  <button onClick={fn} aria-pressed={on} style={{
    padding:"6px 2px", fontSize:10, fontFamily:font, letterSpacing:2, textTransform:"uppercase", fontWeight:on?700:500,
    border:0, borderBottom:`1.5px solid ${on?(cl||c.accent):"transparent"}`,
    background:"transparent", color:on?(cl||c.ink):c.mut,
    cursor:"pointer", transition:"color .18s ease, border-color .18s ease", whiteSpace:"nowrap", outline:"none",
    marginRight:12,
  }}>{lb}</button>
));

const CBtn = memo(({ id, txt, cl, sm, copied, cp, t, bg, skip }) => (
  <button onClick={() => cp(id, txt, skip)} aria-label={copied===id ? t.copied : `${t.copy}: ${id}`} style={{
    padding:sm?"4px 12px":"6px 14px", fontSize:9, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:700,
    border:`1px solid ${cl||"currentColor"}`, borderRadius:0,
    background:copied===id?"transparent":(cl||"currentColor"), color:copied===id?(cl||"currentColor"):bg,
    cursor:"pointer", transition:"all .15s", outline:"none",
    transform: copied===id ? "scale(.96)" : "scale(1)",
  }}>{copied===id ? "✓" : t.copy}</button>
));

const Toast = memo(({ msg, c }) => msg ? (
  <div className="toast" role="status" aria-live="polite" style={{ background:"#10b981", color:"#fff", fontFamily:font }}>{msg}</div>
) : null);

const EmptyState = memo(({ c, lang }) => (
  <div style={{ textAlign:"center", padding:"40px 0", color:c.dim, fontSize:12, fontFamily:font }}>
    <div style={{ fontSize:28, marginBottom:8, opacity:.5 }}>⌕</div>
    <div style={{ fontWeight:600, color:c.mut }}>{lang==="ru"?"Ничего не найдено":lang==="kk"?"Ештеңе табылмады":"Nothing found"}</div>
    <div style={{ fontSize:10, marginTop:6, opacity:.7 }}>{lang==="ru"?"Попробуйте другой запрос":lang==="kk"?"Басқа сұраныс жасап көріңіз":"Try a different query"}</div>
  </div>
));

/* ═══════════════════════════════════════════════
   HIGHLIGHT HELPER (task: 042)
   ═══════════════════════════════════════════════ */
function HL({ text, q, color }) {
  if (!q || q.length < 2) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'));
  return parts.map((p,i) => p.toLowerCase()===q.toLowerCase() ? <mark key={i} style={{background:alpha(color||"#e86a2a",.25),color:"inherit",borderRadius:2,padding:"0 1px"}}>{p}</mark> : p);
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
          {this.state.err?.stack && <details style={{marginBottom:16,textAlign:"left",maxWidth:500}}><summary style={{fontSize:10,color:"#5e5e78",cursor:"pointer"}}>Stack trace</summary><pre style={{fontSize:9,color:"#44445a",marginTop:8,padding:8,background:"#0a0a12",borderRadius:0,whiteSpace:"pre-wrap",wordBreak:"break-all",maxHeight:200,overflow:"auto"}}>{this.state.err.stack}</pre></details>}
          <button onClick={()=>this.setState({err:null})} style={{padding:"8px 24px",fontSize:12,fontFamily:font,fontWeight:600,border:"1.5px solid #e86a2a",borderRadius:0,background:"#e86a2a",color:"#fff",cursor:"pointer"}}>Перезагрузить</button>
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
        <button onClick={()=>{setErr(null);setLoadPct(0);_d(Z,(pct)=>setLoadPct(Math.round(pct*100))).then(d=>{dataRef.current=d;setData(d)}).catch(e=>setErr(e))}} style={{padding:"8px 24px",fontSize:12,fontFamily:font,fontWeight:600,border:"1.5px solid #e86a2a",borderRadius:0,background:"#e86a2a",color:"#fff",cursor:"pointer"}}>Обновить</button>
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
  const [toastKey, setToastKey] = useState(0);
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
        if (el) { el.scrollIntoView({behavior:"smooth",block:"center"}); el.style.outline="2px solid #e86a2a"; setTimeout(()=>{el.style.outline=""},2000); }
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
    setToast(`${t.copied} · ${tokens >= 1000 ? (tokens/1000).toFixed(1)+"K" : tokens} tok`);
    setToastKey(k => k + 1);
    setTimeout(() => setCopied(null), 1600);
    setTimeout(() => setToast(null), 1700);
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
  const CAT_COLORS = {"AI / LLM":"#c4541d","Security":"#ef4444","Testing / QA":"#a855f7","Performance":"#f59e0b","DevOps / CI":"#2563eb","Frontend / UI":"#ec4899","Backend / API":"#10b981","Data & Files":"#0891b2","Integrations":"#f97316","Architecture":"#e86a2a","Documentation":"#06b6d4","Project Setup":"#0ea5e9"};

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
      <Toast key={toastKey} msg={toast} c={c} />

      {/* Feat 5: Scroll progress bar */}
      <div style={{ position:"fixed", top:0, left:0, width:scrollPct+"%", height:2, background:"linear-gradient(90deg,#e86a2a,#c4541d)", zIndex:9999, transition:"width .1s", opacity:scrollPct>0?1:0, willChange:"width" }} />

      {/* Feat 6: Offline banner */}
      {isOffline && <div role="alert" style={{ position:"fixed", top:0, left:0, right:0, padding:"6px 0", background:"#ef4444", color:"#fff", textAlign:"center", fontSize:11, fontFamily:font, fontWeight:600, zIndex:9998 }}>{lang==="ru"?"⚡ Нет подключения к интернету":"⚡ No internet connection"}</div>}

      {/* Cycle 25: Diff overlay — compact vs original */}
      {showDiff && (() => {
        const dp = pGet(showDiff);
        if (!dp || !dp.compact) return null;
        return <div onClick={()=>setShowDiff(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.8)", zIndex:9992, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div role="dialog" aria-modal="true" aria-label="Diff" onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:0, padding:"24px 28px", maxWidth:900, width:"100%", maxHeight:"90vh", overflowY:"auto", fontFamily:font }}>
            <div style={{ fontSize:16, fontWeight:800, marginBottom:16, color:c.text }}>{dp.icon} {t.r[dp.role]||dp.role} — {lang==="ru"?"Сравнение":"Diff"}</div>
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
            <button onClick={()=>setShowDiff(null)} style={{ marginTop:16, width:"100%", padding:"8px", fontSize:11, fontFamily:font, fontWeight:600, border:`1px solid ${c.brd}`, borderRadius:0, background:c.surf, color:c.text, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
          </div>
        </div>;
      })()}

      {/* Cycle 9: Glossary overlay */}
      {showGlossary && <div onClick={()=>setShowGlossary(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:9990, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label="Glossary" onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:0, padding:"24px 28px", maxWidth:480, width:"100%", maxHeight:"80vh", overflowY:"auto", fontFamily:font }}>
          <div style={{ marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${c.brd}` }}>
            <div className="label-tech-sm" style={{ color:c.mut, marginBottom:6 }}>§ Reference</div>
            <div className="display-serif" style={{ fontSize:28, fontWeight:400, color:c.ink, lineHeight:1, letterSpacing:"-.5px", fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>{lang==="ru"?"Глоссарий":"Glossary"}</div>
          </div>
          {[
            ["АНТИ-ЛУП",lang==="ru"?"Защита от зацикливания: 3 похожих действия = смена подхода":"Loop protection: 3 similar actions = change approach"],
            ["АНТИ-ГАЛЛЮЦИНАЦИЯ",lang==="ru"?"Правило: прочитай файл перед изменением, не придумывай API":"Rule: read file before changing, don't invent APIs"],
            ["Worktree",lang==="ru"?"Git worktree — изолированная копия репозитория для параллельной работы":"Git worktree — isolated repo copy for parallel work"],
            ["Compact mode",lang==="ru"?"Сокращённые промты (~700 символов) для экономии контекста":"Shortened prompts (~700 chars) to save context window"],
            ["КРИТИЧНО",lang==="ru"?"Наивысший приоритет: баги, security, crashes":"Highest priority: bugs, security, crashes"],
            ["Story Points",lang==="ru"?"Оценка сложности: 1=5мин, 2=15мин, 3=30мин, 5=1ч":"Complexity estimate: 1=5min, 2=15min, 3=30min, 5=1hr"],
            ["♾️ Бесконечный",lang==="ru"?"Агент который не останавливается — самогенерирует задачи":"Agent that never stops — self-generates tasks"],
          ].map(([term,desc])=><div key={term} style={{ padding:"8px 0", borderBottom:`1px solid ${c.brd}` }}>
            <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", fontWeight:700, color:"#e86a2a", fontFamily:font }}>{term}</div>
            <div style={{ fontSize:10, color:c.mut, marginTop:2 }}>{desc}</div>
          </div>)}
          <button onClick={()=>setShowGlossary(false)} style={{ marginTop:16, width:"100%", padding:"8px", fontSize:11, fontFamily:font, fontWeight:600, border:`1px solid ${c.brd}`, borderRadius:0, background:c.surf, color:c.text, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
        </div>
      </div>}

      {/* Feat 4: Keyboard shortcuts overlay */}
      {showShortcuts && <div onClick={()=>setShowShortcuts(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:9990, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label={lang==="ru"?"Горячие клавиши":"Keyboard Shortcuts"} onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:0, padding:"24px 32px", maxWidth:420, width:"100%", fontFamily:font }}>
          <div style={{ marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${c.brd}` }}>
            <div className="label-tech-sm" style={{ color:c.mut, marginBottom:6 }}>⌨ Keyboard</div>
            <div className="display-serif" style={{ fontSize:28, fontWeight:400, color:c.ink, lineHeight:1, letterSpacing:"-.5px", fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>{lang==="ru"?"Горячие клавиши":"Shortcuts"}</div>
          </div>
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
          <button onClick={()=>setShowShortcuts(false)} style={{ marginTop:16, width:"100%", padding:"8px", fontSize:11, fontFamily:font, fontWeight:600, border:`1px solid ${c.brd}`, borderRadius:0, background:c.surf, color:c.text, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
        </div>
      </div>}

      {/* Feat 18: Focus mode */}
      {focusPrompt && <div onClick={()=>setFocusPrompt(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.85)", zIndex:9991, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label="Focus mode" onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${focusPrompt.ac}40`, borderRadius:0, padding:"24px 28px", maxWidth:720, width:"100%", maxHeight:"90vh", overflowY:"auto", fontFamily:font }}>
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
              <button onClick={()=>setFocusPrompt(null)} style={{ width:32, height:32, borderRadius:0, border:`1px solid ${c.brd}`, background:"transparent", color:c.mut, cursor:"pointer", fontSize:16, outline:"none" }}>×</button>
            </div>
          </div>
          <pre style={{ fontSize:11, lineHeight:1.7, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, fontFamily:font, padding:16, background:c.surf, borderRadius:0, border:`1px solid ${c.brd}` }}>{focusPrompt.text}</pre>
        </div>
      </div>}

      {/* Feat 24: Stats modal */}
      {showStats && <div onClick={()=>setShowStats(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:9990, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div role="dialog" aria-modal="true" aria-label={lang==="ru"?"Статистика":"Statistics"} onClick={e=>e.stopPropagation()} style={{ background:c.card, border:`1px solid ${c.brd}`, borderRadius:0, padding:"24px 28px", maxWidth:500, width:"100%", fontFamily:font }}>
          <div style={{ marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${c.brd}` }}>
            <div className="label-tech-sm" style={{ color:c.mut, marginBottom:6 }}>◈ Index</div>
            <div className="display-serif" style={{ fontSize:28, fontWeight:400, color:c.ink, lineHeight:1, letterSpacing:"-.5px", fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>{lang==="ru"?"Статистика":"Statistics"}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {[
              [stats.total, lang==="ru"?"Промтов":"Prompts", "#e86a2a"],
              [stats.models, lang==="ru"?"Моделей":"Models", "#f97316"],
              [stats.roles, lang==="ru"?"Ролей":"Roles", "#c4541d"],
              [`~${stats.totalHours}h`, lang==="ru"?"Время":"Time", "#06b6d4"],
              [`~${(stats.totalTokens/1000).toFixed(0)}K`, "Tokens", "#10b981"],
              [copyCount, lang==="ru"?"Скопировано":"Copied", "#eab308"],
              [usedCount, lang==="ru"?"Использовано":"Used", "#10b981"],
              [favCount, lang==="ru"?"Избранных":"Favorites", "#eab308"],
            ].map(([v,l,cl])=><div key={l} style={{ padding:"14px 12px 10px", borderRadius:0, background:"transparent", border:`1px solid ${c.brd}`, textAlign:"left" }}><div className="display-serif" style={{ fontSize:32, fontWeight:300, color:cl, lineHeight:.9, letterSpacing:"-1px", fontVariationSettings:"'SOFT' 30,'opsz' 144" }}>{v}</div><div className="label-tech-sm" style={{ color:c.mut, marginTop:6 }}>{l}</div></div>)}
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
              {(() => { const tc = {}; P.forEach(p=>(p.tags||[]).forEach(tg=>{tc[tg]=(tc[tg]||0)+1})); return Object.entries(tc).sort((a,b)=>b[1]-a[1]).slice(0,15).map(([tg,n])=><span key={tg} style={{ fontSize:Math.max(8,Math.min(12,7+n/3)), padding:"2px 6px", borderRadius:0, background:"#e86a2a10", color:"#e86a2a", border:"1px solid #e86a2a20", cursor:"pointer", fontFamily:font }} onClick={()=>{setFm("tag");setFv(tg);setSection("prompts");setShowStats(false)}}>{tg} <span style={{fontSize:8,color:c.dim}}>{n}</span></span>); })()}
            </div>
          </div>
          {/* Cycle 26: Most copied prompts */}
          {Object.keys(copyCounters).length > 0 && <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:600, color:c.mut, marginBottom:6 }}>{lang==="ru"?"Часто копируемые":"Most copied"}</div>
            {Object.entries(copyCounters).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([pid,n])=>{const pp=pGet(pid);return pp?<div key={pid} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"3px 0", fontSize:10 }}><span style={{ color:pp.ac }}>{pp.icon} {t.r[pp.role]||pp.role}</span><span style={{ color:c.dim }}>×{n}</span></div>:null})}
          </div>}
          {(() => { try { const used = localStorage.getItem("aiagent-hub-settings"); return used ? <div className="label-tech-sm" style={{ color:c.dim, marginTop:10 }}>⇩ localStorage · {(used.length/1024).toFixed(1)} KB</div> : null; } catch { return null; } })()}
          <button onClick={()=>setShowStats(false)} style={{ marginTop:12, width:"100%", padding:"8px", fontSize:11, fontFamily:font, fontWeight:600, border:`1px solid ${c.brd}`, borderRadius:0, background:c.surf, color:c.text, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
        </div>
      </div>}

      {/* Feat 17: Copy history sidebar */}
      {showCopyHistory && <div onClick={()=>setShowCopyHistory(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:9989 }}>
        <div onClick={e=>e.stopPropagation()} style={{ position:"fixed", right:0, top:0, bottom:0, width:280, background:c.card, borderLeft:`1px solid ${c.brd}`, padding:"20px 16px", fontFamily:font, overflowY:"auto" }}>
          <div style={{ marginBottom:18, paddingBottom:10, borderBottom:`1px solid ${c.brd}` }}>
            <div className="label-tech-sm" style={{ color:c.mut, marginBottom:6 }}>≣ Log</div>
            <div className="display-serif" style={{ fontSize:22, fontWeight:400, color:c.ink, lineHeight:1.1, letterSpacing:"-.3px" }}>{lang==="ru"?"История копирования":"Copy History"}</div>
          </div>
          {copyHistory.length===0 && <div style={{ fontSize:11, color:c.dim }}>{lang==="ru"?"Ещё ничего не скопировано":"Nothing copied yet"}</div>}
          {copyHistory.map((h,i)=><div key={i} style={{ padding:"8px 10px", borderRadius:0, border:`1px solid ${c.brd}`, marginBottom:6, background:c.surf }}>
            <div style={{ fontSize:11, fontWeight:600, color:c.text }}>{h.icon} {h.name}</div>
            <div style={{ fontSize:9, color:c.dim, marginTop:2 }}>{h.time}</div>
          </div>)}
          <button onClick={()=>setShowCopyHistory(false)} style={{ marginTop:12, width:"100%", padding:"8px", fontSize:11, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
        </div>
      </div>}

      {/* Skip link (task 100) */}
      <a href="#main-content" className="skip-link">{lang==="ru"?"К содержимому":"Skip to content"}</a>
      
      {/* Grain texture */}
      <div className="grain" />
      {/* Warm glow */}
      <div style={{ position:"fixed", top:-40, left:"50%", transform:"translateX(-50%)", width:720, height:340, background:`radial-gradient(ellipse, ${c.glow} 0%, transparent 65%)`, pointerEvents:"none", zIndex:0 }} />

      <div id="main-content" style={{ maxWidth:880, margin:"0 auto", padding:"32px 20px 80px", position:"relative", zIndex:1 }}>

        {/* ══════════════════ EDITORIAL MASTHEAD ══════════════════ */}
        <header style={{ position:"relative", paddingTop:32, paddingBottom:28, marginBottom:36, color:c.text }}>
          {/* Double-rule top */}
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6 }} />
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6, marginTop:2 }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0" }}>
            <span className="label-tech-sm" style={{ color:c.mut }}>№ v9.1 · {new Date().toLocaleDateString(lang==="ru"?"ru-RU":"en-US",{month:"short",year:"numeric"}).toUpperCase()}</span>
            <span className="label-tech-sm" style={{ color:c.mut }}>An Almanac of Autonomous Development</span>
          </div>
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6 }} />
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6, marginTop:2 }} />

          {/* Main heading row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:32, alignItems:"end", padding:"32px 0 8px" }} className="stack-mobile">
            <div className="full-mobile">
              <h1 className="display-serif masthead-title" style={{ fontSize:64, lineHeight:.95, letterSpacing:"-2.5px", fontWeight:400, margin:0, color:c.ink, fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>
                <span style={{ color:c.accent, fontStyle:"italic", fontWeight:300 }}>AI</span>Agent<span style={{ color:c.mut }}>·</span>Hub
              </h1>
              <p className="display-serif display-italic" style={{ fontSize:17, lineHeight:1.55, color:c.mut, marginTop:14, maxWidth:460, fontWeight:300, fontStyle:"italic" }}>
                {lang==="ru" ? "Полевой справочник автономной разработки c Claude Code — промты, комбо, шпаргалки." : lang==="kk" ? "Claude Code көмегімен автономды әзірлеудің далалық нұсқаулығы." : "A field guide to autonomous development with Claude Code — prompts, combos, cheat sheets."}
              </p>
            </div>
            {/* Statistical display */}
            <div style={{ textAlign:"right", minWidth:130 }} className="full-mobile">
              <div className="display-serif masthead-stat-num" style={{ fontSize:88, lineHeight:.85, fontWeight:300, letterSpacing:"-4px", color:c.accent, fontVariationSettings:"'SOFT' 30,'opsz' 144" }}>
                {stats.total}
              </div>
              <div className="label-tech" style={{ color:c.mut, marginTop:10 }}>{lang==="ru"?"промтов":"prompts"}</div>
              <div className="label-tech-sm" style={{ color:c.dim, marginTop:8 }}>~{Math.round(stats.totalTokens/1000)}K tok · {stats.roles} roles{usedCount>0?` · ✓${usedCount}`:""}</div>
            </div>
          </div>

          {/* Double-rule bottom */}
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6, marginTop:8 }} />
          <div style={{ borderTop:`1px solid ${c.text}`, opacity:.6, marginTop:2 }} />

          {/* Control row */}
          <div style={{ display:"flex", justifyContent:"flex-end", gap:0, marginTop:14, flexWrap:"wrap" }}>
            <button onClick={()=>setShowStats(true)} aria-label="Stats" title={lang==="ru"?"Статистика":"Statistics"} className="icon-btn" style={{ borderColor:c.brd, color:c.text, borderRightWidth:0 }}>◈</button>
            <button onClick={()=>setShowCopyHistory(true)} aria-label="Copy history" title={lang==="ru"?"История":"History"} className="icon-btn" style={{ borderColor:c.brd, color:c.text, borderRightWidth:0, position:"relative" }}>≣{copyCount>0 && <span style={{ position:"absolute", top:-1, right:-1, background:c.accent, color:c.bg, fontSize:8, fontWeight:700, padding:"0 4px", minWidth:13, textAlign:"center", fontFamily:font }}>{copyCount}</span>}</button>
            <button onClick={()=>setShowGlossary(true)} aria-label="Glossary" title={lang==="ru"?"Глоссарий":"Glossary"} className="icon-btn" style={{ borderColor:c.brd, color:c.text, borderRightWidth:0 }}>¶</button>
            <button onClick={()=>setShowShortcuts(true)} aria-label="Shortcuts" title={lang==="ru"?"Горячие клавиши":"Shortcuts"} className="icon-btn" style={{ borderColor:c.brd, color:c.text, borderRightWidth:0, position:"relative" }}>⌨<span style={{ position:"absolute", bottom:-1, right:2, fontSize:7, color:c.dim, fontFamily:font, fontWeight:700 }}>?</span></button>
            <button onClick={()=>setTheme(theme==="dark"?"light":"dark")} aria-label={theme==="dark"?"Светлая тема":"Тёмная тема"} title={`${theme==="dark"?"Light":"Dark"} (T)`} className="icon-btn" style={{ borderColor:c.brd, color:c.text, borderRightWidth:0, fontSize:15 }}>{theme==="dark"?"☾":"☀"}</button>
            <button onClick={nextLang} aria-label={`Switch language`} className="icon-btn" style={{ borderColor:c.brd, color:c.text, width:"auto", padding:"0 14px", fontSize:10, fontWeight:700, letterSpacing:2, borderRightWidth:0 }}>{langLabel}</button>
            <select value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} aria-label="Font size" className="hide-mobile" style={{ height:36, padding:"0 8px", border:`1px solid ${c.brd}`, background:"transparent", color:c.text, cursor:"pointer", fontSize:10, fontFamily:font, outline:"none", WebkitAppearance:"none", MozAppearance:"none", appearance:"none", textAlign:"center", width:36 }}>
              <option value={85}>A-</option>
              <option value={100}>A</option>
              <option value={115}>A+</option>
            </select>
          </div>
        </header>

        {/* Feat 16: Welcome banner — editorial style */}
        {isFirstVisit && <div style={{ marginBottom:24, padding:"20px 24px", border:`1px solid ${c.accent}40`, borderLeft:`3px solid ${c.accent}`, background:`${c.accent}06`, position:"relative" }}>
          <button onClick={()=>setIsFirstVisit(false)} aria-label="Close" style={{ position:"absolute", top:10, right:14, background:"none", border:"none", color:c.mut, cursor:"pointer", fontSize:18, outline:"none", fontFamily:font }}>×</button>
          <div className="label-tech-sm" style={{ color:c.accent, marginBottom:10 }}>Ed. Note · {lang==="ru"?"Добро пожаловать":"Welcome"}</div>
          <div className="display-serif" style={{ fontSize:20, fontWeight:400, color:c.ink, marginBottom:10, lineHeight:1.25, fontVariationSettings:"'SOFT' 50,'opsz' 144" }}>
            {lang==="ru"?"Полевой справочник":"A Field Guide"}
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
            <span className="label-tech-sm" style={{ color:c.dim }}>{lang==="ru"?"ролей":"roles"}</span>
            <span style={{ fontSize:16, fontWeight:400, color:c.text, fontFamily:fontDisplay }}>{stats.roles}</span>
          </div>
        </div>

        {/* ══════════════ EDITORIAL TAB BAR ══════════════ */}
        <nav role="tablist" aria-label="Sections" style={{ display:"flex", gap:28, marginBottom:28, overflowX:"auto", borderBottom:`1px solid ${c.brd}`, paddingBottom:0 }}>
          {[
            { k:"prompts", l:lang==="ru"?"Промты":"Prompts", n:P.length },
            { k:"combos", l:lang==="ru"?"Комбо":"Combos", n:(COMBOS[lang]||COMBOS.ru).length },
            { k:"cheat", l:lang==="ru"?"Шпаргалки":"Cheat", n:Object.keys(CHEAT).length },
            { k:"quick", l:"CLI", n:(QUICK_CMDS[lang]||QUICK_CMDS.ru||[]).reduce((a,c)=>a+(c.cmds||[]).length,0) },
            { k:"setup", l:lang==="ru"?"Настройка":"Setup", n:CONFIGS.length },
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
          <span style={{ color:c.text, fontWeight:600 }}>{section==="prompts"?(lang==="ru"?"Промты":"Prompts"):section==="combos"?(lang==="ru"?"Команды":"Teams"):section==="cheat"?(lang==="ru"?"Шпаргалки":"Cheat"):section==="quick"?"CLI":(lang==="ru"?"Настройка":"Setup")}</span>
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
            {search && <button onClick={()=>setSearch("")} aria-label="Очистить поиск" style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:c.mut, cursor:"pointer", fontSize:16, padding:4, lineHeight:1, outline:"none" }}>×</button>}
          </div>

          {/* Filters */}
          <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
            {[{k:"all",l:t.all},{k:"category",l:lang==="ru"?"Категории":"Categories"},{k:"model",l:t.byModel},{k:"role",l:t.byRole},{k:"type",l:t.byType},{k:"difficulty",l:lang==="ru"?"Сложность":"Difficulty"},{k:"time",l:lang==="ru"?"Время":"Time"},{k:"tag",l:lang==="ru"?"Теги":"Tags"}].map(f =>
              <Pill key={f.k} on={fm===f.k} fn={()=>{setFm(f.k);setFv("all");}} lb={f.l} c={c} />
            )}
            {hasFilters && <button onClick={clearFilters} style={{ padding:"6px 2px", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:600, border:0, borderBottom:`1.5px solid #ef4444`, background:"transparent", color:"#ef4444", cursor:"pointer", outline:"none", marginRight:12 }}>✕ {lang==="ru"?"Сброс":"Reset"}</button>}
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
            {Object.entries(categories.counts).map(([cat,n]) => <button key={cat} onClick={()=>setFv(cat)} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", fontSize:10, fontFamily:font, fontWeight:fv===cat?700:400, border:`1px solid ${fv===cat?(CAT_COLORS[cat]||"#e86a2a")+"60":c.brd}`, borderRadius:0, background:fv===cat?(CAT_COLORS[cat]||"#e86a2a")+"12":"transparent", color:fv===cat?(CAT_COLORS[cat]||"#e86a2a"):c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}><span>{CAT_ICONS[cat]||""}</span> {cat} <span style={{fontSize:8,opacity:.6}}>{n}</span></button>)}
          </div>}
          {fm==="time" && <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
            <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
            <Pill on={fv==="<1h"} fn={()=>setFv("<1h")} lb="< 1h" cl="#10b981" c={c} />
            <Pill on={fv==="1-2h"} fn={()=>setFv("1-2h")} lb="1-2h" cl="#f59e0b" c={c} />
            <Pill on={fv===">2h"} fn={()=>setFv(">2h")} lb="> 2h" cl="#ef4444" c={c} />
          </div>}
          {fm==="tag" && <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
            <Pill on={fv==="all"} fn={()=>setFv("all")} lb={t.all} c={c} />
            {allTags.map(tag => <Pill key={tag} on={fv===tag} fn={()=>setFv(tag)} lb={tag} cl="#e86a2a" c={c} />)}
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
            <button onClick={randomPrompt} title={lang==="ru"?"Случайный промпт":"Random prompt"} style={{ padding:"4px 10px", fontSize:9, letterSpacing:2, textTransform:"uppercase", fontWeight:600, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}>⟲ {lang==="ru"?"Случайный":"Random"}</button>
            {favCount > 0 && <button onClick={()=>setShowFavsOnly(!showFavsOnly)} aria-pressed={showFavsOnly} style={{
              padding:"4px 10px", fontSize:9, letterSpacing:1.5, fontFamily:font, fontWeight:showFavsOnly?700:500,
              border:`1px solid ${showFavsOnly?"#eab308":c.brd}`, borderRadius:0,
              background:showFavsOnly?"#eab30812":"transparent", color:showFavsOnly?"#eab308":c.mut,
              cursor:"pointer", outline:"none",
            }}>★ {favCount}</button>}
            {/* Sort (task 045) */}
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} aria-label={lang==="ru"?"Сортировка":"Sort"} style={{ padding:"3px 8px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>
              <option value="default">{lang==="ru"?"По умолчанию":"Default"}</option>
              <option value="name">{lang==="ru"?"По имени":"By name"}</option>
              <option value="length">{lang==="ru"?"По длине":"By length"}</option>
              <option value="time">{lang==="ru"?"По времени":"By time"}</option>
              <option value="model">{lang==="ru"?"По модели":"By model"}</option>
            </select>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
            {/* Task 74: Quick copy mode */}
            <button onClick={()=>setQuickCopy(!quickCopy)} aria-pressed={quickCopy} title={lang==="ru"?"Быстрое копирование: клик = copy":"Quick copy: click = copy"} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, fontWeight:700, border:`1px solid ${quickCopy?"#06b6d4":c.brd}`, borderRadius:0, background:quickCopy?"#06b6d412":"transparent", color:quickCopy?"#06b6d4":c.mut, cursor:"pointer", outline:"none" }}>⌁</button>
            {/* Task 69: Compare mode */}
            <button onClick={()=>{setCompareMode(!compareMode);if(compareMode)setCompareIds([]);}} aria-pressed={compareMode} title={lang==="ru"?"Выбрать промты (сравнение/экспорт)":"Select prompts (compare/export)"} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, fontWeight:700, border:`1px solid ${compareMode?"#c4541d":c.brd}`, borderRadius:0, background:compareMode?"#c4541d12":"transparent", color:compareMode?"#c4541d":c.mut, cursor:"pointer", outline:"none" }}>{compareMode ? `▦ ${compareIds.length}` : "▦"}</button>
            {/* Random (task 047) */}
            <button onClick={() => {
              const r = P[Math.floor(Math.random()*P.length)];
              setExpanded(e=>({...e,[r.id]:true}));
              setFm("all"); setFv("all"); setSearch(""); setShowFavsOnly(false);
              setTimeout(()=>{document.getElementById(`card-${r.id}`)?.scrollIntoView({behavior:"smooth",block:"center"})},100);
            }} aria-label={lang==="ru"?"Случайный промт":"Random"} style={{ padding:"4px 12px", fontSize:11, fontFamily:font, fontWeight:700, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>⟲</button>
            {list.length > 0 && hasFilters && <button onClick={() => {
              const allText = list.map(p => `═══ ${(t.r[p.role]||p.role).toUpperCase()} (${p.m}) ═══\n\n${compactMode && p.compact ? p.compact : p.text}`).join('\n\n\n');
              cp("copy-filtered", allText, true);
            }} style={{ padding:"3px 10px", fontSize:10, fontFamily:font, fontWeight:600, border:`1px solid ${copied==="copy-filtered"?"#10b981":c.brd}`, borderRadius:0, background:copied==="copy-filtered"?"#10b98112":"transparent", color:copied==="copy-filtered"?"#10b981":c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}>
              {copied==="copy-filtered" ? t.copied : t.copyFiltered} ({list.length})
            </button>}
            <button onClick={toggleAll} style={{ fontSize:10, fontFamily:font, color:c.mut, background:"none", border:"none", cursor:"pointer", padding:"4px 8px", outline:"none" }}>{allExpanded ? t.collapseAll : t.expandAll}</button>
            {/* Feat 26: View mode toggle */}
            <div style={{ display:"flex", border:`1px solid ${c.brd}`, borderRadius:0, overflow:"hidden" }}>
              {[{k:"card",l:"▤",t:lang==="ru"?"Карточки":"Cards"},{k:"table",l:"≡",t:lang==="ru"?"Таблица":"Table"}].map(v=><button key={v.k} onClick={()=>setViewMode(v.k)} title={v.t} style={{ padding:"4px 10px", fontSize:12, fontWeight:700, background:viewMode===v.k?c.accent+"15":"transparent", color:viewMode===v.k?c.accent:c.dim, border:"none", cursor:"pointer", fontFamily:font, outline:"none" }}>{v.l}</button>)}
            </div>
          </div>
        </div>

        {/* Task 69: Compare panel */}
        {compareMode && compareIds.length >= 2 && (
          <div style={{ marginBottom:12, padding:12, borderRadius:0, border:`2px solid #c4541d40`, background:"#c4541d08" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#c4541d", marginBottom:8 }}>{lang==="ru"?"Сравнение":"Compare"} ({compareIds.length})</div>
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
                {copied==="bulk-export"?t.copied:(lang==="ru"?"Скопировать все":"Copy all")} ({compareIds.length})
              </button>
              <button onClick={()=>setCompareIds(list.map(p=>p.id))} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Выбрать все":"Select all"}</button>
              <button onClick={()=>setCompareIds([])} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Снять все":"Deselect"}</button>
              <button onClick={()=>{setCompareIds([]);setCompareMode(false)}} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
            </div>
          </div>
        )}

        {/* Task 78: Prompt of the day */}
        {!hasFilters && !showFavsOnly && potd && (
          <div style={{ marginBottom:12, padding:"10px 14px", borderRadius:0, border:`1px solid ${potd.ac}30`, background:`linear-gradient(135deg, ${potd.ac}06, ${potd.ac}02)` }}>
            <div style={{ fontSize:9, fontWeight:700, color:potd.ac, letterSpacing:4, textTransform:"uppercase", marginBottom:4, fontFamily:font }}>⊛ {lang==="ru"?"Промт дня":"Prompt of the day"}</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"space-between" }}>
              <div style={{ fontSize:11, fontWeight:600, color:c.text }}>{potd.icon} {t.r[potd.role]||potd.role} <span style={{ fontSize:9, color:c.mut, fontWeight:400 }}>({ML[potd.mk]})</span></div>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={()=>{setExpanded(e=>({...e,[potd.id]:true}));setTimeout(()=>document.getElementById("card-"+potd.id)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, fontWeight:600, border:`1px solid ${potd.ac}40`, borderRadius:0, background:"transparent", color:potd.ac, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Открыть":"Open"}</button>
                <button onClick={()=>cp(potd.id,potd.text)} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, fontWeight:600, border:`1px solid ${potd.ac}`, borderRadius:0, background:potd.ac, color:c.bg, cursor:"pointer", outline:"none" }}>{copied===potd.id?t.copied:t.copy}</button>
              </div>
            </div>
          </div>
        )}

        {/* Task 66: Prompt Constructor */}
        {showConstructor && (
          <div style={{ marginBottom:16, padding:"16px 18px", borderRadius:0, border:`2px solid #e86a2a40`, background:"#e86a2a06" }}>
            <div style={{ fontSize:10, letterSpacing:4, textTransform:"uppercase", fontWeight:700, color:"#e86a2a", marginBottom:12, fontFamily:font }}>✎ {lang==="ru"?"Конструктор промта":"Prompt Constructor"}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }} className="stack-mobile">
              <div>
                <div style={{ fontSize:10, fontWeight:600, color:c.text, marginBottom:6 }}>{lang==="ru"?"Роль":"Role"}</div>
                <select value={constructorRole} onChange={e=>setConstructorRole(e.target.value)} style={{ width:"100%", padding:"6px 10px", fontSize:11, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.text, outline:"none" }}>
                  <option value="">{lang==="ru"?"Выбери роль...":"Choose role..."}</option>
                  {["frontend","backend","fullstack","tester","designer","devops","reviewer"].map(r => (
                    <option key={r} value={r}>{t.r[r]||r}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:600, color:c.text, marginBottom:6 }}>{lang==="ru"?"Стек":"Stack"}</div>
                <select value={constructorStack} onChange={e=>setConstructorStack(e.target.value)} style={{ width:"100%", padding:"6px 10px", fontSize:11, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.text, outline:"none" }}>
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
                  {copied==="constructor" ? t.copied : (lang==="ru"?"Сгенерировать и скопировать":"Generate & Copy")}
                </button>
              </div>
            )}
            <button onClick={()=>setShowConstructor(false)} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
          </div>
        )}

        {/* Task 76: Import Custom Prompt */}
        {showImport && (
          <div style={{ marginBottom:16, padding:"16px 18px", borderRadius:0, border:`2px dashed ${c.brd}`, background:c.bg2 }}>
            <div style={{ fontSize:12, fontWeight:700, color:c.text, marginBottom:8 }}>📥 {lang==="ru"?"Импорт промта":"Import Prompt"}</div>
            <textarea value={importText} onChange={e=>setImportText(e.target.value)} placeholder={lang==="ru"?"Вставь текст промта здесь...":"Paste prompt text here..."} style={{ width:"100%", height:120, padding:12, fontSize:11, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.text, outline:"none", resize:"vertical", boxSizing:"border-box" }} />
            {importText.trim().length > 50 && (
              <div style={{ marginTop:8, display:"flex", gap:8 }}>
                <button onClick={()=>{cp("imported", importText); setToast(lang==="ru"?"Промт скопирован":"Prompt copied"); setShowImport(false); setImportText("");}} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, fontWeight:600, border:"1.5px solid #10b981", borderRadius:0, background:"#10b981", color:"#fff", cursor:"pointer", outline:"none" }}>{lang==="ru"?"Скопировать":"Copy"} ({Math.round(importText.length/4)} tokens)</button>
              </div>
            )}
            <button onClick={()=>{setShowImport(false);setImportText("")}} style={{ marginTop:8, padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Закрыть":"Close"}</button>
          </div>
        )}

        {/* Task 66,76: Constructor & Import buttons + Task 58,93,94: Stack & PromptLang */}
        {!showConstructor && !showImport && (
          <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
            <button onClick={()=>setShowConstructor(true)} style={{ padding:"5px 14px", fontSize:9, letterSpacing:2, textTransform:"uppercase", fontWeight:700, fontFamily:font, border:`1px dashed #e86a2a60`, borderRadius:0, background:"transparent", color:"#e86a2a", cursor:"pointer", outline:"none" }}>✎ {lang==="ru"?"Конструктор":lang==="kk"?"Конструктор":"Constructor"}</button>
            <button onClick={()=>setShowImport(true)} style={{ padding:"4px 12px", fontSize:10, fontFamily:font, border:`1px dashed ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>📥 {lang==="ru"?"Импорт":lang==="kk"?"Импорт":"Import"}</button>
            <div style={{ width:1, height:16, background:c.brd, margin:"0 2px" }} className="hide-mobile" />
            {/* Task 93+94: Prompt language */}
            <select value={promptLang} onChange={e=>setPromptLang(e.target.value)} aria-label="Prompt language" style={{ padding:"3px 8px", fontSize:9, fontFamily:font, border:`1px solid ${promptLang!=="original"?"#f97316":c.brd}`, borderRadius:0, background:promptLang!=="original"?"#f9731608":c.card, color:promptLang!=="original"?"#f97316":c.mut, cursor:"pointer", outline:"none" }}>
              <option value="original">🌐 Original</option>
              <option value="en">🇬🇧 English output</option>
            </select>
            {/* Compact mode for Claude Code */}
            <button onClick={()=>setCompactMode(!compactMode)} aria-pressed={compactMode} title={lang==="ru"?"Компактные промты для Claude Code (~700 символов)":"Compact prompts for Claude Code (~700 chars)"} style={{ padding:"3px 10px", fontSize:9, fontFamily:font, border:`1px solid ${compactMode?"#10b981":c.brd}`, borderRadius:0, background:compactMode?"#10b98110":"transparent", color:compactMode?"#10b981":c.mut, cursor:"pointer", outline:"none", fontWeight:compactMode?700:400 }}>
              {compactMode ? "⇣ Compact" : "≡ Full"}
            </button>
            {/* Task 58: Stack override */}
            <select value={stackOverride} onChange={e=>setStackOverride(e.target.value)} aria-label="Stack override" style={{ padding:"3px 8px", fontSize:9, fontFamily:font, border:`1px solid ${stackOverride?"#c4541d":c.brd}`, borderRadius:0, background:stackOverride?"#c4541d08":c.card, color:stackOverride?"#c4541d":c.mut, cursor:"pointer", outline:"none" }}>
              <option value="">◎ {lang==="ru"?"Стек":"Stack"}: Auto</option>
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
          const preview = p.text.split("\n").slice(0, 2).join(" ").slice(0, 100);
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
                <div onClick={()=>toggle(p.id)} style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0, cursor:"pointer" }} role="button" aria-expanded={isO} aria-controls={`body-${p.id}`}>
                  <div style={{ width:32, height:32, borderRadius:0, background:"transparent", border:0, borderRight:`1px solid ${c.brd}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, paddingRight:10 }}>{p.icon}</div>
                  <div style={{ minWidth:0, flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:p.ac }}>{debouncedSearch ? <HL text={t.r[p.role]||p.role} q={debouncedSearch} color={p.ac}/> : (t.r[p.role]||p.role)}</span>
                      <span style={{ fontSize:8, letterSpacing:1.5, textTransform:"uppercase", color:MC[p.mk], fontWeight:700, fontFamily:font }}>{ML[p.mk]}</span>
                      {p.type==="task" && <span style={{ fontSize:8, letterSpacing:1.5, textTransform:"uppercase", color:"#ef4444", fontWeight:700, fontFamily:font }}>· {lang==="ru"?"задача":"task"}</span>}
                      {p.difficulty && <span style={{ fontSize:8, letterSpacing:1.5, textTransform:"uppercase", color:diffColors[p.difficulty], fontWeight:600, fontFamily:font }} className="hide-mobile">· {p.difficulty}</span>}
                      {p.v==="7.1" && <span style={{ fontSize:8, letterSpacing:1.5, textTransform:"uppercase", color:"#10b981", fontWeight:700, fontFamily:font }}>· new</span>}
                      {p.time && <span style={{ fontSize:8, letterSpacing:1.5, color:c.dim, fontFamily:font }} className="hide-mobile">· {p.time}</span>}
                    </div>
                    {!isO && <div style={{ fontSize:10, color:c.dim, marginTop:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{preview}...</div>}
                    {isO && <div style={{ fontSize:10, color:c.mut, marginTop:3 }}>{compactMode ? (p.compact||"").split("\n").length : ln} {t.lines} · {(compactMode ? (p.compact||"") : p.text).split(/\s+/).length} {lang==="ru"?"слов":"words"} · ~{Math.ceil((compactMode ? (p.compact||"").length : p.text.length)/4)} tokens {compactMode && <span style={{color:"#10b981",fontWeight:600}}>⚡</span>}</div>}
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0, alignItems:"center" }}>
                  {/* Task 75: Used indicator */}
                  {/* Feat 18: Focus mode button */}
                  <button onClick={(e)=>{e.stopPropagation();setFocusPrompt(p)}} aria-label="Focus" title={lang==="ru"?"Focus mode (F)":"Focus mode (F)"} className="hide-mobile" style={{ width:28, height:28, borderRadius:0, border:`1px solid ${c.brd}`, background:"transparent", color:c.dim, cursor:"pointer", outline:"none", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>⛶</button>
                  {copyCounters[p.id] > 0 && <span style={{ fontSize:8, color:c.dim, fontWeight:600 }} title={lang==="ru"?`Скопировано ${copyCounters[p.id]}x`:`Copied ${copyCounters[p.id]}x`}>×{copyCounters[p.id]}</span>}
                  {isUsed && <span style={{ fontSize:10, color:"#10b981" }} title={lang==="ru"?"Использован":"Used"}>✓</span>}
                  {/* Task 69: Compare checkbox */}
                  {compareMode && <button onClick={(e)=>{e.stopPropagation();setCompareIds(ids=>ids.includes(p.id)?ids.filter(x=>x!==p.id):[...ids,p.id])}} style={{ width:24, height:24, borderRadius:0, border:`1px solid ${compareIds.includes(p.id)?"#c4541d":c.brd}`, background:compareIds.includes(p.id)?"#c4541d":"transparent", color:compareIds.includes(p.id)?"#fff":c.dim, cursor:"pointer", outline:"none", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center" }}>{compareIds.includes(p.id)?"✓":""}</button>}
                  <button onClick={(e)=>{e.stopPropagation();setPinnedIds(ids=>ids.includes(p.id)?ids.filter(x=>x!==p.id):[...ids,p.id])}} aria-label="Pin" title={lang==="ru"?"Закрепить наверху":"Pin to top"} className="hide-mobile" style={{ width:28, height:28, borderRadius:0, border:`1px solid ${pinnedIds.includes(p.id)?"#e86a2a40":c.brd}`, background:pinnedIds.includes(p.id)?"#e86a2a12":"transparent", color:pinnedIds.includes(p.id)?"#e86a2a":c.dim, cursor:"pointer", outline:"none", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>{pinnedIds.includes(p.id)?"◆":"◇"}</button>
                  <button onClick={(e)=>{e.stopPropagation();toggleFav(p.id)}} aria-label={favs[p.id]?(lang==="ru"?"Убрать":lang==="kk"?"Алып тастау":"Remove"):(lang==="ru"?"Избранное":lang==="kk"?"Таңдаулы":"Favorite")} aria-pressed={!!favs[p.id]} style={{ width:28, height:28, borderRadius:0, border:`1px solid ${favs[p.id]?"#eab30840":c.brd}`, background:favs[p.id]?"#eab30812":"transparent", color:favs[p.id]?"#eab308":c.dim, cursor:"pointer", outline:"none", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>{favs[p.id]?"★":"☆"}</button>
                  <button onClick={(e)=>{e.stopPropagation();toggle(p.id)}} aria-expanded={isO} className="hide-mobile" style={{ padding:"4px 12px", fontSize:9, letterSpacing:2, textTransform:"uppercase", fontWeight:600, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}>{isO ? t.hide : t.show}</button>
                  <CBtn id={p.id} txt={compactMode && p.compact ? p.compact : p.text} cl={p.ac} sm copied={copied} cp={cp} t={t} bg={c.bg} />
                  {/* Cycle 6: Copy as markdown */}
                  {isO && <button onClick={(e)=>{e.stopPropagation();const md=`## ${p.icon} ${t.r[p.role]||p.role} (${p.m})\n\n\`\`\`\n${p.text}\n\`\`\`\n`;cp("md-"+p.id,md,true)}} title={lang==="ru"?"Копировать как Markdown":"Copy as Markdown"} className="hide-mobile" style={{ width:28, height:28, borderRadius:0, border:`1px solid ${copied===("md-"+p.id)?"#10b981":c.brd}`, background:copied===("md-"+p.id)?"#10b98112":"transparent", color:copied===("md-"+p.id)?"#10b981":c.dim, cursor:"pointer", outline:"none", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", fontFamily:font, fontWeight:700 }}>{copied===("md-"+p.id)?"✓":"MD"}</button>}
                  {isO && p.compact && <button onClick={(e)=>{e.stopPropagation();setShowDiff(p.id)}} title={lang==="ru"?"Сравнить original vs compact":"Diff original vs compact"} className="hide-mobile" style={{ width:28, height:28, borderRadius:0, border:`1px solid ${c.brd}`, background:"transparent", color:c.dim, cursor:"pointer", outline:"none", fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", fontFamily:font, fontWeight:700 }}>⇄</button>}
                  <button onClick={(e)=>{e.stopPropagation();const url=location.origin+location.pathname+`#prompt-${p.id}`;navigator.clipboard?.writeText(url);setCopied("share-"+p.id);setTimeout(()=>setCopied(null),2000)}} title={lang==="ru"?"Скопировать ссылку":"Copy link"} style={{ width:28, height:28, borderRadius:0, border:`1px solid ${copied===("share-"+p.id)?"#10b981":c.brd}`, background:copied===("share-"+p.id)?"#10b98112":"transparent", color:copied===("share-"+p.id)?"#10b981":c.dim, cursor:"pointer", outline:"none", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>{copied===("share-"+p.id)?"✓":"§"}</button>
                </div>
              </div>
              {/* Body (task 084: lazy render) */}
              {isO && (
                <div id={`body-${p.id}`} className="body-enter" style={{ padding:"0 16px 14px" }}>
                  <div style={{ maxHeight:420, overflowY:"auto", padding:16, background:c.surf, borderRadius:0, border:`1px solid ${c.brd}`, borderLeft:`2px solid ${p.ac}40` }}>
                    {compactMode && <div style={{ marginBottom:8, padding:"4px 10px", borderRadius:0, background:"#10b98110", border:"1px solid #10b98120", fontSize:9, color:"#10b981", fontWeight:600 }}>⚡ COMPACT MODE — {lang==="ru"?"оптимизировано для Claude Code (~700 символов)":"optimized for Claude Code (~700 chars)"}</div>}
                    <pre style={{ fontSize:10.5, lineHeight:1.65, color:c.mut, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, fontFamily:font }}>{debouncedSearch ? <HL text={compactMode && p.compact ? p.compact : p.text} q={debouncedSearch} color={p.ac}/> : (compactMode && p.compact ? p.compact : p.text)}</pre>
                  </div>
                  {/* Task 033: Related prompts */}
                  {p.related && p.related.length > 0 && (
                    <div style={{ marginTop:10, display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
                      <span style={{ fontSize:9, color:c.dim, marginRight:4 }}>{lang==="ru"?"Похожие:":"Related:"}</span>
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
                      <span style={{ fontSize:9, color:c.dim }}>⚙ {lang==="ru"?"Требуется:":"Requires:"}</span>
                      {p.prereqs.map(pr => <span key={pr} style={{ fontSize:8, padding:"1px 6px", borderRadius:0, background:c.surf, color:c.mut, border:`1px solid ${c.brd}` }}>{pr}</span>)}
                    </div>
                  )}
                  {/* Feat 22: Similar by tags (only if no related defined) */}
                  {(!p.related || p.related.length === 0) && p.tags && p.tags.length > 0 && (() => {
                    const similar = P.filter(x => x.id !== p.id && x.tags && x.tags.some(t2 => p.tags.includes(t2))).slice(0, 3);
                    return similar.length > 0 ? (
                      <div style={{ marginTop:6, display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
                        <span style={{ fontSize:9, color:c.dim, marginRight:4 }}>{lang==="ru"?"Похожие:":"Similar:"}</span>
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
            <div style={{ fontSize:9, color:c.dim, marginBottom:4, fontWeight:600 }}>{lang==="ru"?"Недавно просмотренные":"Recently viewed"}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {recentViewed.map(rid => { const rp = pGet(rid); return rp ? <button key={rid} onClick={()=>{setExpanded(e=>({...e,[rid]:true}));setTimeout(()=>document.getElementById("card-"+rid)?.scrollIntoView({behavior:"smooth",block:"center"}),100)}} style={{ fontSize:9, padding:"3px 8px", borderRadius:0, background:rp.ac+"10", color:rp.ac, border:`1px solid ${rp.ac}20`, cursor:"pointer", fontFamily:font, outline:"none" }}>{rp.icon} {t.r[rp.role]||rp.role}</button> : null; })}
            </div>
          </div>
        )}

        {list.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 0", color:c.dim, fontSize:12 }}>
            {lang==="ru" ? "Ничего не найдено" : "Nothing found"}
            {hasFilters && <div style={{marginTop:8}}><button onClick={clearFilters} style={{padding:"6px 16px",fontSize:11,fontFamily:font,border:`1px solid ${c.brd}`,borderRadius:0,background:c.card,color:c.text,cursor:"pointer",outline:"none"}}>{lang==="ru"?"Очистить фильтры":"Clear filters"}</button></div>}
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
          <summary style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"#c4541d", cursor:"pointer", padding:"10px 0", fontFamily:font }}>⇄ {lang==="ru"?"Конструктор workflow":"Workflow Builder"}</summary>
          <div style={{ marginTop:8, padding:"14px 16px", borderRadius:0, border:`2px solid #c4541d30`, background:"#c4541d06" }}>
            <div style={{ fontSize:10, color:c.dim, marginBottom:10 }}>{lang==="ru"?"Перетаскивай промты для создания последовательности выполнения:":"Drag prompts to create execution sequence:"}</div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:12 }}>
              {P.filter(p=>!workflow.includes(p.id)).slice(0,30).map(p => (
                <button key={p.id} onClick={()=>setWorkflow(w=>[...w,p.id])} style={{ fontSize:9, padding:"3px 8px", borderRadius:0, background:c.surf, color:p.ac, border:`1px solid ${p.ac}20`, cursor:"pointer", fontFamily:font, outline:"none" }}>{p.icon} {(t.r[p.role]||p.role).slice(0,12)}</button>
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
                    {copied==="workflow"?t.copied:(lang==="ru"?"Скопировать workflow":"Copy workflow")} ({workflow.length})
                  </button>
                  <button onClick={()=>setWorkflow([])} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Очистить":"Clear"}</button>
                </div>
              </div>
            )}
          </div>
        </details>
        
        {/* Task 114: Custom combo builder */}
        <div style={{ marginBottom:16, padding:"12px 16px", borderRadius:0, border:`1px dashed ${buildingCombo?'#e86a2a':c.brd}`, background:buildingCombo?'#e86a2a08':c.card }}>
          {!buildingCombo ? (
            <button onClick={()=>setBuildingCombo(true)} style={{ width:"100%", padding:"10px", fontSize:10, letterSpacing:3, textTransform:"uppercase", fontFamily:font, fontWeight:700, border:"none", background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>
              + {lang==="ru"?"Создать свою команду":"Build custom team"}
            </button>
          ) : (
            <div>
              <div style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", fontWeight:700, color:"#e86a2a", marginBottom:10, fontFamily:font }}>{lang==="ru"?"Выбери промты для команды":"Select prompts for team"}</div>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
                {P.filter(p=>p.type==="role"||customCombo.includes(p.id)).map(p => {
                  const sel = customCombo.includes(p.id);
                  return <button key={p.id} onClick={()=>setCustomCombo(cc=>sel?cc.filter(x=>x!==p.id):[...cc,p.id])} style={{ fontSize:9, padding:"4px 10px", borderRadius:0, background:sel?p.ac+"20":c.surf, color:sel?p.ac:c.mut, border:`1px solid ${sel?p.ac+"40":c.brd}`, cursor:"pointer", fontFamily:font, outline:"none", fontWeight:sel?600:400 }}>{p.icon} {t.r[p.role]||p.role}</button>;
                })}
              </div>
              {customCombo.length > 0 && (
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                  <div style={{ fontSize:9, color:c.dim }}>{lang==="ru"?"Можно добавить задачи:":"Add tasks:"}</div>
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
                  {copied==="custom-combo" ? t.copied : (lang==="ru"?"Скопировать":"Copy")} ({customCombo.length})
                </button>}
                <button onClick={()=>{setBuildingCombo(false);setCustomCombo([])}} style={{ padding:"6px 16px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>{lang==="ru"?"Отмена":"Cancel"}</button>
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
        {comboSearch && (COMBOS[lang]||COMBOS.ru).filter(cb => (cb.name + " " + cb.desc + " " + (cb.ids||[]).map(id=>{const p=pGet(id);return p?(t.r[p.role]||p.role):""}).join(" ")).toLowerCase().includes(comboSearch.toLowerCase())).length === 0 && <EmptyState c={c} lang={lang} />}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(250px, 1fr))", gap:8 }}>
          {(COMBOS[lang]||COMBOS.ru).filter(cb => !comboSearch || (cb.name + " " + cb.desc + " " + (cb.ids||[]).map(id=>{const p=pGet(id);return p?(t.r[p.role]||p.role):""}).join(" ")).toLowerCase().includes(comboSearch.toLowerCase())).map((cb, i) => {
            // Task 71: detect conflicts (multiple prompts for same role)
            const agents = (cb.ids||[]).map(id=>pGet(id)).filter(Boolean);
            const roles = agents.map(a=>a.role);
            const hasConflict = roles.length !== new Set(roles).size;
            return (
            <div key={i} className="card-enter combo-card" style={{
              padding:"14px 16px", borderRadius:0, borderTop:`1px solid ${c.brd}`,
              borderRight:`1px solid ${c.brd}`, borderBottom:`1px solid ${c.brd}`,
              background:c.card, cursor:"pointer", transition:"all .15s",
              borderLeft:`3px solid ${cb.color}`, animationDelay:`${i*30}ms`,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <div style={{ fontSize:12, fontWeight:700, color:c.text }}>{cb.name}</div>
                {hasConflict && <span style={{ fontSize:8, padding:"1px 6px", borderRadius:0, background:"#f59e0b18", color:"#f59e0b", border:"1px solid #f59e0b30" }}>⚠</span>}
                <span style={{ fontSize:9, color:c.dim }}>{(cb.ids||[]).length} {lang==="ru"?"агентов":"agents"}</span>
              </div>
              <div style={{ fontSize:10, color:c.dim, lineHeight:1.5, marginBottom:8 }}>{cb.desc}</div>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
                {(cb.ids||[]).map(id => {
                  const p = pGet(id);
                  return p ? <span key={id} style={{ fontSize:8, padding:"2px 6px", borderRadius:0, background:p.ac+"12", color:p.ac, border:`1px solid ${p.ac}20` }}>{p.icon} {t.r[p.role]||p.role}</span> : null;
                })}
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <div onClick={(e)=>{
                  e.stopPropagation();
                  const allText = buildPromptBundle(cb.ids);
                  cp("combo-"+i, allText);
                }} style={{ flex:1, fontSize:9, padding:"6px 10px", borderRadius:0, border:`1px solid ${c.brd}`, background:c.surf, color:copied===("combo-"+i)?"#10b981":c.mut, cursor:"pointer", textAlign:"center", fontWeight:600, fontFamily:font, transition:"all .15s" }}>
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
                }} style={{ flex:1, fontSize:9, padding:"6px 10px", borderRadius:0, border:`1px solid ${c.brd}`, background:c.surf, color:copied===("launch-"+i)?"#10b981":c.mut, cursor:"pointer", textAlign:"center", fontWeight:600, fontFamily:font, transition:"all .15s" }}>
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
            <input type="search" value={cheatSearch} onChange={e=>setCheatSearch(e.target.value)} placeholder={lang==="ru"?"Поиск команд...":lang==="kk"?"Команда іздеу...":"Search commands..."} style={{ width:"100%", height:32, padding:"0 30px 0 10px", fontSize:11, fontFamily:font, letterSpacing:0.3, borderRadius:0, border:0, borderBottom:`1px solid ${c.brd}`, background:"transparent", color:c.text, outline:"none", transition:"border-color .15s" }} />
            {cheatSearch && <button onClick={()=>setCheatSearch("")} style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:c.dim, cursor:"pointer", fontSize:12, padding:0, lineHeight:1 }}>×</button>}
          </div>
        </div>
        {cheatSearch && <div style={{ fontSize:10, color:c.dim, marginBottom:8 }}>{lang==="ru"?"Фильтр":"Filter"}: "{cheatSearch}"</div>}
        {cheatSearch && Object.values(CHEAT).every(sheet => (sheet.cmds||[]).filter(c2 => (c2.cmd + " " + c2.desc).toLowerCase().includes(cheatSearch.toLowerCase())).length === 0) && <EmptyState c={c} lang={lang} />}
        {Object.entries(CHEAT).map(([key, sheet]) => {
          const filteredCmds = cheatSearch ? sheet.cmds.filter(c2 => (c2.cmd + " " + c2.desc).toLowerCase().includes(cheatSearch.toLowerCase())) : sheet.cmds;
          if (cheatSearch && filteredCmds.length === 0) return null;
          return (
          <div key={key} style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:24, height:24, borderRadius:0, background:sheet.color+"20", color:sheet.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>{MI[key]||key[0].toUpperCase()}</div>
              <span style={{ fontSize:14, fontWeight:700, color:sheet.color }}>{sheet.name}</span>
              <span style={{ fontSize:9, color:c.dim }}>{filteredCmds.length}</span>
            </div>
            {filteredCmds.map((c2, i) => (
              <div key={i} onClick={()=>cp(`cheat-${key}-${i}`, c2.cmd)} className="card-enter" style={{
                display:"flex", alignItems:"center", justifyContent:"space-between", gap:12,
                padding:"8px 14px", marginBottom:4, borderRadius:0,
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
            <input type="search" value={quickSearch} onChange={e=>setQuickSearch(e.target.value)} placeholder={lang==="ru"?"Поиск CLI команд...":lang==="kk"?"CLI команда іздеу...":"Search CLI commands..."} style={{ width:"100%", height:32, padding:"0 30px 0 10px", fontSize:11, fontFamily:font, letterSpacing:0.3, borderRadius:0, border:0, borderBottom:`1px solid ${c.brd}`, background:"transparent", color:c.text, outline:"none", transition:"border-color .15s" }} />
            {quickSearch && <button onClick={()=>setQuickSearch("")} style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:c.dim, cursor:"pointer", fontSize:12, padding:0, lineHeight:1 }}>×</button>}
          </div>
        </div>
        {quickSearch && <div style={{ fontSize:10, color:c.dim, marginBottom:8 }}>{lang==="ru"?"Фильтр":"Filter"}: "{quickSearch}"</div>}
        {quickSearch && (QUICK_CMDS[lang]||QUICK_CMDS.ru||[]).every(cat => (cat.cmds||[]).filter(cmd => (cmd.cmd + " " + cmd.label).toLowerCase().includes(quickSearch.toLowerCase())).length === 0) && <EmptyState c={c} lang={lang} />}
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
                  padding:"10px 14px", borderRadius:0, border:`1px solid ${c.brd}`,
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
        <div style={{ marginBottom:16, padding:"16px 18px", borderRadius:0, border:`2px solid #e86a2a40`, background:"linear-gradient(135deg, #e86a2a08, #c4541d08)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, right:0, width:120, height:120, background:"radial-gradient(circle, #e86a2a10, transparent 70%)", pointerEvents:"none" }} />
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }} className="stack-mobile">
            <div style={{ width:40, height:40, borderRadius:0, background:"#e86a2a20", border:"1px solid #e86a2a30", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🚀</div>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:c.text }}>{t.teamSetup}</div>
              <div style={{ fontSize:10, color:c.mut, marginTop:2 }}>{t.teamSetupDesc}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button onClick={()=>cp("team-setup", TEAM_SETUP)} style={{
              padding:"9px 22px", fontSize:12, fontFamily:font, fontWeight:700,
              border:"1.5px solid #e86a2a", borderRadius:0,
              background:copied==="team-setup"?"transparent":"#e86a2a",
              color:copied==="team-setup"?"#e86a2a":"#fff",
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
          <div key={s.id} style={{ marginBottom:8, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:0, background:c.surf, border:`1px solid ${c.brd}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{s.icon}</div>
                <div><div style={{ fontSize:13, fontWeight:600 }}>{s.title}</div><div style={{ fontSize:10, color:c.mut, marginTop:2 }}>{s.desc}</div></div>
              </div>
              <CBtn id={s.id} txt={s.text} copied={copied} cp={cp} t={t} bg={c.bg} skip />
            </div>
          </div>
        ))}

        {/* Structure */}
        <div style={{ marginTop:16, marginBottom:8, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:0, background:c.surf, border:`1px solid ${c.brd}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🗂</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{t.structure}</div>
                <div style={{ fontSize:10, color:c.mut, marginTop:2 }}>{t.structureDesc}</div>
              </div>
            </div>
            <CBtn id="structure" txt={FOLDER_STRUCTURE} copied={copied} cp={cp} t={t} bg={c.bg} skip />
          </div>
        </div>

        {/* Feat 25: Quick launch generator */}
        <div style={{ marginBottom:16, padding:"14px 18px", borderRadius:0, border:`1px dashed ${c.brd}`, background:c.bg2 }}>
          <div style={{ fontSize:12, fontWeight:700, color:c.mut, marginBottom:10 }}>⚡ {lang==="ru"?"Быстрый запуск одного агента":"Quick Launch Single Agent"}</div>
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
                <div onClick={()=>toggle(cfg.id)} style={{ display:"flex", alignItems:"center", gap:10, flex:1, cursor:"pointer" }} role="button" aria-expanded={isO}>
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
                  <CBtn id={cfg.id} txt={cfg.text} cl={cfg.accent} sm copied={copied} cp={cp} t={t} bg={c.bg} skip />
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
              <div key={s.n} style={{ display:"flex", gap:8, alignItems:"flex-start", padding:"8px 10px", borderRadius:0, background:c.surf, border:`1px solid ${c.brd}` }}>
                <div style={{ width:20, height:20, borderRadius:0, background:"#e86a2a15", color:"#e86a2a", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.n}</div>
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
              <div style={{marginTop:6}}><strong>{lang==="ru"?"Где документация CLI?":"CLI documentation?"}</strong> — Claude Code: <span style={{color:"#f97316"}}>docs.anthropic.com</span> · Gemini CLI: <span style={{color:"#c4541d"}}>github.com/google-gemini/gemini-cli</span> · Codex CLI: <span style={{color:"#06b6d4"}}>github.com/openai/codex</span></div>
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
                    <circle cx={p.x+12} cy={40} r={Math.max(6, p.n/10)} fill="#e86a2a" opacity={0.3+i*0.15} />
                    <circle cx={p.x+12} cy={40} r={4} fill="#e86a2a" />
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
            border:`1.5px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut,
            cursor:"pointer", transition:"all .15s", outline:"none",
          }}>{lang==="ru"?"Экспорт CSV":"Export CSV"}</button>
          <button onClick={() => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type:"application/json" });
            const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "aiagent-hub-data.json"; a.click(); URL.revokeObjectURL(url);
          }} style={{
            padding:"8px 24px", fontSize:11, fontFamily:font, fontWeight:600,
            border:`1.5px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut,
            cursor:"pointer", transition:"all .15s", outline:"none",
          }}>{lang==="ru"?"Экспорт JSON":"Export JSON"}</button>
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
          }} style={{ padding:"8px 24px", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:700, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>⇩ {lang==="ru"?"Бэкап":"Backup"}</button>
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
          }} style={{ padding:"8px 24px", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontFamily:font, fontWeight:700, border:`1px solid ${c.brd}`, borderRadius:0, background:"transparent", color:c.mut, cursor:"pointer", outline:"none" }}>⇧ {lang==="ru"?"Восстановить":"Restore"}</button>
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
          {scrollPct > 10 && <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} aria-label="Scroll to top" style={{ marginTop:8, padding:"6px 20px", fontSize:10, fontFamily:font, border:`1px solid ${c.brd}`, borderRadius:0, background:c.card, color:c.mut, cursor:"pointer", outline:"none", transition:"all .15s" }}>↑ {lang==="ru"?"Наверх":"Top"}</button>}
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
            { k:"prompts", i:"¶", l:lang==="ru"?"Промты":"Prompts" },
            { k:"combos", i:"⧉", l:lang==="ru"?"Комбо":"Combos" },
            { k:"cheat", i:"≣", l:lang==="ru"?"Шпаргалки":"Cheat" },
            { k:"setup", i:"◎", l:lang==="ru"?"Setup":"Setup" },
          ].map(n=><button key={n.k} data-active={section===n.k ? "true" : "false"} onClick={()=>{setSection(n.k);window.scrollTo({top:0,behavior:"smooth"})}} style={{ background:"none", border:"none", color:section===n.k?c.text:c.dim, cursor:"pointer", outline:"none", textAlign:"center", padding:"4px 8px", fontSize:10, fontFamily:font, fontWeight:section===n.k?700:400 }}><div style={{ fontSize:16, marginBottom:2 }}>{n.i}</div>{n.l}</button>)}
        </div>
      </nav>
    </div>
  );
}
