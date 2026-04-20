const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const fix = {
  'rl-eventually-consistent': 'rl-consistency-patterns',
  'rl-push-web': 'fd-push-web',
};
['ru','en'].forEach(lang => {
  data.COMBOS[lang].forEach(cb => {
    if (cb.ids) cb.ids = cb.ids.map(id => fix[id] || id);
    if (cb.agents) cb.agents = cb.agents.map(id => fix[id] || id);
  });
});

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('✓ Fixed combo refs');
