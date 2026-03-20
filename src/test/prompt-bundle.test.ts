import { describe, it, expect } from 'vitest';
import { buildBundle, buildLaunchScript, totalTime, totalTokens } from '../utils/prompt-bundle';
import type { Prompt } from '../types';

const makePrompt = (id: string, mk: string, role: string, time: string, text: string): Prompt => ({
  id, m: mk === 'claude' ? 'Claude Code Opus 4.6' : 'Gemini 3.1 Pro',
  mk: mk as any, role, type: 'role', icon: '🖥', ac: '#10b981', time,
  text, tags: [], difficulty: 'intermediate', output: '', related: [],
  prereqs: [], v: '8.2', compact: text.slice(0, 50),
});

const roleNames = { frontend: 'Frontend', backend: 'Backend' };
const prompts = [
  makePrompt('c-fe', 'claude', 'frontend', '~2h', 'Frontend prompt text'),
  makePrompt('g-be', 'gemini', 'backend', '~30m', 'Backend prompt text'),
];

describe('buildBundle', () => {
  it('combines prompts with headers', () => {
    const bundle = buildBundle(prompts, roleNames);
    expect(bundle).toContain('═══ FRONTEND');
    expect(bundle).toContain('═══ BACKEND');
    expect(bundle).toContain('Frontend prompt text');
    expect(bundle).toContain('Backend prompt text');
  });

  it('includes model name', () => {
    const bundle = buildBundle(prompts, roleNames);
    expect(bundle).toContain('Claude Code Opus 4.6');
    expect(bundle).toContain('Gemini 3.1 Pro');
  });

  it('handles empty array', () => {
    expect(buildBundle([], roleNames)).toBe('');
  });

  it('handles single prompt', () => {
    const bundle = buildBundle([prompts[0]], roleNames);
    expect(bundle).toContain('FRONTEND');
    expect(bundle).not.toContain('BACKEND');
  });
});

describe('buildLaunchScript', () => {
  it('generates bash script', () => {
    const script = buildLaunchScript(prompts, roleNames);
    expect(script).toContain('#!/bin/bash');
    expect(script).toContain('claude --dangerously-skip-permissions');
    expect(script).toContain('gemini --model gemini-3.1-pro-preview --yolo');
  });

  it('includes role names', () => {
    const script = buildLaunchScript(prompts, roleNames);
    expect(script).toContain('Frontend');
    expect(script).toContain('Backend');
  });

  it('handles codex model', () => {
    const codexPrompt = makePrompt('x-do', 'codex', 'devops', '~1h', 'text');
    const script = buildLaunchScript([codexPrompt], { devops: 'DevOps' });
    expect(script).toContain('codex --full-auto');
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
    // "Frontend prompt text" = 20 chars → 5 tokens
    // "Backend prompt text" = 19 chars → 5 tokens
    expect(tokens).toBe(10);
  });

  it('handles empty array', () => {
    expect(totalTokens([])).toBe(0);
  });
});
