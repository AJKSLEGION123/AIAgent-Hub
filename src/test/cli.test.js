import { describe, it, expect } from 'vitest';
import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

const cli = path.join(process.cwd(), 'cli', 'index.cjs');
const run = (args) => execFileSync('node', [cli, ...args], { encoding: 'utf8', cwd: process.cwd(), maxBuffer: 50 * 1024 * 1024 });

describe('CLI', () => {
  it('help shows usage', () => {
    const out = run(['help']);
    expect(out).toContain('AIAgent-Hub CLI');
    expect(out).toContain('list');
    expect(out).toContain('show');
    expect(out).toContain('search');
  });

  it('stats shows counts', () => {
    const out = run(['stats']);
    expect(out).toContain('AIAgent-Hub Stats');
    expect(out).toMatch(/\d+/);
  });

  it('list shows prompts', () => {
    const out = run(['list']);
    expect(out).toContain('промтов');
    expect(out).toContain('rl-feat');
  });

  it('list --model filters', () => {
    const opus = run(['list', '--model', 'opus47m']);
    expect(opus).toContain('rl-feat');
  });

  it('show displays prompt', () => {
    const out = run(['show', 'rl-feat']);
    expect(out).toContain('Feature Development');
    expect(out).toContain('tokens');
  });

  it('show unknown returns error', () => {
    try { run(['show', 'nonexistent']); } catch (e) {
      expect(e.stderr || e.message).toContain('Not found');
    }
  });

  it('search finds results', () => {
    const out = run(['search', 'feature']);
    expect(out).toContain('results');
    expect(out).toContain('rl-feat');
  });

  it('combos lists teams', () => {
    const out = run(['combos']);
    expect(out).toContain('combos');
  });

  it('export json outputs valid JSON', () => {
    const out = run(['export', 'json']);
    expect(() => JSON.parse(out)).not.toThrow();
    const data = JSON.parse(out);
    expect(data.P.length).toBeGreaterThan(0);
  });

  it('export csv has header', () => {
    const out = run(['export', 'csv']);
    expect(out.startsWith('ID,Role,Model')).toBe(true);
  });

  it('export md has markdown', () => {
    const out = run(['export', 'md']);
    expect(out).toContain('# AIAgent-Hub');
  });

  it('run generates bash script', () => {
    const out = run(['run', 'rl-feat']);
    expect(out).toContain('#!/bin/bash');
    expect(out).toContain('claude');
  });

  // iter48: VERSION had drifted to '8.3' (5 majors stale) — bumped to '13.0'.
  // Pin the sync between CLI version and CHANGELOG.md so a future CHANGELOG
  // bump without CLI bump fails this test instead of shipping stale.
  it('CLI VERSION matches CHANGELOG.md latest entry', () => {
    const helpOut = run(['help']);
    const cliVer = helpOut.match(/CLI v(\d+\.\d+)/)?.[1];
    expect(cliVer, 'CLI help should print v<version>').toBeTruthy();

    const changelog = readFileSync('CHANGELOG.md', 'utf8');
    const latestVer = changelog.match(/^## \[(\d+\.\d+)\]/m)?.[1];
    expect(latestVer, 'CHANGELOG should have a [N.N] entry').toBeTruthy();

    expect(cliVer).toBe(latestVer);
  });
});
