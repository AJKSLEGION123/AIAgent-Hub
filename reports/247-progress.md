# 24/7 Project Perfectionist — Progress Log

| Timestamp (UTC) | Category | Fix | Metric before → after |
|---|---|---|---|
2026-04-25T06:16:42Z | quality/lint | Fix 4 react-hooks/exhaustive-deps warnings: showGlossary in scroll-lock deps; mount-only initial scroll eslint-disable; keydown listener captures all 8 modal/state deps (no more ESC-on-stale-state); cp() useCallback deps swap P→pGet | lint warnings 4 → 0
2026-04-25T06:21:44Z | deps/patch | npm install: hono 4.12.14→4.12.15, vite 8.0.9→8.0.10 (also bumped overrides), vitest 4.1.4→4.1.5, eslint-plugin-react-refresh 0.4.26→0.5.2 | 4 outdated patch/minor → 0; 0 CVE retained
2026-04-25T06:24:27Z | seo+security | sitemap.xml lastmod 2026-04-21→2026-04-25 (post-consolidation freshness signal); vercel.json +Permissions-Policy header (camera/mic/geo/gyro/usb/payment/FLoC all disabled) | sitemap stale 4d→0d; sec headers 4→5
2026-04-25T06:29:37Z | quality/types | Fix tsc error in hooks.test.ts (useLocalStorage<T> generic narrowed too tightly to {a:number} blocked dynamic-shape test); explicitly typed as {a:number; b?:number}. Added npm run typecheck script (tsc --noEmit) to prevent regression | tsc errors 1 → 0; new typecheck script available
