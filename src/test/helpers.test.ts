import { describe, it, expect } from 'vitest';
import { alpha, csvEscape, htmlEscape, wordCount, tokenCount, timeAgo } from '../utils/helpers';

describe('alpha()', () => {
  it('appends hex alpha', () => {
    expect(alpha('#ff0000', 1)).toBe('#ff0000ff');
    expect(alpha('#ff0000', 0)).toBe('#ff000000');
    expect(alpha('#ff0000', 0.5)).toBe('#ff000080');
  });

  it('pads single digit', () => {
    expect(alpha('#000', 0.01)).toMatch(/^#000[0-9a-f]{2}$/);
  });
});

describe('csvEscape()', () => {
  it('escapes double quotes', () => {
    expect(csvEscape('hello "world"')).toBe('hello ""world""');
  });

  it('handles undefined', () => {
    expect(csvEscape(undefined)).toBe('');
  });

  it('handles empty string', () => {
    expect(csvEscape('')).toBe('');
  });
});

describe('htmlEscape()', () => {
  it('escapes all HTML entities', () => {
    expect(htmlEscape('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('escapes ampersand', () => {
    expect(htmlEscape('a & b')).toBe('a &amp; b');
  });
});

describe('wordCount()', () => {
  it('counts words', () => {
    expect(wordCount('hello world')).toBe(2);
    expect(wordCount('  spaced  out  ')).toBe(2);
    expect(wordCount('')).toBe(0);
  });

  it('handles unicode', () => {
    expect(wordCount('привет мир 🚀')).toBe(3);
  });
});

describe('tokenCount()', () => {
  it('approximates tokens as chars/4', () => {
    expect(tokenCount('abcd')).toBe(1);
    expect(tokenCount('12345678')).toBe(2);
    expect(tokenCount('abc')).toBe(1); // ceil
  });
});

describe('timeAgo()', () => {
  it('formats milliseconds', () => {
    expect(timeAgo(15000)).toBe('<1m');
    expect(timeAgo(120000)).toBe('2m');
    expect(timeAgo(3600000)).toBe('1h0m');
    expect(timeAgo(5400000)).toBe('1h30m');
  });
});
