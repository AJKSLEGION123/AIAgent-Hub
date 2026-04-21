/**
 * Upgrade all prompts [AUTONOMY-v2] -> [AUTONOMY-v3].
 *
 * v3 grants EXPLICIT full permissions: auto commit/push/deploy per improvement,
 * parallel subagent spawning, perpetual improvement loop. No confirmations.
 *
 * Also adds:
 *   • rl-godmode — the "∞ God-Mode" perpetual-improvement prompt
 *   • "∞ Perpetual Improvement" combo (RU + EN) bundling godmode + specialists
 *   • Role translations for godmode across ru/en/kk
 */
const fs = require('fs');
const { inflateSync, deflateSync } = require('zlib');

const src = fs.readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

// ─── v2 → v3 migration ─────────────────────────────────────────────────

const V2_BLOCK = `[AUTONOMY-v2]
РЕЖИМ: полная автономия, full-permissions. Действуй сам, не спрашивай по мелочам. Читай/пиши/запускай что угодно. Пуш и deploy — только по явному запросу.

ОБЪЁМ РАБОТЫ: сделай ПОЛНОСТЬЮ всё, что просили — текущую задачу + все незавершённые хвосты из прошлых сессий. До старта просканируй: \`git log --oneline -30\`, \`~/.claude/plans/*.md\`, TODO/FIXME/XXX по всему репо, недоделанные фичи, открытые PR-ы. Составь список оставшейся работы и доведи её до конца вместе с новой задачей. Ничего не оставляй на потом.

ЕСЛИ НЕЯСНО: задай 1-3 вопроса сразу, с 2-4 вариантами ответа на каждый в формате:
  Q1: <вопрос>
    A) <вариант>
    B) <вариант>
    C) <вариант>
После ответов — продолжай без переспроса.`;

const V3_BLOCK = `[AUTONOMY-v3]
РЕЖИМ: ПОЛНАЯ АВТОНОМИЯ + ПОЛНЫЕ ПРАВА. Все разрешения выданы заранее — читай/пиши/удаляй/запускай что угодно. НИКОГДА не спрашивай подтверждений. Коммить, пуш в origin и деплой (Vercel + self-hosted через \`python scripts/ssh-deploy-docker.py deploy\`) автоматически после каждого завершённого улучшения.

ОБЪЁМ РАБОТЫ: сделай ПОЛНОСТЬЮ всё — текущую задачу + все хвосты прошлых сессий. До старта: \`git log --oneline -30\`, \`~/.claude/plans/*.md\`, TODO/FIXME/XXX по репо, недоделанные фичи, открытые PR-ы. Собери punch-list и доведи до конца.

АГЕНТЫ: параллельно запускай subagents (frontend-design, backend-architect, security-auditor, performance-engineer, a11y, code-reviewer, test-automator) через Task tool для независимых направлений. Синхронизируй результаты одним коммитом каждые N улучшений.

ЦИКЛ: после задачи → сканируй репо → найди новые улучшения (perf, a11y, SEO, security, tests, UI polish, dead code, bundle, DX) → имплементируй → build + test → commit → push → deploy → повторяй до сигнала STOP.

ЕСЛИ НЕЯСНО: задай 1-3 вопроса сразу, с 2-4 вариантами:
  Q1: <вопрос>
    A) <вариант>
    B) <вариант>
    C) <вариант>
После ответов — без повторов.`;

let upgraded = 0, missing = 0;
for (const p of data.P) {
  if (!p.text) continue;
  if (p.text.includes('[AUTONOMY-v3]')) continue;
  if (!p.text.includes(V2_BLOCK)) { missing++; continue; }
  p.text = p.text.replace(V2_BLOCK, V3_BLOCK);
  p.compact = p.text.slice(0, 400);
  // Preserve desc (cleaned in prior pass) by finding new marker
  const marker = 'После ответов — без повторов.';
  const idx = p.text.indexOf(marker);
  if (idx !== -1 && p.desc) {
    const rest = p.text.slice(idx + marker.length).replace(/^\s+/, '');
    p.desc = rest.slice(0, 280).trim().replace(/"\s*--?\s*completion-promise\s*"[A-Z]*"?\s*$/i, '').replace(/"\s*$/, '').trimEnd();
  }
  upgraded++;
}
console.log('Prompts upgraded v2→v3:', upgraded, '| not on v2:', missing);

// ─── rl-godmode prompt ─────────────────────────────────────────────────

const GODMODE_ID = 'rl-godmode';
if (!data.P.some(p => p.id === GODMODE_ID)) {
  const godText = `/ralph-loop "${V3_BLOCK}

ФАЗА 0 — ПОЛНАЯ РАЗВЕДКА:
Прочитай ВСЁ рекурсивно. Изучи: структуру директорий, package.json/pyproject/Cargo/go.mod, README, CLAUDE.md, конфиги, точки входа, схему БД/API, тесты, CI, deploy-скрипты, git log последних 30 коммитов, ~/.claude/plans/*, все TODO/FIXME/XXX маркеры, открытые PR-ы.

ФАЗА 1 — AUDIT-РАУНД (параллельно через Task tool):
- performance-engineer: bundle size, runtime hot paths, DB queries, N+1, memoization gaps
- security-auditor: OWASP Top 10, dep vulnerabilities, secret leaks, CSP, auth flows
- a11y: WCAG AA/AAA по всем страницам, клавиатурная навигация, aria, контраст
- code-reviewer: smells, dead code, tech debt, тесты, coverage
- frontend-design: UI polish, typography, spacing, motion, responsive
- backend-architect: API design, модели, транзакции, idempotency, retry
- test-automator: coverage gaps, flaky тесты, missing edge cases

Собери единый улучшения-backlog с приоритизацией (user-impact × effort).

ФАЗА 2 — ИМПЛЕМЕНТАЦИЯ:
Для каждого пункта (по приоритету): TDD → failing test → implementation → green → refactor. Коммить atomic (Conventional Commits). Каждые 3-5 коммитов — push в origin + deploy (Vercel auto + self-hosted через python scripts/ssh-deploy-docker.py deploy).

ФАЗА 3 — РЕГРЕССИИ:
npm test + npm run test:e2e. Если падает — фикс и повторный цикл. Lighthouse audit живого сайта. Сравни score с предыдущим запуском.

ФАЗА 4 — ОТЧЁТ + ЦИКЛ:
Коротко: что сделано, какие метрики изменились, что следующее. Затем → ФАЗА 1 на новом состоянии репо.

ОСТАНОВКА: только по явному STOP от пользователя или если все метрики в зелёной зоне И backlog пуст. Иначе — loop." --completion-promise "Все метрики AA+ зелёные, backlog пуст, prod задеплоен, regress-тесты зелёные"`;

  const godPrompt = {
    id: GODMODE_ID,
    m: '/ralph-loop',
    mk: 'opus47m',
    role: '∞ God-Mode Autonomous',
    type: 'command',
    icon: '∞',
    ac: '#e86a2a',
    time: '∞',
    text: godText,
    tags: ['autonomy', 'perpetual', 'god-mode', 'audit', 'deploy', 'multi-agent', 'perfectionist'],
    difficulty: 'advanced',
    output: 'Постоянный цикл улучшений: audit → fix → test → deploy → повтор.',
    related: ['rl-perf-audit', 'rl-a11y-audit', 'rl-api-security', 'rl-seo', 'rl-test', 'rl-dead', 'rl-ui', 'rl-bundle'],
    v: '12.0',
    compact: godText.slice(0, 400),
    desc: 'Бесконечный цикл автономных улучшений — audit → fix → test → commit → push → deploy → повтор. Запускает субагентов параллельно для perf/a11y/security/tests/design. Полные права, автодеплой, без подтверждений. Останавливается только по STOP пользователя.',
  };
  data.P.push(godPrompt);
  console.log('Added godmode prompt:', godPrompt.id);
}

// ─── Role translations ─────────────────────────────────────────────────

// The T object lives in src/App.jsx outside the Z blob, so we can't modify from here.
// But t.r[role] falls back to role text itself if translation missing, so
// "∞ God-Mode Autonomous" will render as-is. We add RU/KK translations next in a separate edit.

// ─── "∞ Perpetual Improvement" combo ──────────────────────────────────

const COMBO_RU = {
  name: '∞ Perpetual Improvement',
  agents: [GODMODE_ID, 'rl-perf-audit', 'rl-a11y-audit', 'rl-api-security', 'rl-seo', 'rl-test', 'rl-dead', 'rl-ui', 'rl-bundle'],
  ids:    [GODMODE_ID, 'rl-perf-audit', 'rl-a11y-audit', 'rl-api-security', 'rl-seo', 'rl-test', 'rl-dead', 'rl-ui', 'rl-bundle'],
  desc: 'God-Mode цикл + параллельные агенты: performance, accessibility, security, SEO, tests, dead code, UI polish, bundle size. Полные права, автодеплой каждого улучшения, работа до STOP. Работай в режиме полной автономии и доведи до конца всё, что осталось незавершённым ранее — не только этот комбо.',
  color: '#e86a2a',
};
const COMBO_EN = {
  name: '∞ Perpetual Improvement',
  agents: [GODMODE_ID, 'rl-perf-audit', 'rl-a11y-audit', 'rl-api-security', 'rl-seo', 'rl-test', 'rl-dead', 'rl-ui', 'rl-bundle'],
  ids:    [GODMODE_ID, 'rl-perf-audit', 'rl-a11y-audit', 'rl-api-security', 'rl-seo', 'rl-test', 'rl-dead', 'rl-ui', 'rl-bundle'],
  desc: 'God-Mode loop + parallel agents: performance, accessibility, security, SEO, tests, dead code, UI polish, bundle size. Full permissions, auto-deploy every improvement, runs until STOP. Run in full autonomy mode and finish every loose end from prior sessions too — not just this combo.',
  color: '#e86a2a',
};

if (!data.COMBOS.ru.some(c => c.name === COMBO_RU.name)) {
  data.COMBOS.ru.unshift(COMBO_RU); // put at top
  data.COMBOS.en.unshift(COMBO_EN);
  console.log('Added ∞ Perpetual Improvement combo to RU + EN');
}

// ─── Write ─────────────────────────────────────────────────────────────

console.log('Final: P=' + data.P.length, 'Combos RU=' + data.COMBOS.ru.length);
const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('Z blob rewritten. New size:', newZ.length, 'chars');
