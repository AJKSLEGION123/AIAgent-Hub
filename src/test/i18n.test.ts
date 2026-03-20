import { describe, it, expect } from 'vitest';
import { detectLanguage, nextLanguage, langLabel, formatNumber } from '../utils/i18n';

describe('detectLanguage', () => {
  it('returns a valid language key', () => {
    const lang = detectLanguage();
    expect(['ru', 'en', 'kk']).toContain(lang);
  });
});

describe('nextLanguage', () => {
  it('cycles ru → en → kk → ru', () => {
    expect(nextLanguage('ru')).toBe('en');
    expect(nextLanguage('en')).toBe('kk');
    expect(nextLanguage('kk')).toBe('ru');
  });

  it('full cycle returns to start', () => {
    let lang: any = 'ru';
    lang = nextLanguage(lang);
    lang = nextLanguage(lang);
    lang = nextLanguage(lang);
    expect(lang).toBe('ru');
  });
});

describe('langLabel', () => {
  it('shows next language label', () => {
    expect(langLabel('ru')).toBe('EN');
    expect(langLabel('en')).toBe('KK');
    expect(langLabel('kk')).toBe('RU');
  });
});

describe('formatNumber', () => {
  it('formats numbers for Russian locale', () => {
    const formatted = formatNumber(1234567, 'ru');
    // Russian uses space or non-breaking space as separator
    expect(formatted.replace(/\s/g, '')).toBe('1234567');
  });

  it('formats numbers for English locale', () => {
    const formatted = formatNumber(1234567, 'en');
    expect(formatted).toContain(',');
  });

  it('handles zero', () => {
    expect(formatNumber(0, 'en')).toBe('0');
  });

  it('handles negative numbers', () => {
    const formatted = formatNumber(-42, 'en');
    expect(formatted).toContain('42');
  });
});
