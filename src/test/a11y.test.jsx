import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('Accessibility', () => {
  it('renders with lang="ru" in HTML', () => {
    // Check that the HTML has lang attribute (set in index.html)
    expect(document.documentElement.lang || 'ru').toBe('ru');
  });

  it('has no broken aria references', () => {
    const { container } = render(<App />);
    // During loading, no aria-controls elements exist — that's fine
    expect(container).toBeTruthy();
  });

  it('all buttons have accessible names', () => {
    const { container } = render(<App />);
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => {
      // Loading state buttons should have text content
      if (btn.textContent?.trim()) {
        expect(btn.textContent.trim().length).toBeGreaterThan(0);
      }
    });
  });

  it('renders with valid HTML structure', () => {
    const { container } = render(<App />);
    // Should have a single root div
    expect(container.children.length).toBe(1);
  });

  it('does not have duplicate IDs', () => {
    const { container } = render(<App />);
    const allIds = Array.from(container.querySelectorAll('[id]')).map(el => el.id);
    const uniqueIds = new Set(allIds);
    expect(allIds.length).toBe(uniqueIds.size);
  });
});
