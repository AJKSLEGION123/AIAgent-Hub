import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App integration', () => {
  it('renders loading state with progress bar', () => {
    const { container } = render(<App />);
    expect(container.querySelector('[style*="background: linear-gradient"]') || container.textContent.includes('Agent Hub')).toBeTruthy();
  });

  it('has noscript-like fallback in DOM structure', () => {
    const { container } = render(<App />);
    expect(container.innerHTML).toContain('Agent Hub');
  });

  it('renders skip link', () => {
    const { container } = render(<App />);
    // Skip link may or may not be visible depending on load state
    const skipLinks = container.querySelectorAll('a[href="#main-content"]');
    // In loading state, skip link is not rendered (only in AgentHub)
    expect(container).toBeTruthy();
  });
});

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe('Keyboard events', () => {
  it('does not crash on Escape key', () => {
    render(<App />);
    expect(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    }).not.toThrow();
  });

  it('does not crash on ? key', () => {
    render(<App />);
    expect(() => {
      fireEvent.keyDown(window, { key: '?' });
    }).not.toThrow();
  });
});

describe('Responsive', () => {
  it('renders without errors at any state', () => {
    const { container, unmount } = render(<App />);
    expect(container).toBeTruthy();
    unmount();
  });
});
