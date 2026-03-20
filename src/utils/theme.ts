import type { ThemeKey } from "../types";

/** Detect system theme preference */
export function detectTheme(): ThemeKey {
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/** Toggle between dark and light */
export function toggleTheme(current: ThemeKey): ThemeKey {
  return current === "dark" ? "light" : "dark";
}

/** Update meta theme-color tag */
export function updateMetaThemeColor(color: string): void {
  try {
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = color;
  } catch {}
}
