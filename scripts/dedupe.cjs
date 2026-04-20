const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const seen = new Set();
const before = data.P.length;
data.P = data.P.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
console.log('Removed', before - data.P.length, 'dupes. Total:', data.P.length);

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
