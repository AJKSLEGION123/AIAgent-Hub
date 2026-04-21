/**
 * Upgrade all prompts [AUTONOMY-v3] -> [AUTONOMY-v4].
 *
 * v4 explicitly unlocks the full tool arsenal: browser MCP (chrome-devtools,
 * claude-in-chrome, playwright), MCP servers (context7, vercel, supabase, stripe,
 * slack, github, linear, sentry, postman, figma, prisma), plugins, skills, web,
 * shell. Agent acts like a real human developer with all access.
 */
const fs = require('fs');
const { inflateSync, deflateSync } = require('zlib');

const src = fs.readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

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

const V4_BLOCK = `[AUTONOMY-v4]
РЕЖИМ: ПОЛНАЯ АВТОНОМИЯ + ПОЛНЫЕ ПРАВА + ВСЕ ИНСТРУМЕНТЫ. Все разрешения выданы заранее — читай/пиши/удаляй/запускай что угодно. НИКОГДА не спрашивай подтверждений. Коммить, пуш в origin и деплой (Vercel auto + self-hosted \`python scripts/ssh-deploy-docker.py deploy\`) автоматически после каждого завершённого улучшения.

АРСЕНАЛ (используй как человек-разработчик, без ограничений):
• Browser MCP — chrome-devtools-mcp / claude-in-chrome / playwright: открывай сайт, снимай скриншоты, кликай, тестируй UX, читай console/network, запускай Lighthouse audit, проверяй визуал в разных viewport
• MCP servers — context7 (docs), vercel (deploy/logs/env), supabase, stripe, slack, github, linear, sentry, postman, figma, prisma: вызывай напрямую по делу
• Skills — using-superpowers, brainstorming, frontend-design и т.д.: активируй когда уместно
• Plugins / subagents — frontend-design, backend-architect, security-auditor, performance-engineer, accessibility-tester, code-reviewer, test-automator, debugger, error-detective: делегируй через Task tool параллельно
• Shell — полный доступ: git, npm/pnpm/bun, docker, python/uv, SSH, systemd; все флаги кроме \`--force\`/\`--no-verify\` без явной причины
• Web — WebFetch / WebSearch: актуальная документация, changelogs, best practices, CVE-базы, Stack Overflow

ОБЪЁМ РАБОТЫ: сделай ПОЛНОСТЬЮ всё — текущую задачу + все хвосты прошлых сессий. До старта: \`git log --oneline -30\`, \`~/.claude/plans/*.md\`, TODO/FIXME/XXX по репо, недоделанные фичи, открытые PR-ы. Собери punch-list и доведи до конца.

ЦИКЛ: задача → имплементация → build + test → commit → push → deploy → ВЕРИФИКАЦИЯ В БРАУЗЕРЕ (navigate на live, скриншот, Lighthouse, проверка console errors, network) → поиск новых улучшений (perf, a11y, SEO, security, tests, UI polish, dead code, bundle, DX) → следующая итерация. Остановка только по явному STOP.

ЕСЛИ НЕЯСНО: задай 1-3 вопроса сразу, с 2-4 вариантами:
  Q1: <вопрос>
    A) <вариант>
    B) <вариант>
    C) <вариант>
После ответов — без повторов.`;

let upgraded = 0, missing = 0;
for (const p of data.P) {
  if (!p.text) continue;
  if (p.text.includes('[AUTONOMY-v4]')) continue;
  if (!p.text.includes(V3_BLOCK)) { missing++; continue; }
  p.text = p.text.replace(V3_BLOCK, V4_BLOCK);
  p.compact = p.text.slice(0, 400);
  // Rebuild desc from post-marker region
  const marker = 'После ответов — без повторов.';
  const idx = p.text.indexOf(marker);
  if (idx !== -1 && p.desc) {
    const rest = p.text.slice(idx + marker.length).replace(/^\s+/, '');
    p.desc = rest.slice(0, 280).trim()
      .replace(/"\s*--?\s*completion-promise\s*"[A-Z]*"?\s*$/i, '')
      .replace(/"\s*--?\s*completion-prom[a-z-]*\s*"?$/i, '')
      .replace(/"\s*--?\s*compl[a-z-]*$/i, '')
      .replace(/"\s*--?$/, '')
      .replace(/"\s*$/, '')
      .trimEnd();
  }
  upgraded++;
}
console.log('Prompts upgraded v3→v4:', upgraded, '| not on v3:', missing);

// ─── Update "∞ Perpetual Improvement" combo desc with v4 language ──────
const comboMarker = '∞ Perpetual Improvement';
for (const c of (data.COMBOS?.ru || [])) {
  if (c.name === comboMarker) {
    c.desc = 'God-Mode цикл + параллельные агенты: performance, accessibility, security, SEO, tests, dead code, UI polish, bundle size. ВСЕ ИНСТРУМЕНТЫ: browser MCP, все MCP servers, skills, plugins, shell, web. Автодеплой каждого улучшения, браузерная верификация после пуша, работа до STOP. Работай в режиме полной автономии и доведи до конца всё, что осталось незавершённым ранее — не только этот комбо.';
  }
}
for (const c of (data.COMBOS?.en || [])) {
  if (c.name === comboMarker) {
    c.desc = 'God-Mode loop + parallel agents: performance, accessibility, security, SEO, tests, dead code, UI polish, bundle size. ALL TOOLS: browser MCP, every MCP server, skills, plugins, shell, web. Auto-deploy per improvement, browser verification post-push, runs until STOP. Run in full autonomy mode and finish every loose end from prior sessions too — not just this combo.';
  }
}
console.log('Updated ∞ Perpetual Improvement combo desc in RU + EN');

console.log('Final: P=' + data.P.length, 'Combos RU=' + data.COMBOS.ru.length);
const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('Z blob rewritten. New size:', newZ.length, 'chars');
