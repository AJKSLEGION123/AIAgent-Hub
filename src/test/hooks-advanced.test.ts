import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { usePageTitle } from '../hooks/usePageTitle';
import { useScrollProgress } from '../hooks/useScrollProgress';

describe('useOnlineStatus', () => {
  it('returns true by default', () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });
});

describe('useBodyScrollLock', () => {
  it('sets overflow hidden when locked', () => {
    const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
      initialProps: { locked: true },
    });
    expect(document.body.style.overflow).toBe('hidden');

    rerender({ locked: false });
    expect(document.body.style.overflow).toBe('');
  });

  it('cleans up on unmount', () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});

describe('usePageTitle', () => {
  it('sets document title', () => {
    renderHook(() => usePageTitle('Test Title'));
    expect(document.title).toBe('Test Title');
  });

  it('updates on change', () => {
    const { rerender } = renderHook(({ title }) => usePageTitle(title), {
      initialProps: { title: 'First' },
    });
    expect(document.title).toBe('First');
    rerender({ title: 'Second' });
    expect(document.title).toBe('Second');
  });
});

describe('useScrollProgress', () => {
  it('returns 0 initially', () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);
  });

  it('updates percentage on scroll via requestAnimationFrame', async () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
    let rafCb: FrameRequestCallback | null = null;
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCb = cb;
      return 0;
    });

    const { result } = renderHook(() => useScrollProgress());

    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });
    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
      rafCb?.(0);
    });
    expect(result.current).toBe(50);

    Object.defineProperty(window, 'scrollY', { value: 1000, configurable: true });
    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
      rafCb?.(0);
    });
    expect(result.current).toBe(100);

    rafSpy.mockRestore();
  });

  it('returns 0 when no scrollable content (scrollHeight === innerHeight)', async () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 800, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    let rafCb: FrameRequestCallback | null = null;
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCb = cb;
      return 0;
    });

    const { result } = renderHook(() => useScrollProgress());
    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
      rafCb?.(0);
    });
    expect(result.current).toBe(0);

    rafSpy.mockRestore();
  });

  it('cleans up scroll listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useScrollProgress());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeSpy.mockRestore();
  });
});
