import { describe, it, expect } from 'vitest';
import { buildBundle, buildLaunchScript, totalTime, totalTokens } from '../utils/prompt-bundle';
import type { Prompt } from '../types';

const makePrompt = (id: string, mk: string, role: string, time: string, text: string): Prompt => ({
  id, m: 'Claude Code Opus 4.6',
  mk: mk as any, role, type: 'command' as any, icon: '🖥', ac: '#10b981', time,
  text, tags: [], difficulty: 'intermediate', output: '', related: [],
  prereqs: [], v: '8.2', compact: text.slice(0, 50),
});

const roleNames = { feature: 'Feature', api: 'API' };
const prompts = [
  makePrompt('rl-feat', 'claude', 'feature', '~2h', 'Feature prompt text'),
  makePrompt('rl-api', 'claude', 'api', '~30m', 'API prompt text'),
];

describe('buildBundle', () => {
  it('combines prompts with headers', () => {
    const bundle = buildBundle(prompts, roleNames);
    expect(bundle).toContain('═══ FEATURE');
    expect(bundle).toContain('═══ API');
    expect(bundle).toContain('Feature prompt text');
    expect(bundle).toContain('API prompt text');
  });

  it('includes model name', () => {
    const bundle = buildBundle(prompts, roleNames);
    expect(bundle).toContain('Claude Code Opus 4.6');
  });

  it('handles empty array', () => {
    expect(buildBundle([], roleNames)).toBe('');
  });

  it('handles single prompt', () => {
    const bundle = buildBundle([prompts[0]], roleNames);
    expect(bundle).toContain('FEATURE');
    expect(bundle).not.toContain('═══ API');
  });
});

describe('buildLaunchScript', () => {
  it('generates bash script', () => {
    const script = buildLaunchScript(prompts, roleNames);
    expect(script).toContain('#!/bin/bash');
    expect(script).toContain('claude --dangerously-skip-permissions');
  });

  it('includes role names', () => {
    const script = buildLaunchScript(prompts, roleNames);
    expect(script).toContain('Feature');
    expect(script).toContain('API');
  });

  it('handles all-claude prompts', () => {
    const extraPrompt = makePrompt('sm-simplify', 'claude', 'simplify', '~1h', 'text');
    const script = buildLaunchScript([extraPrompt], { simplify: 'Simplify' });
    expect(script).toContain('claude --dangerously-skip-permissions');
  });
});

describe('totalTime', () => {
  it('sums hours and minutes', () => {
    const total = totalTime(prompts); // 2h + 30m = 150min
    expect(total).toBe(150);
  });

  it('handles hours only', () => {
    expect(totalTime([makePrompt('a', 'claude', 'x', '~3h', '')])).toBe(180);
  });

  it('handles minutes only', () => {
    expect(totalTime([makePrompt('a', 'claude', 'x', '~45m', '')])).toBe(45);
  });

  it('handles empty array', () => {
    expect(totalTime([])).toBe(0);
  });

  it('handles invalid time format', () => {
    expect(totalTime([makePrompt('a', 'claude', 'x', '∞', '')])).toBe(0);
  });
});

describe('totalTokens', () => {
  it('calculates token estimate', () => {
    const tokens = totalTokens(prompts);
    expect(tokens).toBeGreaterThan(0);
    // "Feature prompt text" = 19 chars → 5 tokens
    // "API prompt text" = 15 chars → 4 tokens
    expect(tokens).toBe(9);
  });

  it('handles empty array', () => {
    expect(totalTokens([])).toBe(0);
  });
});
