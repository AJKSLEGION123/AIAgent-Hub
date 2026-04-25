import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary.jsx';

const Throw = () => { throw new Error('boom'); };
const Safe = () => <div>safe content</div>;

describe('ErrorBoundary', () => {
  // Silence the expected error log during tests
  let errSpy;
  beforeAll(() => { errSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); });
  afterAll(() => { errSpy.mockRestore(); });

  it('renders children when no error', () => {
    render(<ErrorBoundary><Safe /></ErrorBoundary>);
    expect(screen.getByText('safe content')).toBeTruthy();
  });

  it('renders fallback UI when child throws', () => {
    render(<ErrorBoundary><Throw /></ErrorBoundary>);
    // Fallback has AIAgent-Hub header and a Reload/Перезагрузить button
    expect(screen.getByText(/AIAgent-Hub/i)).toBeTruthy();
    const reloadBtn = screen.getByRole('button');
    expect(/Reload|Перезагрузить/.test(reloadBtn.textContent)).toBe(true);
  });

  it('exposes error details in a <details> element', () => {
    const { container } = render(<ErrorBoundary><Throw /></ErrorBoundary>);
    const details = container.querySelector('details');
    expect(details).toBeTruthy();
    expect(details.textContent).toContain('boom');
  });

  it('reset() handler reloads window on Reload click', () => {
    const reloadMock = vi.fn();
    const origLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { ...origLocation, reload: reloadMock },
      writable: true,
      configurable: true,
    });
    try {
      render(<ErrorBoundary><Throw /></ErrorBoundary>);
      const btn = screen.getByRole('button');
      fireEvent.click(btn);
      expect(reloadMock).toHaveBeenCalledTimes(1);
    } finally {
      Object.defineProperty(window, 'location', { value: origLocation, writable: true, configurable: true });
    }
  });
});
