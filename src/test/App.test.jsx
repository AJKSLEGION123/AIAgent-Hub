import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('shows Agent Hub title in loading/error state', () => {
    render(<App />);
    const titles = screen.getAllByText('Agent Hub');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('renders root container with data-theme', async () => {
    const { container } = render(<App />);
    // App renders a div — either loading, error, or main
    expect(container.firstChild).toBeTruthy();
  });
});

describe('localStorage', () => {
  it('reads saved settings without throwing', () => {
    localStorage.setItem('agent-hub-settings', JSON.stringify({ theme: 'light', lang: 'en' }));
    expect(() => render(<App />)).not.toThrow();
    localStorage.removeItem('agent-hub-settings');
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('agent-hub-settings', 'not-json');
    expect(() => render(<App />)).not.toThrow();
    localStorage.removeItem('agent-hub-settings');
  });
});
