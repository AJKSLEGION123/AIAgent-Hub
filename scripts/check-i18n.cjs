#!/usr/bin/env node
/**
 * Static analysis: counts binary `lang === "ru" ? X : Y` ternaries that
 * lack a Kazakh fallback on the same expression. The catalog supports
 * 3 languages (ru/en/kk) but historical code wrote binary ternaries that
 * fall back English for Kazakh users.
 *
 * iter76 introduced this check after iter40/iter41/iter75 surfaced the
 * pattern 3 times (anti-loop class-fix). Baseline ceiling lets us
 * prevent regressions while existing 174 binary sites are addressed
 * gradually in future iters.
 *
 * Usage:
 *   node scripts/check-i18n.cjs           # count + warn if exceeds baseline
 *   node scripts/check-i18n.cjs --list    # also print every offending line
 */
const fs = require('fs');
const path = require('path');

// Baseline: count after iter80 fixed FAQ cluster (6 lines, 12 ternaries).
// Lower this number whenever a future iter drives it down — never raise.
const BASELINE = 145;

const files = ['src/App.jsx'];
let total = 0;
const offenders = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (/lang===['"]ru['"]\s*\?/.test(line) && !/lang===['"]kk['"]/.test(line)) {
      total++;
      offenders.push({ file, line: i + 1, text: line.trim() });
    }
  });
}

if (process.argv.includes('--list')) {
  for (const o of offenders) {
    console.log(`${o.file}:${o.line}  ${o.text.slice(0, 140)}`);
  }
}

console.log(`Binary ru-only ternaries (no kk fallback): ${total} / baseline ${BASELINE}`);

if (total > BASELINE) {
  console.error(`\n⚠ Regression: ${total - BASELINE} new binary ternaries vs baseline.`);
  console.error('  Either add a kk fallback (`lang==="ru"?ru:lang==="kk"?kk:en`)');
  console.error('  or lower BASELINE in this script if the new sites are intentional.');
  process.exit(1);
}

if (total < BASELINE) {
  console.log(`✓ Below baseline by ${BASELINE - total}. Consider lowering BASELINE in this script.`);
}
