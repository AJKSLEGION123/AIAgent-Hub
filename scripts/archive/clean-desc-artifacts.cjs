/**
 * Remove ralph-loop trailing artifacts from p.desc.
 *
 * When desc is taken as first 280 chars of text AFTER the AUTONOMY block,
 * ralph-loop prompts leak the closing `" --completion-promise "DONE"`
 * suffix into the preview. Strip it.
 */
const fs = require('fs');
const { inflateSync, deflateSync } = require('zlib');

const src = fs.readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

let cleaned = 0;
for (const p of data.P) {
  if (!p.desc) continue;
  let d = p.desc;
  const before = d;
  // Strip full suffix + partial fragments at end
  d = d
    .replace(/"\s*--?\s*completion-promise\s*"[A-Z]*"?\s*$/i, '')
    .replace(/"\s*--?\s*completion-prom[a-z-]*\s*"?$/i, '')
    .replace(/"\s*--?\s*compl[a-z-]*$/i, '')
    .replace(/"\s*--?$/, '')
    .replace(/"\s*$/, '')
    .trimEnd();
  if (d !== before) {
    p.desc = d;
    cleaned++;
  }
}

console.log('Descs cleaned:', cleaned);
const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('Z blob rewritten. New size:', newZ.length, 'chars');
