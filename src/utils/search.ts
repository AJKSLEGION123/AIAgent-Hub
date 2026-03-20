import type { Prompt } from "../types";

/** Escape regex special characters for safe use in RegExp */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Multi-word fuzzy search — all words must match */
export function matchesSearch(prompt: Prompt, query: string, roleNames: Record<string, string>): boolean {
  if (!query.trim()) return true;
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    prompt.text, prompt.role, prompt.m,
    roleNames[prompt.role] || "", prompt.id,
    ...(prompt.tags || [])
  ].join(" ").toLowerCase();
  return words.every(w => haystack.includes(w));
}

/** Highlight matching text with <mark> tags (returns HTML string) */
export function highlightMatch(text: string, query: string): string {
  if (!query || query.length < 2) return text;
  const escaped = escapeRegex(query);
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

/** Calculate search relevance score (higher = better match) */
export function searchRelevance(prompt: Prompt, query: string, roleNames: Record<string, string>): number {
  if (!query.trim()) return 0;
  const q = query.toLowerCase();
  let score = 0;

  // Exact ID match
  if (prompt.id.toLowerCase() === q) score += 100;
  // Role name match
  if ((roleNames[prompt.role] || prompt.role).toLowerCase().includes(q)) score += 50;
  // Tag match
  if (prompt.tags?.some(t => t.toLowerCase().includes(q))) score += 30;
  // Text match (less weight)
  if (prompt.text.toLowerCase().includes(q)) score += 10;

  return score;
}
