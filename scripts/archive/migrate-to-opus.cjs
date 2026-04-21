/**
 * Миграция: все существующие промты mk:"claude" → mk:"opus47m".
 * Проект целиком — для Claude Code с моделью Opus 4.7 (1M context).
 */
const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

let migrated = 0;
data.P.forEach(p => {
  if (p.mk === "claude") {
    p.mk = "opus47m";
    migrated++;
  }
});

console.log('Migrated', migrated, 'prompts from claude -> opus47m');
console.log('Total prompts:', data.P.length);
const counts = data.P.reduce((acc, p) => { acc[p.mk] = (acc[p.mk]||0)+1; return acc; }, {});
console.log('Distribution:', counts);

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
