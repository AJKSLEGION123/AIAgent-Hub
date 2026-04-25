const fs = require('fs');
const zlib = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
if (!m) { console.error('Z not found'); process.exit(1); }
const data = JSON.parse(zlib.inflateSync(Buffer.from(m[1],'base64')).toString());

console.log('=== DATA INTEGRITY CHECK ===');
console.log('Prompts:', data.P.length);
console.log('Combos RU:', data.COMBOS.ru.length, '| EN:', data.COMBOS.en.length);
console.log('Configs:', data.CONFIGS.length);
console.log('Cheat sheets:', Object.keys(data.CHEAT).length);
console.log('Quick cmds RU:', data.QUICK_CMDS.ru.reduce((a,c)=>a+(c.cmds||[]).length,0));

const issues = [];

// Prompts: missing required fields
data.P.forEach((p, i) => {
  ['id','text','m','mk','role','icon','ac','time','type'].forEach(f => {
    if (!p[f]) issues.push('P['+i+']: missing '+f+' (id='+(p.id||'?')+')');
  });
});

// Duplicate IDs
const idCounts = {};
data.P.forEach(p => { idCounts[p.id] = (idCounts[p.id]||0)+1; });
Object.entries(idCounts).filter(([,c]) => c > 1).forEach(([id,c]) => {
  issues.push('DUPLICATE prompt id=' + id + ' (x' + c + ')');
});

// Combos: missing fields + broken refs
['ru','en'].forEach(lang => {
  (data.COMBOS[lang]||[]).forEach((cb, i) => {
    if (!cb.name) issues.push('COMBOS.'+lang+'['+i+']: missing name');
    if (!cb.ids && !cb.agents) issues.push('COMBOS.'+lang+'['+i+']: missing ids (name='+(cb.name||'?')+')');
    if (!cb.color) issues.push('COMBOS.'+lang+'['+i+']: missing color (name='+(cb.name||'?')+')');
    (cb.ids||[]).forEach(id => {
      if (!data.P.find(p => p.id === id)) issues.push('COMBOS.'+lang+'['+i+']: broken ref id='+id+' (name='+cb.name+')');
    });
  });
});

// Configs: missing fields (two formats: {id,text,...} or {name,lang,content})
(data.CONFIGS||[]).forEach((cfg, i) => {
  const hasOld = cfg.id && cfg.text;
  const hasNew = cfg.name && cfg.content;
  if (!hasOld && !hasNew) issues.push('CONFIGS['+i+']: missing id/text or name/content');
});

// Related/prereqs broken refs
data.P.forEach(p => {
  (p.related||[]).forEach(rid => {
    if (!data.P.find(r => r.id === rid)) issues.push('related broken: ' + p.id + ' -> ' + rid);
  });
  (p.prereqs||[]).forEach(pid => {
    if (!data.P.find(r => r.id === pid)) issues.push('prereqs broken: ' + p.id + ' -> ' + pid);
  });
});

// Cheat sheets: check structure ({name,color,cmds} or {title,sections/items/content})
Object.entries(data.CHEAT||{}).forEach(([key, val]) => {
  const hasNew = val.name && val.cmds;
  const hasOld = val.title && (val.sections || val.items || val.content);
  if (!hasNew && !hasOld) issues.push('CHEAT['+key+']: invalid structure (keys: '+Object.keys(val).join(',')+')');
});

if (issues.length === 0) {
  console.log('\n✅ No issues found!');
  process.exit(0);
}

console.error('\n⚠️  Found', issues.length, 'issues:');
issues.forEach(i => console.error('  - ' + i));
process.exit(1);
