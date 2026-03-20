import type { Prompt, FilterMode, SortMode } from "../types";

/** Apply filters to prompt list */
export function filterPrompts(
  prompts: Prompt[],
  options: {
    mode: FilterMode;
    value: string;
    search: string;
    showFavsOnly: boolean;
    favs: Record<string, boolean>;
    showNew: boolean;
    hideUsed: boolean;
    usedPrompts: Record<string, boolean>;
    roleNames: Record<string, string>;
  }
): Prompt[] {
  let f = prompts;

  if (options.showFavsOnly) f = f.filter(p => options.favs[p.id]);
  if (options.showNew) f = f.filter(p => p.v === "7.1" || p.v === "8.1" || p.v === "8.2" || p.v === "8.3");
  if (options.hideUsed) f = f.filter(p => !options.usedPrompts[p.id]);

  if (options.mode === "model" && options.value !== "all") {
    f = f.filter(p => p.mk === options.value);
  } else if (options.mode === "role" && options.value !== "all") {
    f = f.filter(p => p.role === options.value);
  } else if (options.mode === "type" && options.value !== "all") {
    f = f.filter(p => p.type === options.value);
  } else if (options.mode === "difficulty" && options.value !== "all") {
    f = f.filter(p => p.difficulty === options.value);
  } else if (options.mode === "tag" && options.value !== "all") {
    f = f.filter(p => p.tags?.includes(options.value));
  } else if (options.mode === "time" && options.value !== "all") {
    f = f.filter(p => {
      const m = p.time?.match(/(\d+\.?\d*)(h|m)/);
      if (!m) return false;
      const hrs = m[2] === "h" ? parseFloat(m[1]) : parseFloat(m[1]) / 60;
      if (options.value === "<1h") return hrs < 1;
      if (options.value === "1-2h") return hrs >= 1 && hrs <= 2;
      if (options.value === ">2h") return hrs > 2;
      return true;
    });
  }

  if (options.search.trim()) {
    const words = options.search.toLowerCase().split(/\s+/).filter(Boolean);
    f = f.filter(p => {
      const hay = [p.text, p.role, p.m, options.roleNames[p.role] || "", p.id, ...(p.tags || [])].join(" ").toLowerCase();
      return words.every(w => hay.includes(w));
    });
  }

  return f;
}

/** Sort filtered prompts */
export function sortPrompts(
  prompts: Prompt[],
  sortBy: SortMode,
  roleNames: Record<string, string>
): Prompt[] {
  if (sortBy === "default") return prompts;
  const sorted = [...prompts];
  switch (sortBy) {
    case "name": return sorted.sort((a, b) => (roleNames[a.role] || a.role).localeCompare(roleNames[b.role] || b.role));
    case "length": return sorted.sort((a, b) => b.text.length - a.text.length);
    case "time": return sorted.sort((a, b) => {
      const gt = (s: string) => { const m = s?.match(/(\d+\.?\d*)(h|m)/); return m ? (m[2] === "h" ? parseFloat(m[1]) * 60 : parseFloat(m[1])) : 0; };
      return gt(b.time) - gt(a.time);
    });
    case "model": return sorted.sort((a, b) => a.mk.localeCompare(b.mk));
    default: return sorted;
  }
}
