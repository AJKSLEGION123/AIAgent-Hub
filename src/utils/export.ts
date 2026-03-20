import type { Prompt } from "../types";
import { htmlEscape, csvEscape } from "./helpers";

/** Export prompts as Markdown */
export function exportMarkdown(prompts: Prompt[], roleNames: Record<string, string>): string {
  let md = `# Agent Hub v8.2\n\n> ${prompts.length} prompts\n\n`;
  const grouped: Record<string, Prompt[]> = {};
  prompts.forEach(p => { (grouped[p.mk] = grouped[p.mk] || []).push(p); });
  Object.entries(grouped).forEach(([mk, grp]) => {
    md += `## ${mk} (${grp.length})\n\n`;
    grp.forEach(p => {
      md += `### ${p.icon} ${roleNames[p.role] || p.role}\n`;
      if (p.tags.length) md += `Tags: ${p.tags.join(", ")}\n`;
      md += `\n\`\`\`\n${p.text}\n\`\`\`\n\n`;
    });
  });
  return md;
}

/** Export prompts as CSV */
export function exportCSV(prompts: Prompt[], roleNames: Record<string, string>): string {
  let csv = "ID,Role,Model,Type,Difficulty,Time,Tags,Chars,Tokens\n";
  prompts.forEach(p => {
    csv += `"${csvEscape(p.id)}","${csvEscape(roleNames[p.role] || p.role)}","${csvEscape(p.m)}","${p.type}","${csvEscape(p.difficulty)}","${csvEscape(p.time)}","${csvEscape(p.tags.join(";"))}",${p.text.length},${Math.ceil(p.text.length / 4)}\n`;
  });
  return csv;
}

/** Export prompts as standalone HTML */
export function exportHTML(prompts: Prompt[], roleNames: Record<string, string>): string {
  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Agent Hub</title><style>body{font-family:monospace;background:#060609;color:#ddd;padding:20px;max-width:800px;margin:0 auto}h1{color:#6366f1}h3{color:#8b5cf6;margin-top:24px}pre{background:#111;padding:12px;border-radius:8px;white-space:pre-wrap;font-size:12px;line-height:1.6;border:1px solid #222}.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:10px;background:#1a1a28;color:#888;margin:2px}</style></head><body><h1>Agent Hub</h1><p>${prompts.length} prompts</p>`;
  prompts.forEach(p => {
    html += `<h3>${p.icon} ${htmlEscape(roleNames[p.role] || p.role)} <small>(${htmlEscape(p.m)})</small></h3>`;
    if (p.tags.length) html += `<div>${p.tags.map(t => `<span class="tag">#${htmlEscape(t)}</span>`).join(" ")}</div>`;
    html += `<pre>${htmlEscape(p.text)}</pre>`;
  });
  html += `</body></html>`;
  return html;
}

/** Trigger file download in browser */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
