import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { validateData, REQUIRED_PROMPT_FIELDS } = require('../../scripts/check-data.cjs');

// Helper: build a minimal valid catalog
const validPrompt = (over = {}) => ({
  id: 'rl-test', text: 'Test prompt', m: '/ralph-loop', mk: 'opus47m',
  role: 'Test', icon: '🧪', ac: '#10b981', time: '~1h', type: 'command',
  ...over,
});

const validCombo = (over = {}) => ({
  name: 'Test Combo', color: '#10b981', ids: [], ...over,
});

const validData = (over = {}) => ({
  P: [validPrompt()],
  COMBOS: { ru: [], en: [] },
  CONFIGS: [],
  CHEAT: {},
  ...over,
});

describe('check-data validateData — clean cases', () => {
  it('returns empty array for minimal valid catalog', () => {
    expect(validateData(validData())).toEqual([]);
  });

  it('handles missing optional collections gracefully', () => {
    const data = { P: [validPrompt()] };
    expect(validateData(data)).toEqual([]);
  });

  it('exports REQUIRED_PROMPT_FIELDS list', () => {
    expect(REQUIRED_PROMPT_FIELDS).toContain('id');
    expect(REQUIRED_PROMPT_FIELDS).toContain('text');
    expect(REQUIRED_PROMPT_FIELDS).toContain('m');
    expect(REQUIRED_PROMPT_FIELDS).toContain('mk');
    expect(REQUIRED_PROMPT_FIELDS).toContain('type');
  });
});

describe('check-data validateData — prompt validation', () => {
  it('flags missing required field', () => {
    const broken = validPrompt({ icon: undefined });
    delete broken.icon;
    const data = validData({ P: [broken] });
    const issues = validateData(data);
    expect(issues.some(i => i.includes('missing icon'))).toBe(true);
  });

  it('flags duplicate prompt IDs', () => {
    const data = validData({
      P: [validPrompt({ id: 'dup' }), validPrompt({ id: 'dup' })],
    });
    const issues = validateData(data);
    expect(issues.some(i => i.includes('DUPLICATE prompt id=dup'))).toBe(true);
  });

  it('reports the prompt id in the error message', () => {
    const broken = validPrompt({ id: 'rl-broken' });
    delete broken.text;
    const issues = validateData(validData({ P: [broken] }));
    expect(issues.some(i => i.includes('id=rl-broken'))).toBe(true);
  });
});

describe('check-data validateData — combo validation', () => {
  it('flags combo missing name', () => {
    const data = validData({
      COMBOS: { ru: [{ color: '#fff', ids: [] }], en: [] },
    });
    const issues = validateData(data);
    expect(issues.some(i => i.includes('missing name'))).toBe(true);
  });

  it('flags combo missing color', () => {
    const data = validData({
      COMBOS: { ru: [{ name: 'X', ids: [] }], en: [] },
    });
    const issues = validateData(data);
    expect(issues.some(i => i.includes('missing color'))).toBe(true);
  });

  it('accepts combo with `agents` field instead of `ids`', () => {
    const data = validData({
      COMBOS: { ru: [{ name: 'X', color: '#fff', agents: [] }], en: [] },
    });
    const issues = validateData(data).filter(i => i.includes('missing ids'));
    expect(issues).toHaveLength(0);
  });

  it('flags broken combo references', () => {
    const data = validData({
      P: [validPrompt({ id: 'rl-real' })],
      COMBOS: {
        ru: [validCombo({ ids: ['rl-real', 'rl-ghost'] })],
        en: [],
      },
    });
    const issues = validateData(data);
    expect(issues.some(i => i.includes('broken ref id=rl-ghost'))).toBe(true);
    expect(issues.some(i => i.includes('rl-real'))).toBe(false); // valid ref shouldn't flag
  });
});

describe('check-data validateData — config validation', () => {
  it('accepts old-format config (id+text)', () => {
    const data = validData({
      CONFIGS: [{ id: 'eslint', text: 'config' }],
    });
    expect(validateData(data)).toEqual([]);
  });

  it('accepts new-format config (name+content)', () => {
    const data = validData({
      CONFIGS: [{ name: 'eslint', content: 'config' }],
    });
    expect(validateData(data)).toEqual([]);
  });

  it('flags config matching neither shape', () => {
    const data = validData({
      CONFIGS: [{ name: 'eslint' }], // missing content
    });
    const issues = validateData(data);
    expect(issues.some(i => i.includes('CONFIGS[0]'))).toBe(true);
  });
});

describe('check-data validateData — related/prereqs', () => {
  it('flags broken related ref', () => {
    const data = validData({
      P: [validPrompt({ id: 'rl-a', related: ['rl-ghost'] })],
    });
    const issues = validateData(data);
    expect(issues.some(i => i.includes('related broken: rl-a -> rl-ghost'))).toBe(true);
  });

  it('flags broken prereqs ref', () => {
    const data = validData({
      P: [validPrompt({ id: 'rl-a', prereqs: ['rl-ghost'] })],
    });
    const issues = validateData(data);
    expect(issues.some(i => i.includes('prereqs broken: rl-a -> rl-ghost'))).toBe(true);
  });

  it('passes valid related/prereqs', () => {
    const data = validData({
      P: [
        validPrompt({ id: 'rl-a', related: ['rl-b'] }),
        validPrompt({ id: 'rl-b', prereqs: ['rl-a'] }),
      ],
    });
    expect(validateData(data)).toEqual([]);
  });
});

describe('check-data validateData — cheat sheets', () => {
  it('accepts new-format cheat sheet (name+cmds)', () => {
    const data = validData({
      CHEAT: { git: { name: 'Git', color: '#f04', cmds: [] } },
    });
    expect(validateData(data)).toEqual([]);
  });

  it('accepts old-format cheat sheet (title+sections)', () => {
    const data = validData({
      CHEAT: { git: { title: 'Git', sections: [] } },
    });
    expect(validateData(data)).toEqual([]);
  });

  it('flags cheat sheet matching neither shape', () => {
    const data = validData({
      CHEAT: { git: { foo: 'bar' } },
    });
    const issues = validateData(data);
    expect(issues.some(i => i.includes('CHEAT[git]'))).toBe(true);
  });
});
