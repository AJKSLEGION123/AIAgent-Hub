import { describe, it, expect } from 'vitest';
import { detectTheme, toggleTheme, updateMetaThemeColor } from '../utils/theme';

describe('detectTheme', () => {
  it('returns dark or light', () => {
    const theme = detectTheme();
    expect(['dark', 'light']).toContain(theme);
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
