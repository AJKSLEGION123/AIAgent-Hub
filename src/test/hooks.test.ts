import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default value when empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('saved'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('saved');
  });

  it('updates value and saves to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    act(() => { result.current[1]('updated'); });
    expect(result.current[0]).toBe('updated');
  });

  it('handles objects', () => {
    const { result } = renderHook(() => useLocalStorage<{ a: number; b?: number }>('obj-key', { a: 1 }));
    expect(result.current[0]).toEqual({ a: 1 });
    act(() => { result.current[1]({ a: 2, b: 3 }); });
    expect(result.current[0]).toEqual({ a: 2, b: 3 });
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('bad-key', 'not-json!!!');
    const { result } = renderHook(() => useLocalStorage('bad-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('supports function updater', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    act(() => { result.current[1]((prev) => prev + 1); });
    expect(result.current[0]).toBe(1);
  });

  it('warns when payload exceeds 4 MB near-limit threshold', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      // 4 MB threshold is on JSON-stringified bytes; "x".repeat(5_000_000) → ~5 MB JSON string
      const huge = 'x'.repeat(5_000_000);
      renderHook(() => useLocalStorage('huge-key', huge));
      expect(warnSpy).toHaveBeenCalled();
      const message = warnSpy.mock.calls[0][0];
      expect(String(message)).toMatch(/near limit/);
      expect(String(message)).toContain('huge-key');
    } finally {
      warnSpy.mockRestore();
    }
  });
});
