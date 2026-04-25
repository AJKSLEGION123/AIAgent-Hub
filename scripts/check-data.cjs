#!/usr/bin/env node
/**
 * Data-integrity gate for the catalog. Validates the compressed Z blob
 * inside src/data.js (was src/App.jsx until iter122):
 *   - Prompts have all required fields
 *   - No duplicate prompt IDs
 *   - Combos have name/color/ids and references resolve
 *   - Configs match {id,text} or {name,content} shape
 *   - Related/prereqs references resolve to existing prompts
 *   - Cheat sheets match either {name,color,cmds} or {title,sections|items|content}
 *
 * Added iter11 as a CI gate; iter20 hardened it with process.exit(1).
 * iter98 refactored for testability — exports `validateData(data)` as a
 * pure function returning the issues array.
 *
 * Usage: node scripts/check-data.cjs
 */
const fs = require('fs');
const zlib = require('zlib');

const REQUIRED_PROMPT_FIELDS = ['id','text','m','mk','role','icon','ac','time','type'];

/**
 * Pure validator. Returns issues array. Empty array means clean.
 * @param {object} data - parsed catalog data (decompressed Z blob)
 * @returns {string[]} issues — human-readable issue descriptions
 */
function validateData(data) {
  const issues = [];

  // Prompts: missing required fields
  (data.P || []).forEach((p, i) => {
    REQUIRED_PROMPT_FIELDS.forEach(f => {
      if (!p[f]) issues.push('P['+i+']: missing '+f+' (id='+(p.id||'?')+')');
    });
  });

  // Duplicate IDs
  const idCounts = {};
  (data.P || []).forEach(p => { idCounts[p.id] = (idCounts[p.id]||0)+1; });
  Object.entries(idCounts).filter(([,c]) => c > 1).forEach(([id,c]) => {
    issues.push('DUPLICATE prompt id=' + id + ' (x' + c + ')');
  });

  // Combos: missing fields + broken refs
  ['ru','en'].forEach(lang => {
    (data.COMBOS?.[lang]||[]).forEach((cb, i) => {
      if (!cb.name) issues.push('COMBOS.'+lang+'['+i+']: missing name');
      if (!cb.ids && !cb.agents) issues.push('COMBOS.'+lang+'['+i+']: missing ids (name='+(cb.name||'?')+')');
      if (!cb.color) issues.push('COMBOS.'+lang+'['+i+']: missing color (name='+(cb.name||'?')+')');
      (cb.ids||[]).forEach(id => {
        if (!(data.P||[]).find(p => p.id === id)) issues.push('COMBOS.'+lang+'['+i+']: broken ref id='+id+' (name='+cb.name+')');
      });
    });
  });

  // Configs: two formats supported
  (data.CONFIGS||[]).forEach((cfg, i) => {
    const hasOld = cfg.id && cfg.text;
    const hasNew = cfg.name && cfg.content;
    if (!hasOld && !hasNew) issues.push('CONFIGS['+i+']: missing id/text or name/content');
  });

  // Related/prereqs broken refs
  (data.P || []).forEach(p => {
    (p.related||[]).forEach(rid => {
      if (!(data.P||[]).find(r => r.id === rid)) issues.push('related broken: ' + p.id + ' -> ' + rid);
    });
    (p.prereqs||[]).forEach(pid => {
      if (!(data.P||[]).find(r => r.id === pid)) issues.push('prereqs broken: ' + p.id + ' -> ' + pid);
    });
  });

  // Cheat sheets: two structures supported
  Object.entries(data.CHEAT||{}).forEach(([key, val]) => {
    const hasNew = val.name && val.cmds;
    const hasOld = val.title && (val.sections || val.items || val.content);
    if (!hasNew && !hasOld) issues.push('CHEAT['+key+']: invalid structure (keys: '+Object.keys(val).join(',')+')');
  });

  return issues;
}

/**
 * Decompress catalog data from the Z blob (default: src/data.js, formerly inline in src/App.jsx).
 * @param {string} appJsxPath
 * @returns {object} parsed data
 */
function loadCatalogFromAppJsx(appJsxPath) {
  const src = fs.readFileSync(appJsxPath, 'utf8');
  const m = src.match(/const Z = "([^"]+)"/);
  if (!m) throw new Error('Z constant not found in ' + appJsxPath);
  return JSON.parse(zlib.inflateSync(Buffer.from(m[1], 'base64')).toString());
}

function main() {
  const data = loadCatalogFromAppJsx('src/data.js');

  console.log('=== DATA INTEGRITY CHECK ===');
  console.log('Prompts:', data.P.length);
  console.log('Combos RU:', data.COMBOS.ru.length, '| EN:', data.COMBOS.en.length);
  console.log('Configs:', data.CONFIGS.length);
  console.log('Cheat sheets:', Object.keys(data.CHEAT).length);
  console.log('Quick cmds RU:', data.QUICK_CMDS.ru.reduce((a,c)=>a+(c.cmds||[]).length,0));

  const issues = validateData(data);

  if (issues.length === 0) {
    console.log('\n✅ No issues found!');
    process.exit(0);
  }

  console.error('\n⚠️  Found', issues.length, 'issues:');
  issues.forEach(i => console.error('  - ' + i));
  process.exit(1);
}

module.exports = { validateData, loadCatalogFromAppJsx, REQUIRED_PROMPT_FIELDS };

if (require.main === module) main();
