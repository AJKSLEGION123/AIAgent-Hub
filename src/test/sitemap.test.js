import { describe, it, expect } from 'vitest';
import { buildSitemapXml } from '../../vite.config.js';

// iter129 generated sitemap.xml at build time so <lastmod> tracks the build
// date instead of a hardcoded value that goes stale every iter. These tests
// lock the helper's contract: single canonical URL, valid XML structure,
// custom date plumbing for build-time injection.

describe('buildSitemapXml', () => {
  it('emits a valid XML declaration', () => {
    expect(buildSitemapXml('2026-04-25')).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  });

  it('uses the sitemap.org urlset namespace', () => {
    expect(buildSitemapXml('2026-04-25')).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  });

  it('includes the canonical site URL', () => {
    expect(buildSitemapXml('2026-04-25')).toContain('<loc>https://ai-agent-hub.net/</loc>');
  });

  it('injects the provided lastmod date', () => {
    expect(buildSitemapXml('2026-04-25')).toContain('<lastmod>2026-04-25</lastmod>');
    expect(buildSitemapXml('2027-01-01')).toContain('<lastmod>2027-01-01</lastmod>');
  });

  it('defaults lastmod to today when no date supplied', () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(buildSitemapXml()).toContain(`<lastmod>${today}</lastmod>`);
  });

  it('exposes single canonical URL — no fragment URLs', () => {
    // Pre-iter129 sitemap had /#prompts, /#combos, /#cheat, /#quick, /#setup.
    // Google treats fragments as the same canonical URL, so they were SEO
    // noise. This test fails if anyone re-adds them.
    const xml = buildSitemapXml('2026-04-25');
    expect(xml).not.toMatch(/<loc>[^<]*#/);
    expect(xml.match(/<url>/g)).toHaveLength(1);
  });

  it('has priority 1.0 for the canonical URL', () => {
    expect(buildSitemapXml('2026-04-25')).toContain('<priority>1.0</priority>');
  });

  it('declares weekly changefreq', () => {
    expect(buildSitemapXml('2026-04-25')).toContain('<changefreq>weekly</changefreq>');
  });
});
