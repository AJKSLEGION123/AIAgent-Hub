const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { inflateSync } = require('zlib');

let prompts = [];

function loadPrompts() {
  try {
    const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
    const src = fs.readFileSync(appPath, 'utf8');
    const match = src.match(/const Z = "([^"]+)"/);
    if (match) {
      const data = JSON.parse(inflateSync(Buffer.from(match[1], 'base64')).toString('utf8'));
      prompts = data.P;
    }
  } catch (e) {
    vscode.window.showErrorMessage('Agent Hub: Failed to load prompts');
  }
}

function activate(context) {
  loadPrompts();

  // Search prompts
  context.subscriptions.push(vscode.commands.registerCommand('agent-hub.search', async () => {
    const items = prompts.map(p => ({
      label: `${p.icon} ${p.role}`,
      description: `${p.mk} · ${p.time} · ${p.difficulty}`,
      detail: p.text.slice(0, 100) + '...',
      prompt: p,
    }));
    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Search prompts...',
      matchOnDescription: true,
      matchOnDetail: true,
    });
    if (selected) {
      await vscode.env.clipboard.writeText(selected.prompt.text);
      vscode.window.showInformationMessage(`Copied: ${selected.label} (~${Math.ceil(selected.prompt.text.length/4)} tokens)`);
    }
  }));

  // Copy specific prompt
  context.subscriptions.push(vscode.commands.registerCommand('agent-hub.copy', async () => {
    const id = await vscode.window.showInputBox({ prompt: 'Enter prompt ID (e.g. c-fe)' });
    if (!id) return;
    const p = prompts.find(x => x.id === id);
    if (!p) { vscode.window.showErrorMessage(`Prompt ${id} not found`); return; }
    await vscode.env.clipboard.writeText(p.text);
    vscode.window.showInformationMessage(`Copied: ${p.icon} ${p.role}`);
  }));

  // List all
  context.subscriptions.push(vscode.commands.registerCommand('agent-hub.list', async () => {
    const items = prompts.map(p => ({
      label: `${p.icon} ${p.role} (${p.mk})`,
      description: `${p.id} · ${p.time}`,
      prompt: p,
    }));
    const selected = await vscode.window.showQuickPick(items, { placeHolder: `${prompts.length} prompts` });
    if (selected) {
      await vscode.env.clipboard.writeText(selected.prompt.text);
      vscode.window.showInformationMessage(`Copied: ${selected.label}`);
    }
  }));

  // Random
  context.subscriptions.push(vscode.commands.registerCommand('agent-hub.random', async () => {
    const p = prompts[Math.floor(Math.random() * prompts.length)];
    await vscode.env.clipboard.writeText(p.text);
    vscode.window.showInformationMessage(`Random: ${p.icon} ${p.role} (~${Math.ceil(p.text.length/4)} tokens)`);
  }));

  // Insert at cursor
  context.subscriptions.push(vscode.commands.registerCommand('agent-hub.insert', async () => {
    const items = prompts.map(p => ({
      label: `${p.icon} ${p.role}`,
      description: p.id,
      prompt: p,
    }));
    const selected = await vscode.window.showQuickPick(items, { placeHolder: 'Insert prompt at cursor' });
    if (selected) {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit(edit => edit.insert(editor.selection.active, selected.prompt.text));
      }
    }
  }));
}

function deactivate() {}

module.exports = { activate, deactivate };
