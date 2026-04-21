/**
 * 47 prompts share identical `desc` (first 280 chars of post-autonomy
 * content) because they all begin with the same generic "ФАЗА 0 —
 * ПОЛНАЯ РАЗВЕДКА ПРОЕКТА" boilerplate. Regenerate desc for those
 * by starting at the "ЗАДАЧА:" / "TASK:" / "Реализуй:" marker where
 * task-specific content begins.
 */
const fs = require('fs');
const { inflateSync, deflateSync } = require('zlib');

const src = fs.readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

const MARKERS = ['ЗАДАЧА:', 'TASK:', 'МИНИМУМ:', 'Реализуй:', 'Implement:', 'Deliverables:', 'Конкретно:', 'ВЫХОД:', 'STRUCTURE:'];

// Find which prompts have duplicate descs
const descCount = new Map();
for (const p of data.P) {
  if (!p.desc) continue;
  descCount.set(p.desc, (descCount.get(p.desc) || 0) + 1);
}
const dupeDescs = new Set([...descCount.entries()].filter(([, n]) => n > 1).map(([d]) => d));

let regenerated = 0;
for (const p of data.P) {
  if (!p.desc || !dupeDescs.has(p.desc)) continue;
  // Find earliest task-specific marker in text
  let best = { idx: Infinity };
  for (const mk of MARKERS) {
    const idx = p.text.indexOf(mk);
    if (idx > -1 && idx < best.idx) best = { idx, mk };
  }
  if (best.idx === Infinity) continue;
  const slice = p.text.slice(best.idx, best.idx + 280).trim()
    .replace(/"\s*--?\s*completion-promise\s*"[A-Z]*"?\s*$/i, '')
    .replace(/"\s*--?\s*completion-prom[a-z-]*\s*"?$/i, '')
    .replace(/"\s*--?\s*compl[a-z-]*$/i, '')
    .replace(/"\s*--?$/, '')
    .replace(/"\s*$/, '')
    .trimEnd();
  p.desc = slice;
  regenerated++;
}

// Verify: count remaining duplicates
const afterCount = new Map();
for (const p of data.P) {
  if (!p.desc) continue;
  afterCount.set(p.desc, (afterCount.get(p.desc) || 0) + 1);
}
const remainingDupes = [...afterCount.entries()].filter(([, n]) => n > 1);

console.log('Regenerated descs:', regenerated);
console.log('Remaining duplicate descs:', remainingDupes.length);
remainingDupes.slice(0, 5).forEach(([d, n]) => console.log('  x' + n, '->', d.slice(0, 80)));

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('Z rewritten, size:', newZ.length);
