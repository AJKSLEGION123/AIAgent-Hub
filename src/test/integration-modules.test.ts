import { describe, it, expect } from 'vitest';

// Cross-module integration tests
import { alpha } from '../utils/helpers';
import { TH, MC, COLORS } from '../utils/constants';
import { toggleTheme, detectTheme } from '../utils/theme';
import { nextLanguage, detectLanguage } from '../utils/i18n';
import { escapeRegex } from '../utils/search';

describe('Cross-module integration', () => {
  it('alpha works with theme colors', () => {
    const result = alpha(TH.dark.bg, 0.5);
    expect(result).toMatch(/^#[0-9a-f]+$/);
    expect(result.length).toBe(9); // #060609 + 80
  });

  it('alpha works with model colors', () => {
    Object.values(MC).forEach(color => {
      const result = alpha(color, 0.1);
      expect(result.length).toBe(9);
    });
  });

  it('alpha works with semantic colors', () => {
    Object.values(COLORS).forEach(color => {
      expect(alpha(color, 0.5)).toMatch(/^#[0-9a-f]+$/);
    });
  });

  it('theme detection matches theme keys', () => {
    const theme = detectTheme();
    expect(TH[theme]).toBeDefined();
    const toggled = toggleTheme(theme);
    expect(TH[toggled]).toBeDefined();
  });

  it('language detection returns valid key', () => {
    const lang = detectLanguage();
    const next = nextLanguage(lang);
    expect(['ru', 'en', 'kk']).toContain(next);
  });

  it('escapeRegex handles all special characters in theme values', () => {
    // Theme glow uses rgba() which contains parens
    const glow = TH.dark.glow; // "rgba(99,102,241,0.04)"
    const escaped = escapeRegex(glow);
    expect(() => new RegExp(escaped)).not.toThrow();
  });
});
