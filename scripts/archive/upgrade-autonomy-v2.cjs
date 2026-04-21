/**
 * Upgrade all prompts from [AUTONOMY-v1] to [AUTONOMY-v2].
 *
 * v2 adds ОБЪЁМ РАБОТЫ section forcing Claude Code to finish
 * every outstanding request — current task + leftover work from
 * previous sessions (git log, ~/.claude/plans/, TODO/FIXME markers,
 * half-done features, open PRs).
 *
 * Combos get a short completion clause appended to data.COMBOS.ru/en descriptions.
 */
const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');

const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const V1_BLOCK = `[AUTONOMY-v1]
РЕЖИМ: полная автономия, full-permissions. Действуй сам, не спрашивай по мелочам. Читай/пиши/запускай что угодно. Пуш и deploy — только по явному запросу.

ЕСЛИ НЕЯСНО: задай 1-3 вопроса сразу, с 2-4 вариантами ответа на каждый в формате:
  Q1: <вопрос>
    A) <вариант>
    B) <вариант>
    C) <вариант>
После ответов — продолжай без переспроса.`;

const V2_BLOCK = `[AUTONOMY-v2]
РЕЖИМ: полная автономия, full-permissions. Действуй сам, не спрашивай по мелочам. Читай/пиши/запускай что угодно. Пуш и deploy — только по явному запросу.

ОБЪЁМ РАБОТЫ: сделай ПОЛНОСТЬЮ всё, что просили — текущую задачу + все незавершённые хвосты из прошлых сессий. До старта просканируй: \`git log --oneline -30\`, \`~/.claude/plans/*.md\`, TODO/FIXME/XXX по всему репо, недоделанные фичи, открытые PR-ы. Составь список оставшейся работы и доведи её до конца вместе с новой задачей. Ничего не оставляй на потом.

ЕСЛИ НЕЯСНО: задай 1-3 вопроса сразу, с 2-4 вариантами ответа на каждый в формате:
  Q1: <вопрос>
    A) <вариант>
    B) <вариант>
    C) <вариант>
После ответов — продолжай без переспроса.`;

let upgraded = 0, skipped = 0, missing = 0;

for (const p of data.P) {
  if (!p.text) { missing++; continue; }
  if (p.text.includes('[AUTONOMY-v2]')) { skipped++; continue; }
  if (!p.text.includes(V1_BLOCK)) {
    missing++;
    continue;
  }
  p.text = p.text.replace(V1_BLOCK, V2_BLOCK);
  p.compact = p.text.slice(0, 400);
  // desc is the human-readable preview stripped of autonomy wrapper — rebuild it
  // by taking content AFTER the autonomy block's closing line.
  if (p.desc) {
    const marker = 'После ответов — продолжай без переспроса.';
    const idx = p.text.indexOf(marker);
    if (idx !== -1) {
      const rest = p.text.slice(idx + marker.length).replace(/^\s+/, '');
      p.desc = rest.slice(0, 280).trim();
    }
  }
  upgraded++;
}

console.log('Prompts upgraded:', upgraded);
console.log('Already v2 (skipped):', skipped);
console.log('No v1 block found:', missing);

// Combos — append completion clause to desc if not already present.
const COMBO_DIRECTIVE_RU = ' Работай в режиме полной автономии и доведи до конца всё, что осталось незавершённым ранее — не только этот комбо.';
const COMBO_DIRECTIVE_EN = ' Run in full autonomy mode and finish every loose end from prior sessions too — not just this combo.';

let combosRu = 0, combosEn = 0;
for (const c of (data.COMBOS?.ru || [])) {
  if (c.desc && !c.desc.includes('полной автономии')) {
    c.desc = c.desc.trim() + COMBO_DIRECTIVE_RU;
    combosRu++;
  }
}
for (const c of (data.COMBOS?.en || [])) {
  if (c.desc && !c.desc.includes('full autonomy')) {
    c.desc = c.desc.trim() + COMBO_DIRECTIVE_EN;
    combosEn++;
  }
}
console.log('Combos RU updated:', combosRu);
console.log('Combos EN updated:', combosEn);

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('Z blob rewritten. New size:', newZ.length, 'chars');
