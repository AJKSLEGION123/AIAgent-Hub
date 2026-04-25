import { describe, it, expect } from 'vitest';
import { TH, MC, ML, MI, pl } from '../constants.js';

describe('TH (theme color tokens)', () => {
  it('has dark + light variants with the same keys', () => {
    expect(Object.keys(TH.dark).sort()).toEqual(Object.keys(TH.light).sort());
  });

  it('exposes accent + onAccent for contrast pairing', () => {
    expect(TH.dark.accent).toBeTruthy();
    expect(TH.dark.onAccent).toBeTruthy();
    expect(TH.light.accent).toBeTruthy();
    expect(TH.light.onAccent).toBeTruthy();
  });

  it('uses warm-editorial palette (no indigo/purple per CLAUDE.md)', () => {
    // Brand palette is espresso + cream + burnt orange. Sanity-check a few:
    expect(TH.dark.bg).toBe('#0a0806');     // espresso
    expect(TH.dark.text).toBe('#ece3ce');   // cream
    expect(TH.dark.accent).toBe('#e86a2a'); // burnt orange
  });
});

describe('MC / ML / MI (model maps)', () => {
  it('has matching keys across all three maps', () => {
    expect(Object.keys(MC).sort()).toEqual(Object.keys(ML).sort());
    expect(Object.keys(MC).sort()).toEqual(Object.keys(MI).sort());
  });

  it('opus47m model is registered', () => {
    expect(MC.opus47m).toBeTruthy();
    expect(ML.opus47m).toContain('Opus 4.7');
    expect(MI.opus47m).toBeTruthy();
  });
});

describe('pl() — Russian pluralization', () => {
  // Russian plural rules:
  // - "one" form for n ending in 1 (except 11): 1, 21, 31, 101, ...
  // - "few" form for n ending in 2,3,4 (except 12-14): 2, 3, 4, 22, 23, ...
  // - "many" form for everything else: 0, 5-20, 25-30, ...

  it('selects "one" for 1, 21, 31, 101', () => {
    expect(pl(1, 'модель', 'модели', 'моделей')).toBe('модель');
    expect(pl(21, 'модель', 'модели', 'моделей')).toBe('модель');
    expect(pl(31, 'модель', 'модели', 'моделей')).toBe('модель');
    expect(pl(101, 'модель', 'модели', 'моделей')).toBe('модель');
  });

  it('selects "few" for 2-4, 22-24', () => {
    expect(pl(2, 'модель', 'модели', 'моделей')).toBe('модели');
    expect(pl(3, 'модель', 'модели', 'моделей')).toBe('модели');
    expect(pl(4, 'модель', 'модели', 'моделей')).toBe('модели');
    expect(pl(22, 'модель', 'модели', 'моделей')).toBe('модели');
    expect(pl(24, 'модель', 'модели', 'моделей')).toBe('модели');
  });

  it('selects "many" for 0, 5-20, 25-30, 100', () => {
    expect(pl(0, 'модель', 'модели', 'моделей')).toBe('моделей');
    expect(pl(5, 'модель', 'модели', 'моделей')).toBe('моделей');
    expect(pl(20, 'модель', 'модели', 'моделей')).toBe('моделей');
    expect(pl(25, 'модель', 'модели', 'моделей')).toBe('моделей');
    expect(pl(100, 'модель', 'модели', 'моделей')).toBe('моделей');
  });

  it('handles teen exceptions correctly (11-14 → "many")', () => {
    // 11/12/13/14 are special-cases — they're "many" despite ending in 1/2/3/4
    expect(pl(11, 'модель', 'модели', 'моделей')).toBe('моделей');
    expect(pl(12, 'модель', 'модели', 'моделей')).toBe('моделей');
    expect(pl(13, 'модель', 'модели', 'моделей')).toBe('моделей');
    expect(pl(14, 'модель', 'модели', 'моделей')).toBe('моделей');
  });

  it('handles negative numbers via Math.abs', () => {
    expect(pl(-1, 'модель', 'модели', 'моделей')).toBe('модель');
    expect(pl(-3, 'модель', 'модели', 'моделей')).toBe('модели');
    expect(pl(-11, 'модель', 'модели', 'моделей')).toBe('моделей');
  });
});
