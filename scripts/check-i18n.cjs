#!/usr/bin/env node
/**
 * Static analysis for i18n hygiene in App.jsx. Two checks:
 *
 * 1. Binary `lang === "ru" ? X : Y` ternaries that lack a Kazakh
 *    fallback. The catalog supports ru/en/kk; binary ternaries fall
 *    back to English for Kazakh users. Tracked against a baseline
 *    ceiling that gradually shrinks as iters chip away.
 *
 * 2. Bogus identical-branch ternaries: `lang === "ru" ? "X" : "X"`
 *    (or any `cond ? "X" : "X"`) where both branches return the same
 *    literal. Discovered 4 of these during the i18n campaign
 *    (iter75/79/82/87) — pattern: copy-paste during translation
 *    work that was never finished. Hard-fail because identical-branch
 *    ternaries are pure dead-code with zero legitimate use cases.
 *
 * Usage:
 *   node scripts/check-i18n.cjs           # both checks
 *   node scripts/check-i18n.cjs --list    # also print every offending line
 */
const fs = require('fs');
const path = require('path');

// Baseline: 0 reached at iter96 (campaign complete: 179 → 0 over 21 iters).
// Both checks are now hard-fail. Any new binary ru-only ternary OR identical-
// branch ternary fails CI immediately. Keep at 0 — never raise.
const BASELINE = 0;

const files = ['src/App.jsx'];
let binaryTotal = 0;
let bogusTotal = 0;
const binaryOffenders = [];
const bogusOffenders = [];

// Match `?\s*"X"\s*:\s*"X"` where the two strings are byte-identical.
// Backreference \1 ensures the second string equals the first.
const BOGUS_TERNARY = /\?\s*"([^"]*)"\s*:\s*"\1"/g;

// Look-ahead window for multi-line ternaries (e.g. ru-array on one line,
// kk-array on a later line). 10 lines covers all observed cases without
// misattributing kk fallbacks from unrelated nearby ternaries.
const LOOKAHEAD = 10;

for (const file of files) {
  const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (/lang===['"]ru['"]\s*\?/.test(line) && !/lang===['"]kk['"]/.test(line)) {
      // Check next LOOKAHEAD lines for a kk fallback completing this multi-line ternary
      const window = lines.slice(i + 1, i + 1 + LOOKAHEAD).join('\n');
      const hasKkInWindow = /lang===['"]kk['"]/.test(window);
      if (!hasKkInWindow) {
        binaryTotal++;
        binaryOffenders.push({ file, line: i + 1, text: line.trim() });
      }
    }
    BOGUS_TERNARY.lastIndex = 0;
    let m;
    while ((m = BOGUS_TERNARY.exec(line)) !== null) {
      bogusTotal++;
      bogusOffenders.push({ file, line: i + 1, match: m[0], text: line.trim() });
    }
  });
}

if (process.argv.includes('--list')) {
  console.log('--- Binary ru-only ternaries ---');
  for (const o of binaryOffenders) {
    console.log(`${o.file}:${o.line}  ${o.text.slice(0, 140)}`);
  }
  if (bogusOffenders.length) {
    console.log('--- Bogus identical-branch ternaries ---');
    for (const o of bogusOffenders) {
      console.log(`${o.file}:${o.line}  ${o.match}`);
    }
  }
}

console.log(`Binary ru-only ternaries (no kk fallback): ${binaryTotal} / baseline ${BASELINE}`);
console.log(`Bogus identical-branch ternaries: ${bogusTotal} (must be 0)`);

let failed = false;
if (binaryTotal > BASELINE) {
  console.error(`\n⚠ Regression: ${binaryTotal - BASELINE} new binary ternaries vs baseline.`);
  console.error('  Either add a kk fallback (`lang==="ru"?ru:lang==="kk"?kk:en`)');
  console.error('  or lower BASELINE in this script if the new sites are intentional.');
  failed = true;
}
if (bogusTotal > 0) {
  console.error(`\n⚠ ${bogusTotal} bogus identical-branch ternaries — both branches return the same string.`);
  console.error('  Replace with the literal string. Re-run with --list to see locations.');
  failed = true;
}
if (failed) process.exit(1);

if (binaryTotal < BASELINE) {
  console.log(`✓ Below baseline by ${BASELINE - binaryTotal}. Consider lowering BASELINE in this script.`);
}
