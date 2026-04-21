/**
 * Premium Opus 4.7 (1M context) prompts — project-agnostic.
 * Полный набор промтов использующих 1M context: читаем ВЕСЬ проект за один проход,
 * находим и исправляем всё сразу, а не куском.
 */
const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

function p(id, m, role, icon, ac, time, text, tags, difficulty) {
  return { id, m, mk:"opus47m", role, type:"command", icon, ac, time, text,
    tags: tags.split(","), difficulty, output:"Continuous improvement", related:[], prereqs:[], v:"12.0" };
}

const add = [];

// ═════════════════════════════════════════════════════
// FLAGSHIP: Infinite Polish Loop
// ═════════════════════════════════════════════════════
add.push(p(
  "opus-infinite-polish",
  "/ralph-loop",
  "∞ Infinite Polisher",
  "∞",
  "#d4a574",
  "∞ continuous",
  `/ralph-loop "ТЫ — PRINCIPAL ENGINEER С 1M CONTEXT. Работай над ЛЮБЫМ проектом как сеньор, который доводит его до идеала.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ФАЗА 0 — ПОЛНАЯ РАЗВЕДКА (ИСПОЛЬЗУЙ ВСЕ 1M TOKEN'ОВ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Дерево проекта: все файлы, размеры, последние даты.
2. Конфиги: package.json/pyproject/Cargo/go.mod/composer/Gemfile — зависимости, скрипты, версии.
3. Git: последние 50 коммитов, active branches, uncommitted, stashes.
4. Тесты: coverage, flaky list, skipped tests.
5. CI: последние 20 runs — успешные/упавшие, медленные.
6. Документация: README, ADRs, CHANGELOG, docs/.
7. Entry points: main/index/app файлы и их импорты вглубь.
8. Загрузи В КОНТЕКСТ все критичные файлы (core domain + public API + tests).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ФАЗА 1 — INVENTORY ISSUES (10 ИЗМЕРЕНИЙ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Создай issues.md с категориями (severity: P0/P1/P2/P3):
1. BUGS: null деrefs, off-by-one, race conditions, memory leaks, unhandled errors, silent failures.
2. SECURITY: OWASP Top 10, secrets in code, SQL/cmd injection, XSS/CSRF, weak crypto, auth bypass.
3. PERFORMANCE: N+1 queries, sync I/O в hot path, unbounded loops, bundle size, LCP/INP/CLS.
4. TECH DEBT: TODO/FIXME/HACK, deprecated API, dead code, duplicate code, god classes.
5. UX/UI: inconsistent spacing, broken states (empty/loading/error), missing feedback, a11y gaps.
6. TYPES: any/unknown, implicit any, missing generics, type holes.
7. TESTS: missing coverage <70%, flaky, no edge cases, no error paths, snapshot overuse.
8. DOCS: outdated README, missing examples, broken links, no API docs, no changelog.
9. DEPS: outdated (npm outdated/pip-audit), vulnerabilities, unused, licenses.
10. DX: slow build, slow tests, no hot reload, missing lint rules, confusing error messages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ФАЗА 2 — ПРИОРИТИЗАЦИЯ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Score каждого issue: (impact 1-5) × (confidence 1-5) / (effort 1-5).
- Сортируй desc. Top-1 — работаем сейчас.
- P0 (production broken/security) всегда top, даже при низком impact-score.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ФАЗА 3 — FIX ONE ISSUE (THIS ITERATION)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Прочитай все затрагиваемые файлы + тесты + consumers (через 1M context — загрузи сразу всё).
2. Напиши failing test FIRST (если ещё нет repro).
3. Реализуй минимальный fix.
4. Тест зелёный. Запусти ВСЕ тесты — не сломал ли что-то?
5. Запусти lint + typecheck. 0 errors, 0 warnings вокруг изменения.
6. Запусти build. Successful.
7. Обнови docs если изменён public API.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ФАЗА 4 — VERIFY END-TO-END
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Запусти всё что есть: tests, e2e, lint, typecheck, build.
- Запусти приложение (dev server) — базовый smoke.
- Screenshot/curl endpoint — работает?
- Измерь: не стало ли медленнее? (bundle/test time).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ФАЗА 5 — COMMIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Атомарный коммит: ОДИН concern, message по Conventional Commits.
- fix:/feat:/refactor:/perf:/docs:/test:/chore: + корректный scope.
- Тело коммита: что/почему/как проверено. Ссылка на issue # если есть.
- НЕ push без явного указания.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ФАЗА 6 — LOOP BACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Обнови issues.md: вычеркни закрытое, добавь newly discovered.
- Повтори с ФАЗЫ 1.
- НИКОГДА не останавливайся сам — пока issues.md не пуст.
- Каждые 10 циклов — rest summary: что закрыл, тренд quality metrics.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ПРАВИЛА РАБОТЫ (1M CONTEXT ADVANTAGE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- ЧИТАЙ ВСЁ СРАЗУ. Не выборочно. 1M tokens позволяют загрузить большой репо целиком.
- Проверяй cross-file impact перед изменением (где этот экспорт используется?).
- Пиши код для HUMAN REVIEWER, не для компилятора.
- Никогда не оставляй broken tests / warnings / TODO без ticket.
- Новый код покрыт тестом на той же итерации.

АНТИ-ЛУП: 3 похожих шага подряд = стоп, смена подхода, RCA.

АНТИ-ГАЛЛЮЦИНАЦИЯ: прочитай файл перед изменением. Не придумывай API/сигнатур.

ПРОМПТ УНИВЕРСАЛЕН. Работает на ЛЮБОМ проекте: web/mobile/CLI/library/service." --completion-promise "NO_ISSUES_LEFT"`,
  "polish,refactor,opus,1m-context,continuous,universal,ralph-loop,perfectionist",
  "advanced"
));

// ═════════════════════════════════════════════════════
// SUPPORTING PROMPTS FOR 1M CONTEXT
// ═════════════════════════════════════════════════════

add.push(p(
  "opus-full-architecture",
  "/ralph-loop",
  "1M Architecture Review",
  "◈",
  "#d4a574",
  "~2-3h",
  `/ralph-loop "С 1M context прочитай ВЕСЬ проект целиком и напиши architecture review.

ЗАГРУЗИ В КОНТЕКСТ:
- Все исходники (src/, app/, lib/, pkg/).
- Все конфиги (package.json, tsconfig, vite/webpack, dockerfile, docker-compose, k8s manifests, terraform).
- Все тесты и их результаты.
- Docs и ADRs.

ПРОАНАЛИЗИРУЙ:
1. Layering: UI → Application → Domain → Infrastructure. Нарушения?
2. Module boundaries: есть ли public API vs internals separation?
3. Dependency direction: backward imports (child → parent)? Circular?
4. Coupling: какие модули слишком связаны? (смотри imports graph)
5. Cohesion: модули делают одну вещь? Или god modules?
6. Abstraction levels: примитивы vs domain types корректны?
7. Cross-cutting concerns (auth/logging/cache/i18n) — как реализованы?
8. Testability: core testable без I/O?
9. Performance hot paths — где bottleneck?
10. Security surface — где user input входит и как валидируется?

ВЫХОД: ARCHITECTURE_REVIEW.md с:
- Current state diagram (Mermaid).
- Top 10 issues with severity.
- Refactor roadmap: 3 этапа, low-risk → high-impact.
- Metrics: cyclomatic complexity top-20, file/function length outliers.

АНТИ-ЛУП. УНИВЕРСАЛЬНО." --completion-promise "REVIEW_DONE"`,
  "architecture,review,opus,1m-context,universal",
  "advanced"
));

add.push(p(
  "opus-full-security",
  "/ralph-loop",
  "1M Security Sweep",
  "🛡",
  "#d4a574",
  "~2-4h",
  `/ralph-loop "С 1M context проведи ПОЛНЫЙ security audit.

ЗАГРУЗИ: исходники + конфиги + IaC + env.example + dependencies.

CHECKLIST OWASP + BEYOND:
A01 Broken Access Control: IDOR, vertical/horizontal priv escalation, mass assignment, missing auth middleware.
A02 Cryptographic Failures: weak algorithms (MD5/SHA1, DES), hardcoded keys, TLS 1.0/1.1, weak randomness (Math.random для tokens).
A03 Injection: SQL (поиск raw concat), command injection (exec с user input), LDAP, NoSQL, XPath, prompt injection (LLM).
A04 Insecure Design: missing rate limits, no lockout, predictable tokens, race conditions в business logic.
A05 Misconfiguration: debug on in prod, default creds, verbose errors, CORS too open, exposed admin endpoints.
A06 Vulnerable Deps: npm audit / pip-audit / cargo audit — найти и исправить.
A07 Auth Failures: no MFA for admin, short session timeout, session fixation, no lockout.
A08 Integrity: no SRI на CDN scripts, unsigned packages, no SBOM.
A09 Logging: sensitive data в logs (passwords/PII/tokens), no audit trail, no alerts на suspicious.
A10 SSRF: validate outbound URLs, block metadata endpoints (169.254.169.254).

ДОПОЛНИТЕЛЬНО:
- Secrets в Git history (git log -p | grep).
- .env.example vs .env — secrets не коммитятся?
- Dockerfile: non-root, no secrets в layers, minimal base.
- K8s: PSA level, NetworkPolicy, read-only root fs, resource limits.
- CI: secrets через vault, signed commits.

ВЫХОД: SECURITY_AUDIT.md с CVSS score per issue, POC (где возможно), fix каждый сейчас же в отдельном коммите. Приоритет P0 (RCE/auth bypass) → P3 (hardening).

УНИВЕРСАЛЬНО для любого стека. АНТИ-ЛУП." --completion-promise "SECURITY_CLEAN"`,
  "security,audit,owasp,opus,1m-context,universal",
  "advanced"
));

add.push(p(
  "opus-full-performance",
  "/ralph-loop",
  "1M Performance Audit",
  "⚡",
  "#d4a574",
  "~2-3h",
  `/ralph-loop "С 1M context — полный performance audit.

1. PROFILE baseline:
   - Backend: p50/p95/p99 latency всех endpoints (если доступен APM).
   - Frontend: LCP/INP/CLS/TTFB через Lighthouse CI.
   - Bundle: total size, per-chunk, duplicates.
   - DB: slow query log, EXPLAIN на top-10 запросах.

2. SCAN CODE на известные anti-patterns:
   - N+1 queries (цикл с DB внутри).
   - Sync I/O в async контексте.
   - Unbounded queries (no LIMIT).
   - Missing indexes (JOIN/WHERE на non-indexed columns).
   - Memory leaks: event listeners без cleanup, closures держащие большие scopes, timers без clearTimeout.
   - React: ненужные re-renders, missing memo, большие components.
   - Bundle: moment.js, lodash full, unused polyfills.
   - Images: no lazy, no responsive, no modern format.
   - Fonts: no font-display, too many weights, no preload.

3. ИЗМЕРЬ BEFORE:
   - npm run build → размер.
   - npm test → время.
   - Lighthouse → LCP/INP/CLS.
   - k6/Locust quick load → p95.

4. FIX по приоритету (impact × effort):
   - Quick wins first: indexes, lazy imports, debounce, memo.
   - Medium: query optimization, caching, code splitting.
   - Heavy: refactor hot path, infra upgrade.

5. ИЗМЕРЬ AFTER каждого fix — прогресс в % заметен?

6. ВЫХОД: PERFORMANCE_REPORT.md с before/after metrics, топ wins.

УНИВЕРСАЛЬНО. АНТИ-ЛУП." --completion-promise "PERF_TARGETS_MET"`,
  "performance,profiling,opus,1m-context,universal",
  "advanced"
));

add.push(p(
  "opus-full-a11y",
  "/ralph-loop",
  "1M Accessibility Sweep",
  "♿",
  "#d4a574",
  "~2-3h",
  `/ralph-loop "С 1M context — полный accessibility audit по WCAG 2.1 AA.

AUTOMATED: axe-core, Lighthouse a11y, pa11y — запусти на каждой странице.

MANUAL через исходники:
1. Semantic HTML: h1-h6 hierarchy, landmark roles (<header>/<main>/<nav>/<footer>), button vs <a>, lists <ul>.
2. ARIA: labels на icon-only buttons, aria-expanded на toggles, aria-live на dynamic updates, role='alert' на errors.
3. Keyboard: Tab order logical, Escape закрывает modals, Enter/Space активирует, arrows в lists/menus, focus visible ring.
4. Focus management: trap в dialogs, return focus on close, skip links.
5. Screen reader: все form fields labeled, error announced, status updates polite/assertive.
6. Visual: contrast ratio 4.5:1 (text), 3:1 (large), color не единственный индикатор, text scales 200%.
7. Motion: prefers-reduced-motion respected, no auto-playing video with sound.
8. Images: alt text для informative, aria-hidden для decorative.
9. Forms: <label for>, required marked, inline validation, submit errors focused.
10. Mobile: 44x44 tap targets, no horizontal scroll, zoom not disabled.

FIX каждое violation — не копи. Tests: @axe-core/playwright, jest-axe в CI.

ВЫХОД: A11Y_REPORT.md с score per page, violations fixed, remaining backlog.

УНИВЕРСАЛЬНО для React/Vue/Svelte/etc. АНТИ-ЛУП." --completion-promise "WCAG_AA_CLEAN"`,
  "a11y,wcag,accessibility,opus,1m-context,universal",
  "advanced"
));

add.push(p(
  "opus-full-tests",
  "/ralph-loop",
  "1M Test Coverage Push",
  "✓",
  "#d4a574",
  "~3-4h",
  `/ralph-loop "С 1M context — доведи test coverage до 80%+ (line) и 60%+ (mutation).

1. BASELINE: npm test -- --coverage. Запиши current: line/branch/function.

2. GAP ANALYSIS:
   - Файлы с coverage 0% — критичные? (utils, helpers, routes).
   - Функции с coverage <50% — top-20 list.
   - Branches не покрыты — где условия без else-path теста.
   - Error paths (catch блоки) тестируются?

3. СТРАТЕГИЯ:
   - Unit tests для pure functions (быстро, дёшево).
   - Integration tests для слоёв (DB + service).
   - E2E для критических user flows (smoke).
   - Contract tests для APIs (если microservices).

4. ПИШИ ТЕСТЫ (TDD-style):
   - Name: describe('Module') > it('should X when Y, given Z').
   - AAA: Arrange / Act / Assert — один assert (обычно).
   - Edge cases: null/undefined/empty/max/negative/unicode/timezone.
   - Error paths: throw on invalid, recover on transient.

5. MUTATION TESTING: Stryker/mutmut/PITest. Цель 60%+ mutation score.

6. ANTI-PATTERNS remove:
   - Тесты testing mocks, не код.
   - Snapshot без смысла.
   - Timing sleeps — replace with waitFor/polling.
   - Shared mutable state между тестами.

7. CI: coverage gate в PR (не падает), flaky detection + quarantine.

ВЫХОД: COVERAGE_REPORT.md с before/after. Новые tests committed in batches.

УНИВЕРСАЛЬНО. АНТИ-ЛУП." --completion-promise "COVERAGE_80_PLUS"`,
  "testing,coverage,opus,1m-context,universal",
  "advanced"
));

add.push(p(
  "opus-full-types",
  "/ralph-loop",
  "1M Type Safety Push",
  "⎈",
  "#d4a574",
  "~2-4h",
  `/ralph-loop "С 1M context — доведи type safety до максимума.

TYPESCRIPT:
1. tsconfig.json strict:true (и все подопции strictNullChecks, noImplicitAny, strictFunctionTypes).
2. noUncheckedIndexedAccess, exactOptionalPropertyTypes.
3. target ES2022+, module NodeNext, moduleResolution bundler.
4. Устрани ВСЕ // @ts-ignore / // @ts-expect-error без reason.
5. any → unknown → concrete types. Grep ': any' — zero matches.
6. Public API: explicit return types, no implicit inference.
7. Генерики: explicit constraints (extends).
8. Discriminated unions для state (Loading/Success/Error).
9. Branded types для IDs (UserId vs PostId).
10. satisfies operator для config objects.

PYTHON (mypy/pyright):
1. mypy --strict. Fix every error.
2. Все функции typed (params + return).
3. TypedDict для dicts, Pydantic v2 для validation.
4. Optional[T] vs T | None явно.
5. Protocols для structural typing.
6. py.typed marker в library packages.

GO:
- gofmt + golint + staticcheck clean.
- No interface{} unless justified.
- Explicit error handling (no _).

RUST:
- clippy --all-targets -- -D warnings clean.
- No unsafe unless documented.
- Proper Result<T, E> everywhere.

FIX BATCHES: по 20-50 errors за коммит, run full typecheck after each.

ВЫХОД: TYPE_SAFETY.md: before/after error counts, strict flags enabled.

УНИВЕРСАЛЬНО. АНТИ-ЛУП." --completion-promise "TYPES_STRICT_CLEAN"`,
  "types,typescript,mypy,opus,1m-context,universal",
  "advanced"
));

add.push(p(
  "opus-full-deps",
  "/ralph-loop",
  "1M Dependency Audit + Update",
  "📦",
  "#d4a574",
  "~2-3h",
  `/ralph-loop "С 1M context — полный аудит и обновление зависимостей.

1. SECURITY:
   - npm audit / pip-audit / cargo audit / go list -m -u all.
   - Критичные vulnerabilities — fix немедленно.
   - Snyk/Dependabot alerts.
   - SBOM: syft/cyclonedx-cli.

2. OUTDATED:
   - npm outdated / pip-check / cargo outdated.
   - Категоризация: patch (auto), minor (check CHANGELOG), major (plan).
   - Per-major-upgrade: читай release notes, breaking changes, migration guide.

3. UNUSED:
   - depcheck (Node), unimport (Python), cargo-machete (Rust).
   - Удали unused — меньше bundle, меньше surface.

4. DUPLICATE:
   - npm ls — same lib разных версий? → resolutions/overrides.
   - Lock file analysis.

5. LICENSE compliance:
   - license-checker / cargo-license.
   - GPL-compatible с твоим продуктом? Проверь корпоративную policy.

6. MAINTENANCE health:
   - Last commit > 1 год? → flag.
   - 1 maintainer + low activity → risk.
   - Issues open > 100 без движения → red flag.

7. REPLACE:
   - Moment.js → date-fns / Temporal.
   - Lodash full → lodash-es + specific imports или native.
   - Axios → fetch (если Node 18+).
   - node-sass → sass (Dart).

8. UPDATE WORKFLOW:
   - По одной major version за коммит.
   - Запусти все тесты после каждого.
   - Обнови lock file.
   - Обнови CI cache.

ВЫХОД: DEPS_REPORT.md: before/after, count updated, count removed, size diff.

УНИВЕРСАЛЬНО. АНТИ-ЛУП." --completion-promise "DEPS_CURRENT"`,
  "dependencies,audit,upgrade,opus,1m-context,universal",
  "advanced"
));

add.push(p(
  "opus-full-docs",
  "/ralph-loop",
  "1M Docs Sync",
  "📚",
  "#d4a574",
  "~2-3h",
  `/ralph-loop "С 1M context — полная синхронизация документации с кодом.

1. README.md:
   - Description, badges (build/coverage/license), quickstart.
   - Install, config (all env vars), usage examples.
   - Development setup: prerequisites, build, test, run.
   - Deployment section.
   - Contributing link.
   - License.

2. API DOCS:
   - OpenAPI spec sync с handlers.
   - GraphQL schema docs sync.
   - Code: JSDoc/TypeDoc/Sphinx/rustdoc generate and publish.
   - Every public export documented: params, returns, throws, example.

3. ARCHITECTURE DECISION RECORDS (ADR):
   - Собери все существующие ADRs.
   - Для каждого major design choice пиши ADR retroactively (если нет).
   - Template: Context, Decision, Alternatives, Consequences.

4. CHANGELOG.md (Keep a Changelog format):
   - Generate from conventional commits / release-please.
   - Categorize: Added/Changed/Deprecated/Removed/Fixed/Security.
   - Link PRs/issues.

5. RUNBOOKS:
   - На каждый critical alert — runbook.
   - Symptoms, impact, detection, mitigation, verify, follow-up.

6. CONTRIBUTING.md:
   - Dev setup, branching, commit convention, PR template, code of conduct.

7. DOCS FORMAT:
   - MDX/Markdown, lint (markdownlint, remark).
   - Links check (lychee).
   - Code examples runnable (test them!).
   - Screenshots up-to-date.

8. PUBLISH:
   - Docusaurus/Mintlify/Starlight/VitePress.
   - CI publish on main merge.
   - Search (Algolia DocSearch / FlexSearch).

ВЫХОД: DOCS_STATE.md с gaps closed. Commit per doc.

УНИВЕРСАЛЬНО. АНТИ-ЛУП." --completion-promise "DOCS_IN_SYNC"`,
  "docs,documentation,opus,1m-context,universal",
  "advanced"
));

add.push(p(
  "opus-full-dead-code",
  "/ralph-loop",
  "1M Dead Code Elimination",
  "🧹",
  "#d4a574",
  "~1-2h",
  `/ralph-loop "С 1M context — найди и удали ВСЁ dead code / unused / unreferenced.

TOOLS:
- TypeScript/JS: knip, ts-prune, ts-unused-exports, depcheck.
- Python: vulture, dead, unimport.
- Go: deadcode, staticcheck U1000.
- Rust: cargo-machete, #[warn(dead_code)].
- CSS: purgecss (с allowlist для dynamic classes), unused-imports plugin.

КАТЕГОРИИ:
1. Unused imports per file (auto-fix).
2. Unused variables/functions/classes.
3. Unused exports (public API не имеет consumers).
4. Unreachable code (после return/throw).
5. Dead branches (условия всегда true/false).
6. Commented-out blocks (если есть в git — удалить из текущего).
7. Unused dependencies в package.json.
8. Unused translations в i18n JSON файлах.
9. Unused CSS classes.
10. Unused feature flags (всегда on/off в production config).
11. Deprecated endpoints без callers.
12. Old migration files (выполненные > 1 год назад — в archive/).

ПРАВИЛА:
- Dynamic imports (require(variable)) — static tools не видят → проверь runtime.
- Public API library — НЕ удаляй без major version bump.
- Feature flags — проверь production config перед удалением.

FIX: по 1 категории за коммит. Tests зелёные после каждого.

BONUS: code size reduction в %. Bundle size reduction в KB.

ВЫХОД: DEAD_CODE_REPORT.md: удалено X files, Y lines, Z deps. Bundle -W KB.

УНИВЕРСАЛЬНО. АНТИ-ЛУП." --completion-promise "NO_DEAD_CODE"`,
  "dead-code,cleanup,opus,1m-context,universal",
  "intermediate"
));

add.push(p(
  "opus-full-ux",
  "/ralph-loop",
  "1M UX Polish Sweep",
  "◆",
  "#d4a574",
  "~2-4h",
  `/ralph-loop "С 1M context — полный UX polish pass.

1. EMPTY STATES: каждый список/таблица/search с empty state? Illustration + message + CTA.
2. LOADING STATES: Skeleton/shimmer везде где loading > 300ms. НЕ spinner в центре.
3. ERROR STATES: retry button, clear message (not 'Error 500'), fallback UI.
4. SUCCESS FEEDBACK: toast на успешные actions, visual confirmation.
5. FORM UX:
   - Inline validation onBlur (не onChange).
   - Errors под полем (не alert).
   - Required indicator (asterisk or text).
   - Submit disabled until valid.
   - Loading state on submit (disable + spinner).
   - Server error → field-level если возможно.
6. NAVIGATION:
   - Active state visible.
   - Breadcrumbs если depth > 2.
   - Back button предсказуемый.
   - 404 page with search/home link.
7. MOBILE:
   - Tap targets 44x44 min.
   - No horizontal scroll.
   - Keyboard не закрывает input.
   - Pull-to-refresh на feed.
8. DARK MODE parity: все компоненты работают, no flash.
9. ANIMATIONS: 150-300ms, easing ease/cubic-bezier, respect reduced-motion.
10. MICROCOPY:
   - Plain language (не jargon).
   - Action-oriented buttons ('Save changes' не 'OK').
   - Helpful error messages (what + how to fix).
   - Placeholder != label.
11. DENSITY:
   - Whitespace breathing room.
   - Consistent spacing scale (4/8/12/16/24/32/48/64).
   - Line-height 1.5 для body.
12. HIERARCHY:
   - One primary CTA per view.
   - Heading scale h1 > h2 > h3 чёткий.
   - Color accent на важных действиях, muted на secondary.

FIX по 1 области за sweep. Screenshot before/after.

ВЫХОД: UX_POLISH.md with fixed items, screenshots.

УНИВЕРСАЛЬНО. АНТИ-ЛУП." --completion-promise "UX_POLISHED"`,
  "ux,polish,design,opus,1m-context,universal",
  "advanced"
));

add.push(p(
  "opus-full-refactor",
  "/ralph-loop",
  "1M Deep Refactor",
  "⎔",
  "#d4a574",
  "~3-5h",
  `/ralph-loop "С 1M context — deep refactor pass.

1. LONG METHODS (> 50 lines): extract method / extract class.
2. LONG FILES (> 300 lines): split по responsibilities.
3. GOD CLASSES (> 500 lines / 20+ methods): разбей по SRP.
4. DEEP NESTING (> 4 levels): early return, guard clauses, extract helpers.
5. COMPLEX CONDITIONALS: extract to named boolean function.
6. DUPLICATE CODE (DRY): найди через копирование (jscpd/dupl/similar.py), extract.
7. PRIMITIVE OBSESSION: Money class instead of number. Email type instead of string.
8. FEATURE ENVY: метод класса A больше работает с полями B → переместить.
9. DATA CLUMPS: одинаковые 3+ параметра везде → extract to object.
10. SHOTGUN SURGERY: 1 change → 20 files → централизуй.
11. NAMING:
    - Functions — verbs.
    - Variables — nouns.
    - Booleans — is/has/can/should.
    - Intention-revealing.
12. DEAD PARAMS: всегда null/default? Remove.
13. MAGIC NUMBERS: extract to const with meaningful name.
14. COMMENTS explaining WHAT → rename code. Comments только для WHY.

СТРАТЕГИЯ:
- Один concern за коммит.
- Тесты зелёные после каждого шага.
- Behavior preserved. НЕ меняй contract в refactor commit.
- Безопасные steps (IDE refactor > manual где можно).

MEASURE:
- Cyclomatic complexity (gocyclo/complexity-report): before/after.
- File length distribution.
- Coupling (dep-cruiser): снизилось?
- Test runtime: не вырос ли.

ВЫХОД: REFACTOR_LOG.md with metrics before/after, commits list.

УНИВЕРСАЛЬНО. АНТИ-ЛУП." --completion-promise "REFACTOR_DONE"`,
  "refactor,clean-code,opus,1m-context,universal",
  "advanced"
));

add.push(p(
  "opus-full-lint-zero",
  "/ralph-loop",
  "1M Zero-Warning Pass",
  "◎",
  "#d4a574",
  "~1-2h",
  `/ralph-loop "С 1M context — доведи проект до ZERO warnings / errors везде.

1. LINTERS:
   - ESLint --max-warnings 0 (JS/TS).
   - Biome/Rome equivalent.
   - Ruff check . --statistics (Python).
   - Clippy -- -D warnings (Rust).
   - go vet ./... + staticcheck (Go).
   - RuboCop (Ruby).

2. TYPE CHECKERS:
   - tsc --noEmit (TS strict).
   - mypy --strict (Python).
   - pyright strict mode.
   - flow check (если Flow).

3. BUILD:
   - No deprecation warnings in build logs.
   - No 'chunks larger than 500 kB' warnings (если не acceptable).
   - No 'missing peer dependencies'.

4. RUNTIME:
   - Browser console — zero errors, zero warnings.
   - Server logs — zero unexpected errors.
   - Test runs — zero deprecation warnings.

5. CSS:
   - stylelint clean.
   - No unknown properties, no unknown at-rules.

6. SECURITY:
   - npm audit — zero critical/high.
   - Snyk — zero issues.

7. TESTS:
   - No console.log left.
   - No skipped tests (test.skip) без reason.
   - No focused tests (fdescribe/it.only).

8. DEPENDENCIES:
   - No 'extraneous' packages.
   - No duplicate versions.

PROCESS:
- Один rule/tool за коммит.
- По 10-50 warnings fixes per iteration.
- Re-run check после каждого.

ВЫХОД: LINT_ZERO.md: before/after counts per tool.

УНИВЕРСАЛЬНО. АНТИ-ЛУП." --completion-promise "ZERO_WARN"`,
  "lint,zero-warnings,opus,1m-context,universal",
  "intermediate"
));

add.push(p(
  "opus-full-final-qa",
  "/ralph-loop",
  "1M Final QA Gauntlet",
  "🏁",
  "#d4a574",
  "~2-3h",
  `/ralph-loop "С 1M context — финальный QA gauntlet перед release.

CHECKLIST (всё должно быть ZELENO):

BUILD:
☐ npm run build / cargo build --release / go build — success, no warnings.
☐ Bundle size в пределах budget.
☐ Source maps correct.

TESTS:
☐ All unit tests pass.
☐ All integration tests pass.
☐ All e2e tests pass (Playwright smoke suite).
☐ Coverage >= threshold.

QUALITY:
☐ Linter clean (eslint --max-warnings 0).
☐ Type check clean (tsc --noEmit / mypy strict).
☐ Format check (prettier --check / biome format).
☐ No console.log in production code.
☐ No TODO/FIXME без ticket reference.

SECURITY:
☐ npm audit — zero critical/high.
☐ Secrets scan (gitleaks) clean.
☐ SBOM generated.

PERFORMANCE:
☐ Lighthouse >= 90 (Perf/A11y/Best/SEO).
☐ CWV в бюджете (LCP<2.5s, INP<200ms, CLS<0.1).
☐ Bundle < target.

RUNTIME SMOKE:
☐ Dev server starts without errors.
☐ Home page loads.
☐ Critical flows работают (auth/core/checkout).
☐ Browser console — zero errors.
☐ Server logs — zero errors.

INFRA:
☐ Docker builds successfully.
☐ Container healthcheck passes.
☐ K8s manifests valid (kubectl --dry-run).
☐ Terraform plan clean.

DOCS:
☐ README up-to-date (install, use, deploy).
☐ CHANGELOG updated.
☐ API docs в sync.
☐ Migration guide (если breaking).

RELEASE:
☐ Version bumped (semver).
☐ Git tag создан.
☐ GitHub Release notes.
☐ Deploy to staging verified.

ВСЕ failures — fix прямо сейчас, не откладывай.

ВЫХОД: RELEASE_READINESS.md: checkmarks + remaining blockers.

УНИВЕРСАЛЬНО. АНТИ-ЛУП." --completion-promise "SHIP_READY"`,
  "qa,release,opus,1m-context,universal",
  "advanced"
));

// COMBO
const combo = {
  name: "∞ Opus 4.7 Perfectionist Suite",
  ids: [
    "opus-infinite-polish",
    "opus-full-architecture",
    "opus-full-security",
    "opus-full-performance",
    "opus-full-a11y",
    "opus-full-tests",
    "opus-full-types",
    "opus-full-deps",
    "opus-full-docs",
    "opus-full-dead-code",
    "opus-full-ux",
    "opus-full-refactor",
    "opus-full-lint-zero",
    "opus-full-final-qa"
  ],
  color: "#d4a574",
  descRu: "14 универсальных промтов для Claude Opus 4.7 (1M context) — полировка любого проекта до идеала. Infinite polish loop + полные аудиты arch/sec/perf/a11y/tests/types/deps/docs + deep refactor + zero-warnings + final QA.",
  descEn: "14 universal prompts for Claude Opus 4.7 (1M context) — polishing any project to perfection. Infinite polish loop + full arch/sec/perf/a11y/tests/types/deps/docs audits + deep refactor + zero-warnings + final QA."
};
data.COMBOS.ru.push({ name: combo.name, ids: combo.ids, agents: combo.ids, desc: combo.descRu, color: combo.color });
data.COMBOS.en.push({ name: combo.name, ids: combo.ids, agents: combo.ids, desc: combo.descEn, color: combo.color });

// Write out
add.forEach(x => { x.compact = (x.text||"").slice(0, 500); });
const existingIds = new Set(data.P.map(x=>x.id));
const toAdd = add.filter(x => !existingIds.has(x.id));
console.error('Dupes:', add.length - toAdd.length);
data.P = [...data.P, ...toAdd];

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('✓ Added', toAdd.length, 'Opus 4.7 premium prompts. Total:', data.P.length);
console.log('✓ Added premium combo. Combos RU:', data.COMBOS.ru.length);
