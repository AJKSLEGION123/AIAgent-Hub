import { memo } from 'react';
import { font, alpha, textOn } from './theme-utils.js';

/* ═══════════════════════════════════════════════
   SHARED PRESENTATIONAL COMPONENTS
   Extracted from App.jsx in iter115. All memoized,
   all stateless beyond their props. Theme deps come
   from ./theme-utils.js (font, alpha, textOn).
   ═══════════════════════════════════════════════ */

/** Filter/toggle pill — underlined when active. */
export const Pill = memo(({ on, fn, lb, cl, c }) => (
  <button onClick={fn} aria-pressed={on} style={{
    padding: '6px 2px', fontSize: 10, fontFamily: font, letterSpacing: 2,
    textTransform: 'uppercase', fontWeight: on ? 700 : 500,
    border: 0, borderBottom: `1.5px solid ${on ? (cl || c.accent) : 'transparent'}`,
    background: 'transparent', color: on ? (cl || c.ink) : c.mut,
    cursor: 'pointer', transition: 'color .18s ease, border-color .18s ease',
    whiteSpace: 'nowrap', outline: 'none', marginRight: 12,
  }}>{lb}</button>
));

/** Copy button — shows ✓ + scale-pulse when its id matches the global `copied` state. */
export const CBtn = memo(({ id, txt, cl, sm, copied, cp, t, bg, skip }) => {
  const textClr = cl ? textOn(cl) : (bg || '#0a0806');
  return (
    <button onClick={() => cp(id, txt, skip)} aria-label={copied === id ? t.copied : `${t.copy}: ${id}`} style={{
      padding: sm ? '4px 12px' : '6px 14px',
      fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
      fontFamily: font, fontWeight: 700,
      border: `1px solid ${cl || 'currentColor'}`, borderRadius: 0,
      background: copied === id ? 'transparent' : (cl || 'currentColor'),
      color: copied === id ? (cl || 'currentColor') : textClr,
      cursor: 'pointer', transition: 'all .15s', outline: 'none',
      transform: copied === id ? 'scale(.96)' : 'scale(1)',
    }}>{copied === id ? '✓' : t.copy}</button>
  );
});

/** Top-of-screen status toast — auto-dismisses via CSS animation. */
export const Toast = memo(({ msg }) => msg ? (
  <div className="toast" role="status" aria-live="polite" style={{
    background: '#10b981', color: '#fff', fontFamily: font,
  }}>{msg}</div>
) : null);

/** Empty-results placeholder shown in search/filter no-match state. */
export const EmptyState = memo(({ c, lang }) => (
  <div style={{ textAlign: 'center', padding: '40px 0', color: c.dim, fontSize: 12, fontFamily: font }}>
    <div style={{ fontSize: 28, marginBottom: 8, opacity: .5 }}>⌕</div>
    <div style={{ fontWeight: 600, color: c.mut }}>
      {lang === 'ru' ? 'Ничего не найдено' : lang === 'kk' ? 'Ештеңе табылмады' : 'Nothing found'}
    </div>
    <div style={{ fontSize: 10, marginTop: 6, opacity: .7 }}>
      {lang === 'ru' ? 'Попробуйте другой запрос' : lang === 'kk' ? 'Басқа сұраныс жасап көріңіз' : 'Try a different query'}
    </div>
  </div>
));

/** Highlight matched text fragments with <mark>. q < 2 chars = no-op. */
export function HL({ text, q, color }) {
  if (!q || q.length < 2) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase()
      ? <mark key={i} style={{ background: alpha(color || '#e86a2a', .25), color: 'inherit', borderRadius: 2, padding: '0 1px' }}>{p}</mark>
      : p
  );
}
