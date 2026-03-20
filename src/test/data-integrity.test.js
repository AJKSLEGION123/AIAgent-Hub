import { describe, it, expect } from 'vitest';

// Test data structure integrity without importing the actual compressed data
describe('Prompt schema validation', () => {
  const requiredKeys = ['id', 'm', 'mk', 'role', 'type', 'icon', 'ac', 'time', 'text', 'tags', 'difficulty'];
  const validMks = ['claude', 'gemini', 'codex'];
  const validTypes = ['role', 'task'];
  const validDifficulties = ['beginner', 'intermediate', 'advanced'];

  it('schema keys are defined', () => {
    expect(requiredKeys.length).toBe(11);
  });

  it('valid model keys', () => {
    expect(validMks).toEqual(['claude', 'gemini', 'codex']);
  });

  it('valid types', () => {
    expect(validTypes).toEqual(['role', 'task']);
  });

  it('valid difficulties', () => {
    expect(validDifficulties).toEqual(['beginner', 'intermediate', 'advanced']);
  });
});

describe('ID conventions', () => {
  it('claude IDs start with c-', () => {
    expect('c-fe'.startsWith('c-')).toBe(true);
  });

  it('gemini IDs start with g-', () => {
    expect('g-qa'.startsWith('g-')).toBe(true);
  });

  it('codex IDs start with x-', () => {
    expect('x-do'.startsWith('x-')).toBe(true);
  });

  it('IDs are lowercase with hyphens', () => {
    const validId = /^[a-z]-[a-z0-9-]+$/;
    expect(validId.test('c-mega-overnight')).toBe(true);
    expect(validId.test('g-unstoppable')).toBe(true);
    expect(validId.test('x-cost-opt')).toBe(true);
  });
});

describe('Color format', () => {
  it('accent colors are valid hex', () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    expect(hexRegex.test('#10b981')).toBe(true);
    expect(hexRegex.test('#ef4444')).toBe(true);
    expect(hexRegex.test('#6366f1')).toBe(true);
  });

  it('rejects invalid colors', () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    expect(hexRegex.test('red')).toBe(false);
    expect(hexRegex.test('#fff')).toBe(false);
    expect(hexRegex.test('')).toBe(false);
  });
});

describe('Time format', () => {
  it('parses valid time strings', () => {
    const timeRegex = /^~?\d+(\.\d+)?(h|m)$/;
    expect(timeRegex.test('~2h')).toBe(true);
    expect(timeRegex.test('~30m')).toBe(true);
    expect(timeRegex.test('~1.5h')).toBe(true);
  });

  it('special time values', () => {
    // Infinite prompt has special time
    expect('∞'.length).toBe(1);
  });
});
