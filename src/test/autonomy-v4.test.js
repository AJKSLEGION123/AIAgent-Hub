import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const src = readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

describe('AUTONOMY-v4 wrapper', () => {
  it('every prompt contains [AUTONOMY-v4] marker', () => {
    const missing = data.P.filter(p => !p.text?.includes('[AUTONOMY-v4]'));
    expect(missing.length).toBe(0);
  });

  it('no prompt carries legacy [AUTONOMY-v1/v2/v3] marker', () => {
    const legacy = data.P.filter(p =>
      p.text?.includes('[AUTONOMY-v1]') ||
      p.text?.includes('[AUTONOMY-v2]') ||
      p.text?.includes('[AUTONOMY-v3]')
    );
    expect(legacy.length).toBe(0);
  });

  it('every prompt names АРСЕНАЛ tool section', () => {
    const missing = data.P.filter(p => !p.text?.includes('АРСЕНАЛ'));
    expect(missing.length).toBe(0);
  });

  it('every prompt grants ВСЕ ИНСТРУМЕНТЫ explicitly', () => {
    const missing = data.P.filter(p => !p.text?.includes('ВСЕ ИНСТРУМЕНТЫ'));
    expect(missing.length).toBe(0);
  });

  it('every prompt mentions Browser MCP', () => {
    const missing = data.P.filter(p => !p.text?.includes('Browser MCP'));
    expect(missing.length).toBe(0);
  });

  it('every prompt retains ОБЪЁМ РАБОТЫ scope-of-work clause', () => {
    const missing = data.P.filter(p => !p.text?.includes('ОБЪЁМ РАБОТЫ'));
    expect(missing.length).toBe(0);
  });

  it('no prompt desc ends with ralph-loop closing quote artifact', () => {
    const leaking = data.P.filter(p =>
      p.desc && /"\s*--?\s*completion/i.test(p.desc.slice(-40))
    );
    expect(leaking.length).toBe(0);
  });
});

describe('Combo completion directive', () => {
  it('every RU combo desc mentions "полной автономии"', () => {
    const missing = (data.COMBOS?.ru || []).filter(c => !c.desc?.includes('полной автономии'));
    expect(missing.length).toBe(0);
  });

  it('every EN combo desc mentions "full autonomy"', () => {
    const missing = (data.COMBOS?.en || []).filter(c => !c.desc?.includes('full autonomy'));
    expect(missing.length).toBe(0);
  });

  it('∞ Perpetual Improvement combo mentions ALL TOOLS / ВСЕ ИНСТРУМЕНТЫ', () => {
    const ru = (data.COMBOS?.ru || []).find(c => c.name === '∞ Perpetual Improvement');
    const en = (data.COMBOS?.en || []).find(c => c.name === '∞ Perpetual Improvement');
    expect(ru?.desc).toContain('ВСЕ ИНСТРУМЕНТЫ');
    expect(en?.desc).toContain('ALL TOOLS');
  });
});

describe('rl-godmode perpetual-improvement prompt', () => {
  it('rl-godmode exists', () => {
    const god = data.P.find(p => p.id === 'rl-godmode');
    expect(god).toBeTruthy();
  });

  it('∞ Perpetual Improvement combo present in RU + EN', () => {
    const ru = (data.COMBOS?.ru || []).find(c => c.name === '∞ Perpetual Improvement');
    const en = (data.COMBOS?.en || []).find(c => c.name === '∞ Perpetual Improvement');
    expect(ru).toBeTruthy();
    expect(en).toBeTruthy();
  });
});
