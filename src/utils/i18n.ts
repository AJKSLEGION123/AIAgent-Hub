export type LangKey = "ru" | "en" | "kk";

/** Detect browser language */
export function detectLanguage(): LangKey {
  try {
    const lang = navigator.language;
    if (lang?.startsWith("kk")) return "kk";
    if (lang?.startsWith("ru")) return "ru";
    return "en";
  } catch {
    return "ru";
  }
}

/** Cycle through languages: ru → en → kk → ru */
export function nextLanguage(current: LangKey): LangKey {
  const cycle: Record<LangKey, LangKey> = { ru: "en", en: "kk", kk: "ru" };
  return cycle[current];
}

/** Get language display label (shows what clicking will switch TO) */
export function langLabel(current: LangKey): string {
  const labels: Record<LangKey, string> = { ru: "EN", en: "KK", kk: "RU" };
  return labels[current];
}

/** Format a number with locale-appropriate separators */
export function formatNumber(n: number, lang: LangKey): string {
  try {
    const locale = lang === "ru" ? "ru-RU" : lang === "kk" ? "kk-KZ" : "en-US";
    return new Intl.NumberFormat(locale).format(n);
  } catch {
    return String(n);
  }
}
