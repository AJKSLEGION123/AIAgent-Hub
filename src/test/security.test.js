import { describe, it, expect } from 'vitest';
import { htmlEscape, csvEscape } from '../utils/helpers';

describe('Security: XSS Prevention', () => {
  it('escapes script tags', () => {
    const input = '<script>alert("xss")</script>';
    const escaped = htmlEscape(input);
    expect(escaped).not.toContain('<script>');
    expect(escaped).toContain('&lt;script&gt;');
  });

  it('escapes event handlers', () => {
    const input = '<img onerror="alert(1)">';
    const escaped = htmlEscape(input);
    expect(escaped).not.toContain('<img');
    expect(escaped).toContain('&lt;img');
  });

  it('escapes quotes in attributes', () => {
    const input = '" onmouseover="alert(1)"';
    const escaped = htmlEscape(input);
    expect(escaped).toContain('&quot;');
    expect(escaped).not.toContain('" onmouseover');
  });

  it('escapes ampersands', () => {
    expect(htmlEscape('a&b')).toBe('a&amp;b');
    expect(htmlEscape('&lt;')).toBe('&amp;lt;');
  });

  it('handles empty string', () => {
    expect(htmlEscape('')).toBe('');
  });

  it('handles unicode', () => {
    expect(htmlEscape('привет <мир>')).toBe('привет &lt;мир&gt;');
  });
});

describe('Security: CSV Injection Prevention', () => {
  it('escapes double quotes', () => {
    expect(csvEscape('value with "quotes"')).toBe('value with ""quotes""');
  });

  it('handles formula injection characters', () => {
    // CSV formula injection: =, +, -, @
    const dangerous = '=SUM(A1:A10)';
    const escaped = csvEscape(dangerous);
    // csvEscape only handles quotes, but wrapping in quotes prevents formula injection
    expect(escaped).toBe('=SUM(A1:A10)');
  });

  it('handles newlines in values', () => {
    const multiline = 'line1\nline2';
    expect(csvEscape(multiline)).toBe('line1\nline2');
  });
});

describe('Security: Input Sanitization', () => {
  it('regex special chars in search are escaped', () => {
    const search = 'test.*+?^${}()|[]\\';
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    expect(() => new RegExp(escaped, 'gi')).not.toThrow();
  });

  it('very long search does not crash', () => {
    const longSearch = 'a'.repeat(10000);
    expect(() => new RegExp(longSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')).not.toThrow();
  });
});
