import { describe, it, expect } from 'vitest';
import { TH, MC, ML, MI, FONT, DIFF_COLORS, VALID_SECTIONS, COLORS } from '../utils/constants';

describe('Theme constants', () => {
  it('has dark and light themes', () => {
    expect(TH.dark).toBeDefined();
    expect(TH.light).toBeDefined();
  });

  it('themes have all required keys', () => {
    const keys = ['bg', 'bg2', 'card', 'cardH', 'brd', 'brdH', 'text', 'mut', 'dim', 'surf', 'glow', 'meta'];
    keys.forEach(key => {
      expect(TH.dark).toHaveProperty(key);
      expect(TH.light).toHaveProperty(key);
    });
  });

  it('dark colors are dark', () => {
    expect(TH.dark.bg).toMatch(/^#0/);
  });

  it('light colors are light', () => {
    expect(TH.light.bg).toMatch(/^#[e-f]/);
  });
});

describe('Model constants', () => {
  it('has all three models', () => {
    expect(Object.keys(MC)).toEqual(['claude', 'gemini', 'codex']);
    expect(Object.keys(ML)).toEqual(['claude', 'gemini', 'codex']);
    expect(Object.keys(MI)).toEqual(['claude', 'gemini', 'codex']);
  });

  it('model colors are valid hex', () => {
    Object.values(MC).forEach(c => expect(c).toMatch(/^#[0-9a-f]{6}$/));
  });

  it('model initials are single chars', () => {
    Object.values(MI).forEach(i => expect(i.length).toBe(1));
  });
});

describe('FONT', () => {
  it('includes JetBrains Mono', () => {
    expect(FONT).toContain('JetBrains Mono');
  });

  it('has fallbacks', () => {
    expect(FONT).toContain('monospace');
  });
});

describe('DIFF_COLORS', () => {
  it('has beginner, intermediate, advanced', () => {
    expect(DIFF_COLORS.beginner).toBeDefined();
    expect(DIFF_COLORS.intermediate).toBeDefined();
    expect(DIFF_COLORS.advanced).toBeDefined();
  });
});

describe('VALID_SECTIONS', () => {
  it('has 5 sections', () => {
    expect(VALID_SECTIONS.length).toBe(5);
    expect(VALID_SECTIONS).toContain('prompts');
    expect(VALID_SECTIONS).toContain('combos');
  });
});

describe('COLORS', () => {
  it('has all semantic colors', () => {
    expect(COLORS.success).toBe('#10b981');
    expect(COLORS.error).toBe('#ef4444');
    expect(COLORS.primary).toBe('#6366f1');
    expect(COLORS.warning).toBe('#f59e0b');
    expect(COLORS.info).toBe('#06b6d4');
    expect(COLORS.star).toBe('#eab308');
  });

  it('all are valid hex', () => {
    Object.values(COLORS).forEach(c => expect(c).toMatch(/^#[0-9a-f]{6}$/));
  });
});
