import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const src = readFileSync('src/App.jsx', 'utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1], 'base64')).toString('utf8'));

describe('AUTONOMY-v2 wrapper', () => {
  it('every prompt contains [AUTONOMY-v2] marker', () => {
    const missing = data.P.filter(p => !p.text?.includes('[AUTONOMY-v2]'));
    expect(missing.length).toBe(0);
  });

  it('no prompt carries legacy [AUTONOMY-v1] marker', () => {
    const legacy = data.P.filter(p => p.text?.includes('[AUTONOMY-v1]'));
    expect(legacy.length).toBe(0);
  });

  it('every prompt includes ОБЪЁМ РАБОТЫ scope-of-work clause', () => {
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
});
