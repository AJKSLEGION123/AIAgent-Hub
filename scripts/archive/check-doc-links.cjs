// Quick external-link health check for all .md files in repo root + key dirs.
// Re-run after big doc edits or before a release. No network deps — uses
// node:https built-in. Each link is a single HEAD-then-GET fallback.
const fs = require('node:fs');
const https = require('node:https');
const http = require('node:http');

const FILES = [
  'README.md', 'CHANGELOG.md', 'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md', 'SECURITY.md',
  'vscode-extension/README.md',
];

const URL_RE = /https?:\/\/[^\s)\]"'`,]+/g;

// Known false-positive hostnames: font CDN endpoints have no homepage by
// design (only specific resource paths return 200). They show up in CSP
// directives quoted in SECURITY.md and aren't meant to be navigable.
const SKIP_HOSTS = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);

const checked = new Set();
const failures = [];

function probe(url) {
  return new Promise(resolve => {
    const lib = url.startsWith('https:') ? https : http;
    const opts = { method: 'HEAD', timeout: 8000 };
    const req = lib.request(url, opts, res => {
      // 405 (Method Not Allowed for HEAD) → retry with GET
      if (res.statusCode === 405 || res.statusCode === 403) {
        const r2 = lib.get(url, { timeout: 8000 }, res2 => {
          resolve(res2.statusCode);
          res2.destroy();
        });
        r2.on('error', () => resolve(0));
        r2.on('timeout', () => { r2.destroy(); resolve(0); });
        return;
      }
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
    req.end();
  });
}

(async () => {
  const urls = new Set();
  for (const f of FILES) {
    if (!fs.existsSync(f)) continue;
    const content = fs.readFileSync(f, 'utf8');
    for (const m of content.matchAll(URL_RE)) {
      // Skip placeholder-style URLs, intra-doc anchors etc.
      const u = m[0].replace(/[.,;:>]+$/, '');
      if (u.includes('{') || u.includes('<') || u.includes('placeholder')) continue;
      try {
        const host = new URL(u).hostname;
        if (SKIP_HOSTS.has(host)) continue;
      } catch { continue; }
      urls.add(u);
    }
  }
  const list = [...urls].sort();
  console.log(`Probing ${list.length} unique URLs from ${FILES.length} doc files...`);
  for (const url of list) {
    if (checked.has(url)) continue;
    checked.add(url);
    const code = await probe(url);
    const ok = code >= 200 && code < 400;
    console.log(`${ok ? '✓' : '✗'}  ${code || 'ERR'}  ${url}`);
    if (!ok) failures.push({ url, code });
  }
  if (failures.length) {
    console.error(`\n${failures.length} broken links — see above.`);
    process.exit(1);
  }
  console.log('\n✅ All doc links healthy.');
})();
