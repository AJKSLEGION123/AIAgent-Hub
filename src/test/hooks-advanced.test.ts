import { describe, it, expect } from 'vitest';
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
});
