import { describe, it, expect, vi } from 'vitest';
import { detectLanguage, nextLanguage, langLabel, formatNumber } from '../utils/i18n';

describe('detectLanguage', () => {
  it('returns a valid language key', () => {
    const lang = detectLanguage();
    expect(['ru', 'en', 'kk']).toContain(lang);
  });

  it('falls back to ru when navigator.language access throws', () => {
    const origDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'language')
      ?? Object.getOwnPropertyDescriptor(navigator, 'language');
    Object.defineProperty(navigator, 'language', {
      get() { throw new Error('blocked'); },
      configurable: true,
    });
    try {
      expect(detectLanguage()).toBe('ru');
    } finally {
      if (origDescriptor) Object.defineProperty(navigator, 'language', origDescriptor);
    }
  });

  it('detects Kazakh from navigator.language="kk-KZ"', () => {
    const origDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'language')
      ?? Object.getOwnPropertyDescriptor(navigator, 'language');
    Object.defineProperty(navigator, 'language', {
      get() { return 'kk-KZ'; },
      configurable: true,
    });
    try {
      expect(detectLanguage()).toBe('kk');
    } finally {
      if (origDescriptor) Object.defineProperty(navigator, 'language', origDescriptor);
    }
  });

  it('detects Russian from navigator.language="ru-RU"', () => {
    const origDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'language')
      ?? Object.getOwnPropertyDescriptor(navigator, 'language');
    Object.defineProperty(navigator, 'language', {
      get() { return 'ru-RU'; },
      configurable: true,
    });
    try {
      expect(detectLanguage()).toBe('ru');
    } finally {
      if (origDescriptor) Object.defineProperty(navigator, 'language', origDescriptor);
    }
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

  it('formats numbers for Kazakh locale', () => {
    const formatted = formatNumber(1234567, 'kk');
    // Kazakh kk-KZ uses space group separator like Russian. Just assert it
    // contains the digits and isn't equal to the English comma-formatted form.
    expect(formatted.replace(/\s/g, '')).toBe('1234567');
    expect(formatted).not.toContain(',');
  });

  it('handles zero', () => {
    expect(formatNumber(0, 'en')).toBe('0');
  });

  it('handles negative numbers', () => {
    const formatted = formatNumber(-42, 'en');
    expect(formatted).toContain('42');
  });

  it('falls back to plain String(n) when Intl.NumberFormat throws', () => {
    const orig = Intl.NumberFormat;
    // @ts-expect-error overriding for fallback-path coverage
    Intl.NumberFormat = function () { throw new Error('intl-broken'); };
    try {
      expect(formatNumber(42, 'en')).toBe('42');
    } finally {
      Intl.NumberFormat = orig;
    }
  });
});
