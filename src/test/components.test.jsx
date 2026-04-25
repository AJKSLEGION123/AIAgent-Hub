import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Pill, CBtn, Toast, EmptyState, HL } from '../components.jsx';

const themeColors = { accent: '#e86a2a', ink: '#0a0806', mut: '#888', dim: '#aaa' };

describe('Pill', () => {
  it('renders label text', () => {
    const { getByText } = render(<Pill on={false} fn={() => {}} lb="Filter" c={themeColors} />);
    expect(getByText('Filter')).toBeTruthy();
  });

  it('aria-pressed reflects on prop', () => {
    const { container } = render(<Pill on={true} fn={() => {}} lb="X" c={themeColors} />);
    expect(container.querySelector('button[aria-pressed="true"]')).toBeTruthy();
  });

  it('calls fn on click', () => {
    const fn = vi.fn();
    const { getByText } = render(<Pill on={false} fn={fn} lb="X" c={themeColors} />);
    fireEvent.click(getByText('X'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('uses cl override when provided', () => {
    const { container } = render(<Pill on={true} fn={() => {}} lb="X" cl="#10b981" c={themeColors} />);
    const btn = container.querySelector('button');
    // jsdom serializes hex → rgb. #10b981 = rgb(16, 185, 129)
    const style = btn?.getAttribute('style') || '';
    expect(style).toContain('rgb(16, 185, 129)');
  });
});

describe('CBtn', () => {
  const t = { copy: 'Copy', copied: '✓ Copied' };

  it('renders Copy text when not copied', () => {
    const { getByText } = render(
      <CBtn id="x" txt="text" copied={null} cp={() => {}} t={t} bg="#0a0806" />
    );
    expect(getByText('Copy')).toBeTruthy();
  });

  it('renders ✓ when its id matches copied state', () => {
    const { getByText } = render(
      <CBtn id="x" txt="text" copied="x" cp={() => {}} t={t} bg="#0a0806" />
    );
    expect(getByText('✓')).toBeTruthy();
  });

  it('aria-label switches between copy verb and copied confirmation', () => {
    const { container, rerender } = render(
      <CBtn id="ab" txt="text" copied={null} cp={() => {}} t={t} bg="#0a0806" />
    );
    expect(container.querySelector('button')?.getAttribute('aria-label')).toBe('Copy: ab');
    rerender(<CBtn id="ab" txt="text" copied="ab" cp={() => {}} t={t} bg="#0a0806" />);
    expect(container.querySelector('button')?.getAttribute('aria-label')).toBe('✓ Copied');
  });

  it('calls cp(id, txt, skip) on click', () => {
    const cp = vi.fn();
    const { getByText } = render(
      <CBtn id="x" txt="hello" skip={true} copied={null} cp={cp} t={t} bg="#0a0806" />
    );
    fireEvent.click(getByText('Copy'));
    expect(cp).toHaveBeenCalledWith('x', 'hello', true);
  });
});

describe('Toast', () => {
  it('renders the message when msg is truthy', () => {
    const { getByText } = render(<Toast msg="Saved!" />);
    expect(getByText('Saved!')).toBeTruthy();
  });

  it('returns null when msg is falsy', () => {
    const { container } = render(<Toast msg={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('has role="status" and aria-live="polite" for screen readers', () => {
    const { container } = render(<Toast msg="hi" />);
    const div = container.firstChild;
    expect(div?.getAttribute('role')).toBe('status');
    expect(div?.getAttribute('aria-live')).toBe('polite');
  });
});

describe('EmptyState', () => {
  it('renders Russian text when lang="ru"', () => {
    const { getByText } = render(<EmptyState c={themeColors} lang="ru" />);
    expect(getByText('Ничего не найдено')).toBeTruthy();
    expect(getByText('Попробуйте другой запрос')).toBeTruthy();
  });

  it('renders Kazakh text when lang="kk"', () => {
    const { getByText } = render(<EmptyState c={themeColors} lang="kk" />);
    expect(getByText('Ештеңе табылмады')).toBeTruthy();
    expect(getByText('Басқа сұраныс жасап көріңіз')).toBeTruthy();
  });

  it('renders English text when lang="en"', () => {
    const { getByText } = render(<EmptyState c={themeColors} lang="en" />);
    expect(getByText('Nothing found')).toBeTruthy();
    expect(getByText('Try a different query')).toBeTruthy();
  });
});

describe('HL', () => {
  it('returns plain text when query is empty', () => {
    const { container } = render(<HL text="hello world" q="" color="#e86a2a" />);
    expect(container.querySelectorAll('mark')).toHaveLength(0);
  });

  it('returns plain text when query is too short (< 2 chars)', () => {
    const { container } = render(<HL text="hello world" q="h" color="#e86a2a" />);
    expect(container.querySelectorAll('mark')).toHaveLength(0);
  });

  it('wraps matching substrings in <mark>', () => {
    const { container } = render(<HL text="hello world" q="hello" color="#e86a2a" />);
    expect(container.querySelectorAll('mark')).toHaveLength(1);
    expect(container.querySelector('mark')?.textContent).toBe('hello');
  });

  it('case-insensitive matching', () => {
    const { container } = render(<HL text="Hello World" q="hello" color="#e86a2a" />);
    expect(container.querySelector('mark')?.textContent).toBe('Hello');
  });

  it('escapes regex-special chars in query', () => {
    // q="(test)" must be treated as literal — should match only "(test)" not regex group
    const { container } = render(<HL text="this is (test) here" q="(test)" color="#e86a2a" />);
    expect(container.querySelector('mark')?.textContent).toBe('(test)');
  });

  it('handles multiple matches in same text', () => {
    const { container } = render(<HL text="foo foo foo" q="foo" color="#e86a2a" />);
    expect(container.querySelectorAll('mark')).toHaveLength(3);
  });
});
