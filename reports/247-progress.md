# 24/7 Project Perfectionist — Progress Log

| Timestamp (UTC) | Category | Fix | Metric before → after |
|---|---|---|---|
2026-04-25T06:16:42Z | quality/lint | Fix 4 react-hooks/exhaustive-deps warnings: showGlossary in scroll-lock deps; mount-only initial scroll eslint-disable; keydown listener captures all 8 modal/state deps (no more ESC-on-stale-state); cp() useCallback deps swap P→pGet | lint warnings 4 → 0
2026-04-25T06:21:44Z | deps/patch | npm install: hono 4.12.14→4.12.15, vite 8.0.9→8.0.10 (also bumped overrides), vitest 4.1.4→4.1.5, eslint-plugin-react-refresh 0.4.26→0.5.2 | 4 outdated patch/minor → 0; 0 CVE retained
