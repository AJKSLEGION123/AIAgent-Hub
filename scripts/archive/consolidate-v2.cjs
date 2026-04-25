// Aggressive consolidation v2: 10 014 → ~2 500 quality, portable prompts.
// Strategy: family-level rules with explicit limits. Whitelist combo agents.

const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');

const src = fs.readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

const before = data.P.length;

// ─── Whitelist: flagship + combo-referenced ─────────────────
const FLAGSHIP_IDS = new Set([
  'rl-godmode', 'rl-247-perfectionist', 'rl-feat',
  'rl-perf-audit', 'rl-a11y-audit', 'rl-api-security', 'rl-seo',
  'rl-test', 'rl-dead', 'rl-ui', 'rl-bundle',
  'rl-rag-project-knowledge', 'rl-rag-hybrid', 'rl-vector-db', 'rl-embeddings',
  'rl-llm-eval', 'rl-guardrails', 'rl-finetune', 'rl-agent-multi',
  'rl-overnight', 'rl-multi',
]);

const comboReferenced = new Set();
[...data.COMBOS.ru, ...data.COMBOS.en].forEach(c => {
  (c.agents || []).forEach(id => comboReferenced.add(id));
  (c.ids || []).forEach(id => comboReferenced.add(id));
});

// ─── Hard delete: pure dictionaries / formulaic matrices ────
const HARD_DELETE_PREFIXES = [
  'fd-career-', 'fd-game-', 'fd-role-',
  'rl-algo-', 'rl-ds-',
  'rl-bug-', 'rl-entity-', 'rl-metric-', 'rl-pain-', 'rl-intpat-',
  'rl-iot-', 'rl-testcase-', 'sm-smell-', 'rl-orm-', 'rl-conc-', 'rl-web3-',
  // v2 additions:
  'rl-nodelib-', 'rl-pylib-', 'rl-vuelib-',  // lib × stack matrix (formulaic perf-tuning)
  'rl-rh-',                                   // React hooks micro-pitfalls
  'rl-debt-',                                 // tech-debt micro-tasks
  'rl-pkgm-',                                 // pkg-manager × command matrix
  'rl-eip-',                                  // EIP catalog dictionary
  'rl-interview-',                            // interview prep (not Claude Code automation)
  'rl-pm-',                                   // PM metrics catalog
  'rl-date-',                                 // date library micro-tasks
  // Per-language matrices: same 35 tasks repeated for each language → kill them
  'rl-rs-', 'rl-kt-', 'rl-swift-', 'rl-cs-', 'rl-cpp-', 'rl-rb-', 'rl-php-',
  'rl-ex-', 'rl-dart-', 'rl-scala-', 'rl-lua-', 'rl-r-', 'rl-jl-',
  'rl-hs-', 'rl-clj-',
  // Per-cloud micro-matrices (same task × different cloud)
  'rl-cloudflare-', 'rl-digitalocean-', 'rl-linode-',
  'rl-netlify-', 'rl-railway-', 'rl-fly-',
];

// ─── Top-N by text.length within these families ────────────
const KEEP_TOP_N = {
  // Core engineering — keep generous
  'rl-ai-': 60,
  'rl-sec-': 60,
  'rl-perf-': 25,
  'rl-a11y-': 25,
  'rl-test-': 35,
  'rl-devops-': 40,
  'rl-relib-': 30,
  'rl-api-': 30,
  'rl-state-': 25,
  'rl-auth-': 25,
  'rl-debug-': 25,
  'rl-deploy-': 20,
  'rl-sre-': 20,
  'rl-obs-': 20,
  'rl-msgbus-': 18,
  'rl-cli-': 18,
  'rl-alert-': 15,
  'rl-search-': 15,
  'rl-notif-': 15,
  'rl-i18n-': 12,
  'rl-git-': 12,
  'rl-docker-': 15,
  'rl-k8s-': 25,
  'rl-k8ssc-': 12,
  'rl-sql-': 18,
  'rl-vec-': 15,
  'rl-form-': 18,
  'rl-pattern-': 18,
  'rl-http-': 18,
  'rl-rest-': 18,
  'rl-css-': 25,
  'rl-style-': 18,
  'rl-anim-': 12,
  'rl-fmt-': 10,
  'rl-val-': 12,
  'rl-errhdl-': 12,
  'rl-file-': 10,
  'rl-dbmig-': 12,
  'rl-dbprob-': 15,
  'rl-anal-': 10,
  'rl-log-': 18,
  'rl-logq-': 15,
  'rl-tfp-': 12,
  'rl-llmp-': 25,
  'rl-perm-': 12,
  'rl-cf-': 12,
  'rl-vue-': 12,
  'rl-rust-': 12,
  'rl-go-': 18,
  'rl-py-': 18,
  'rl-java-': 18,
  'rl-ts-': 18,
  'rl-js-': 18,
  'rl-rn-': 12,
  'rl-shell-': 12,
  'rl-linux-': 15,
  'rl-vercel-': 12,
  'rl-aws-': 18,
  'rl-gcp-': 10,
  'rl-azure-': 10,
  'rl-ecom-': 15,
  'rl-cms-': 12,
  'rl-pay-': 15,
  'rl-mkt-': 10,
  'rl-pipe-': 10,
  'rl-srv-': 10,
  'rl-store-': 12,
  'rl-webapi-': 12,
  'rl-apidocs-': 12,
  'rl-comp-': 10,
  'rl-regex-': 8,
  'rl-dns-': 8,
  'rl-video-': 8,
  'rl-math-': 8,
  'rl-dist-': 12,
  'rl-msa-': 12,
  'rl-sla-': 12,
  'rl-sysdes-': 12,
  'rl-migr-': 12,
  'rl-migrate-': 10,
  'rl-netdeep-': 10,
  'rl-pkg-': 8,
  'rl-build-': 10,
  'rl-time-': 8,
  'rl-prod-': 8,
  'rl-pair-': 8,
  'rl-editor-': 8,
  'rl-dx-': 12,
  'rl-err-': 12,
  // Feature-dev families
  'fd-ui-': 40,
  'fd-mobile-': 20,
  'fd-domain-': 20,
  'fd-chart-': 12,
  'fd-apiend-': 18,
  'fd-gql-': 15,
  'fd-onb-': 12,
  'fd-saas-': 15,
  'fd-ecom-': 15,
  'fd-feat-': 15,
  'fd-image-': 8,
  'fd-audio-': 8,
  'fd-map-': 8,
  'fd-industry-': 12,
  'fd-chatops-': 10,
  // Review/code-review families
  'rv-audit-': 18,
  'rv-a11y-': 12,
  'rv-design-': 10,
  'cr-focus-': 10,
  // Simplify
  'sm-refact-': 15,
};

// ─── Apply ──────────────────────────────────────────────────
const keepReason = new Map();
const deleteReason = new Map();
const candidatesByFamily = new Map();

for (const p of data.P) {
  // Always keep flagship + combo-referenced
  if (FLAGSHIP_IDS.has(p.id) || comboReferenced.has(p.id)) {
    keepReason.set(p.id, 'flagship/combo');
    continue;
  }

  // Hard-delete prefixes
  const hardDel = HARD_DELETE_PREFIXES.find(prefix => p.id.startsWith(prefix));
  if (hardDel) {
    deleteReason.set(p.id, `hard ${hardDel}`);
    continue;
  }

  // Top-N families
  const topPrefix = Object.keys(KEEP_TOP_N).find(prefix => p.id.startsWith(prefix));
  if (topPrefix) {
    if (!candidatesByFamily.has(topPrefix)) candidatesByFamily.set(topPrefix, []);
    candidatesByFamily.get(topPrefix).push(p);
    continue;
  }

  // Default: keep small-family + un-categorized prompts
  keepReason.set(p.id, 'default keep');
}

// Resolve top-N families
for (const [prefix, candidates] of candidatesByFamily) {
  const limit = KEEP_TOP_N[prefix];
  // Score: text.length is primary, tag count secondary, advanced bonus
  const sorted = [...candidates].sort((a, b) => {
    const sa = (a.text?.length || 0) + (a.tags?.length || 0) * 30 + (a.difficulty === 'advanced' ? 200 : 0);
    const sb = (b.text?.length || 0) + (b.tags?.length || 0) * 30 + (b.difficulty === 'advanced' ? 200 : 0);
    return sb - sa;
  });
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    if (i < limit) {
      keepReason.set(p.id, `top-${limit} of ${prefix}`);
    } else {
      deleteReason.set(p.id, `beyond top-${limit} of ${prefix}`);
    }
  }
}

const kept = data.P.filter(p => keepReason.has(p.id));
const deleted = data.P.filter(p => deleteReason.has(p.id));

console.log('=== Consolidation v2 ===');
console.log('Before:', before);
console.log('Keep:', kept.length);
console.log('Delete:', deleted.length);
console.log('Reduction: ' + ((deleted.length / before) * 100).toFixed(1) + '%');

// ─── Repair combos ──────────────────────────────────────────
const keptIds = new Set(kept.map(p => p.id));
let combosBefore = data.COMBOS.ru.length;

['ru', 'en'].forEach(lang => {
  data.COMBOS[lang] = data.COMBOS[lang].filter(combo => {
    const validAgents = (combo.agents || []).filter(id => keptIds.has(id));
    if (validAgents.length < 3) return false;
    combo.agents = validAgents;
    combo.ids = validAgents;
    return true;
  });
});

console.log('Combos:', combosBefore, '→', data.COMBOS.ru.length);

// ─── Repair related[] ───────────────────────────────────────
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
console.log('related[] cleaned in', relatedFixed, 'prompts');

data.P = kept;

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));

console.log('\n✓ Total prompts:', data.P.length);
console.log('✓ Combos RU:', data.COMBOS.ru.length, '| EN:', data.COMBOS.en.length);
console.log('✓ Z:', (newZ.length / 1024).toFixed(0) + ' KB');
