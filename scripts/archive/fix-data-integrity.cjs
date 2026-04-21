const fs = require('fs');
const zlib = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(zlib.inflateSync(Buffer.from(m[1],'base64')).toString());

let fixes = 0;

// ═══ 1. FIX DUPLICATE IDS ═══
// Keep newer v11.0, rename older versions
const seen = {};
data.P.forEach((p, i) => {
  if (seen[p.id] !== undefined) {
    const older = data.P[seen[p.id]].v < p.v ? seen[p.id] : i;
    const olderP = data.P[older];
    const newId = olderP.id + '-v' + (olderP.v || '1').replace(/\./g, '');
    console.log('DUPE FIX: ' + olderP.id + ' (v' + olderP.v + ') -> ' + newId);
    olderP.id = newId;
    fixes++;
  } else {
    seen[p.id] = i;
  }
});

// ═══ 2. ADD COLORS TO COMBOS ═══
const palette = [
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#84cc16', // lime
  '#a855f7', // violet
  '#0ea5e9', // sky
  '#22d3ee', // cyan-light
  '#d946ef', // fuchsia
  '#2563eb', // blue-dark
  '#059669', // green
  '#dc2626', // red-dark
  '#7c3aed', // purple-dark
  '#e11d48', // rose
];

['ru', 'en'].forEach(lang => {
  data.COMBOS[lang].forEach((cb, i) => {
    if (!cb.color) {
      cb.color = palette[i % palette.length];
      fixes++;
    }
  });
});
console.log('Added colors to ' + data.COMBOS.ru.filter(c => c.color).length + ' combos');

// ═══ 3. FIX BROKEN RELATED/PREREQS REFS ═══
const validIds = new Set(data.P.map(p => p.id));

data.P.forEach(p => {
  if (p.related) {
    const before = p.related.length;
    p.related = p.related.filter(id => validIds.has(id));
    const removed = before - p.related.length;
    if (removed > 0) {
      console.log('Cleaned ' + removed + ' broken related refs from ' + p.id);
      fixes += removed;
    }
    if (p.related.length === 0) delete p.related;
  }
  if (p.prereqs) {
    const before = p.prereqs.length;
    p.prereqs = p.prereqs.filter(id => validIds.has(id));
    const removed = before - p.prereqs.length;
    if (removed > 0) {
      console.log('Cleaned ' + removed + ' broken prereqs refs from ' + p.id);
      fixes += removed;
    }
    if (p.prereqs.length === 0) delete p.prereqs;
  }
});

// ═══ SAVE ═══
const compressed = zlib.deflateSync(Buffer.from(JSON.stringify(data), 'utf8'));
const b64 = compressed.toString('base64');
const newSrc = src.replace(m[1], b64);
fs.writeFileSync('src/App.jsx', newSrc, 'utf8');

console.log('\n✓ Applied ' + fixes + ' fixes');
console.log('  Prompts: ' + data.P.length);
console.log('  Unique IDs: ' + new Set(data.P.map(p=>p.id)).size);
console.log('  Combos with color: ' + data.COMBOS.ru.filter(c=>c.color).length + '/' + data.COMBOS.ru.length);
