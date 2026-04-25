import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { analyzeContent, BOGUS_TERNARY, DEFAULT_LOOKAHEAD, CYRILLIC_JSX_TEXT } = require('../../scripts/check-i18n.cjs');

describe('check-i18n analyzeContent — binary detection', () => {
  it('flags binary ru-only ternary with no kk fallback', () => {
    const src = `<div>{lang==="ru"?"Привет":"Hello"}</div>`;
    const { binaryOffenders } = analyzeContent(src);
    expect(binaryOffenders).toHaveLength(1);
    expect(binaryOffenders[0].line).toBe(1);
  });

  it('passes 3-way ternary with kk fallback on same line', () => {
    const src = `<div>{lang==="ru"?"Привет":lang==="kk"?"Сәлем":"Hello"}</div>`;
    const { binaryOffenders } = analyzeContent(src);
    expect(binaryOffenders).toHaveLength(0);
  });

  it('passes multi-line 3-way ternary (kk fallback within lookahead window)', () => {
    const src = [
      `const items = lang==="ru" ? [`,
      `  "Привет",`,
      `  "Мир"`,
      `] : lang==="kk" ? [`,
      `  "Сәлем",`,
      `  "Әлем"`,
      `] : [`,
      `  "Hello",`,
      `  "World"`,
      `];`,
    ].join('\n');
    const { binaryOffenders } = analyzeContent(src);
    expect(binaryOffenders).toHaveLength(0);
  });

  it('flags multi-line ternary when kk is beyond lookahead window', () => {
    const lines = [`const a = lang==="ru" ? "А" :`];
    for (let i = 0; i < 12; i++) lines.push('  // padding');
    lines.push(`  lang==="kk" ? "К" : "A";`);
    const { binaryOffenders } = analyzeContent(lines.join('\n'), { lookahead: 10 });
    expect(binaryOffenders).toHaveLength(1); // kk is too far
  });

  it('respects custom lookahead value', () => {
    const lines = [`const a = lang==="ru" ? "А" :`];
    for (let i = 0; i < 5; i++) lines.push('  // padding');
    lines.push(`  lang==="kk" ? "К" : "A";`);
    // With lookahead 10 (default), kk is found
    expect(analyzeContent(lines.join('\n')).binaryOffenders).toHaveLength(0);
    // With lookahead 3, kk is too far
    expect(analyzeContent(lines.join('\n'), { lookahead: 3 }).binaryOffenders).toHaveLength(1);
  });

  it('uses provided file name in offender records', () => {
    const src = `<div>{lang==="ru"?"X":"Y"}</div>`;
    const { binaryOffenders } = analyzeContent(src, { file: 'my-component.jsx' });
    expect(binaryOffenders[0].file).toBe('my-component.jsx');
  });

  it('default lookahead is 10', () => {
    expect(DEFAULT_LOOKAHEAD).toBe(10);
  });
});

describe('check-i18n analyzeContent — bogus identical-branch detection', () => {
  it('flags identical-branch ternary', () => {
    const src = `<div>{flag ? "Same" : "Same"}</div>`;
    const { bogusOffenders } = analyzeContent(src);
    expect(bogusOffenders).toHaveLength(1);
    expect(bogusOffenders[0].match).toMatch(/\? "Same" : "Same"/);
  });

  it('does not flag distinct branches', () => {
    const src = `<div>{flag ? "Yes" : "No"}</div>`;
    const { bogusOffenders } = analyzeContent(src);
    expect(bogusOffenders).toHaveLength(0);
  });

  it('flags multiple bogus ternaries on same line', () => {
    const src = `{a?"x":"x"} {b?"y":"y"}`;
    const { bogusOffenders } = analyzeContent(src);
    expect(bogusOffenders).toHaveLength(2);
  });

  it('flags lang-conditional bogus (the historical iter75/79/82/87 pattern)', () => {
    const src = `<button title={lang==="ru"?"Setup":"Setup"}>X</button>`;
    const { bogusOffenders } = analyzeContent(src);
    expect(bogusOffenders).toHaveLength(1);
  });

  it('handles empty strings in both branches', () => {
    const src = `{flag ? "" : ""}`;
    const { bogusOffenders } = analyzeContent(src);
    expect(bogusOffenders).toHaveLength(1); // both branches empty IS identical
  });
});

describe('check-i18n analyzeContent — locale-blind aria-label/title detection', () => {
  it('flags aria-label with English literal', () => {
    const src = `<button aria-label="Close" />`;
    const { localeBlindOffenders } = analyzeContent(src);
    expect(localeBlindOffenders).toHaveLength(1);
    expect(localeBlindOffenders[0].value).toBe('Close');
  });

  it('flags aria-label with Russian literal', () => {
    const src = `<button aria-label="Закрыть" />`;
    const { localeBlindOffenders } = analyzeContent(src);
    expect(localeBlindOffenders).toHaveLength(1);
    expect(localeBlindOffenders[0].value).toBe('Закрыть');
  });

  it('flags title attribute with literal string', () => {
    const src = `<button title="Focus mode (F)" />`;
    const { localeBlindOffenders } = analyzeContent(src);
    expect(localeBlindOffenders).toHaveLength(1);
  });

  it('flags placeholder attribute with literal string', () => {
    const src = `<input placeholder="Search..." />`;
    const { localeBlindOffenders } = analyzeContent(src);
    expect(localeBlindOffenders).toHaveLength(1);
  });

  it('flags alt attribute with literal string', () => {
    const src = `<img alt="Profile photo" />`;
    const { localeBlindOffenders } = analyzeContent(src);
    expect(localeBlindOffenders).toHaveLength(1);
  });

  it('does NOT flag aria-label with JSX expression value', () => {
    const src = `<button aria-label={lang==="ru"?"А":"B"} />`;
    const { localeBlindOffenders } = analyzeContent(src);
    expect(localeBlindOffenders).toHaveLength(0);
  });

  it('does NOT flag aria-label with empty string', () => {
    const src = `<button aria-label="" />`;
    const { localeBlindOffenders } = analyzeContent(src);
    expect(localeBlindOffenders).toHaveLength(0);
  });

  it('does NOT flag aria-label with pure-symbol value', () => {
    const src = `<button aria-label="×" />`;
    const { localeBlindOffenders } = analyzeContent(src);
    // Pure-symbol values like "×" / "→" / "?" are intentional — accessibility
    // shorthand for icons. They don't need translation.
    expect(localeBlindOffenders).toHaveLength(0);
  });
});

describe('check-i18n analyzeContent — combined scenarios', () => {
  it('reports zero offenders for clean file', () => {
    const src = `<div>{lang==="ru"?"Привет":lang==="kk"?"Сәлем":"Hello"}</div>`;
    const result = analyzeContent(src);
    expect(result.binaryOffenders).toHaveLength(0);
    expect(result.bogusOffenders).toHaveLength(0);
  });

  it('separately tracks both check types when both are violated', () => {
    const src = [
      `<div>{lang==="ru"?"X":"Y"}</div>`, // binary, no kk
      `<div>{lang==="ru"?"Same":"Same"}</div>`, // bogus AND binary (no kk)
    ].join('\n');
    const { binaryOffenders, bogusOffenders } = analyzeContent(src);
    expect(binaryOffenders).toHaveLength(2);
    expect(bogusOffenders).toHaveLength(1);
  });

  it('BOGUS_TERNARY regex requires both branches identical via backreference', () => {
    expect(BOGUS_TERNARY.source).toContain('\\1');
  });
});

describe('check-i18n analyzeContent — Cyrillic JSX text detection', () => {
  it('flags Russian text content directly in JSX (iter123 boot-UI pattern)', () => {
    const src = `<div>Ошибка загрузки данных</div>`;
    const { cyrillicJsxOffenders } = analyzeContent(src);
    expect(cyrillicJsxOffenders).toHaveLength(1);
    expect(cyrillicJsxOffenders[0].value).toBe('Ошибка загрузки данных');
  });

  it('flags single Russian word in button (iter123 "Обновить" pattern)', () => {
    const src = `<button>Обновить</button>`;
    const { cyrillicJsxOffenders } = analyzeContent(src);
    expect(cyrillicJsxOffenders).toHaveLength(1);
    expect(cyrillicJsxOffenders[0].value).toBe('Обновить');
  });

  it('flags Russian text with punctuation', () => {
    const src = `<p>Привет, мир!</p>`;
    const { cyrillicJsxOffenders } = analyzeContent(src);
    expect(cyrillicJsxOffenders).toHaveLength(1);
  });

  it('does NOT flag JSX expression with lang conditional', () => {
    const src = `<div>{lang==="ru"?"Привет":lang==="kk"?"Сәлем":"Hello"}</div>`;
    const { cyrillicJsxOffenders } = analyzeContent(src);
    expect(cyrillicJsxOffenders).toHaveLength(0);
  });

  it('does NOT flag pure Latin text (legitimate brand/dev contexts)', () => {
    const src = `<div>AIAgent-Hub</div>`;
    const { cyrillicJsxOffenders } = analyzeContent(src);
    expect(cyrillicJsxOffenders).toHaveLength(0);
  });

  it('does NOT flag single Cyrillic char (too short to be a phrase)', () => {
    const src = `<span>Я</span>`;
    const { cyrillicJsxOffenders } = analyzeContent(src);
    expect(cyrillicJsxOffenders).toHaveLength(0);
  });

  it('does NOT scan pathologically long lines (e.g. compressed data blob)', () => {
    const longLine = '<div>Ошибка</div>' + 'x'.repeat(1000);
    const { cyrillicJsxOffenders } = analyzeContent(longLine);
    expect(cyrillicJsxOffenders).toHaveLength(0);
  });

  it('does NOT flag JSX expression interpolation', () => {
    const src = `<div>{value}</div>`;
    const { cyrillicJsxOffenders } = analyzeContent(src);
    expect(cyrillicJsxOffenders).toHaveLength(0);
  });

  it('CYRILLIC_JSX_TEXT regex is exported', () => {
    expect(CYRILLIC_JSX_TEXT).toBeInstanceOf(RegExp);
    expect(CYRILLIC_JSX_TEXT.source).toContain('А-Яа-яЁё');
  });
});
