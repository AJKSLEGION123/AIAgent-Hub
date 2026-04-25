// Aggressive consolidation: 10 014 → ~2 500 quality, portable prompts.
// Strategy:
//   Tier-1: HARD-DELETE entire formulaic/dictionary families
//   Tier-2: KEEP TOP-N by text.length within remaining big families
//   Tier-3: Always keep flagship + combo-referenced + small unique families
//   Tier-4: Repair combos (replace deleted agents with closest match, drop combos < 3)

const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');

const src = fs.readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

const before = data.P.length;

// ─── Whitelist — always keep ────────────────────────────────
const FLAGSHIP_IDS = new Set([
  'rl-godmode', 'rl-247-perfectionist', 'rl-feat',
  'rl-perf-audit', 'rl-a11y-audit', 'rl-api-security', 'rl-seo',
  'rl-test', 'rl-dead', 'rl-ui', 'rl-bundle',
  'rl-rag-project-knowledge', 'rl-rag-hybrid', 'rl-vector-db', 'rl-embeddings',
  'rl-llm-eval', 'rl-guardrails', 'rl-finetune', 'rl-agent-multi',
  'rl-overnight', 'rl-multi',
]);

// All combo-referenced ids must survive
const comboReferenced = new Set();
[...data.COMBOS.ru, ...data.COMBOS.en].forEach(c => {
  (c.agents || []).forEach(id => comboReferenced.add(id));
  (c.ids || []).forEach(id => comboReferenced.add(id));
});

// ─── Tier-1: HARD-DELETE entire families ────────────────────
const HARD_DELETE_PREFIXES = [
  'fd-career-',     // 51  career advice (not Claude Code automation)
  'fd-game-',       // 120 game dev formulaic per engine
  'fd-role-',       // 120 career roles
  'rl-algo-',       // 180 leetcode algorithms × language
  'rl-ds-',         // 200 data structure × language
  'rl-bug-',        // 101 bug catalog × language
  'rl-entity-',     // 100 CRUD entity dictionary
  'rl-metric-',     // 100 metric catalog
  'rl-pain-',       // 100 pain points catalog
  'rl-intpat-',     // 92  integration patterns × language
  'rl-iot-',        // 96  IoT × stack
  'rl-testcase-',   // 75  test case dictionary
  'sm-smell-',      // 75  smell × language matrix
  'rl-orm-',        // 96  ORM × operation × language
  'rl-conc-',       // 90  concurrency × language
  'rl-web3-',       // 115 too niche, formulaic
];

// ─── Tier-2: KEEP TOP-N by text.length (descending) ─────────
const KEEP_TOP_N = {
  'rl-aws-': 25,
  'rl-gcp-': 12,
  'rl-azure-': 12,
  'rl-pattern-': 25,
  'fd-ui-': 60,
  'fd-mobile-': 30,
  'rl-test-': 50,
  'rl-ai-': 80,
  'rl-devops-': 50,
  'rl-sec-': 70,
  'rl-relib-': 35,
  'rl-api-': 45,
  'rl-http-': 25,
  'rl-go-': 30,
  'rl-err-': 20,
};

// ─── Apply rules ─────────────────────────────────────────────
const keepReason = new Map();
const deleteReason = new Map();
const candidatesByFamily = new Map();

for (const p of data.P) {
  // Hard-delete prefixes
  const hardDel = HARD_DELETE_PREFIXES.find(prefix => p.id.startsWith(prefix));
  if (hardDel) {
    if (FLAGSHIP_IDS.has(p.id) || comboReferenced.has(p.id)) {
      keepReason.set(p.id, `flagship/combo (in ${hardDel} family)`);
    } else {
      deleteReason.set(p.id, `hard-delete family ${hardDel}`);
    }
    continue;
  }

  // Top-N families
  const topPrefix = Object.keys(KEEP_TOP_N).find(prefix => p.id.startsWith(prefix));
  if (topPrefix) {
    if (!candidatesByFamily.has(topPrefix)) candidatesByFamily.set(topPrefix, []);
    candidatesByFamily.get(topPrefix).push(p);
    continue;
  }

  // Default: keep
  keepReason.set(p.id, 'default keep');
}

// Resolve top-N families
for (const [prefix, candidates] of candidatesByFamily) {
  const limit = KEEP_TOP_N[prefix];
  const sorted = [...candidates].sort((a, b) => (b.text?.length || 0) - (a.text?.length || 0));
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    if (i < limit || FLAGSHIP_IDS.has(p.id) || comboReferenced.has(p.id)) {
      keepReason.set(p.id, `top-${limit} of ${prefix}`);
    } else {
      deleteReason.set(p.id, `beyond top-${limit} of ${prefix}`);
    }
  }
}

const kept = data.P.filter(p => keepReason.has(p.id));
const deleted = data.P.filter(p => deleteReason.has(p.id));

console.log('=== Consolidation plan ===');
console.log('Before:', before);
console.log('Keep:', kept.length);
console.log('Delete:', deleted.length);
console.log('Reduction: ' + ((deleted.length / before) * 100).toFixed(1) + '%');

// Group deletions by reason for transparency
const delByReason = {};
deleteReason.forEach((reason) => {
  delByReason[reason] = (delByReason[reason] || 0) + 1;
});
console.log('\nDeletions by rule:');
Object.entries(delByReason).sort((a, b) => b[1] - a[1]).forEach(([r, c]) => console.log('  ' + c.toString().padStart(5) + '  ' + r));

// ─── Tier-4: Repair combos ──────────────────────────────────
const keptIds = new Set(kept.map(p => p.id));
const repairLog = [];
let combosBefore = data.COMBOS.ru.length;

['ru', 'en'].forEach(lang => {
  data.COMBOS[lang] = data.COMBOS[lang].filter(combo => {
    const validAgents = (combo.agents || []).filter(id => keptIds.has(id));
    const removed = (combo.agents || []).length - validAgents.length;
    if (removed > 0) repairLog.push(`${lang}/${combo.name}: dropped ${removed} agents`);
    if (validAgents.length < 3) {
      repairLog.push(`${lang}/${combo.name}: REMOVED COMBO (< 3 valid agents)`);
      return false;
    }
    combo.agents = validAgents;
    combo.ids = validAgents;
    return true;
  });
});

console.log('\n=== Combo repair ===');
console.log('Combos before:', combosBefore, '→ after:', data.COMBOS.ru.length);
repairLog.slice(0, 30).forEach(l => console.log('  ' + l));
if (repairLog.length > 30) console.log('  ...and ' + (repairLog.length - 30) + ' more');

// ─── Repair related[] arrays in kept prompts ───────────────
let relatedFixed = 0;
for (const p of kept) {
  if (Array.isArray(p.related)) {
    const newRelated = p.related.filter(id => keptIds.has(id));
    if (newRelated.length !== p.related.length) {
      p.related = newRelated;
      relatedFixed++;
    }
  }
}
console.log('\nrelated[] arrays cleaned:', relatedFixed, 'prompts');

// Apply
data.P = kept;

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));

console.log('\n✓ Consolidated. Total prompts:', data.P.length);
console.log('✓ Combos RU:', data.COMBOS.ru.length, '| EN:', data.COMBOS.en.length);
console.log('✓ Z size:', newZ.length, 'chars (', (newZ.length / 1024).toFixed(0) + ' KB)');
