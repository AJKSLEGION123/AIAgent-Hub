import { describe, it, expect } from 'vitest';
import { execFileSync } from 'child_process';
import path from 'path';

const cli = path.join(process.cwd(), 'cli', 'index.cjs');
const run = (args) => execFileSync('node', [cli, ...args], { encoding: 'utf8', cwd: process.cwd() });

describe('CLI', () => {
  it('help shows usage', () => {
    const out = run(['help']);
    expect(out).toContain('Agent Hub CLI');
    expect(out).toContain('list');
    expect(out).toContain('show');
    expect(out).toContain('search');
  });

  it('stats shows counts', () => {
    const out = run(['stats']);
    expect(out).toContain('Agent Hub Stats');
    expect(out).toContain('200');
  });

  it('list shows prompts', () => {
    const out = run(['list']);
    expect(out).toContain('промтов');
    expect(out).toContain('c-fe');
  });

  it('list --model filters', () => {
    const all = run(['list']);
    const claude = run(['list', '--model', 'claude']);
    expect(claude.match(/\n/g).length).toBeLessThan(all.match(/\n/g).length);
  });

  it('show displays prompt', () => {
    const out = run(['show', 'c-fe']);
    expect(out).toContain('frontend');
    expect(out).toContain('tokens');
  });

  it('show unknown returns error', () => {
    try { run(['show', 'nonexistent']); } catch (e) {
      expect(e.stderr || e.message).toContain('Not found');
    }
  });

  it('search finds results', () => {
    const out = run(['search', 'frontend']);
    expect(out).toContain('results');
    expect(out).toContain('c-fe');
  });

  it('combos lists teams', () => {
    const out = run(['combos']);
    expect(out).toContain('combos');
  });

  it('export json outputs valid JSON', () => {
    const out = run(['export', 'json']);
    expect(() => JSON.parse(out)).not.toThrow();
    const data = JSON.parse(out);
    expect(data.P.length).toBe(200);
  });

  it('export csv has header', () => {
    const out = run(['export', 'csv']);
    expect(out.startsWith('ID,Role,Model')).toBe(true);
  });

  it('export md has markdown', () => {
    const out = run(['export', 'md']);
    expect(out).toContain('# Agent Hub');
  });

  it('run generates bash script', () => {
    const out = run(['run', 'c-fe']);
    expect(out).toContain('#!/bin/bash');
    expect(out).toContain('claude');
  });
});
