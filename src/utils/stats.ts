import type { Prompt, Stats } from "../types";

/** Calculate comprehensive stats from prompt array */
export function calculateStats(prompts: Prompt[]): Stats {
  const totalTime = prompts.reduce((acc, p) => {
    const m = p.time?.match(/(\d+\.?\d*)(h|m)/);
    if (!m) return acc;
    return acc + (m[2] === "h" ? parseFloat(m[1]) * 60 : parseFloat(m[1]));
  }, 0);

  const totalChars = prompts.reduce((a, p) => a + p.text.length, 0);

  const byModel = Object.entries(
    prompts.reduce<Record<string, number>>((a, p) => {
      a[p.mk] = (a[p.mk] || 0) + 1;
      return a;
    }, {})
  ) as [string, number][];

  const byDifficulty = prompts.reduce<Record<string, number>>((a, p) => {
    if (p.difficulty) a[p.difficulty] = (a[p.difficulty] || 0) + 1;
    return a;
  }, {});

  return {
    total: prompts.length,
    models: new Set(prompts.map(p => p.mk)).size,
    roles: new Set(prompts.map(p => p.role)).size,
    totalHours: Math.round(totalTime / 60 / 5) * 5,
    totalTokens: Math.round(totalChars / 4),
    byModel,
    byDifficulty,
  };
}

/** Get unique tags with counts, sorted by popularity */
export function getTagCounts(prompts: Prompt[]): [string, number][] {
  const tc: Record<string, number> = {};
  prompts.forEach(p => (p.tags || []).forEach(t => { tc[t] = (tc[t] || 0) + 1; }));
  return Object.entries(tc).sort((a, b) => b[1] - a[1]);
}

/** Get unique roles from prompts */
export function getUniqueRoles(prompts: Prompt[]): string[] {
  return [...new Set(prompts.map(p => p.role))];
}
