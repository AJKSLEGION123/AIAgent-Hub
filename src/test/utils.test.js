import { describe, it, expect } from 'vitest';

// Test the alpha helper logic (same as in App.jsx)
const alpha = (hex, a) => hex + Math.round(a * 255).toString(16).padStart(2, '0');

describe('alpha()', () => {
  it('appends hex alpha to color', () => {
    expect(alpha('#ff0000', 1)).toBe('#ff0000ff');
    expect(alpha('#ff0000', 0)).toBe('#ff000000');
    expect(alpha('#ff0000', 0.5)).toBe('#ff000080');
  });

  it('handles edge values', () => {
    expect(alpha('#000', 0.1)).toMatch(/^#000[0-9a-f]{2}$/);
    expect(alpha('#6366f1', 0.04)).toMatch(/^#6366f1[0-9a-f]{2}$/);
  });
});

// Test theme structure
const TH = {
  dark: { bg: "#060609", text: "#ddddef", card: "#0e0e16", brd: "#1a1a28", mut: "#8888a0", dim: "#555577", surf: "#0a0a10" },
  light: { bg: "#f0f0f5", text: "#12122a", card: "#ffffff", brd: "#d8d8e4", mut: "#555570", dim: "#8888a8", surf: "#eaeaf0" },
};

describe('Theme', () => {
  it('has dark and light themes', () => {
    expect(TH.dark).toBeDefined();
    expect(TH.light).toBeDefined();
  });

  it('both themes have required keys', () => {
    const requiredKeys = ['bg', 'text', 'card', 'brd', 'mut', 'dim', 'surf'];
    for (const key of requiredKeys) {
      expect(TH.dark[key]).toBeDefined();
      expect(TH.light[key]).toBeDefined();
    }
  });

  it('colors are valid hex strings', () => {
    Object.values(TH.dark).forEach(color => {
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});

// Test model constants
const MC = { claude: "#f97316", gemini: "#8b5cf6", codex: "#06b6d4" };
const ML = { claude: "Claude Opus 4.6", gemini: "Gemini 3.1 Pro", codex: "Codex CLI" };

describe('Model constants', () => {
  it('has all three models', () => {
    expect(Object.keys(MC)).toEqual(['claude', 'gemini', 'codex']);
    expect(Object.keys(ML)).toEqual(['claude', 'gemini', 'codex']);
  });

  it('colors are valid hex', () => {
    Object.values(MC).forEach(color => {
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});
