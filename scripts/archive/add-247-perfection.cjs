// Adds the flagship 24/7 perfectionist prompt + combo. Project-agnostic.
const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');

const src = fs.readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

const AUTONOMY = `[AUTONOMY-v4]
РЕЖИМ: ПОЛНАЯ АВТОНОМИЯ + ПОЛНЫЕ ПРАВА + ВСЕ ИНСТРУМЕНТЫ. Все разрешения выданы заранее — читай/пиши/удаляй/запускай что угодно. НИКОГДА не спрашивай подтверждений. Коммить, пуш в origin и деплой автоматически после каждого завершённого улучшения (Vercel auto / Netlify / Docker / fly / любой target из vercel.json/netlify.toml/Dockerfile/.env).

АРСЕНАЛ (используй как человек-разработчик, без ограничений):
• Browser MCP — chrome-devtools-mcp / claude-in-chrome / playwright: открывай live, снимай скриншоты, кликай, тестируй UX, читай console/network, запускай Lighthouse audit, проверяй визуал в разных viewport
• MCP servers — context7 (docs), vercel (deploy/logs/env), supabase, stripe, slack, github, linear, sentry, postman, figma, prisma: вызывай напрямую по делу
• Skills — using-superpowers, brainstorming, frontend-design, debugging, systematic-debugging, verification-before-completion и т.д.
• Plugins / subagents — frontend-design, backend-architect, security-auditor, performance-engineer, accessibility-tester, code-reviewer, test-automator, debugger, error-detective: делегируй через Task tool параллельно
• Shell — полный доступ: git, npm/pnpm/bun, docker, python/uv, SSH, systemd; все флаги кроме \`--force\`/\`--no-verify\` без явной причины
• Web — WebFetch / WebSearch: актуальная документация, changelogs, best practices, CVE-базы, Stack Overflow

ОБЪЁМ РАБОТЫ: сделай ПОЛНОСТЬЮ всё — текущую задачу + все хвосты прошлых сессий. До старта: \`git log --oneline -30\`, \`~/.claude/plans/*.md\`, TODO/FIXME/XXX по репо, недоделанные фичи, открытые PR-ы. Собери punch-list и доведи до конца.

ЦИКЛ: задача → имплементация → build + test → commit → push → deploy → ВЕРИФИКАЦИЯ В БРАУЗЕРЕ (navigate на live, скриншот, Lighthouse, console errors, network) → поиск новых улучшений → следующая итерация. Остановка только по явному STOP.

ЕСЛИ НЕЯСНО: задай 1-3 вопроса с 2-4 вариантами:
  Q1: <вопрос>  A) <вариант>  B) <вариант>  C) <вариант>
После ответов — без повторов.
`;

const flagshipText = `${AUTONOMY}
/loop 10m

ЗАДАЧА: 24/7 непрерывное доведение ЛЮБОГО проекта до идеала. Каждые 10 минут находишь одну проблему и фиксишь её полностью. Работаешь как сеньор-разработчик который никогда не устаёт.

ПОРТАТИВНОСТЬ — этот промт работает в ЛЮБОМ репо. Stack определяй автоматически из:
• package.json / pyproject.toml / Cargo.toml / go.mod / composer.json / Gemfile
• vercel.json / netlify.toml / Dockerfile / docker-compose.yml / fly.toml / k8s manifests
• .env.example для deploy targets и live URL
• README / CLAUDE.md / AGENTS.md / GEMINI.md для intent
• git remote -v — где пушить

ИСТОЧНИКИ ПРОБЛЕМ (сканируй параллельно через Task tool каждую итерацию):
1. QUALITY — eslint/biome warnings, tsc --noEmit errors, knip/depcheck/unimported (мёртвый код), jscpd (дубликаты), eslint-complexity (cyclomatic > 15), файлы > 500 строк, функции > 50 строк, циркулярные импорты (madge).
2. PERFORMANCE — bundle size (rollup-plugin-visualizer, source-map-explorer), Lighthouse score, slow queries (EXPLAIN ANALYZE / pg_stat_statements), p95 latency, memory leak (heap snapshots, clinic.js), render perf (React Profiler), image weights (>200KB), font loading (FOIT/FOUT).
3. SECURITY — npm/pnpm audit, snyk, OWASP dependency-check, secret scan (gitleaks/trufflehog), security headers (securityheaders.com), CSP gaps, OWASP Top 10 (SQLi, XSS, IDOR, SSRF, broken auth), JWT handling, rate limits.
4. RELIABILITY — Sentry открытые issues, broken links (linkinator), 4xx/5xx logs за 7 дней, flaky tests (повторный запуск 10×), race conditions, retry logic missing, idempotency.
5. UX/A11Y — Lighthouse a11y < 95, console errors на live, axe-core violations, FCP/LCP/CLS regressions, focus trap, screen-reader, contrast WCAG AA, keyboard navigation, skip-link.
6. DX — docs vs code drift (JSDoc/docstring coverage), CI pipeline > 5 мин, build > 30 сек, медленные тесты (top-10 slowest), .env.example sync, README outdated commands, broken local dev setup, missing onboarding.
7. SEO — title/description/canonical, sitemap.xml актуальность, robots.txt, structured data (schema.org validator), OG image, broken canonical, hreflang, page speed signals для CWV.
8. TESTS — coverage < 80% (vitest --coverage / pytest-cov), missing edge cases (mutation testing — stryker/mutmut), unhandled rejections, snapshot stale, e2e flake rate.
9. CLEANUP — TODO/FIXME/HACK/XXX comments, deprecation warnings, unused exports (ts-prune), commented-out code, console.log в production, debugger statements.
10. DEPS — outdated (npm-check-updates / dependabot), peer dep conflicts, license issues (license-checker), package size impact (bundlephobia), lockfile drift, duplicate transitive deps.

АЛГОРИТМ ИТЕРАЦИИ (10 минут):
1. SCAN (~2 мин) — запусти все scanner-команды параллельно через Task tool. Собери список (problem, severity 1-5, file:line, suggested-fix).
2. PRIORITIZE (~30 сек) — score = severity × impact / effort. Бери top-1.
3. FIX (~5-7 мин) — реализуй полное решение, не воркараунд. Если большое — раздели на атомарные коммиты в одной итерации.
4. VERIFY — build + lint + typecheck + unit + e2e (если затрагивает UI) + smoke на live (Browser MCP screenshot + console clean).
5. COMMIT — conventional ("fix(perf): ...", "refactor(api): ..."), push origin, auto-deploy (Vercel/Netlify/Docker/fly).
6. POST-DEPLOY VERIFY — Browser MCP на live URL, Lighthouse score сравни до/после, console clean, network 200/304.
7. RECORD — \`reports/247-progress.md\`: append \`<timestamp> | <category> | <fix> | metric: <before>→<after>\`.
8. NEXT — повторить немедленно. Никогда не останавливайся кроме явного STOP.

ПОДЪЁМ КАЧЕСТВА КОДА — конкретные действия:
• Длинная функция → разбей на чистые единицы ответственности.
• Глубокая вложенность → guard-clauses + early returns.
• Magic numbers → именованные константы.
• Дубли → выноси в helper / hook / mixin / trait.
• God object → раздели по domain.
• Утечка типов → строгие interface/protocol/trait.
• Слабая типизация → убери \`any\` / \`unknown\` / \`object\`.
• Колбэк-ад → async/await + AbortController.
• Бизнес-логика в UI/контроллере → выноси в service/use-case.
• Связанность UI ↔ API → Repository pattern + DTO.

ПОДЪЁМ ПРОИЗВОДИТЕЛЬНОСТИ — конкретные действия:
• N+1 query → eager-load / batch / DataLoader.
• Большой bundle → code-splitting + lazy + dynamic import.
• Медленный first paint → SSR / SSG / streaming / preload critical.
• Тяжёлые ре-рендеры → memo / signals / fine-grained reactivity.
• Slow API → caching layer (Redis/CDN/HTTP), index, materialized view.
• Hot path → профайлер + микрооптимизация + benchmark.
• Большие изображения → WebP/AVIF + responsive srcset + lazy.
• Шрифты блокируют → preload + font-display: swap + subsetting.

ТЕСТИРОВАНИЕ — каждое улучшение покрывается:
• Failing test (bugfix TDD) → fix → passing test → коммит.
• Регрессионный тест на ту же проблему — чтобы не повторилась.
• Если найдена флака — fix race + retry policy + добавь stability test.

УВЕДОМЛЕНИЯ:
• Slack/Telegram/Discord webhook (если в .env / vercel env / GitHub secrets) — короткий summary "fixed X, before: Y, after: Z".
• Critical (CVE / secret leak / prod breakage) — alert немедленно + создай GitHub issue с label \`urgent\`.
• Дайджест раз в сутки — markdown report за 24 часа в \`reports/247-daily-<date>.md\`.

САМО-УЛУЧШЕНИЕ ИНСТРУМЕНТАРИЯ (фокус 90% на проект, 10% на свои инструменты):
• Если scanner X срабатывает > 10 раз — добавь его в pre-commit hook.
• Если ошибка X повторяется — добавь lint-rule.
• Если проверка занимает > 1 мин — оптимизируй (cache, parallel, narrow scope).
• Если новый паттерн рабочий — задокументируй в CLAUDE.md / AGENTS.md проекта.

АНТИ-ЛУП: одна и та же проблема не должна всплывать 3 раза подряд. Если — root-cause анализ + регрессионный тест + lint-rule + comment в коде с invariant.

ОСТАНОВКА:
• Только явный STOP в чате.
• Между итерациями — короткий progress-апдейт (1 строка) и сразу следующая.
• Если все scanners чистые 5 итераций подряд — увеличь интервал до 30m, расширь scanners (включи доп фреймворк-специфичные правила, deeper analysis).
• Если 24 часа — 0 регрессий и Lighthouse > 95 на всех метриках — переключись в режим feature work из roadmap (\`docs/roadmap.md\` или GitHub Projects).`;

const newPrompt = {
  id: 'lp-247-perfectionist',
  m: '/loop',
  mk: 'opus47m',
  role: '24/7 Project Perfectionist',
  type: 'command',
  icon: '∞',
  ac: '#e86a2a',
  time: 'continuous',
  text: flagshipText,
  desc: 'Главный 24/7 цикл доведения ЛЮБОГО проекта до идеала. Портативный — определяет stack из package.json/pyproject/Cargo/go.mod, deploy target из vercel.json/netlify.toml/Dockerfile. Каждые 10 мин: scan через 10 категорий (quality, perf, security, reliability, UX/a11y, DX, SEO, tests, cleanup, deps) → prioritize по severity×impact/effort → fix полностью → verify build+test+e2e+browser smoke → commit conventional + push + auto-deploy → post-deploy Lighthouse diff → record в reports/247-progress.md → next. Slack/TG webhook на каждый fix. Останавливается только по STOP.',
  tags: ['flagship', '24-7', 'loop', 'continuous-improvement', 'project-agnostic', 'quality', 'performance', 'self-healing'],
  difficulty: 'advanced',
  output: 'Continuously improved project',
  related: ['rl-godmode', 'rl-perf-audit', 'rl-a11y-audit', 'rl-api-security', 'lp-watch', 'lp-tg-self-heal'],
  v: '12.0',
};
newPrompt.compact = newPrompt.text.slice(0, 400);

if (!data.P.find(p => p.id === newPrompt.id)) {
  data.P.push(newPrompt);
}

const comboName = '∞ 24/7 Project Perfection';
const comboAgents = [
  'lp-247-perfectionist',
  'rl-godmode',
  'rl-perf-audit',
  'rl-a11y-audit',
  'rl-api-security',
  'rl-seo',
  'rl-test',
  'rl-dead',
  'rl-ui',
  'rl-bundle',
  'lp-watch',
  'lp-tg-self-heal',
  'lp-message-quality',
  'lp-full-click-test',
  'rl-rag-project-knowledge',
];

const comboRu = {
  name: comboName,
  agents: comboAgents,
  ids: comboAgents,
  desc: 'Работа в режиме полной автономии 24/7 для ЛЮБОГО проекта. Главный цикл lp-247-perfectionist каждые 10 мин сканирует quality+perf+security+reliability+UX+DX+SEO+tests+cleanup+deps, фиксит top-1 проблему полностью, верифицирует build+test+e2e+Browser MCP smoke, коммитит conventional + auto-deploy на любой target (Vercel/Netlify/Docker/fly), Lighthouse до/после. Параллельно: god-mode, perf+a11y+security+SEO+test+dead-code+UI+bundle audits, watch-loop, Telegram-бот self-heal, message-quality watchdog, full click-sweep, RAG-знание проекта. Доведи до конца всё, что осталось незавершённым ранее. Останавливается только по STOP.',
  color: '#e86a2a',
};
const comboEn = {
  name: comboName,
  agents: comboAgents,
  ids: comboAgents,
  desc: 'Run in full autonomy 24/7 mode for ANY project. Master loop lp-247-perfectionist every 10 min scans quality+perf+security+reliability+UX+DX+SEO+tests+cleanup+deps, fixes top-1 issue completely, verifies build+test+e2e+Browser MCP smoke, conventional commits + auto-deploy to any target (Vercel/Netlify/Docker/fly), Lighthouse before/after diff. In parallel: god-mode, perf+a11y+security+SEO+test+dead-code+UI+bundle audits, watch-loop, Telegram bot self-heal, message-quality watchdog, full click-sweep, project RAG knowledge. Finish everything left undone earlier. Stops only on explicit STOP.',
  color: '#e86a2a',
};

if (!data.COMBOS.ru.find(c => c.name === comboName)) data.COMBOS.ru.push(comboRu);
if (!data.COMBOS.en.find(c => c.name === comboName)) data.COMBOS.en.push(comboEn);

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));

console.log('✓ Total prompts:', data.P.length);
console.log('✓ Combos RU:', data.COMBOS.ru.length, '| EN:', data.COMBOS.en.length);
console.log('✓ Z size:', newZ.length, 'chars');
