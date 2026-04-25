import { describe, it, expect } from 'vitest';
import { escapeRegex, matchesSearch, highlightMatch, searchRelevance } from '../utils/search';
import type { Prompt } from '../types';

const mockPrompt: Prompt = {
  id: 'rl-feat', m: 'Claude Code Opus 4.6', mk: 'claude', role: 'feature',
  type: 'command' as any, icon: '🖥', ac: '#10b981', time: '~2h',
  text: 'Feature development prompt with React and TypeScript',
  tags: ['react', 'typescript', 'ui'], difficulty: 'intermediate',
  output: '', related: [], prereqs: [], v: '8.2', compact: 'Short'
};

const roleNames = { feature: 'Фича' };

describe('escapeRegex', () => {
  it('escapes special characters', () => {
    expect(escapeRegex('test.*+?')).toBe('test\\.\\*\\+\\?');
    expect(escapeRegex('a(b)c')).toBe('a\\(b\\)c');
    expect(escapeRegex('a[b]c')).toBe('a\\[b\\]c');
  });

  it('handles empty string', () => {
    expect(escapeRegex('')).toBe('');
  });

  it('does not escape normal text', () => {
    expect(escapeRegex('hello world')).toBe('hello world');
  });
});

describe('matchesSearch', () => {
  it('returns true for empty query', () => {
    expect(matchesSearch(mockPrompt, '', roleNames)).toBe(true);
    expect(matchesSearch(mockPrompt, '  ', roleNames)).toBe(true);
  });

  it('matches by text content', () => {
    expect(matchesSearch(mockPrompt, 'react', roleNames)).toBe(true);
    expect(matchesSearch(mockPrompt, 'typescript', roleNames)).toBe(true);
  });

  it('matches by role name (translated)', () => {
    expect(matchesSearch(mockPrompt, 'Фича', roleNames)).toBe(true);
  });

  it('matches by ID', () => {
    expect(matchesSearch(mockPrompt, 'rl-feat', roleNames)).toBe(true);
  });

  it('matches by tag', () => {
    expect(matchesSearch(mockPrompt, 'ui', roleNames)).toBe(true);
  });

  it('multi-word AND search', () => {
    expect(matchesSearch(mockPrompt, 'react typescript', roleNames)).toBe(true);
    expect(matchesSearch(mockPrompt, 'react python', roleNames)).toBe(false);
  });

  it('case insensitive', () => {
    expect(matchesSearch(mockPrompt, 'REACT', roleNames)).toBe(true);
  });

  it('does not match unrelated query', () => {
    expect(matchesSearch(mockPrompt, 'kubernetes', roleNames)).toBe(false);
  });

  it('handles prompt with undefined tags (fallback to empty array)', () => {
    const noTags = { ...mockPrompt, tags: undefined as unknown as string[] };
    expect(matchesSearch(noTags, 'react', roleNames)).toBe(true); // still matches text
    expect(matchesSearch(noTags, 'kubernetes', roleNames)).toBe(false);
  });

  it('handles missing role in roleNames map', () => {
    expect(matchesSearch(mockPrompt, 'feature', {})).toBe(true); // raw role still in haystack
  });
});

describe('highlightMatch', () => {
  it('wraps matching text in mark tags', () => {
    expect(highlightMatch('hello world', 'world')).toBe('hello <mark>world</mark>');
  });

  it('case insensitive highlight', () => {
    expect(highlightMatch('Hello World', 'hello')).toBe('<mark>Hello</mark> World');
  });

  it('returns original for short query', () => {
    expect(highlightMatch('hello', 'h')).toBe('hello');
  });

  it('returns original for empty query', () => {
    expect(highlightMatch('hello', '')).toBe('hello');
  });

  it('handles regex characters safely', () => {
    expect(highlightMatch('test (value)', '(value)')).toBe('test <mark>(value)</mark>');
  });
});

describe('searchRelevance', () => {
  it('returns 0 for empty query', () => {
    expect(searchRelevance(mockPrompt, '', roleNames)).toBe(0);
  });

  it('highest score for exact ID match', () => {
    const score = searchRelevance(mockPrompt, 'rl-feat', roleNames);
    expect(score).toBeGreaterThanOrEqual(100);
  });

  it('high score for role name match', () => {
    const score = searchRelevance(mockPrompt, 'фича', roleNames);
    expect(score).toBeGreaterThanOrEqual(50);
  });

  it('medium score for tag match', () => {
    const score = searchRelevance(mockPrompt, 'react', roleNames);
    expect(score).toBeGreaterThanOrEqual(30);
  });

  it('low score for text-only match', () => {
    const score = searchRelevance(mockPrompt, 'development', roleNames);
    expect(score).toBe(10);
  });

  it('falls back to prompt.role when roleNames lookup misses', () => {
    // With empty roleNames, "feature" still matches via raw prompt.role
    const score = searchRelevance(mockPrompt, 'feature', {});
    expect(score).toBeGreaterThanOrEqual(50); // role match gives 50
  });
});
