/**
 * Agent Hub Telegram Bot
 *
 * Setup:
 * 1. Create bot via @BotFather → get BOT_TOKEN
 * 2. Set env: TELEGRAM_BOT_TOKEN=<token>
 * 3. Run: node bot/telegram.cjs
 *
 * Commands:
 * /start — welcome message
 * /list — list all prompts (first 20)
 * /search <query> — search prompts
 * /show <id> — show full prompt
 * /copy <id> — send prompt text as message
 * /stats — statistics
 * /combos — team combinations
 * /random — random prompt
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { inflateSync } = require('zlib');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) {
  console.error('Set TELEGRAM_BOT_TOKEN environment variable');
  console.error('Get one from @BotFather on Telegram');
  process.exit(1);
}

// Load prompt data
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.jsx'), 'utf8');
const match = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(match[1], 'base64')).toString('utf8'));
const P = data.P;

console.log(`Loaded ${P.length} prompts`);

// Telegram API helper
function api(method, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TOKEN}/${method}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const send = (chatId, text, opts = {}) => api('sendMessage', {
  chat_id: chatId, text, parse_mode: 'Markdown', ...opts,
});

// Handlers
const handlers = {
  '/start': (chatId) => send(chatId,
    `🤖 *Agent Hub Bot*\n\n${P.length} промтов для автономных AI-агентов.\n\n` +
    `/list — список промтов\n/search <запрос> — поиск\n/show <id> — показать промт\n` +
    `/copy <id> — получить текст\n/stats — статистика\n/random — случайный`
  ),

  '/stats': (chatId) => {
    const models = {};
    P.forEach(p => { models[p.mk] = (models[p.mk] || 0) + 1; });
    let msg = `📊 *Agent Hub Stats*\n\nПромтов: ${P.length}\nКомбо: ${data.COMBOS.ru.length}\n\n`;
    Object.entries(models).forEach(([mk, n]) => {
      const name = mk === 'claude' ? 'Claude' : mk === 'gemini' ? 'Gemini' : 'Codex';
      msg += `${name}: ${n}\n`;
    });
    return send(chatId, msg);
  },

  '/list': (chatId) => {
    let msg = `📝 *${P.length} промтов* (первые 20)\n\n`;
    P.slice(0, 20).forEach(p => {
      msg += `${p.icon} \`${p.id}\` — ${p.role} (${p.time})\n`;
    });
    msg += `\n_/show <id> для деталей_`;
    return send(chatId, msg);
  },

  '/random': (chatId) => {
    const p = P[Math.floor(Math.random() * P.length)];
    return send(chatId,
      `🎲 *${p.icon} ${p.role}*\n\`${p.id}\` · ${p.m} · ${p.time}\n\n` +
      `\`\`\`\n${p.text.slice(0, 3000)}\n\`\`\`\n\n_/copy ${p.id} для полного текста_`
    );
  },
};

function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = msg.text || '';
  const [cmd, ...args] = text.split(' ');

  if (handlers[cmd]) return handlers[cmd](chatId, args);

  if (cmd === '/search' && args.length > 0) {
    const q = args.join(' ').toLowerCase();
    const results = P.filter(p => (p.text + ' ' + p.role + ' ' + p.id + ' ' + (p.tags||[]).join(' ')).toLowerCase().includes(q));
    let msg2 = `🔍 *${results.length} результатов* для "${q}"\n\n`;
    results.slice(0, 15).forEach(p => { msg2 += `${p.icon} \`${p.id}\` — ${p.role}\n`; });
    if (results.length > 15) msg2 += `\n_... ещё ${results.length - 15}_`;
    return send(chatId, msg2);
  }

  if (cmd === '/show' && args[0]) {
    const p = P.find(x => x.id === args[0]);
    if (!p) return send(chatId, `❌ Промт \`${args[0]}\` не найден`);
    return send(chatId,
      `${p.icon} *${p.role}*\n${p.m} · ${p.time} · ${p.difficulty}\n` +
      (p.tags.length ? `Tags: ${p.tags.join(', ')}\n` : '') +
      `\n\`\`\`\n${p.text.slice(0, 3500)}\n\`\`\`\n\n~${Math.ceil(p.text.length/4)} tokens`
    );
  }

  if (cmd === '/copy' && args[0]) {
    const p = P.find(x => x.id === args[0]);
    if (!p) return send(chatId, `❌ Промт \`${args[0]}\` не найден`);
    // Send as plain text (no markdown) so it can be copied
    return api('sendMessage', { chat_id: chatId, text: p.text });
  }

  if (cmd === '/combos') {
    let msg2 = `👥 *${data.COMBOS.ru.length} комбо*\n\n`;
    data.COMBOS.ru.slice(0, 15).forEach((cb, i) => {
      msg2 += `${i+1}. *${cb.name}*\n   ${cb.desc}\n\n`;
    });
    return send(chatId, msg2);
  }

  return send(chatId, `Неизвестная команда. /start для помощи.`);
}

// Polling loop
let offset = 0;
async function poll() {
  try {
    const res = await api('getUpdates', { offset, timeout: 30 });
    if (res.ok && res.result.length > 0) {
      for (const update of res.result) {
        offset = update.update_id + 1;
        if (update.message) await handleMessage(update.message);
      }
    }
  } catch (e) {
    console.error('Poll error:', e.message);
  }
  setTimeout(poll, 100);
}

console.log('Bot started. Polling for messages...');
poll();
