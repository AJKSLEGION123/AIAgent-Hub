import { describe, it, expect } from 'vitest';
import { exportMarkdown, exportCSV, exportHTML } from '../utils/export';
import type { Prompt } from '../types';

const mockPrompt: Prompt = {
  id: 'c-test',
  m: 'Claude Code Opus 4.6',
  mk: 'claude',
  role: 'frontend',
  type: 'role',
  icon: '🖥',
  ac: '#10b981',
  time: '~2h',
  text: 'Test prompt text with <special> chars & "quotes"',
  tags: ['react', 'typescript'],
  difficulty: 'intermediate',
  output: '',
  related: [],
  prereqs: [],
  v: '8.2',
  compact: 'Short version',
};

const roleNames = { frontend: 'Frontend' };

describe('exportMarkdown', () => {
  it('generates valid markdown', () => {
    const md = exportMarkdown([mockPrompt], roleNames);
    expect(md).toContain('# AIAgent-Hub');
    expect(md).toContain('Frontend');
    expect(md).toContain('```');
    expect(md).toContain('Test prompt text');
  });

  it('groups by model', () => {
    const md = exportMarkdown([mockPrompt], roleNames);
    expect(md).toContain('claude');
  });

  it('includes tags', () => {
    const md = exportMarkdown([mockPrompt], roleNames);
    expect(md).toContain('react, typescript');
  });
});

describe('exportCSV', () => {
  it('generates valid CSV with header', () => {
    const csv = exportCSV([mockPrompt], roleNames);
    expect(csv).toContain('ID,Role,Model');
    expect(csv).toContain('c-test');
    expect(csv).toContain('Frontend');
  });

  it('escapes quotes', () => {
    const promptWithQuotes = { ...mockPrompt, m: 'Model "with" quotes' };
    const csv = exportCSV([promptWithQuotes], roleNames);
    expect(csv).toContain('""with""');
  });

  it('calculates token count', () => {
    const csv = exportCSV([mockPrompt], roleNames);
    const expectedTokens = Math.ceil(mockPrompt.text.length / 4);
    expect(csv).toContain(String(expectedTokens));
  });
});

describe('exportHTML', () => {
  it('generates valid HTML', () => {
    const html = exportHTML([mockPrompt], roleNames);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('</html>');
    expect(html).toContain('Frontend');
  });

  it('escapes HTML entities', () => {
    const html = exportHTML([mockPrompt], roleNames);
    expect(html).toContain('&lt;special&gt;');
    expect(html).toContain('&amp;');
    expect(html).toContain('&quot;quotes&quot;');
    expect(html).not.toContain('<special>');
  });

  it('includes tags', () => {
    const html = exportHTML([mockPrompt], roleNames);
    expect(html).toContain('#react');
    expect(html).toContain('#typescript');
  });
});
