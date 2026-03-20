import type { ThemeColors, ModelKey } from "../types";

export const TH: Record<"dark" | "light", ThemeColors> = {
  dark: { bg:"#060609", bg2:"#0c0c12", card:"#0e0e16", cardH:"#12121c", brd:"#1a1a28", brdH:"#252538", text:"#ddddef", mut:"#8888a0", dim:"#555577", surf:"#0a0a10", glow:"rgba(99,102,241,0.04)", meta:"#060609" },
  light: { bg:"#f0f0f5", bg2:"#e8e8ef", card:"#ffffff", cardH:"#f8f8fc", brd:"#d8d8e4", brdH:"#c0c0d4", text:"#12122a", mut:"#555570", dim:"#8888a8", surf:"#eaeaf0", glow:"rgba(99,102,241,0.06)", meta:"#f0f0f5" },
};

export const MC: Record<ModelKey, string> = { claude:"#f97316", gemini:"#8b5cf6", codex:"#06b6d4" };
export const ML: Record<ModelKey, string> = { claude:"Claude Opus 4.6", gemini:"Gemini 3.1 Pro", codex:"Codex CLI" };
export const MI: Record<ModelKey, string> = { claude:"C", gemini:"G", codex:"X" };
export const FONT = "'JetBrains Mono','IBM Plex Mono','Fira Code',monospace";

export const DIFF_COLORS: Record<string, string> = {
  beginner: "#10b981",
  intermediate: "#f59e0b",
  advanced: "#ef4444",
};

export const VALID_SECTIONS = ["prompts", "combos", "cheat", "quick", "setup"] as const;

/** Semantic colors used throughout the app */
export const COLORS = {
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  primary: "#6366f1",
  secondary: "#8b5cf6",
  info: "#06b6d4",
  star: "#eab308",
} as const;
