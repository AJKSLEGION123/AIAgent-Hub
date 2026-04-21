const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 РАЗВЕДКА: Прочитай структуру, конфиги, зависимости, тесты. ";
const A = " АНТИ-ЛУП: 3 ошибки \u2014 смена подхода.";

// Helper: one-line prompt constructor
function P(id, role, icon, ac, time, taskDesc, tags, difficulty, output, related) {
  const cmd = id.startsWith("rl-") ? "/ralph-loop"
    : id.startsWith("fd-") ? "/feature-dev"
    : id.startsWith("rv-") ? "/review-pr"
    : id.startsWith("cr-") ? "/code-review"
    : id.startsWith("sm-") ? "/simplify"
    : id.startsWith("lp-") ? "/loop"
    : id.startsWith("cm-") ? "/commit"
    : "/feature-dev";
  const text = cmd === "/ralph-loop"
    ? '/ralph-loop "' + E + 'ЗАДАЧА: ' + taskDesc + A + '" --completion-promise "DONE"'
    : cmd === "/loop"
    ? '/loop 5m "' + taskDesc + '"'
    : taskDesc;
  return {
    id, m: cmd, mk: "claude", role, type: "command",
    icon, ac, time, text,
    tags: tags.split(","),
    difficulty,
    output: output || "Result",
    related: related || [],
    prereqs: [],
    v: "11.1"
  };
}

const add = [];

// ═══════════════════════════════════════════════════════
// FRONTEND / UI — 180 prompts
// ═══════════════════════════════════════════════════════

// Next.js (25)
add.push(
  P("rl-next-app-router","Next.js App Router Setup","▲","#000000","~1-2h","Настрой Next.js 15 App Router: layout.tsx/page.tsx/loading.tsx/error.tsx/not-found.tsx, route groups (marketing)/(shop), parallel routes @modal, intercepting routes, generateMetadata, generateStaticParams.","nextjs,app-router,ssr,routing","intermediate","Next.js routing"),
  P("rl-next-server-actions","Next.js Server Actions","▲","#000000","~1h","Использование Server Actions в Next.js 15: use server, форма с action, revalidatePath, redirect, zod валидация, useFormState, useFormStatus, progressive enhancement.","nextjs,server-actions,forms","intermediate"),
  P("rl-next-rsc","React Server Components","⎈","#61dafb","~2h","Архитектура RSC: async server components, streaming, Suspense boundaries, client components с 'use client', избегать hydration mismatches, передача data через props.","react,rsc,server-components,streaming","advanced"),
  P("rl-next-middleware","Next.js Middleware","⇆","#000000","~1h","Edge middleware: auth check, geo rewrites, A/B testing, bot filter, rate limit per IP, headers mutation, NextResponse.rewrite/redirect/next, matcher config.","nextjs,middleware,edge","intermediate"),
  P("rl-next-caching","Next.js Caching Strategies","⏱","#000000","~1-2h","unstable_cache, fetch revalidate, route segment config (dynamic/revalidate/fetchCache), ISR, on-demand revalidation revalidateTag/revalidatePath.","nextjs,cache,isr","intermediate"),
  P("rl-next-metadata","Next.js Metadata & SEO","◎","#000000","~30m","generateMetadata async, openGraph, twitter cards, alternates, robots, sitemap.ts, dynamic OG images via ImageResponse.","nextjs,seo,metadata,og","beginner"),
  P("rl-next-mdx","Next.js + MDX Blog","❖","#000000","~2h","MDX blog: contentlayer2 или next-mdx-remote, frontmatter, syntax highlight (shiki), reading time, RSS feed, tags page.","nextjs,mdx,blog,content","intermediate"),
  P("rl-next-auth","Next.js Auth (NextAuth/Auth.js v5)","⚿","#000000","~2h","Auth.js v5 setup: providers (Google, GitHub, credentials), middleware protection, session в server components, JWT vs DB sessions, role-based access.","nextjs,auth,nextauth","intermediate"),
  P("rl-next-i18n","Next.js i18n (next-intl)","⌘","#000000","~1h","next-intl: locale routing, message files, ICU formatting, pluralization, typed translations, middleware для detection.","nextjs,i18n,l10n","intermediate"),
  P("rl-next-image","Next.js Image Optimization","◐","#000000","~30m","next/image: sizes, placeholder blur, priority, lazy, remote patterns, AVIF/WebP, responsive srcset, LQIP placeholders.","nextjs,image,performance","beginner"),
  P("rl-next-fonts","Next.js Font Optimization","A","#000000","~20m","next/font/google, next/font/local, variable fonts, subsetting, display swap, preload, self-hosted.","nextjs,fonts,performance","beginner"),
  P("rl-next-dynamic","Next.js Dynamic Imports","≋","#000000","~30m","dynamic() с ssr:false, loading state, prefetch, code splitting per route/component, bundle analysis.","nextjs,dynamic,code-splitting","beginner"),
  P("rl-next-parallel","Next.js Parallel Routes","⫴","#000000","~1h","@dashboard, @analytics parallel slots, conditional rendering per slot, default.tsx fallback, интеграция с layouts.","nextjs,parallel-routes","intermediate"),
  P("rl-next-intercept","Next.js Intercepting Routes","↻","#000000","~1h","(.)photo/[id] intercepting для modal, back to list без потери state, параллельная маршрутизация @modal.","nextjs,routing,modal","intermediate"),
  P("rl-next-route-handlers","Next.js Route Handlers","⇉","#000000","~1h","app/api/*/route.ts с GET/POST/PUT/DELETE, dynamic segments, Request/NextRequest, Response/NextResponse, stream responses.","nextjs,api-routes","intermediate"),
  P("fd-next-dashboard","Next.js Admin Dashboard","▦","#000000","~3-4h","Админка на Next.js: sidebar navigation, breadcrumbs, data table (TanStack), charts (Recharts), CRUD modals, role-based routes.","nextjs,admin,dashboard","intermediate"),
  P("fd-next-landing","Next.js Marketing Landing","⬟","#000000","~2h","Лендинг: hero, features grid, testimonials carousel, pricing table, FAQ accordion, CTA, footer, animated sections (Framer Motion).","nextjs,landing,marketing","beginner"),
  P("fd-next-blog","Next.js Blog + CMS","❧","#000000","~2-3h","Блог на Next.js + Sanity/Contentful/Payload. Posts list, post page, categories, tags, related posts, search, comments (Giscus), newsletter.","nextjs,blog,cms","intermediate"),
  P("fd-next-docs","Next.js Documentation Site","❋","#000000","~2-3h","Doc site: left nav, MDX content, search (FlexSearch), версионирование, TOC, prev/next navigation, copy code button, dark mode.","nextjs,docs,mdx","intermediate"),
  P("fd-next-pwa","Next.js PWA","⊞","#000000","~1-2h","PWA: manifest.json, service worker (next-pwa или workbox), offline page, install prompt, push notifications, app shell.","nextjs,pwa,service-worker","intermediate"),
  P("rl-next-deploy-vercel","Next.js на Vercel","▲","#000000","~30m","Deploy to Vercel: vercel.json, env vars, domains, edge config, analytics, speed insights, preview deployments, branches.","nextjs,vercel,deploy","beginner"),
  P("rl-next-monorepo","Next.js Turborepo Monorepo","◫","#000000","~2h","Turborepo setup: apps/web + apps/admin + packages/ui + packages/db. Shared tsconfig, ESLint, Tailwind preset. Remote cache.","turborepo,monorepo,nextjs","advanced"),
  P("rl-next-testing","Next.js Testing","✓","#000000","~1-2h","Vitest + React Testing Library, Playwright E2E, MSW для моков API, server components тестирование, snapshot tests.","nextjs,testing,vitest,playwright","intermediate"),
  P("rl-next-edge","Next.js Edge Functions","⚡","#000000","~1h","Edge runtime, streaming responses, WebCrypto, fetch, KV storage (Vercel KV), limitations (no Node APIs).","nextjs,edge,serverless","intermediate"),
  P("rl-next-ota","Next.js Feature Flags","⚑","#000000","~1h","Feature flags с @vercel/flags, LaunchDarkly, или self-host. Edge-based evaluation, user targeting, A/B tests.","nextjs,feature-flags","intermediate"),
);

// React patterns (25)
add.push(
  P("rl-react-19","React 19 Features","⎈","#61dafb","~1h","use() hook, useActionState, useFormStatus, useOptimistic, document metadata, async transitions, server components.","react,react-19,hooks","intermediate"),
  P("rl-react-suspense","React Suspense Deep","◌","#61dafb","~1h","Suspense boundaries, nested Suspense, SuspenseList, error boundaries интеграция, streaming SSR, lazy() loading.","react,suspense,streaming","intermediate"),
  P("rl-react-transitions","React Transitions","⇄","#61dafb","~45m","useTransition, startTransition, useDeferredValue, concurrent rendering, interrupting renders.","react,transitions,concurrent","intermediate"),
  P("rl-react-memo-deep","React Memoization Deep","◇","#61dafb","~1h","React.memo, useMemo, useCallback — когда НЕ нужно. React Compiler, automatic memoization, profiling с React DevTools.","react,performance,memo","intermediate"),
  P("rl-react-refs","React Refs Advanced","◉","#61dafb","~45m","forwardRef (deprecated в 19), ref as prop, useImperativeHandle, callback refs, ref merging utility.","react,refs","intermediate"),
  P("rl-react-context","React Context Patterns","⊕","#61dafb","~1h","Context optimization, split contexts, useContextSelector polyfill, Provider composition, Context vs Zustand vs Jotai.","react,context,state","intermediate"),
  P("rl-react-portals","React Portals","⇱","#61dafb","~30m","createPortal для modals/tooltips/toasts, event bubbling, aria attributes, focus management.","react,portals","intermediate"),
  P("rl-react-error-bnd","React Error Boundaries","⚠","#61dafb","~30m","ErrorBoundary class component, getDerivedStateFromError, componentDidCatch, fallback UI, Sentry integration.","react,errors,boundary","beginner"),
  P("rl-react-hocs","React HOCs vs Hooks","⚘","#61dafb","~45m","Когда HOC всё ещё полезен: provider injection, auth wrapping. Hooks — default choice. Migration HOC→hook.","react,hoc,hooks","intermediate"),
  P("rl-react-compound","React Compound Components","⧈","#61dafb","~1h","Compound pattern: <Tabs>, <Tabs.List>, <Tabs.Tab>, <Tabs.Panel>. Context-based, flexible API. Radix/Ark примеры.","react,patterns,compound","intermediate"),
  P("rl-react-render-props","Render Props Pattern","⤳","#61dafb","~30m","Render props паттерн — когда предпочесть hooks. Примеры: <Downshift>, <Formik>. Миграция render prop → hook.","react,patterns,render-props","intermediate"),
  P("rl-react-hook-form-deep","React Hook Form Deep","▦","#61dafb","~1-2h","Nested forms, arrays (useFieldArray), watch optimization, Controller для UI libs, resolver с zod, submission error handling.","react,forms,rhf","intermediate"),
  P("fd-react-data-table","Data Table (TanStack)","▤","#61dafb","~2-3h","TanStack Table: sortable, filterable, grouped, virtualized, pagination, column visibility, resize, CSV export, row selection.","react,table,tanstack","intermediate"),
  P("fd-react-drag-drop","Drag & Drop (dnd-kit)","⤨","#61dafb","~1-2h","dnd-kit: sortable list, kanban board, accessibility (keyboard), custom overlay, constraints (horizontal/grid).","react,dnd,dnd-kit","intermediate"),
  P("fd-react-modal","Modal / Dialog (Radix)","⬚","#61dafb","~1h","Radix Dialog: focus trap, esc close, backdrop click, nested dialogs, animated transitions, mobile sheet variant.","react,modal,radix","intermediate"),
  P("fd-react-command-palette","Command Palette (⌘K)","⌘","#61dafb","~1-2h","Cmdk (Vercel): fuzzy search, groups, keyboard navigation, actions, recent, nested commands, shortcuts.","react,cmdk,search","intermediate"),
  P("fd-react-toast","Toast System (Sonner)","◴","#61dafb","~30m","Sonner: success/error/promise, swipe to dismiss, stacking, custom actions, rich-text, position.","react,toast,notification","beginner"),
  P("fd-react-charts","Charts (Recharts/Visx)","◔","#61dafb","~1-2h","Line/Bar/Pie/Area/Scatter. Tooltips, legends, responsive container, custom styles. Visx для low-level.","react,charts,recharts,visx","intermediate"),
  P("fd-react-calendar","Calendar/Date Picker","⊞","#61dafb","~1-2h","react-day-picker или Radix calendar: range selection, min/max, disabled days, locale, keyboard navigation.","react,calendar,date-picker","intermediate"),
  P("fd-react-rich-text","Rich Text Editor (TipTap)","✎","#61dafb","~2-3h","TipTap: toolbar, formatting, headings, lists, code blocks, links, mentions, collaboration (Y.js), images upload.","react,editor,tiptap","advanced"),
  P("fd-react-kanban","Kanban Board","▥","#61dafb","~2-3h","Drag-drop columns, tasks, labels, assignees, due dates. dnd-kit, persist в localStorage/API. Real-time updates.","react,kanban,dnd","intermediate"),
  P("fd-react-tree","Tree View","⛽","#61dafb","~1-2h","Expandable tree: virtualized (react-arborist), keyboard, multi-select, drag-drop, lazy children loading.","react,tree,arborist","intermediate"),
  P("fd-react-split-pane","Resizable Panes","⫐","#61dafb","~45m","react-resizable-panels: horizontal/vertical split, collapse, snap points, save sizes в localStorage.","react,layout,resize","intermediate"),
  P("fd-react-stepper","Multi-Step Wizard","⇄","#61dafb","~1h","Wizard: progress indicator, validation per step, skip logic, back/next, summary, conditional steps.","react,wizard,forms","intermediate"),
  P("fd-react-upload","File Upload (Uploadthing)","⇧","#61dafb","~1h","Uploadthing/react-dropzone: drag zone, progress, multi-file, image preview, chunk upload, S3 presigned URL.","react,upload,s3","intermediate"),
);

// Vue / Nuxt / Svelte / Solid / Angular (25)
add.push(
  P("rl-vue3-composition","Vue 3 Composition API","✺","#42b883","~1h","setup(), ref/reactive/computed, watch/watchEffect, defineProps/emits/expose, composables pattern, script setup.","vue,composition,vue3","intermediate"),
  P("rl-vue3-pinia","Vue Pinia State","≣","#42b883","~1h","Pinia store: defineStore, state/getters/actions, setup-style stores, persistence plugin, devtools.","vue,pinia,state","intermediate"),
  P("rl-nuxt3","Nuxt 3 Setup","◆","#00dc82","~1-2h","Nuxt 3: auto-imports, pages с file-based routing, layouts, middleware, plugins, modules, server routes.","nuxt,vue,ssr","intermediate"),
  P("rl-nuxt3-data","Nuxt Data Fetching","⇉","#00dc82","~1h","useFetch, useAsyncData, lazy, refresh, watch, cache (getCachedData), SSR hydration.","nuxt,data-fetching","intermediate"),
  P("rl-svelte5-runes","Svelte 5 Runes","∫","#ff3e00","~1h","$state, $derived, $effect, $props, $bindable, migration от Svelte 4 stores.","svelte,svelte5,runes","intermediate"),
  P("rl-sveltekit","SvelteKit App","⚡","#ff3e00","~1-2h","Routing, +page/+layout/+server, load functions, form actions, hooks, adapter-vercel/node.","sveltekit,svelte","intermediate"),
  P("rl-solidjs","SolidJS Fundamentals","◈","#2c4f7c","~1h","Signals, createEffect, createMemo, createResource, for/show/switch компоненты, JSX без virtual DOM.","solidjs,reactive","intermediate"),
  P("rl-solid-start","SolidStart","⚛","#2c4f7c","~1h","SolidStart: file routing, server functions, SSR/SSG/CSR, islands.","solidstart,ssr","intermediate"),
  P("rl-qwik","Qwik Resumability","⦿","#ac7ef4","~1h","Qwik: resumability vs hydration, $-suffix lazy, useSignal/useStore, server functions (server$).","qwik,resumability","advanced"),
  P("rl-remix","Remix Fundamentals","◄","#121212","~1-2h","Remix: nested routes, loaders, actions, error boundaries, progressive enhancement, forms.","remix,react","intermediate"),
  P("rl-angular-17","Angular 17+ Signals","△","#dd0031","~1-2h","Angular signals, computed, effect, standalone components, @defer, control flow (@if/@for/@switch).","angular,signals","intermediate"),
  P("rl-angular-rxjs","Angular RxJS Patterns","∞","#dd0031","~1h","RxJS operators: switchMap, mergeMap, combineLatest, takeUntil, shareReplay. HTTP interceptors, retry.","angular,rxjs","advanced"),
  P("rl-astro","Astro Sites","☄","#ff5d01","~1h","Astro: islands architecture, integrations (React/Vue/Svelte), content collections, image optimization.","astro,islands,ssg","intermediate"),
  P("rl-astro-content","Astro Content Collections","❋","#ff5d01","~45m","src/content/blog, Zod schema, getCollection, reference() между коллекциями, динамические routes.","astro,content,mdx","beginner"),
  P("rl-hono","Hono Web Framework","⎔","#e36002","~45m","Hono: fast router, middleware, JSX, validator (zod), JWT, rate limit, deploy to Cloudflare Workers.","hono,workers,api","intermediate"),
  P("rl-lit","Lit Web Components","⌬","#324fff","~1h","LitElement, reactive properties, templates, directives, ReactiveController, SSR с @lit-labs/ssr.","lit,web-components","intermediate"),
  P("rl-preact","Preact Migration","⬡","#673ab8","~1h","React → Preact: preact/compat alias, bundle reduction (~35KB → ~3KB), incompatibilities.","preact,bundle-size","intermediate"),
  P("rl-alpinejs","Alpine.js Declarative","✦","#8bc0d0","~30m","Alpine x-data/x-show/x-for/x-model, без build step, progressive enhancement existing HTML.","alpine,progressive","beginner"),
  P("rl-htmx","HTMX Hypermedia","⇢","#3d72d7","~45m","hx-get/hx-post/hx-target/hx-swap, server returns HTML, partial updates, боevents, progressive.","htmx,hypermedia","intermediate"),
  P("rl-stimulus","Stimulus Controllers","⎈","#77e8b9","~30m","Stimulus controllers, data-action/data-target, lifecycle (connect/disconnect), Rails integration.","stimulus,rails","beginner"),
  P("rl-island","Islands Architecture","◉","#f59e0b","~1h","Islands pattern: static HTML + interactive islands (Astro/Fresh/Qwik). Partial hydration vs resumability.","islands,ssg","advanced"),
  P("rl-micro-frontend","Micro-Frontends","⧈","#f59e0b","~2-3h","Module Federation (Webpack), single-spa, или iframe-based. Shared deps, routing, events.","micro-frontend,architecture","advanced"),
  P("rl-web-vitals","Web Vitals Monitoring","◔","#f59e0b","~30m","web-vitals library: LCP/INP/CLS/FCP/TTFB, attribution, Beacon API send to analytics.","cwv,performance","intermediate"),
  P("rl-pwa-offline","PWA Offline Strategy","⊟","#4285f4","~1-2h","Service Worker: cache-first для assets, network-first для API, stale-while-revalidate, Workbox recipes.","pwa,service-worker,offline","advanced"),
  P("rl-web-bluetooth","Web APIs Exotic","❄","#4285f4","~1h","Web Bluetooth/USB/Serial/NFC, getUserMedia, Web Share API, Screen Wake Lock — реальные use cases.","web-apis,exotic","advanced"),
);

// CSS / Design System / Animation (30)
add.push(
  P("rl-tailwind-v4","Tailwind CSS v4","≣","#06b6d4","~1h","Tailwind v4: @theme, CSS-first config, container queries, 3D transforms, new features.","tailwind,css","intermediate"),
  P("rl-css-container-queries","Container Queries","⬚","#264de4","~45m","@container (inline-size > 400px), component-based responsive без media queries. Polyfill для старых браузеров.","css,responsive,container-queries","intermediate"),
  P("rl-css-cascade-layers","CSS Cascade Layers","≡","#264de4","~30m","@layer reset/base/components/utilities. Порядок важен. Решает специфичность войны.","css,cascade-layers","intermediate"),
  P("rl-css-grid-subgrid","CSS Grid Subgrid","⊞","#264de4","~45m","subgrid для наследования grid lines. Примеры: карточки, формы с выровненными label/input.","css,grid,subgrid","intermediate"),
  P("rl-css-scroll-driven","CSS Scroll-Driven Animations","⬇","#264de4","~45m","animation-timeline: scroll()/view(). Прогресс-бары, parallax, fade-on-view без JS.","css,animation,scroll","intermediate"),
  P("rl-css-view-transitions","View Transitions API","⇄","#264de4","~1h","document.startViewTransition, SPA-like transitions в MPA, ::view-transition-old/new.","css,view-transitions","advanced"),
  P("rl-css-anchor","CSS Anchor Positioning","⚓","#264de4","~45m","anchor-name, position-anchor, tooltips/popovers без JS calc. Chrome 125+, fallback.","css,anchor,positioning","advanced"),
  P("rl-css-popover","Popover API","◉","#264de4","~30m","<dialog> и [popover], popovertarget, auto/manual modes, focus management built-in.","html,popover,dialog","beginner"),
  P("rl-design-tokens","Design Tokens","◆","#f59e0b","~1h","Style Dictionary: tokens.json → CSS/SCSS/JS/iOS/Android. Color, spacing, typography scales.","design-tokens,design-system","intermediate"),
  P("rl-design-system","Design System Bootstrap","◎","#f59e0b","~3-4h","Компонент library: Button, Input, Select, Modal, Tabs. Documentation (Storybook), tests, accessibility.","design-system,storybook","advanced"),
  P("rl-storybook","Storybook v8","◇","#ff4785","~1-2h","Storybook 8: CSF3, args, controls, actions, accessibility addon, interaction tests (play function), Chromatic visual.","storybook,docs","intermediate"),
  P("rl-shadcn","shadcn/ui Setup","◼","#000000","~45m","shadcn/ui CLI, components.json, Radix primitives + Tailwind, copy-paste компоненты, customization.","shadcn,radix,tailwind","beginner"),
  P("rl-radix","Radix Primitives","⬢","#000000","~1h","Radix: Dialog, Dropdown, Select, Tooltip, Popover, Accordion. Unstyled, accessible, composable.","radix,headless","intermediate"),
  P("rl-headlessui","Headless UI","◯","#f7df1e","~45m","Headless UI от Tailwind Labs: Menu, Listbox, Combobox, Dialog, Transition.","headlessui,tailwind","beginner"),
  P("rl-framer-motion","Framer Motion","✿","#0055ff","~1-2h","Motion: animate, variants, gestures (hover/tap/drag), scroll-linked, layout animations, AnimatePresence.","framer-motion,animation","intermediate"),
  P("rl-gsap","GSAP Animations","⟁","#88ce02","~1-2h","GSAP: timelines, ScrollTrigger, Flip, MotionPath, SplitText, pinning, batch, stagger.","gsap,animation","advanced"),
  P("rl-lottie","Lottie Animations","◈","#00ddb3","~30m","Lottie JSON (After Effects export), lottie-web/react-lottie, loop/autoplay/speed, events.","lottie,animation","beginner"),
  P("rl-three-r3f","React Three Fiber","◬","#1f1f1f","~2-3h","Three.js в React: Canvas, meshes, lights, camera, OrbitControls, drei helpers, performance.","threejs,r3f,3d","advanced"),
  P("fd-theme-system","Theme System (light/dark/auto)","☀","#f59e0b","~1h","CSS vars per theme, next-themes, system preference, persistence, no flash of wrong theme.","theme,dark-mode","beginner"),
  P("fd-multi-theme","Multi-Theme System","◐","#f59e0b","~1-2h","Несколько тем (branded, seasonal), user-selectable, CSS-vars-based, Tailwind themes, typed.","theme,multi-theme","intermediate"),
  P("rl-typography-scale","Typography Scale","A","#f59e0b","~45m","Modular scale (1.25/1.333), fluid typography (clamp), line-height per size, vertical rhythm.","typography,css","intermediate"),
  P("rl-responsive-images","Responsive Images Deep","◑","#f59e0b","~45m","srcset/sizes, picture element, art direction, densities 1x/2x/3x, AVIF/WebP/JPEG fallback.","images,responsive","intermediate"),
  P("rl-sprites-svg","SVG Sprites & Icons","⌬","#f59e0b","~45m","SVG sprite sheet, use xlinkHref, icon libraries (Lucide, Phosphor, Heroicons, Tabler), accessibility.","svg,icons","beginner"),
  P("rl-css-reset","Modern CSS Reset","◇","#264de4","~30m","Josh Comeau reset, box-sizing border-box, body text-rendering, custom properties init.","css,reset","beginner"),
  P("rl-css-architecture","CSS Architecture","◆","#264de4","~1h","BEM vs ITCSS vs CUBE CSS vs Tailwind utility-first. Когда какая.","css,architecture,bem","intermediate"),
  P("rl-critical-css","Critical CSS","⚡","#264de4","~45m","Above-the-fold CSS inline, lazy остальное. Critical/critters tools, manual extraction.","critical-css,performance","intermediate"),
  P("rl-css-logical","CSS Logical Properties","◎","#264de4","~30m","margin-inline/block, inset, border-block, RTL готовность без JS.","css,logical,rtl","beginner"),
  P("rl-dark-mode-deep","Dark Mode Deep","☾","#f59e0b","~1h","Not just invert: balanced contrast, tinted surfaces, shadow adaptation, images в dark mode, system detection.","dark-mode,design","intermediate"),
  P("rl-print-styles","Print Stylesheet","⎙","#264de4","~45m","@media print, page-break, avoid orphans/widows, grayscale, url append, header/footer, PDF export.","print,css","intermediate"),
  P("rl-skeleton-ui","Skeleton Screens","▤","#264de4","~30m","Skeleton vs spinner, shimmer animation, match real layout, aria-busy, react-loading-skeleton.","skeleton,loading","beginner"),
);

// Forms / Accessibility / i18n (30)
add.push(
  P("fd-form-wizard","Multi-Step Form Wizard","⇨","#0ea5e9","~2h","Wizard: шаги с валидацией, progress indicator, back button preserves data, final review, submit.","forms,wizard","intermediate"),
  P("fd-form-dynamic","Dynamic Form Fields","⚙","#0ea5e9","~1-2h","Add/remove field rows, nested fields (useFieldArray), conditional fields based on values.","forms,dynamic","intermediate"),
  P("fd-form-conditional","Conditional Fields","⇄","#0ea5e9","~1h","Show/hide fields based on other values, reset hidden fields, validation skip для hidden.","forms,conditional","intermediate"),
  P("fd-form-autosave","Form Autosave","⇩","#0ea5e9","~45m","Debounced autosave, dirty state, conflict resolution, optimistic UI, offline queue.","forms,autosave","intermediate"),
  P("fd-form-file-upload","File Upload Form","⇧","#0ea5e9","~1-2h","Drag zone, multiple, validation (size/type), progress, preview, presigned S3 URLs.","forms,upload","intermediate"),
  P("fd-form-phone","International Phone Input","☏","#0ea5e9","~30m","react-phone-number-input, libphonenumber-js, country flags, format per country, validation E.164.","forms,phone,i18n","intermediate"),
  P("fd-form-address","Address Autocomplete","⚐","#0ea5e9","~1h","Google Places/Mapbox/Algolia addresses, postcode lookup, country selector, address parsing.","forms,address,maps","intermediate"),
  P("fd-form-date","Date/Time Picker","⌚","#0ea5e9","~1h","react-day-picker, timezone handling, min/max, disabled days, range, i18n.","forms,date-picker","intermediate"),
  P("fd-form-otp","OTP Input","◯","#0ea5e9","~30m","6-digit OTP input, auto-focus next, paste handling, backspace, SMS autofill (autocomplete='one-time-code').","forms,otp,2fa","beginner"),
  P("fd-form-search","Search Autocomplete","⌕","#0ea5e9","~1h","Debounced search, dropdown suggestions, keyboard navigation, recent searches, clear button.","forms,search,autocomplete","intermediate"),
  P("rl-a11y-audit","A11y Full Audit","♿","#2563eb","~1-2h","axe DevTools, Lighthouse a11y, WAVE, manual keyboard test, screen reader (NVDA/VoiceOver), color contrast.","a11y,audit","intermediate"),
  P("rl-a11y-keyboard","Keyboard Navigation Audit","⌨","#2563eb","~1h","Tab order, focus visible, trap focus в modals, Escape dismisses, arrow keys lists/menus, shortcuts не конфликт.","a11y,keyboard","intermediate"),
  P("rl-a11y-sr","Screen Reader Support","♫","#2563eb","~1h","aria-label, aria-labelledby, aria-describedby, role, aria-live regions, aria-expanded, sr-only text.","a11y,aria,screen-reader","intermediate"),
  P("rl-a11y-contrast","Contrast Ratio","◐","#2563eb","~30m","WCAG AA 4.5:1 normal/3:1 large. APCA новый подход. Tools: contrast-ratio, Polypane.","a11y,contrast,wcag","beginner"),
  P("rl-a11y-motion","Reduced Motion","⊘","#2563eb","~30m","prefers-reduced-motion, отключить parallax/large animations, предоставить non-animated alternative.","a11y,motion","beginner"),
  P("rl-a11y-forms","Accessible Forms","◇","#2563eb","~45m","Label связан с input, error announcement (role='alert'), required helper, validation сообщения.","a11y,forms","intermediate"),
  P("rl-a11y-images","Accessible Images","◐","#2563eb","~30m","alt text (decorative vs informative), role='img' для SVG inline, figure/figcaption.","a11y,images","beginner"),
  P("rl-a11y-tables","Accessible Tables","▦","#2563eb","~30m","<th scope>, caption, complex tables с headers/ID, sortable tables aria-sort.","a11y,tables","intermediate"),
  P("rl-i18n-setup","i18n Library Setup","⌘","#8b5cf6","~1h","react-i18next / next-intl / vue-i18n / lingui. Namespaces, lazy loading, plural rules, interpolation.","i18n,l10n","intermediate"),
  P("rl-i18n-icu","ICU MessageFormat","◈","#8b5cf6","~45m","ICU syntax: plural, select, number format, date format, nested messages. formatjs или msg.","i18n,icu","intermediate"),
  P("rl-i18n-rtl","RTL Support","⇆","#8b5cf6","~1h","CSS logical properties, dir='rtl', bidi text, иконки flip, Arabic/Hebrew testing.","i18n,rtl,arabic","advanced"),
  P("rl-i18n-locale-routing","Locale Routing","⇶","#8b5cf6","~45m","/en/about, /ru/about, default locale, hreflang tags, sitemap per locale, detection (cookie/accept-language).","i18n,routing","intermediate"),
  P("rl-i18n-translations","Translation Workflow","◎","#8b5cf6","~1h","Crowdin/Lokalise/Weblate sync, CI check missing keys, pseudo-localization, ICU keys валидация.","i18n,translations,workflow","intermediate"),
  P("rl-accessibility-landmarks","ARIA Landmarks","⚐","#2563eb","~30m","<header>/<main>/<nav>/<aside>/<footer>, role-эквиваленты, skip links, aria-label для множественных.","a11y,landmarks","beginner"),
  P("rl-focus-management","Focus Management","◉","#2563eb","~1h","Focus trap в dialogs, return focus после закрытия, initial focus, programmatic focus, focus visible.","a11y,focus","intermediate"),
  P("rl-a11y-mobile","Mobile Accessibility","☏","#2563eb","~30m","44×44 tap targets, touch gestures fallback, zoom not disabled, orientation both.","a11y,mobile","beginner"),
  P("rl-a11y-content","Accessible Content","◇","#2563eb","~30m","Heading hierarchy (h1-h6), plain language, links descriptive (not 'click here'), lists properly marked.","a11y,content","beginner"),
  P("rl-form-validation","Form Validation UX","✓","#0ea5e9","~45m","Inline validation (onBlur не onChange), success states, field-level errors, summary ошибок, submit disabled логика.","forms,validation","intermediate"),
  P("rl-form-error-handling","Form Error Handling","⚠","#0ea5e9","~45m","Server errors → field-level, network errors retry, duplicate submit prevention, error toast.","forms,errors","intermediate"),
  P("rl-form-masked-input","Masked Inputs","⦕","#0ea5e9","~30m","Credit card, phone, date masks. react-input-mask, IMask, custom с onKeyDown.","forms,masks","intermediate"),
);

// Data display + UI widgets (30)
add.push(
  P("fd-data-grid","Enterprise Data Grid","▦","#e86a2a","~3h","AG Grid или TanStack: pivoting, grouping, aggregation, cell editing, server-side data, enterprise features.","data-grid,tables,enterprise","advanced"),
  P("fd-kanban-board","Kanban Board v2","▥","#e86a2a","~2-3h","Columns с WIP limits, cards with labels/priority, drag-drop, swimlanes, filters.","kanban,boards,dnd","intermediate"),
  P("fd-gantt","Gantt Chart","═","#e86a2a","~2-3h","Gantt: tasks with dependencies, timeline zoom, critical path, resource allocation, export.","gantt,project-management","advanced"),
  P("fd-calendar-view","Calendar Views","⊞","#e86a2a","~2h","FullCalendar или react-big-calendar: month/week/day views, events, drag-drop, recurring.","calendar,scheduling","intermediate"),
  P("fd-timeline","Timeline Component","━","#e86a2a","~1h","Vertical/horizontal timeline, events с датами, иконки, цвета per type, responsive.","timeline,ui","intermediate"),
  P("fd-tabs-vertical","Vertical Tabs","▎","#e86a2a","~45m","Settings-style vertical tabs, sticky panel, keyboard arrow navigation, aria-roles.","tabs,ui","beginner"),
  P("fd-accordion","Accordion","⇅","#e86a2a","~30m","Expandable sections, single/multi open, keyboard (Enter/Space), animation collapse, accessible.","accordion,ui","beginner"),
  P("fd-tree-view","Tree View Widget","⛽","#e86a2a","~1-2h","File tree, nested expand, lazy load children, checkboxes, keyboard (arrows), multi-select.","tree,ui","intermediate"),
  P("fd-breadcrumbs","Breadcrumbs","›","#e86a2a","~20m","Breadcrumbs с truncation, overflow menu (…), aria-current, schema.org BreadcrumbList.","breadcrumbs,ui","beginner"),
  P("fd-pagination","Pagination","⇥","#e86a2a","~30m","Page numbers с ellipsis, prev/next, first/last, items per page, URL sync, keyboard.","pagination,ui","beginner"),
  P("fd-infinite-scroll","Infinite Scroll v2","∞","#e86a2a","~1h","IntersectionObserver sentinel, loading indicator, end-of-list message, scroll restoration.","infinite-scroll,ui","intermediate"),
  P("fd-virtualize","Virtualized List","⇣","#e86a2a","~1h","TanStack Virtual / react-window для больших списков, dynamic heights, scroll to index.","virtualization,performance","intermediate"),
  P("fd-tags-input","Tags Input","◈","#e86a2a","~45m","Multi-tag input, Enter добавляет, Backspace удаляет последний, paste CSV, autocomplete.","tags,forms","intermediate"),
  P("fd-color-picker","Color Picker","◐","#e86a2a","~1h","react-colorful: hex/rgba/hsl, opacity slider, presets, recent colors, accessible inputs.","color,picker","beginner"),
  P("fd-rating","Star Rating","★","#e86a2a","~30m","Star rating 1-5, half-star, hover preview, accessible (radio buttons), read-only mode.","rating,forms","beginner"),
  P("fd-switch","Toggle Switch","◐","#e86a2a","~20m","iOS-style switch, accessible (role='switch'), keyboard, label positioning, disabled.","switch,toggle","beginner"),
  P("fd-progress","Progress Bars","▰","#e86a2a","~30m","Linear/circular, determinate/indeterminate, steps, aria-valuenow, custom colors.","progress,ui","beginner"),
  P("fd-stats-cards","Statistics Cards","◈","#e86a2a","~45m","Number + label + delta (% change), icon, sparkline, click to detail.","stats,dashboard","beginner"),
  P("fd-sparkline","Sparkline Charts","〜","#e86a2a","~30m","Inline mini charts, line/bar, trend indicator, tooltip, responsive.","charts,sparkline","beginner"),
  P("fd-heatmap","Heatmap","⋮","#e86a2a","~1-2h","GitHub-style contribution heatmap, D3 или Nivo, tooltip per cell, mobile responsive.","heatmap,charts","intermediate"),
  P("fd-map-leaflet","Interactive Map (Leaflet)","⚐","#10b981","~1-2h","Leaflet/react-leaflet: markers, clusters, polygons, tile providers (OSM/Mapbox), geolocation.","maps,leaflet","intermediate"),
  P("fd-map-mapbox","Mapbox GL","◎","#10b981","~1-2h","Mapbox GL JS: custom styles, 3D terrain, heatmap layer, geocoder, draw tools.","maps,mapbox","advanced"),
  P("fd-video-player","Video Player","▷","#ef4444","~1-2h","video.js или Plyr: HLS/DASH streaming, playback speed, quality selector, captions, picture-in-picture.","video,player","intermediate"),
  P("fd-audio-player","Audio Player","♪","#ef4444","~1h","howler.js: playlist, seek, speed, visualizer (Web Audio API), keyboard shortcuts.","audio,player","intermediate"),
  P("fd-pdf-viewer","PDF Viewer","📜","#ef4444","~1h","react-pdf: pages, zoom, search, download, annotations, thumbnails sidebar.","pdf,viewer","intermediate"),
  P("fd-diff-viewer","Diff Viewer","⇄","#10b981","~1h","monaco-diff или react-diff-view: side-by-side/inline, syntax highlight, hunks navigation.","diff,code","intermediate"),
  P("fd-code-editor","Code Editor (Monaco)","⌨","#007acc","~1-2h","Monaco editor: languages, themes, IntelliSense, diff mode, custom key bindings.","editor,monaco","intermediate"),
  P("fd-terminal","Web Terminal (xterm.js)","⌗","#007acc","~1-2h","xterm.js: fit addon, WebLinks addon, search, copy/paste, WebSocket backend.","terminal,xterm","advanced"),
  P("fd-notification-center","Notification Center","⚑","#f59e0b","~1-2h","In-app notifications: список, unread badge, mark read, categories, real-time push.","notifications,ui","intermediate"),
  P("fd-onboarding-tour","Onboarding Tour","⚑","#f59e0b","~1-2h","react-joyride или Shepherd: steps, highlights, tooltips, skip, progress, persist completion.","onboarding,tour","intermediate"),
);

add.forEach(p => { p.compact = (p.text||"").slice(0,400); });
const existingIds = new Set(data.P.map(p=>p.id));
const toAdd = add.filter(p => !existingIds.has(p.id));
if (toAdd.length !== add.length) {
  console.error('Skipped duplicates:', add.filter(p=>existingIds.has(p.id)).map(p=>p.id));
}
data.P = [...data.P, ...toAdd];

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
const newSrc = src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`);
fs.writeFileSync('src/App.jsx', newSrc);

console.log('✓ Added', toAdd.length, 'prompts. Total:', data.P.length);
