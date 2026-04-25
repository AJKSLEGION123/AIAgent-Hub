import { describe, it, expect } from 'vitest';
import { detectTheme, toggleTheme, updateMetaThemeColor } from '../utils/theme';

describe('detectTheme', () => {
  it('returns dark or light', () => {
    const theme = detectTheme();
    expect(['dark', 'light']).toContain(theme);
  });

  it('returns "light" when prefers-color-scheme: light matches', () => {
    const orig = window.matchMedia;
    // @ts-expect-error stubbing for branch coverage
    window.matchMedia = (q: string) => ({ matches: q.includes('light'), media: q, addListener() {}, removeListener() {} });
    try {
      expect(detectTheme()).toBe('light');
    } finally {
      window.matchMedia = orig;
    }
  });

  it('returns "dark" when prefers-color-scheme: light does NOT match', () => {
    const orig = window.matchMedia;
    // @ts-expect-error stubbing for branch coverage
    window.matchMedia = () => ({ matches: false, media: '', addListener() {}, removeListener() {} });
    try {
      expect(detectTheme()).toBe('dark');
    } finally {
      window.matchMedia = orig;
    }
  });

  it('falls back to "dark" when matchMedia throws', () => {
    const orig = window.matchMedia;
    window.matchMedia = (() => { throw new Error('blocked'); }) as typeof window.matchMedia;
    try {
      expect(detectTheme()).toBe('dark');
    } finally {
      window.matchMedia = orig;
    }
  });
});

describe('toggleTheme', () => {
  it('dark → light', () => {
    expect(toggleTheme('dark')).toBe('light');
  });

  it('light → dark', () => {
    expect(toggleTheme('light')).toBe('dark');
  });

  it('double toggle returns original', () => {
    expect(toggleTheme(toggleTheme('dark'))).toBe('dark');
  });
});

describe('updateMetaThemeColor', () => {
  it('creates meta tag if missing', () => {
    // Remove existing
    document.querySelector('meta[name="theme-color"]')?.remove();
    updateMetaThemeColor('#060609');
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    expect(meta).not.toBeNull();
    expect(meta?.content).toBe('#060609');
  });

  it('updates existing meta tag', () => {
    updateMetaThemeColor('#ffffff');
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    expect(meta?.content).toBe('#ffffff');
  });
});
