/**
 * Remap too-dark prompt accent colors — they became near-invisible
 * titles on the dark card bg after title font size bumped to 19px.
 */
const fs = require('fs');
const { inflateSync, deflateSync } = require('zlib');

const MAP = {
  '#1e1b4b': '#818cf8', // indigo-950 -> indigo-400 (Overnight Work)
  '#1e40af': '#60a5fa', // blue-800  -> blue-400  (Multi-Agent, OAuth...)
  '#1e293b': '#94a3b8', // slate-800 -> slate-400 (Dark Mode)
  '#b91c1c': '#f87171', // red-700   -> red-400   (Security Fix)
};

const src = fs.readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

let n = 0;
for (const p of data.P) if (MAP[p.ac]) { p.ac = MAP[p.ac]; n++; }
for (const c of (data.COMBOS?.ru || [])) if (MAP[c.color]) { c.color = MAP[c.color]; n++; }
for (const c of (data.COMBOS?.en || [])) if (MAP[c.color]) { c.color = MAP[c.color]; n++; }

console.log('Accent remaps:', n);
const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
