/** Append hex alpha channel to a color string */
export const alpha = (hex: string, a: number): string =>
  hex + Math.round(a * 255).toString(16).padStart(2, '0');

/** Escape string for CSV (double-quote wrapping) */
export const csvEscape = (s: string | undefined): string =>
  (s || "").replace(/"/g, '""');

/** Escape HTML entities for safe insertion */
export const htmlEscape = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Calculate word count */
export const wordCount = (text: string): number =>
  text.split(/\s+/).filter(Boolean).length;

/** Calculate approximate token count */
export const tokenCount = (text: string): number =>
  Math.ceil(text.length / 4);

/** Format time elapsed since a timestamp */
export const timeAgo = (ms: number): string => {
  const mins = Math.round(ms / 60000);
  if (mins < 1) return "<1m";
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h${mins % 60}m`;
};
