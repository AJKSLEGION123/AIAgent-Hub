import { describe, it, expect, vi } from 'vitest';
import { copyToClipboard } from '../utils/clipboard';

describe('copyToClipboard', () => {
  it('uses navigator.clipboard when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const result = await copyToClipboard('test text');
    expect(result).toBe(true);
    expect(writeText).toHaveBeenCalledWith('test text');
  });

  it('falls back to execCommand when clipboard fails', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error()) } });

    // execCommand is deprecated but still works as fallback
    document.execCommand = vi.fn().mockReturnValue(true);

    const result = await copyToClipboard('fallback text');
    expect(result).toBe(true);
  });

  it('handles empty string', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const result = await copyToClipboard('');
    expect(result).toBe(true);
  });

  it('handles very long text', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const longText = 'x'.repeat(100000);
    const result = await copyToClipboard(longText);
    expect(result).toBe(true);
    expect(writeText).toHaveBeenCalledWith(longText);
  });

  it('returns false when both navigator.clipboard and execCommand throw', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('clipboard blocked')) },
    });
    document.execCommand = vi.fn().mockImplementation(() => { throw new Error('execCommand also blocked'); });

    const result = await copyToClipboard('abc');
    expect(result).toBe(false);
  });
});
