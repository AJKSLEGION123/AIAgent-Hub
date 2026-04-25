import { describe, it, expect, vi, afterEach } from 'vitest';
import { exportMarkdown, exportCSV, exportHTML, downloadFile } from '../utils/export';
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

  it('omits Tags line when prompt has no tags', () => {
    const noTags = { ...mockPrompt, tags: [] };
    const md = exportMarkdown([noTags], roleNames);
    expect(md).not.toContain('Tags:');
  });

  it('falls back to p.role when roleNames lookup misses', () => {
    const md = exportMarkdown([mockPrompt], {}); // empty roleNames
    expect(md).toContain('frontend'); // raw role string used as fallback
  });

  it('groups prompts by model', () => {
    const claudePrompt = { ...mockPrompt, id: 'c-1', mk: 'claude' as any };
    const geminiPrompt = { ...mockPrompt, id: 'g-1', mk: 'gemini' as any };
    const md = exportMarkdown([claudePrompt, geminiPrompt], roleNames);
    expect(md).toMatch(/## claude.*## gemini/s);
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

  it('falls back to p.role when roleNames lookup misses', () => {
    const csv = exportCSV([mockPrompt], {});
    expect(csv).toContain('frontend');
  });

  it('joins tags with semicolon', () => {
    const csv = exportCSV([mockPrompt], roleNames);
    expect(csv).toContain('react;typescript');
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

  it('omits tag div when prompt has no tags', () => {
    const noTags = { ...mockPrompt, tags: [] };
    const html = exportHTML([noTags], roleNames);
    expect(html).not.toContain('class="tag"');
  });

  it('falls back to p.role when roleNames lookup misses', () => {
    const html = exportHTML([mockPrompt], {});
    expect(html).toContain('frontend');
  });
});

describe('downloadFile', () => {
  afterEach(() => { vi.restoreAllMocks(); });

  it('creates a Blob, anchor, clicks it, and revokes the URL', () => {
    const createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    const revokeUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const clickSpy = vi.fn();
    const createElement = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return { href: '', download: '', click: clickSpy } as unknown as HTMLAnchorElement;
      }
      return document.createElement(tag);
    });

    downloadFile('hello world', 'test.txt', 'text/plain');

    expect(createUrl).toHaveBeenCalledTimes(1);
    const blobArg = createUrl.mock.calls[0]![0] as Blob;
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe('text/plain');
    expect(createElement).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeUrl).toHaveBeenCalledWith('blob:mock-url');
  });

  it('sets the anchor download attribute to the supplied filename', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:x');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const anchor: { href: string; download: string; click: () => void } = {
      href: '', download: '', click: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as unknown as HTMLAnchorElement);

    downloadFile('content', 'prompts-export.md', 'text/markdown');

    expect(anchor.href).toBe('blob:x');
    expect(anchor.download).toBe('prompts-export.md');
  });
});
