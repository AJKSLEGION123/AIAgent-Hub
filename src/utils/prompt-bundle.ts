import type { Prompt } from "../types";

/** Build a combined text bundle from multiple prompts */
export function buildBundle(
  prompts: Prompt[],
  roleNames: Record<string, string>
): string {
  return prompts
    .map(p => `═══ ${(roleNames[p.role] || p.role).toUpperCase()} (${p.m}) ═══\n\n${p.text}`)
    .join("\n\n\n");
}

/** Generate a launch script for a set of prompts */
export function buildLaunchScript(
  prompts: Prompt[],
  roleNames: Record<string, string>
): string {
  const launchers: Record<string, string> = {
    claude: "claude --dangerously-skip-permissions",
    gemini: "gemini --model gemini-3.1-pro-preview --yolo",
    codex: "codex --full-auto",
  };

  let script = "#!/bin/bash\n\n";
  prompts.forEach(p => {
    const launcher = launchers[p.mk] || p.mk;
    script += `# ${roleNames[p.role] || p.role} (${p.m})\n`;
    script += `# ${launcher}\n\n`;
  });

  return script;
}

/** Calculate total estimated time from prompt array */
export function totalTime(prompts: Prompt[]): number {
  return prompts.reduce((acc, p) => {
    const match = p.time?.match(/(\d+\.?\d*)(h|m)/);
    if (!match) return acc;
    // Both groups guaranteed-present on successful match (required captures).
    return acc + (match[2]! === "h" ? parseFloat(match[1]!) * 60 : parseFloat(match[1]!));
  }, 0);
}

/** Calculate total token estimate */
export function totalTokens(prompts: Prompt[]): number {
  return prompts.reduce((acc, p) => acc + Math.ceil(p.text.length / 4), 0);
}
