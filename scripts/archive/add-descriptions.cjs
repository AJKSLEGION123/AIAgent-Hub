/**
 * Extracts human-readable description from each prompt's text.
 * Adds p.desc field used by UI for "explanation" display.
 * Does NOT modify p.text — the prompt text stays wrapped with AUTONOMY.
 */
const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const extract = (text, role) => {
  if (!text) return role || "";
  // Strip [AUTONOMY-v1] block
  let body = text.replace(/\[AUTONOMY-v1\][\s\S]*?После ответов — продолжай без переспроса\.\s*/, "");
  // Pattern 1: ЗАДАЧА: <X> АНТИ-ЛУП/АНТИ-ГАЛЛ
  const m1 = body.match(/ЗАДАЧА:\s*([\s\S]+?)(?:АНТИ-ЛУП|АНТИ-ГАЛЛЮЦ|" --completion-promise)/i);
  if (m1) return m1[1].replace(/\s+/g, ' ').trim();
  // Pattern 2: /ralph-loop "<preamble>ЗАДАЧА: <X>"
  const m2 = body.match(/\/ralph-loop\s+"([\s\S]+?)"\s+--completion-promise/);
  if (m2) {
    const inner = m2[1].replace(/ФАЗА 0[\s\S]*?разведка[^\n]*\n?/i, "").replace(/^[\s\S]*?ЗАДАЧА:\s*/i, "");
    return inner.replace(/\s+/g, ' ').trim();
  }
  // Pattern 3: /loop 5m "<X>"
  const m3 = body.match(/\/loop\s+\S+\s+"([\s\S]+?)"/);
  if (m3) return m3[1].replace(/\s+/g, ' ').trim();
  // Pattern 4: plain text (feature-dev / review-pr etc.) — take body as-is
  return body.replace(/\s+/g, ' ').trim();
};

let ok = 0, empty = 0;
data.P.forEach(p => {
  const raw = extract(p.text, p.role);
  p.desc = raw.slice(0, 280);
  if (p.desc.length < 10) { empty++; p.desc = p.role || "—"; }
  else ok++;
});

console.log('Extracted:', ok, '| Fallback to role:', empty);

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
