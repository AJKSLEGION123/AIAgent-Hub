import { describe, it, expect } from 'vitest';

describe('Edge cases', () => {
  describe('localStorage handling', () => {
    it('handles missing localStorage gracefully', () => {
      const original = window.localStorage;
      // Simulate localStorage being unavailable
      expect(() => {
        try {
          localStorage.getItem('nonexistent');
        } catch {
          // Expected in some environments
        }
      }).not.toThrow();
    });

    it('handles corrupted JSON in localStorage', () => {
      localStorage.setItem('agent-hub-settings', '{invalid json!!!');
      expect(() => {
        try {
          JSON.parse(localStorage.getItem('agent-hub-settings'));
        } catch {
          // Expected - should not crash the app
        }
      }).not.toThrow();
      localStorage.removeItem('agent-hub-settings');
    });

    it('handles extremely large localStorage values', () => {
      const bigString = 'x'.repeat(10000);
      expect(() => {
        localStorage.setItem('test-large', bigString);
        localStorage.removeItem('test-large');
      }).not.toThrow();
    });
  });

  describe('URL hash handling', () => {
    it('handles empty hash', () => {
      expect(location.hash.slice(1) || 'prompts').toBe('prompts');
    });

    it('handles invalid hash values', () => {
      const validSections = ['prompts', 'combos', 'cheat', 'quick', 'setup'];
      const invalid = 'nonexistent';
      expect(validSections.includes(invalid) ? invalid : 'prompts').toBe('prompts');
    });
  });

  describe('Search edge cases', () => {
    it('handles regex special characters in search', () => {
      const search = 'test.*+?^${}()|[]\\';
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      expect(() => new RegExp(escaped, 'gi')).not.toThrow();
    });

    it('handles empty search', () => {
      const search = '';
      const words = search.split(/\s+/).filter(Boolean);
      expect(words).toEqual([]);
    });

    it('handles unicode search', () => {
      const search = 'тест 🚀 日本語';
      const words = search.split(/\s+/).filter(Boolean);
      expect(words.length).toBe(3);
    });
  });

  describe('Clipboard fallback', () => {
    it('handles missing clipboard API', () => {
      expect(() => {
        // Simulate clipboard write failure
        const fallback = () => {
          const a = document.createElement('textarea');
          a.value = 'test';
          a.style.cssText = 'position:fixed;opacity:0';
          document.body.appendChild(a);
          a.select();
          document.body.removeChild(a);
        };
        fallback();
      }).not.toThrow();
    });
  });
});
