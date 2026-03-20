import { describe, it, expect } from 'vitest';
import { filterPrompts, sortPrompts } from '../utils/filter';
import type { Prompt } from '../types';

const mp = (id: string, mk: string, role: string, type: string, diff: string, time: string, tags: string[], text: string, v: string = '8.0'): Prompt => ({
  id, m: mk === 'claude' ? 'Claude' : 'Gemini', mk: mk as any, role,
  type: type as any, icon: '🖥', ac: '#10b981', time, text, tags,
  difficulty: diff as any, output: '', related: [], prereqs: [], v, compact: '',
});

const prompts: Prompt[] = [
  mp('c-fe', 'claude', 'frontend', 'role', 'beginner', '~1h', ['react', 'ui'], 'Frontend text'),
  mp('c-be', 'claude', 'backend', 'role', 'intermediate', '~2h', ['api', 'node'], 'Backend text'),
  mp('g-qa', 'gemini', 'tester', 'task', 'advanced', '~3h', ['testing'], 'Tester text'),
  mp('c-new', 'claude', 'features', 'task', 'intermediate', '~30m', ['new'], 'New feature', '8.2'),
];

const defaultOpts = {
  mode: 'all' as any, value: 'all', search: '',
  showFavsOnly: false, favs: {}, showNew: false,
  hideUsed: false, usedPrompts: {}, roleNames: { frontend: 'Frontend', backend: 'Backend', tester: 'Tester', features: 'Features' },
};

describe('filterPrompts', () => {
  it('returns all with default options', () => {
    expect(filterPrompts(prompts, defaultOpts)).toHaveLength(4);
  });

  it('filters by model', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'model', value: 'claude' });
    expect(result).toHaveLength(3);
    expect(result.every(p => p.mk === 'claude')).toBe(true);
  });

  it('filters by role', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'role', value: 'frontend' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('c-fe');
  });

  it('filters by type', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'type', value: 'task' });
    expect(result).toHaveLength(2);
  });

  it('filters by difficulty', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'difficulty', value: 'advanced' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('g-qa');
  });

  it('filters by tag', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'tag', value: 'react' });
    expect(result).toHaveLength(1);
  });

  it('filters by time <1h', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'time', value: '<1h' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('c-new');
  });

  it('filters by time 1-2h', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, mode: 'time', value: '1-2h' });
    expect(result).toHaveLength(2);
  });

  it('filters by search', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, search: 'frontend' });
    expect(result).toHaveLength(1);
  });

  it('multi-word search', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, search: 'claude backend' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('c-be');
  });

  it('filters favorites only', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, showFavsOnly: true, favs: { 'c-fe': true } });
    expect(result).toHaveLength(1);
  });

  it('filters NEW only', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, showNew: true });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('c-new');
  });

  it('hides used prompts', () => {
    const result = filterPrompts(prompts, { ...defaultOpts, hideUsed: true, usedPrompts: { 'c-fe': true, 'c-be': true } });
    expect(result).toHaveLength(2);
  });
});

describe('sortPrompts', () => {
  it('default returns same order', () => {
    const sorted = sortPrompts(prompts, 'default', defaultOpts.roleNames);
    expect(sorted.map(p => p.id)).toEqual(['c-fe', 'c-be', 'g-qa', 'c-new']);
  });

  it('sorts by name', () => {
    const sorted = sortPrompts(prompts, 'name', defaultOpts.roleNames);
    expect(sorted[0].role).toBe('backend');
  });

  it('sorts by length (longest first)', () => {
    const sorted = sortPrompts(prompts, 'length', defaultOpts.roleNames);
    expect(sorted[0].text.length).toBeGreaterThanOrEqual(sorted[1].text.length);
  });

  it('sorts by time (longest first)', () => {
    const sorted = sortPrompts(prompts, 'time', defaultOpts.roleNames);
    expect(sorted[0].time).toBe('~3h');
  });

  it('sorts by model', () => {
    const sorted = sortPrompts(prompts, 'model', defaultOpts.roleNames);
    expect(sorted[0].mk).toBe('claude');
    expect(sorted[sorted.length - 1].mk).toBe('gemini');
  });
});
