export interface Prompt {
  id: string;
  m: string;
  mk: ModelKey;
  role: string;
  type: "role" | "task";
  icon: string;
  ac: string;
  time: string;
  text: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  output: string;
  related: string[];
  prereqs: string[];
  v: string;
  compact: string;
}

export interface Config {
  id: string;
  icon: string;
  name: string;
  accent: string;
  desc: string;
  text: string;
}

export interface Combo {
  name: string;
  desc: string;
  ids: string[];
  color: string;
}

export interface CheatSheet {
  name: string;
  color: string;
  cmds: { cmd: string; desc: string }[];
}

export interface QuickCmd {
  cat: string;
  cmds: { label: string; cmd: string }[];
}

export interface HubData {
  P: Prompt[];
  CONFIGS: Config[];
  TEAM_SETUP: string;
  COMBOS: { ru: Combo[]; en: Combo[] };
  FOLDER_STRUCTURE: string;
  GIT_SETUP: string;
  LAUNCH: string;
  CHEAT: Record<string, CheatSheet>;
  QUICK_CMDS: { ru: QuickCmd[]; en: QuickCmd[] };
}

export type ModelKey = "claude" | "gemini" | "codex";
export type ThemeKey = "dark" | "light";
export type SectionKey = "prompts" | "combos" | "cheat" | "quick" | "setup";
export type FilterMode = "all" | "model" | "role" | "type" | "difficulty" | "time" | "tag";
export type SortMode = "default" | "name" | "length" | "time" | "model";
export type ViewMode = "card" | "table";

export interface ThemeColors {
  bg: string;
  bg2: string;
  card: string;
  cardH: string;
  brd: string;
  brdH: string;
  text: string;
  mut: string;
  dim: string;
  surf: string;
  glow: string;
  meta: string;
}

export interface Stats {
  total: number;
  models: number;
  roles: number;
  totalHours: number;
  totalTokens: number;
  byModel: [string, number][];
  byDifficulty: Record<string, number>;
}
