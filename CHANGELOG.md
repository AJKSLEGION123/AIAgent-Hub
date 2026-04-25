# Changelog

Все значимые изменения проекта. Формат: [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/) · версионирование: [SemVer](https://semver.org/spec/v2.0.0.html).

## [13.0] — 2026-04-25

Massive consolidation + 24/7 hygiene pass.

### Changed
- **Промтов: 10 014 → 3 299** (-67 %). Удалены формульные per-language /
  per-cloud / per-pattern матрицы (`rl-aws-*`, `rl-py-*` × 17 языков и т.д.).
  Каждый оставшийся промт уникален, портативен (работает в любом проекте),
  обёрнут в `[AUTONOMY-v4]`, минимум 2 KB глубины.
- Bundle: 926 KB gzip → **537 KB gzip** (-42 %).
- Z blob: 1.1 MB → 584 KB (-47 %).
- ESLint 9 → 10, TypeScript 5 → 6, @vitejs/plugin-react 5 → 6, hono 4.12.14 → 4.12.15,
  vite 8.0.9 → 8.0.10, vitest 4.1.4 → 4.1.5, globals 16 → 17, @hono/node-server 1 → 2.
- Live counts (manifest, OG image, sitemap, README, CLAUDE.md, llms.txt) синхронизированы.

### Added
- **`∞ 24/7 Project Perfection`** flagship combo + `lp-247-perfectionist` (10-минутный
  непрерывный цикл доведения любого проекта до идеала, 10 категорий сканирования).
- `Self-Healing Project` combo: Telegram bot self-test, RAG knowledge from project,
  message quality watchdog, full UI click-sweep, project RAG.
- `/.well-known/security.txt` (RFC 9116) для координированного раскрытия.
- `Permissions-Policy` header (camera/mic/geo/gyro/usb/payment + FLoC opt-out).
- PNG og-image (1200 × 630, 273 KB) — Twitter/X совместимость.
- System-pref-aware `theme-color` (dark + light, media-scoped).
- `npm run typecheck` (`tsc --noEmit`) скрипт.
- `@vitest/coverage-v8` + tracking: `src/utils/` 100 %, `src/hooks/` 100 % lines.
- 16 новых vitest тестов; +1 e2e regression (Escape closes shortcut dialog).
- Dependabot config (npm grouped, pip, github-actions).
- `.github/workflows/ci.yml` gates: lint + typecheck + data-integrity (было только build/test).
- `scripts/requirements.txt` (paramiko для self-hosted deploy).
- `concurrently` + `playwright` как explicit devDep (бывшие ghost-deps).
- `knip.json` config — clean dead-code reports.
- `.gitattributes` — нормализация LF на Windows commits.
- `reports/247-progress.md` — лог каждой итерации полного 35-tick 24/7 цикла.

### Fixed
- **4 react-hooks/exhaustive-deps stale-closure bugs** (App.jsx scroll-lock, mount-only
  scroll, global keydown listener, copy callback). ESC-закрытие модалок больше не зависит
  от устаревшего closure.
- **`scripts/check-data.cjs`**: было только `console.log` на issues — теперь `process.exit(1)`,
  CI gate реально fail-fast.
- **api.test.js**: 11 silent-skip patterns (`if (!res) return`) — теперь
  `describe.skipIf(!serverUp)` даёт честный "9 skipped".
- **e2e silent-skips**: 4 теста (copy/star/stats/lang buttons) переведены с
  `if (count > 0)` на assert+act; surfaced и поправлен stale `aria-label="Stats"`
  → `"Statistics"`.
- **Fonts perf**: `@import` → `<link rel="stylesheet">` в `<head>` —
  parallel fetch вместо serial waterfall (∼1 RTT FCP improvement).
- **PWA manifest**: stale "10 036 промтов" → актуальные 3 299.
- **Stats version timeline**: + `v13:3299` entry (визуально показывает консолидацию).
- **Self-hosted deploy smoke test**: 5 retry attempts с linear backoff (2/4/6/8 s)
  вместо single-shot 3 s — false-rollback rate ∼100 % → 0 %.
- TypeScript error в `useLocalStorage` test (object-shape inference).
- Stale 8.3 → shape-check (`/^\d+\.\d+/`) в api health-check.
- 53 строки dead code: `useKeyboardShortcuts.ts`, `decompress.ts` (knip-flagged).

### Security
- Зеро vulnerabilities (5 CVE из v12 фикснуты ранее, retained).
- Permissions-Policy + security.txt + CSP + HSTS + X-Frame-Options + Referrer-Policy.

---

## [12.0] — Apr 2026 (peak count)

Массовое расширение каталога: 10 036 промтов через генерируемые матрицы (язык × задача,
облако × сервис, паттерн × язык). Hub стал «большим», но многие промты повторяют друг
друга в разных формах. Подготовка к консолидации в v13.

### Highlights
- 10 036 промтов на пике каталога.
- ∞ Opus 4.7 Perfectionist Suite combo.
- ∞ God-Mode Autonomous combo.
- `[AUTONOMY-v4]` wrapper во всех промтах.

---

## [11.5] — Apr 2026

1024 промта, расширение по фреймворкам.

## [11.0] — Apr 2026

296 промтов. Введён `[AUTONOMY-v4]` wrapper.

## [9.1] — Apr 2025

188 промтов. Editorial UI (Fraunces + Instrument Serif + JetBrains Mono).

## [8.2] — Mar 2026

175 prompts, 48 combos. Strict TypeScript, 73 tests, global search, glossary,
keyboard shortcuts (1-5 sections, T theme, V view, R random, F focus, ?, Ctrl+K, Ctrl+/),
table view, PWA Service Worker.

## [7.0] — Mar 2025

132 промта.

## [5.0] — Feb 2025

100 промтов. Self-hosted Docker + Cloudflare Tunnel.

## [3.0] — Jan 2025

34 промта. Combo system.

## [1.0] — Nov 2024

15 промтов. Первый запуск каталога.
