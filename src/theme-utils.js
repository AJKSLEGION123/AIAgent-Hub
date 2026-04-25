/* ═══════════════════════════════════════════════
   THEME UTILITIES — typography stacks + color helpers
   Extracted from App.jsx in iter114. Pure functions and
   constants, no React or app-state deps.
   ═══════════════════════════════════════════════ */

/** Monospace stack — used for code, labels, technical UI */
export const font = "'JetBrains Mono','IBM Plex Mono','Fira Code',monospace";

/** Serif display stack — used for headings, hero text */
export const fontDisplay = "'Fraunces','Cormorant Garamond','Times New Roman',serif";

/** Append alpha channel as 2-hex-digit suffix to a 6-digit hex color. */
export const alpha = (hex, a) => hex + Math.round(a * 255).toString(16).padStart(2, '0');

/**
 * Relative luminance → best-contrast text color (dark espresso vs pure white).
 * White beats cream on borderline mid-dark backgrounds (slate-500, red-600,
 * fuchsia-600) so small 9px button text clears WCAG AA 4.5:1.
 */
export const textOn = (hex) => {
  if (!hex || hex.length < 4) return '#0a0806';
  const h = hex.replace('#', '');
  const to = (s) => parseInt(s.length === 1 ? s + s : s, 16) / 255;
  const [r, g, b] = h.length === 3
    ? [to(h[0]), to(h[1]), to(h[2])]
    : [to(h.slice(0, 2)), to(h.slice(2, 4)), to(h.slice(4, 6))];
  const lin = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.18 ? '#0a0806' : '#ffffff';
};

/** Difficulty-level palette. Frozen to prevent accidental mutation. */
export const DIFFICULTY_COLORS = Object.freeze({
  beginner: '#10b981',     // green-500
  intermediate: '#f59e0b', // amber-500
  advanced: '#ef4444',     // red-500
});

/**
 * Pick the difficulty-dot color, or the caller-provided fallback for
 * unknown / missing difficulty values. iter132 hoisted this out of an
 * inline lambda inside AgentHub()'s combo-card map iteration to avoid
 * per-render allocation.
 */
export const diffDot = (diff, fallback) => DIFFICULTY_COLORS[diff] ?? fallback;
