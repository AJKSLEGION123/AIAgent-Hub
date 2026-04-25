import { describe, it, expect } from 'vitest';
import { calculateStats, getTagCounts, getUniqueRoles } from '../utils/stats';
import type { Prompt } from '../types';

const mp = (id: string, mk: string, role: string, diff: string, time: string, tags: string[], text: string): Prompt => ({
  id, m: 'Model', mk: mk as any, role, type: 'role', icon: '🖥', ac: '#10b981',
  time, text, tags, difficulty: diff as any, output: '', related: [], prereqs: [],
  v: '8.0', compact: '',
});

const prompts = [
  mp('c1', 'claude', 'frontend', 'beginner', '~1h', ['react', 'ui'], 'Short text'),
  mp('c2', 'claude', 'backend', 'intermediate', '~2h', ['api', 'node', 'ui'], 'Medium length text here'),
  mp('g1', 'gemini', 'tester', 'advanced', '~30m', ['testing'], 'Another text for testing'),
  mp('x1', 'codex', 'devops', 'intermediate', '~3h', ['docker', 'ci-cd'], 'DevOps prompt text'),
];

describe('calculateStats', () => {
  it('counts totals correctly', () => {
    const stats = calculateStats(prompts);
    expect(stats.total).toBe(4);
    expect(stats.models).toBe(3);
    expect(stats.roles).toBe(4);
  });

  it('calculates time in hours (rounded to 5)', () => {
    const stats = calculateStats(prompts);
    // 1h + 2h + 0.5h + 3h = 6.5h → rounded to 5 → 5
    expect(stats.totalHours).toBe(5);
  });

  it('skips prompts with non-parseable time (no h/m unit)', () => {
    const noTime = mp('rl-broken', 'claude', 'role', 'beginner', '???', [], 'no time');
    const withGood = mp('rl-good', 'claude', 'role', 'beginner', '~1h', [], 'one hour');
    const stats = calculateStats([noTime, withGood]);
    // Only "rl-good" contributes to totalTime — "rl-broken" hits the early-return.
    expect(stats.totalHours).toBe(0); // 1h rounded to nearest 5 = 0
    expect(stats.total).toBe(2); // both still counted in total
  });

  it('calculates token estimate', () => {
    const stats = calculateStats(prompts);
    expect(stats.totalTokens).toBeGreaterThan(0);
  });

  it('groups by model', () => {
    const stats = calculateStats(prompts);
    expect(stats.byModel.length).toBe(3);
    const claudeCount = stats.byModel.find(([mk]) => mk === 'claude')?.[1];
    expect(claudeCount).toBe(2);
  });

  it('groups by difficulty', () => {
    const stats = calculateStats(prompts);
    expect(stats.byDifficulty.beginner).toBe(1);
    expect(stats.byDifficulty.intermediate).toBe(2);
    expect(stats.byDifficulty.advanced).toBe(1);
  });

  it('handles empty array', () => {
    const stats = calculateStats([]);
    expect(stats.total).toBe(0);
    expect(stats.models).toBe(0);
    expect(stats.totalHours).toBe(0);
    expect(stats.totalTokens).toBe(0);
  });
});

describe('getTagCounts', () => {
  it('counts tag occurrences', () => {
    const tags = getTagCounts(prompts);
    const uiCount = tags.find(([t]) => t === 'ui')?.[1];
    expect(uiCount).toBe(2); // appears in c1 and c2
  });

  it('sorts by popularity (desc)', () => {
    const tags = getTagCounts(prompts);
    for (let i = 1; i < tags.length; i++) {
      expect(tags[i - 1]![1]).toBeGreaterThanOrEqual(tags[i]![1]);
    }
  });

  it('returns all unique tags', () => {
    const tags = getTagCounts(prompts);
    const tagNames = tags.map(([t]) => t);
    expect(tagNames).toContain('react');
    expect(tagNames).toContain('docker');
    expect(tagNames).toContain('testing');
  });

  it('handles empty array', () => {
    expect(getTagCounts([])).toEqual([]);
  });
});

describe('getUniqueRoles', () => {
  it('returns unique roles', () => {
    const roles = getUniqueRoles(prompts);
    expect(roles).toHaveLength(4);
    expect(roles).toContain('frontend');
    expect(roles).toContain('devops');
  });

  it('handles duplicates', () => {
    const dupes = [...prompts, ...prompts];
    const roles = getUniqueRoles(dupes);
    expect(roles).toHaveLength(4);
  });

  it('handles empty array', () => {
    expect(getUniqueRoles([])).toEqual([]);
  });
});
