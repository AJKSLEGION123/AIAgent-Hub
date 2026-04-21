/**
 * Adds autonomy + clarifying-questions + full-permissions preamble
 * to ALL prompts. Idempotent — won't re-wrap prompts that already have it.
 */
const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const MARKER = "[AUTONOMY-v1]";

// Autonomy header (short, ~300 chars) prepended to every prompt.
// Written to be understood by Claude Code with Opus 4.7 1M context.
const AUTONOMY = `${MARKER}
РЕЖИМ: полная автономия, full-permissions. Действуй сам, не спрашивай по мелочам. Читай/пиши/запускай что угодно. Пуш и deploy — только по явному запросу.

ЕСЛИ НЕЯСНО: задай 1-3 вопроса сразу, с 2-4 вариантами ответа на каждый в формате:
  Q1: <вопрос>
    A) <вариант>
    B) <вариант>
    C) <вариант>
После ответов — продолжай без переспроса.

`;

let wrapped = 0;
let skipped = 0;

data.P.forEach(p => {
  if (!p.text) return;
  if (p.text.includes(MARKER)) { skipped++; return; }

  // For /ralph-loop and /loop prompts — text starts with '/ralph-loop "...' — need to insert inside the quoted payload.
  const ralph = p.text.match(/^(\/ralph-loop\s+")(.*)("\s+--completion-promise\s+"[^"]+")$/s);
  if (ralph) {
    p.text = `${ralph[1]}${AUTONOMY}${ralph[2]}${ralph[3]}`;
    p.compact = (p.text||"").slice(0,400);
    wrapped++;
    return;
  }
  const loopM = p.text.match(/^(\/loop\s+\S+\s+")(.*)("\s*)$/s);
  if (loopM) {
    p.text = `${loopM[1]}${AUTONOMY}${loopM[2]}${loopM[3]}`;
    p.compact = (p.text||"").slice(0,400);
    wrapped++;
    return;
  }
  // Plain prompts (feature-dev, review-pr, code-review, simplify, commit) — prepend directly.
  p.text = `${AUTONOMY}${p.text}`;
  p.compact = (p.text||"").slice(0,400);
  wrapped++;
});

console.log('Wrapped:', wrapped, '| Skipped (already had marker):', skipped, '| Total:', data.P.length);

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
