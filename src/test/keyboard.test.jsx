import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';

describe('Keyboard shortcuts (during loading)', () => {
  it('Escape does not crash during loading', () => {
    render(<App />);
    expect(() => fireEvent.keyDown(window, { key: 'Escape' })).not.toThrow();
  });

  it('? does not crash during loading', () => {
    render(<App />);
    expect(() => fireEvent.keyDown(window, { key: '?' })).not.toThrow();
  });

  it('Ctrl+K does not crash during loading', () => {
    render(<App />);
    expect(() => fireEvent.keyDown(window, { key: 'k', ctrlKey: true })).not.toThrow();
  });

  it('T does not crash during loading', () => {
    render(<App />);
    expect(() => fireEvent.keyDown(window, { key: 't' })).not.toThrow();
  });

  it('V does not crash during loading', () => {
    render(<App />);
    expect(() => fireEvent.keyDown(window, { key: 'v' })).not.toThrow();
  });

  it('R does not crash during loading', () => {
    render(<App />);
    expect(() => fireEvent.keyDown(window, { key: 'r' })).not.toThrow();
  });

  it('F does not crash during loading', () => {
    render(<App />);
    expect(() => fireEvent.keyDown(window, { key: 'f' })).not.toThrow();
  });

  it('Ctrl+/ does not crash during loading', () => {
    render(<App />);
    expect(() => fireEvent.keyDown(window, { key: '/', ctrlKey: true })).not.toThrow();
  });

  it('ArrowDown does not crash during loading', () => {
    render(<App />);
    expect(() => fireEvent.keyDown(window, { key: 'ArrowDown' })).not.toThrow();
  });

  it('Enter does not crash during loading', () => {
    render(<App />);
    expect(() => fireEvent.keyDown(window, { key: 'Enter' })).not.toThrow();
  });
});
