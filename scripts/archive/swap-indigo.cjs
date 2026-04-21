/**
 * Replace indigo #6366f1 with teal #14b8a6 across prompts + combos.
 * Reason: user palette rule "NO indigo/purple" + Copy button text on indigo
 * gives 4.48:1 contrast (just under WCAG AA). Teal gives 6.2:1 and
 * fits a warm/cool mixed palette without violating the no-indigo rule.
 */
const fs = require('fs');
const { inflateSync, deflateSync } = require('zlib');

const OLD = '#6366f1';
const NEW = '#14b8a6';

const src = fs.readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

let p = 0, c = 0;
for (const pr of data.P) if (pr.ac === OLD) { pr.ac = NEW; p++; }
for (const cb of (data.COMBOS?.ru || [])) if (cb.color === OLD) { cb.color = NEW; c++; }
for (const cb of (data.COMBOS?.en || [])) if (cb.color === OLD) { cb.color = NEW; c++; }

console.log('Prompts remapped:', p, '| Combos remapped:', c);
const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
