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

// Match `?\s*"X"\s*:\s*"X"` where the two strings are byte-identical.
// Backreference \1 ensures the second string equals the first.
const BOGUS_TERNARY = /\?\s*"([^"]*)"\s*:\s*"\1"/g;

// Look-ahead window for multi-line ternaries (e.g. ru-array on one line,
// kk-array on a later line). 10 lines covers all observed cases without
// misattributing kk fallbacks from unrelated nearby ternaries.
const DEFAULT_LOOKAHEAD = 10;

// Hard-fail: locale-blind user-facing string attributes. iter85 caught
// the theme-button Russian-only aria-label; iter109 caught 13 English-only
// dialog/button labels; iter110 caught one of each direction. Class-fix:
// any user-visible attribute (aria-label, title, placeholder, alt) with a
// literal Cyrillic or Latin-letter string bypasses the runtime lang switch.
//
// Matches: <attr>="<at-least-one-letter-A-Za-zА-Яа-я>"  with a literal
// non-empty value. Excluded by design: empty strings, pure-symbol values
// like "×" / "→", and JSX expressions like {lang==="ru"?...}.
const LOCALE_BLIND_LABEL = /(?:aria-label|title|placeholder|alt)="([A-Za-zА-Яа-я][^"]{0,200})"/g;

/**
 * Analyze source content for i18n violations. Pure function — no I/O.
 * @param {string} content - file source
 * @param {object} [opts]
 * @param {number} [opts.lookahead=10] - lines to scan ahead for kk fallback
 * @param {string} [opts.file] - filename for offender records
 * @returns {{binaryOffenders: Array, bogusOffenders: Array, localeBlindOffenders: Array}}
 */
function analyzeContent(content, opts = {}) {
  const lookahead = opts.lookahead ?? DEFAULT_LOOKAHEAD;
  const file = opts.file ?? '<input>';
  const lines = content.split('\n');
  const binaryOffenders = [];
  const bogusOffenders = [];
  const localeBlindOffenders = [];

  lines.forEach((line, i) => {
    if (/lang===['"]ru['"]\s*\?/.test(line) && !/lang===['"]kk['"]/.test(line)) {
      const window = lines.slice(i + 1, i + 1 + lookahead).join('\n');
      const hasKkInWindow = /lang===['"]kk['"]/.test(window);
      if (!hasKkInWindow) {
        binaryOffenders.push({ file, line: i + 1, text: line.trim() });
      }
    }
    BOGUS_TERNARY.lastIndex = 0;
    let m;
    while ((m = BOGUS_TERNARY.exec(line)) !== null) {
      bogusOffenders.push({ file, line: i + 1, match: m[0], text: line.trim() });
    }
    LOCALE_BLIND_LABEL.lastIndex = 0;
    while ((m = LOCALE_BLIND_LABEL.exec(line)) !== null) {
      localeBlindOffenders.push({ file, line: i + 1, match: m[0], value: m[1] });
    }
  });

  return { binaryOffenders, bogusOffenders, localeBlindOffenders };
}

function main() {
  const files = ['src/App.jsx'];
  let allBinary = [];
  let allBogus = [];
  let allLocaleBlind = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    const { binaryOffenders, bogusOffenders, localeBlindOffenders } = analyzeContent(content, { file });
    allBinary = allBinary.concat(binaryOffenders);
    allBogus = allBogus.concat(bogusOffenders);
    allLocaleBlind = allLocaleBlind.concat(localeBlindOffenders);
  }

  if (process.argv.includes('--list')) {
    console.log('--- Binary ru-only ternaries ---');
    for (const o of allBinary) {
      console.log(`${o.file}:${o.line}  ${o.text.slice(0, 140)}`);
    }
    if (allBogus.length) {
      console.log('--- Bogus identical-branch ternaries ---');
      for (const o of allBogus) {
        console.log(`${o.file}:${o.line}  ${o.match}`);
      }
    }
    if (allLocaleBlind.length) {
      console.log('--- Locale-blind aria-label/title/placeholder/alt literals ---');
      for (const o of allLocaleBlind) {
        console.log(`${o.file}:${o.line}  ${o.match}`);
      }
    }
  }

  console.log(`Binary ru-only ternaries (no kk fallback): ${allBinary.length} / baseline ${BASELINE}`);
  console.log(`Bogus identical-branch ternaries: ${allBogus.length} (must be 0)`);
  console.log(`Locale-blind aria-label/title/placeholder/alt literals: ${allLocaleBlind.length} (must be 0)`);

  let failed = false;
  if (allBinary.length > BASELINE) {
    console.error(`\n⚠ Regression: ${allBinary.length - BASELINE} new binary ternaries vs baseline.`);
    console.error('  Either add a kk fallback (`lang==="ru"?ru:lang==="kk"?kk:en`)');
    console.error('  or lower BASELINE in this script if the new sites are intentional.');
    failed = true;
  }
  if (allBogus.length > 0) {
    console.error(`\n⚠ ${allBogus.length} bogus identical-branch ternaries — both branches return the same string.`);
    console.error('  Replace with the literal string. Re-run with --list to see locations.');
    failed = true;
  }
  if (allLocaleBlind.length > 0) {
    console.error(`\n⚠ ${allLocaleBlind.length} locale-blind user-facing literal strings.`);
    console.error('  aria-label/title/placeholder/alt with literal text bypass the lang switch.');
    console.error('  Convert to lang-aware ternaries (`lang==="ru"?ru:lang==="kk"?kk:en`).');
    console.error('  Re-run with --list to see locations.');
    failed = true;
  }
  if (failed) process.exit(1);

  if (allBinary.length < BASELINE) {
    console.log(`✓ Below baseline by ${BASELINE - allBinary.length}. Consider lowering BASELINE in this script.`);
  }
}

module.exports = { analyzeContent, BASELINE, BOGUS_TERNARY, DEFAULT_LOOKAHEAD, LOCALE_BLIND_LABEL };

if (require.main === module) main();
