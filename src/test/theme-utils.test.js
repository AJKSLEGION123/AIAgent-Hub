import { describe, it, expect } from 'vitest';
import { font, fontDisplay, alpha, textOn } from '../theme-utils.js';

describe('font / fontDisplay constants', () => {
  it('font is a CSS font-family stack with mono fallbacks', () => {
    expect(font).toContain('JetBrains Mono');
    expect(font).toContain('monospace');
  });

  it('fontDisplay is a CSS font-family stack with serif fallback', () => {
    expect(fontDisplay).toContain('Fraunces');
    expect(fontDisplay).toContain('serif');
  });
});

describe('alpha()', () => {
  it('appends 2-hex-digit alpha suffix to a 6-digit hex', () => {
    expect(alpha('#e86a2a', 1)).toBe('#e86a2aff'); // 100% → ff
    expect(alpha('#e86a2a', 0)).toBe('#e86a2a00'); // 0% → 00
    expect(alpha('#e86a2a', 0.5)).toBe('#e86a2a80'); // 50% → 80
  });

  it('rounds non-exact alpha values', () => {
    expect(alpha('#000000', 0.25)).toBe('#00000040'); // 0.25 * 255 = 63.75 → 64 = 0x40
  });

  it('handles short 3-digit hex (returns input unchanged + alpha)', () => {
    // Implementation just concatenates — short hex gets weird output but doesn't throw
    expect(alpha('#fff', 1)).toBe('#fffff');
  });
});

describe('textOn() — relative-luminance contrast picker', () => {
  it('returns dark espresso on light backgrounds', () => {
    expect(textOn('#ffffff')).toBe('#0a0806'); // white bg → dark text
    expect(textOn('#f5efdd')).toBe('#0a0806'); // cream bg → dark text
    expect(textOn('#10b981')).toBe('#0a0806'); // bright green → dark text (L > 0.18)
  });

  it('returns white on dark backgrounds', () => {
    expect(textOn('#000000')).toBe('#ffffff');
    expect(textOn('#0a0806')).toBe('#ffffff');
    expect(textOn('#1e1e2e')).toBe('#ffffff');
  });

  it('handles 3-digit shorthand hex', () => {
    expect(textOn('#fff')).toBe('#0a0806'); // short white → dark
    expect(textOn('#000')).toBe('#ffffff'); // short black → white
  });

  it('falls back to dark for invalid input', () => {
    expect(textOn(null)).toBe('#0a0806');
    expect(textOn(undefined)).toBe('#0a0806');
    expect(textOn('')).toBe('#0a0806');
    expect(textOn('#ab')).toBe('#0a0806'); // too short
  });

  it('strips leading # from input', () => {
    expect(textOn('ffffff')).toBe('#0a0806'); // works without #
  });

  it('clears WCAG AA on borderline mid-dark backgrounds (regression)', () => {
    // Previous bug was using cream (#ece3ce) text on red-600 (#dc2626) which
    // failed contrast. textOn should pick white for these.
    expect(textOn('#dc2626')).toBe('#ffffff'); // red-600
    expect(textOn('#c026d3')).toBe('#ffffff'); // fuchsia-600
    expect(textOn('#475569')).toBe('#ffffff'); // slate-500/600
  });
});
