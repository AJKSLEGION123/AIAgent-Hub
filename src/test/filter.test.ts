import { describe, it, expect } from 'vitest';
import { filterPrompts, sortPrompts } from '../utils/filter';
import type { Prompt } from '../types';

const mp = (id: string, mk: string, role: string, type: string, diff: string, time: string, tags: string[], text: string, v: string = '8.0'): Prompt => ({
  id, m: mk === 'claude' ? 'Claude' : 'Gemini', mk: mk as any, role,
  type: type as any, icon: '🖥', ac: '#10b981', time, text, tags,
  difficulty: diff as any, output: '', related: [], prereqs: [], v, compact: '',
});

const prompts: Prompt[] = [
  mp('rl-feat', 'claude', 'feature', 'command', 'beginner', '~1h', ['feature', 'ui'], 'Feature text'),
  mp('rl-api', 'claude', 'api', 'command', 'intermediate', '~2h', ['api', 'backend'], 'API text'),
  mp('rv-pr', 'claude', 'review', 'command', 'advanced', '~3h', ['testing'], 'Review text'),
  mp('sm-new', 'claude', 'simplify', 'command', 'intermediate', '~30m', ['new'], 'New simplify', '8.2'),
];

const defaultOpts = {
  mode: 'all' as any, value: 'all', search: '',
  showFavsOnly: false, favs: {}, showNew: false,
  hideUsed: false, usedPrompts: {}, roleNames: { feature: 'Feature', api: 'API', review: 'Review', simplify: 'Simplify' },
};

describe('filterPrompts', () => {
  it('returns all with default options', () => {
    expect(filterPrompts(prompts, defaultOpts)).toHaveLength(4);
  });

  it('filters by model', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'model', value: 'claude' });
    expect(result).toHaveLength(4);
    expect(result.every(p => p.mk === 'claude')).toBe(true);
  });

  it('filters by role', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'role', value: 'feature' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('rl-feat');
  });

  it('filters by type', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'type', value: 'command' });
    expect(result).toHaveLength(4);
  });

  it('filters by difficulty', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'difficulty', value: 'advanced' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('rv-pr');
  });

  it('filters by tag', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'tag', value: 'feature' });
    expect(result).toHaveLength(1);
  });

  it('filters by time <1h', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'time', value: '<1h' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('sm-new');
  });

  it('filters by time 1-2h', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'time', value: '1-2h' });
    expect(result).toHaveLength(2);
  });

  it('filters by search', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, search: 'feature' });
    expect(result).toHaveLength(1);
  });

  it('multi-word search', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, search: 'claude api' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('rl-api');
  });

  it('filters favorites only', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, showFavsOnly: true, favs: { 'rl-feat': true } });
    expect(result).toHaveLength(1);
  });

  it('filters NEW only', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, showNew: true });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('sm-new');
  });

  it('hides used prompts', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, hideUsed: true, usedPrompts: { 'rl-feat': true, 'rl-api': true } });
    expect(result).toHaveLength(2);
  });

  it('filters by time >2h', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'time', value: '>2h' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('rv-pr');
  });

  it('time filter excludes prompts whose time has no h/m unit', () => {
    const noTime = mp('rl-notime', 'claude', 'role', 'command', 'beginner', '???', [], 'no time');
    const result = filterPrompts([noTime, ...prompts], { ...defaultOpts, mode: 'time', value: '<1h' });
    expect(result.find(p => p.id === 'rl-notime')).toBeUndefined();
  });

  it('time filter falls through (returns true) on unknown value', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'time', value: 'weird' });
    // unknown value → return true → keeps all that have a parseable time
    expect(result.length).toBeGreaterThan(0);
  });

  it('search with special chars matches as plain substring (no regex escape)', () => {
    // Regression for App.jsx iter67: search code used to .replace(/[.*+?^${}()|[\]\\]/g,'\\$&')
    // which broke substring matching since the query was used in String.includes(), not RegExp.
    // The utility was always correct — this test guards against re-introducing the bug.
    const dotted = mp('rl-dot', 'claude', 'role', 'command', 'beginner', '~1h', ['v1.2'], 'tagged version v1.2 release');
    const parens = mp('rl-paren', 'claude', 'role', 'command', 'beginner', '~1h', ['react'], 'use useState() in component');
    const corpus = [...prompts, dotted, parens];

    expect(filterPrompts(corpus, { ...defaultOpts, search: 'v1.2' }).map(p => p.id)).toContain('rl-dot');
    expect(filterPrompts(corpus, { ...defaultOpts, search: 'useState()' }).map(p => p.id)).toContain('rl-paren');
  });
});

describe('sortPrompts', () => {
  it('default returns same order', () => {
    const sorted = sortPrompts(prompts, 'default', defaultOpts.roleNames);
    expect(sorted.map(p => p.id)).toEqual(['rl-feat', 'rl-api', 'rv-pr', 'sm-new']);
  });

  it('sorts by name', () => {
    const sorted = sortPrompts(prompts, 'name', defaultOpts.roleNames);
    expect(sorted[0]!.role).toBe('api');
  });

  it('sorts by length (longest first)', () => {
    const sorted = sortPrompts(prompts, 'length', defaultOpts.roleNames);
    expect(sorted[0]!.text.length).toBeGreaterThanOrEqual(sorted[1]!.text.length);
  });

  it('sorts by time (longest first)', () => {
    const sorted = sortPrompts(prompts, 'time', defaultOpts.roleNames);
    expect(sorted[0]!.time).toBe('~3h');
  });

  it('sorts by model', () => {
    const sorted = sortPrompts(prompts, 'model', defaultOpts.roleNames);
    expect(sorted[0]!.mk).toBe('claude');
    expect(sorted[sorted.length - 1]!.mk).toBe('claude');
  });

  it('falls through to identity sort on unknown sortBy', () => {
    const sorted = sortPrompts(prompts, 'made-up-mode' as never, defaultOpts.roleNames);
    expect(sorted.map(p => p.id)).toEqual(prompts.map(p => p.id));
  });
});
