/* ═══════════════════════════════════════════════
   THEME + MODEL CONSTANTS + I18N HELPERS
   Extracted from App.jsx in iter118. Pure data and a
   pluralization helper — no React deps.
   ═══════════════════════════════════════════════ */

/**
 * Theme color tokens. Warm editorial palette: espresso + cream + burnt orange.
 * `onAccent` is the dark-theme-safe text color to use on accent backgrounds.
 */
export const TH = {
  dark:  { bg: '#0a0806', bg2: '#120e09', card: '#15110b', cardH: '#1c1811', brd: '#221d15', brdH: '#2e281e', text: '#ece3ce', mut: '#b3a794', dim: '#8a816d', surf: '#120e09', glow: 'rgba(232,106,42,0.05)', meta: '#0a0806', accent: '#e86a2a', ink: '#f5efdd', onAccent: '#0a0806' },
  light: { bg: '#f5f0e6', bg2: '#ebe5d6', card: '#fffcf4', cardH: '#f8f3e6', brd: '#d9cfb8', brdH: '#b8ab90', text: '#1a140a', mut: '#4a4434', dim: '#6d6550', surf: '#f0e9d6', glow: 'rgba(232,106,42,0.08)', meta: '#f5f0e6', accent: '#a84a12', ink: '#0a0806', onAccent: '#f5efdd' },
};

/** Model accent colors keyed by model-key (mk). */
export const MC = { opus47m: '#d4a574' };

/** Model display labels keyed by mk. */
export const ML = { opus47m: 'Claude Opus 4.7 · 1M' };

/** Model icons (single-char/symbol) keyed by mk. */
export const MI = { opus47m: '∞' };

/**
 * Russian pluralization: pl(5, 'модель', 'модели', 'моделей') → 'моделей'.
 * Picks the right form based on Slavic plural rules:
 *   - one (1, 21, 31, ... but NOT 11)
 *   - few (2-4, 22-24, ... but NOT 12-14)
 *   - many (everything else, including 0, 5-20, 25-30, ...)
 */
export const pl = (n, one, few, many) => {
  const m = Math.abs(n) % 100;
  const d = m % 10;
  return d === 1 && m !== 11
    ? one
    : d >= 2 && d <= 4 && (m < 12 || m > 14)
      ? few
      : many;
};
