/**
 * Remove 28 duplicate prompt pairs (identical role + text).
 * Rewrite combo refs + prompt.related[] refs to point to the kept ID.
 * Rename the duplicate "AI Application" combo -> "AI Agent Stack".
 */
const fs = require('fs');
const { inflateSync, deflateSync } = require('zlib');

const src = fs.readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

// Kept ID → removed ID mapping. First entry stays, second is removed.
const REMAP = {
  'rl-rag-pipeline':            'rl-rag',
  'rl-k8s-deploy':              'rl-k8s',
  'rl-webhook-system':          'rl-webhook',
  'rl-email-system':            'rl-email',
  'rl-db-optimize-v100':        'rl-db-optimize',
  'rl-err':                     'rl-error-handling',
  'rl-svelte':                  'rl-sveltekit',
  'rl-mongodb-setup':           'rl-mongo',
  'rl-stryker':                 'rl-mutation-test',
  'rl-imageopt':                'rl-image-optimization',
  'rl-temporal-workflows':      'rl-temporal',
  'rl-gcp-secret-manager-setup':'rl-gcp-secrets-setup',
  'rl-intpat-retry-backoff-py':   'rl-py-retry',
  'rl-intpat-retry-backoff-go':   'rl-go-retry',
  'rl-intpat-retry-backoff-java': 'rl-java-retry',
  'rl-intpat-retry-backoff-rust': 'rl-rs-retry',
  'rl-intpat-rate-limiter-py':    'rl-py-rate-limit',
  'rl-intpat-rate-limiter-go':    'rl-go-rate-limit',
  'rl-intpat-rate-limiter-java':  'rl-java-rate-limit',
  'rl-intpat-rate-limiter-rust':  'rl-rs-rate-limit',
  'rl-api-stripe-webhook-handler': 'rl-pay-stripe-webhook-handler',
  'rl-migr-rest-graphql':          'rl-migrate-rest-graphql',
  'rl-migr-mongodb-postgres-jsonb':'rl-migrate-mongodb-postgres-jsonb',
  'fd-feat-feedback-widget':       'fd-saas-feedback-widget',
  'rl-vuelib-pinia-setup':         'rl-state-pinia-setup',
  'rl-vuelib-pinia-testing':       'rl-state-pinia-testing',
  'rl-vuelib-formkit-setup':       'rl-form-formkit-setup',
  'rl-llmp-mistral-streaming':     'rl-ai-mistral-stream',
};
// Key = id to REMOVE, value = id to redirect to.

const toRemove = new Set(Object.keys(REMAP));

// 1. Update combo agents + ids
let comboRefUpdates = 0;
const updateList = (list) => list.map(id => {
  if (REMAP[id]) { comboRefUpdates++; return REMAP[id]; }
  return id;
});

for (const arr of [data.COMBOS?.ru || [], data.COMBOS?.en || []]) {
  for (const c of arr) {
    c.agents = updateList(c.agents || []);
    c.ids = updateList(c.ids || []);
    // Dedupe within a single combo (in case remap created duplicates in list)
    c.agents = [...new Set(c.agents)];
    c.ids = [...new Set(c.ids)];
  }
}

// 2. Update prompt.related[] refs
let relatedUpdates = 0;
for (const p of data.P) {
  if (!p.related) continue;
  p.related = p.related.map(id => {
    if (REMAP[id]) { relatedUpdates++; return REMAP[id]; }
    return id;
  });
  p.related = [...new Set(p.related)];
}

// 3. Remove the duplicate prompts
const before = data.P.length;
data.P = data.P.filter(p => !toRemove.has(p.id));
const after = data.P.length;

// 4. Rename duplicate "AI Application" combo -> "AI Agent Stack"
let comboRenames = 0;
for (const arr of [data.COMBOS?.ru || [], data.COMBOS?.en || []]) {
  const names = arr.map(c => c.name);
  arr.forEach((c, i) => {
    if (c.name === 'AI Application' && names.indexOf('AI Application') !== i) {
      c.name = 'AI Agent Stack';
      // Also update desc to reflect new name in case
      comboRenames++;
    }
  });
}

console.log('Prompts removed:', before - after, '(was', before, ', now', after, ')');
console.log('Combo ref updates:', comboRefUpdates);
console.log('related[] ref updates:', relatedUpdates);
console.log('Combo renames (AI Application -> AI Agent Stack):', comboRenames);
console.log('Combos RU:', data.COMBOS.ru.length, '| EN:', data.COMBOS.en.length);

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('Z blob rewritten. New size:', newZ.length, 'chars');
