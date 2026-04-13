#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { inflateSync } = require('zlib');
const { execFileSync } = require('child_process');

const VERSION = '8.3';
const C = { reset:'\x1b[0m', bold:'\x1b[1m', dim:'\x1b[2m', red:'\x1b[31m', green:'\x1b[32m', yellow:'\x1b[33m', blue:'\x1b[34m', magenta:'\x1b[35m', cyan:'\x1b[36m' };
const cl = (color, text) => `${C[color]}${text}${C.reset}`;

function loadData() {
  const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
  if (!fs.existsSync(appPath)) { console.error(cl('red', 'Error: src/App.jsx not found')); process.exit(1); }
  const src = fs.readFileSync(appPath, 'utf8');
  const match = src.match(/const Z = "([^"]+)"/);
  if (!match) { console.error(cl('red', 'Error: Data not found')); process.exit(1); }
  return JSON.parse(inflateSync(Buffer.from(match[1], 'base64')).toString('utf8'));
}

const args = process.argv.slice(2);
const cmd = args[0] || 'help';

if (cmd === 'help' || cmd === '--help') {
  console.log(`
${cl('bold', `AIAgent-Hub CLI v${VERSION}`)} — 200 промтов для AI-агентов

${cl('yellow', 'Команды:')}
  ${cl('green', 'list')}                Список промтов
  ${cl('green', 'list --model claude')} По модели
  ${cl('green', 'list --role frontend')} По роли
  ${cl('green', 'list --tag react')}    По тегу
  ${cl('green', 'show <id>')}           Показать промт
  ${cl('green', 'copy <id>')}           Скопировать в буфер
  ${cl('green', 'search <query>')}      Поиск
  ${cl('green', 'combos')}              Команды агентов
  ${cl('green', 'stats')}               Статистика
  ${cl('green', 'export md|csv|json')}  Экспорт
  ${cl('green', 'run <id>')}            Launch script
`);
  process.exit(0);
}

const data = loadData();
const P = data.P;

if (cmd === 'stats') {
  const models = {};
  P.forEach(p => { models[p.mk] = (models[p.mk] || 0) + 1; });
  console.log(`\n${cl('bold', 'AIAgent-Hub Stats')}\n${'─'.repeat(40)}`);
  console.log(`Промтов: ${cl('green', P.length)}  Комбо: ${cl('green', data.COMBOS.ru.length)}  Ролей: ${cl('green', new Set(P.map(p=>p.role)).size)}`);
  Object.entries(models).forEach(([mk, n]) => {
    const bar = '█'.repeat(Math.round(n / P.length * 30));
    const name = mk === 'claude' ? 'Claude' : mk === 'gemini' ? 'Gemini' : 'Codex';
    console.log(`  ${name.padEnd(10)} ${bar} ${n}`);
  });
  console.log();
  process.exit(0);
}

if (cmd === 'list') {
  let filtered = P;
  const mi = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i+1] : null; };
  const model = mi('--model'); if (model) filtered = filtered.filter(p => p.mk === model);
  const role = mi('--role'); if (role) filtered = filtered.filter(p => p.role === role);
  const tag = mi('--tag'); if (tag) filtered = filtered.filter(p => p.tags?.includes(tag));
  console.log(`\n${cl('bold', filtered.length + ' промтов')}\n`);
  filtered.forEach(p => {
    const mk = p.mk === 'claude' ? cl('yellow','C') : p.mk === 'gemini' ? cl('magenta','G') : cl('cyan','X');
    console.log(`  ${mk} ${cl('dim', p.id.padEnd(22))} ${p.icon} ${p.role.padEnd(16)} ${cl('dim', p.time)}`);
  });
  console.log(); process.exit(0);
}

if (cmd === 'show' && args[1]) {
  const p = P.find(x => x.id === args[1]);
  if (!p) { console.error(cl('red', `Not found: ${args[1]}`)); process.exit(1); }
  console.log(`\n${cl('bold', p.icon + ' ' + p.role)} ${cl('dim', '(' + p.m + ')')}`);
  console.log('─'.repeat(60));
  if (p.tags.length) console.log(`Tags: ${p.tags.map(t => cl('blue','#'+t)).join(' ')}`);
  console.log('─'.repeat(60));
  console.log(p.text);
  console.log(`\n${cl('dim', p.text.length + ' chars · ~' + Math.ceil(p.text.length/4) + ' tokens')}\n`);
  process.exit(0);
}

if (cmd === 'search' && args[1]) {
  const q = args.slice(1).join(' ').toLowerCase();
  const results = P.filter(p => (p.text+' '+p.role+' '+p.id+' '+(p.tags||[]).join(' ')).toLowerCase().includes(q));
  console.log(`\n${cl('bold', results.length + ' results')} for "${cl('cyan', q)}"\n`);
  results.slice(0,20).forEach(p => console.log(`  ${cl('dim', p.id.padEnd(22))} ${p.icon} ${p.role}`));
  if (results.length > 20) console.log(cl('dim', `  ... +${results.length-20} more`));
  console.log(); process.exit(0);
}

if (cmd === 'combos') {
  console.log(`\n${cl('bold', data.COMBOS.ru.length + ' combos')}\n`);
  data.COMBOS.ru.forEach((cb,i) => {
    console.log(`  ${cl('green', String(i+1).padStart(2))}. ${cl('bold', cb.name)} ${cl('dim', '— '+cb.desc)}`);
    console.log(`     ${(cb.ids||cb.agents||[]).map(id=>cl('cyan',id)).join(', ')}\n`);
  });
  process.exit(0);
}

if (cmd === 'copy' && args[1]) {
  const p = P.find(x => x.id === args[1]);
  if (!p) { console.error(cl('red', `Not found: ${args[1]}`)); process.exit(1); }
  try {
    if (process.platform === 'win32') execFileSync('clip', [], { input: p.text });
    else if (process.platform === 'darwin') execFileSync('pbcopy', [], { input: p.text });
    else execFileSync('xclip', ['-selection', 'clipboard'], { input: p.text });
    console.log(cl('green', `✓ Copied: ${p.icon} ${p.role} (~${Math.ceil(p.text.length/4)} tokens)`));
  } catch { process.stdout.write(p.text); }
  process.exit(0);
}

if (cmd === 'run' && args[1]) {
  const p = P.find(x => x.id === args[1]);
  if (!p) { console.error(cl('red', `Not found: ${args[1]}`)); process.exit(1); }
  const launchers = { claude:'claude --dangerously-skip-permissions', gemini:'gemini --model gemini-3.1-pro-preview --yolo', codex:'codex --full-auto' };
  console.log(`#!/bin/bash\n# ${p.icon} ${p.role} (${p.m})\n# ${launchers[p.mk]||p.mk}\n\ncat << 'EOF'\n${p.text}\nEOF`);
  process.exit(0);
}

if (cmd === 'export') {
  const fmt = args[1] || 'json';
  if (fmt === 'json') console.log(JSON.stringify(data, null, 2));
  else if (fmt === 'csv') { console.log('ID,Role,Model,Difficulty,Time,Tags,Tokens'); P.forEach(p=>console.log(`"${p.id}","${p.role}","${p.m}","${p.difficulty}","${p.time}","${(p.tags||[]).join(';')}",${Math.ceil(p.text.length/4)}`)); }
  else if (fmt === 'md') { console.log(`# AIAgent-Hub\n`); P.forEach(p=>console.log(`## ${p.icon} ${p.role}\n\`\`\`\n${p.text}\n\`\`\`\n`)); }
  process.exit(0);
}

console.error(cl('red', `Unknown: ${cmd}. Use: npx aiagent-hub help`));
process.exit(1);
