import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// Lock in iter127's security-headers parity between Vercel (vercel.json) and
// self-hosted nginx (nginx.conf). Drift between the two has bitten before
// (nginx had ZERO headers until iter127 surfaced the gap), so both configs
// must keep matching values for these required headers.

const REQUIRED_HEADERS = [
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Strict-Transport-Security',
  'Cross-Origin-Opener-Policy',
  'Content-Security-Policy',
];

// CSP directives that ONLY work as HTTP headers (not in <meta>). iter127
// added these to upgrade the security posture beyond what the meta-tag CSP
// in index.html could express.
const REQUIRED_CSP_DIRECTIVES = [
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "object-src 'none'",
  "worker-src 'self'",
];

// Deprecated headers that should NOT be present (per OWASP guidance).
const FORBIDDEN_HEADERS = [
  'X-XSS-Protection', // ignored or harmful in modern browsers
];

function loadVercelHeaders() {
  const cfg = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const globalRule = cfg.headers.find(r => r.source === '/(.*)');
  expect(globalRule, 'vercel.json must have a /(.*) header rule').toBeDefined();
  return Object.fromEntries(globalRule.headers.map(h => [h.key, h.value]));
}

// Parse nginx.conf with a brace-depth state machine. Regex-stripping location
// blocks worked in theory but missed real directives in practice — character
// classes don't compose well with multi-line nested config syntax.
function parseNginxBlocks() {
  const src = readFileSync('nginx.conf', 'utf8');
  const lines = src.split(/\r?\n/);
  const HEADER_RE = /add_header\s+([A-Za-z0-9-]+)\s+"([^"]*)"\s+always\s*;/;
  const result = { server: {}, locations: {} };
  let depth = 0;            // 0=outside, 1=server, 2+=location
  let currentLoc = null;    // pattern of the location block at depth 2
  for (const line of lines) {
    const trimmed = line.trim();
    if (depth === 1) {
      const locMatch = trimmed.match(/^location\s+(.+?)\s*\{/);
      if (locMatch) { currentLoc = locMatch[1]; result.locations[currentLoc] = {}; depth = 2; continue; }
    } else if (depth === 0) {
      if (/^server\s*\{/.test(trimmed)) { depth = 1; continue; }
    }
    // Tally close-braces. nginx convention: braces on own lines.
    if (trimmed === '}') {
      depth = Math.max(0, depth - 1);
      if (depth <= 1) currentLoc = null;
      continue;
    }
    const h = trimmed.match(HEADER_RE);
    if (h) {
      if (depth === 1) result.server[h[1]] = h[2];
      else if (depth === 2 && currentLoc) result.locations[currentLoc][h[1]] = h[2];
    }
  }
  return result;
}

function loadNginxServerHeaders() {
  return parseNginxBlocks().server;
}

function loadNginxLocationHeaders(locationPattern) {
  return parseNginxBlocks().locations[locationPattern] ?? null;
}

describe('security headers — vercel.json', () => {
  const headers = loadVercelHeaders();

  it.each(REQUIRED_HEADERS)('has %s', (key) => {
    expect(headers[key]).toBeTruthy();
  });

  it.each(FORBIDDEN_HEADERS)('does NOT have deprecated %s', (key) => {
    expect(headers[key]).toBeUndefined();
  });

  it.each(REQUIRED_CSP_DIRECTIVES)('CSP includes %s directive', (directive) => {
    expect(headers['Content-Security-Policy']).toContain(directive);
  });

  it('HSTS has 1-year max-age + includeSubDomains + preload', () => {
    const hsts = headers['Strict-Transport-Security'];
    expect(hsts).toContain('max-age=31536000');
    expect(hsts).toContain('includeSubDomains');
    expect(hsts).toContain('preload');
  });

  it('X-Frame-Options is DENY', () => {
    expect(headers['X-Frame-Options']).toBe('DENY');
  });
});

describe('security headers — nginx.conf (server-level)', () => {
  const headers = loadNginxServerHeaders();

  it.each(REQUIRED_HEADERS)('has %s', (key) => {
    expect(headers[key]).toBeTruthy();
  });

  it.each(FORBIDDEN_HEADERS)('does NOT have deprecated %s', (key) => {
    expect(headers[key]).toBeUndefined();
  });

  it.each(REQUIRED_CSP_DIRECTIVES)('CSP includes %s directive', (directive) => {
    expect(headers['Content-Security-Policy']).toContain(directive);
  });
});

describe('security headers — nginx.conf locations (inheritance fix)', () => {
  // nginx drops parent-level add_header directives when a child location
  // has its own add_header. iter127 explicitly repeats the headers in
  // /assets/ and = /index.html locations to satisfy this inheritance rule.
  // This test guards against accidental removal of the duplication.

  it('/assets/ location repeats all required headers', () => {
    const headers = loadNginxLocationHeaders('/assets/');
    expect(headers).toBeTruthy();
    for (const key of REQUIRED_HEADERS) {
      expect(headers[key], `/assets/ missing ${key}`).toBeTruthy();
    }
  });

  it('= /index.html location repeats all required headers', () => {
    const headers = loadNginxLocationHeaders('= /index.html');
    expect(headers).toBeTruthy();
    for (const key of REQUIRED_HEADERS) {
      expect(headers[key], `/index.html missing ${key}`).toBeTruthy();
    }
  });
});

describe('security headers — Vercel ↔ nginx parity', () => {
  const vercel = loadVercelHeaders();
  const nginx = loadNginxServerHeaders();

  it.each(REQUIRED_HEADERS)('%s value matches across both configs', (key) => {
    expect(nginx[key]).toBe(vercel[key]);
  });
});
