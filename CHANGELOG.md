# Changelog

## v8.2 (2026-03-20)

### New Prompts
- 10 new prompts: Component Library, TS Migration, Playwright E2E, Storybook, i18n Full, Analytics, Deploy Vercel, Lighthouse Perf, Dark Mode Polish, Form Wizard
- Total: 175 prompts, 48 combos

### TypeScript
- tsconfig.json (strict: true)
- Type definitions: Prompt, Config, Combo, HubData, ThemeColors, Stats
- Utility modules: constants.ts, helpers.ts
- Custom hooks: useLocalStorage, useKeyboardShortcuts, useScrollProgress

### Testing
- 65 unit tests (vitest): helpers, constants, a11y, keyboard, edge cases, integration
- 8 E2E tests (playwright): load, search, theme, navigation, copy, shortcuts, mobile
- Total: 73 tests

### Features
- Global search across ALL sections (prompts, combos, cheat sheets, CLI commands)
- Pin prompts to top
- Glossary overlay (7 terms)
- Copy as Markdown button
- 12 keyboard shortcuts (1-5 sections, T theme, V view, R random, F focus, ? help, Ctrl+K search, Ctrl+/ compact)
- Table view with difficulty badges and model color dots
- Session timer in footer

### Infrastructure
- Service Worker (PWA offline support)
- vercel.json (security headers, caching, SPA rewrites)
- GitHub Actions CI (build + test + e2e)
- ARCHITECTURE.md, CONTRIBUTING.md

## v8.1 (2026-03-20)

### New Prompts
- 12 mega prompts (overnight 100+ tasks, features, fullstack, testing, security, refactor, perf, a11y, docs, sprint)
- 3 infinite prompts (♾️ Claude/Gemini/Codex — never stops)
- 6 new combos (Night Army, Mega Team 6, Maximum 10)
- Total: 165 prompts, 46 combos

### Features
- 70+ new features: table view, infinite scroll, focus mode, copy history, stats modal, mobile FAB, welcome banner, breadcrumbs, font size control, CSV/HTML/JSON export, settings backup/restore, bulk select, tag similarity, quick launch, auto-collapse
- 10 keyboard shortcuts

### Fixes
- localStorage: window.storage → real localStorage (settings now persist)
- XSS fix in HTML export (& < > " escaped)
- CSV export: quote escaping
- 3x TDZ fixes (list, pGet, t — variable used before declaration)
- location.reload → state retry (no page reloads)
- Search focus: document.activeElement → state-based

### Performance
- promptMap O(1) via Map (replaced 15+ P.find calls)
- rAF throttle on scroll handler
- Memoized difficulty stats
- will-change on scroll progress bar
- prefers-reduced-motion: reduce

### Accessibility
- focus-visible ring for all buttons
- aria-modal on all dialogs
- aria-live on toast, aria-current on tabs
- role="alert" on offline banner
- prefers-contrast: more support
- Skip navigation link

## v8.0 (Initial)

- 132 prompts, 14 configs, 35 combos
- 3 models: Claude Opus 4.6, Gemini 3.1 Pro, Codex CLI
- 3 languages: Russian, English, Kazakh
- Dark/light theme with persistence
- Search with debounce, filters, sorting
- Error boundary, skeleton loading
- Mobile responsive, print styles
