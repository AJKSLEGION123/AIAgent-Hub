const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const { cors } = require('hono/cors');
const crypto = require('crypto');
const db = require('./db.cjs');

const app = new Hono();
app.use('/*', cors());

// ── Auth helpers ──
const hash = (pw) => crypto.createHash('sha256').update(pw).digest('hex');
const sessions = new Map();
const auth = (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  const user = token ? sessions.get(token) : null;
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  c.set('user', user);
  return next();
};

// ── Auth routes ──
app.post('/api/register', async (c) => {
  const { username, password, display_name } = await c.req.json();
  if (!username || !password) return c.json({ error: 'Username and password required' }, 400);
  if (username.length < 3 || password.length < 6) return c.json({ error: 'Username 3+ chars, password 6+ chars' }, 400);
  try {
    const stmt = db.prepare('INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)');
    const result = stmt.run(username, hash(password), display_name || username);
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { id: result.lastInsertRowid, username });
    return c.json({ token, user: { id: result.lastInsertRowid, username, display_name: display_name || username } });
  } catch (e) {
    if (e.message.includes('UNIQUE')) return c.json({ error: 'Username taken' }, 409);
    return c.json({ error: 'Server error' }, 500);
  }
});

app.post('/api/login', async (c) => {
  const { username, password } = await c.req.json();
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password_hash = ?').get(username, hash(password));
  if (!user) return c.json({ error: 'Invalid credentials' }, 401);
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { id: user.id, username: user.username });
  return c.json({ token, user: { id: user.id, username: user.username, display_name: user.display_name } });
});

// ── Prompts CRUD ──
app.get('/api/prompts', (c) => {
  const { model, role, tag, search } = c.req.query();
  let prompts = db.prepare('SELECT * FROM custom_prompts WHERE is_public = 1').all();
  if (model) prompts = prompts.filter(p => p.model === model);
  if (role) prompts = prompts.filter(p => p.role === role);
  if (tag) prompts = prompts.filter(p => JSON.parse(p.tags || '[]').includes(tag));
  if (search) {
    const q = search.toLowerCase();
    prompts = prompts.filter(p => (p.title + ' ' + p.text + ' ' + p.role).toLowerCase().includes(q));
  }
  return c.json({ prompts, total: prompts.length });
});

app.get('/api/prompts/:id', (c) => {
  const prompt = db.prepare('SELECT * FROM custom_prompts WHERE prompt_id = ?').get(c.req.param('id'));
  if (!prompt) return c.json({ error: 'Not found' }, 404);
  db.prepare('INSERT INTO usage_stats (prompt_id, action) VALUES (?, ?)').run(c.req.param('id'), 'view');
  return c.json(prompt);
});

app.post('/api/prompts', auth, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { role, title, text, model, icon, time, tags, difficulty, is_public } = body;
  if (!role || !title || !text) return c.json({ error: 'role, title, text required' }, 400);
  const prompt_id = `u-${user.username}-${Date.now().toString(36)}`;
  try {
    db.prepare(`INSERT INTO custom_prompts (user_id, prompt_id, role, model, icon, time, title, text, tags, difficulty, is_public)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      user.id, prompt_id, role, model || 'claude', icon || '📝', time || '~1h',
      title, text, JSON.stringify(tags || []), difficulty || 'intermediate', is_public ? 1 : 0
    );
    return c.json({ id: prompt_id }, 201);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.put('/api/prompts/:id', auth, async (c) => {
  const user = c.get('user');
  const prompt = db.prepare('SELECT * FROM custom_prompts WHERE prompt_id = ? AND user_id = ?').get(c.req.param('id'), user.id);
  if (!prompt) return c.json({ error: 'Not found or not owner' }, 404);
  const body = await c.req.json();
  const fields = ['role', 'title', 'text', 'model', 'icon', 'time', 'tags', 'difficulty', 'is_public'];
  const updates = [];
  const values = [];
  fields.forEach(f => {
    if (body[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(f === 'tags' ? JSON.stringify(body[f]) : f === 'is_public' ? (body[f] ? 1 : 0) : body[f]);
    }
  });
  if (updates.length === 0) return c.json({ error: 'No fields to update' }, 400);
  values.push(c.req.param('id'));
  db.prepare(`UPDATE custom_prompts SET ${updates.join(', ')} WHERE prompt_id = ?`).run(...values);
  return c.json({ ok: true });
});

app.delete('/api/prompts/:id', auth, async (c) => {
  const user = c.get('user');
  const result = db.prepare('DELETE FROM custom_prompts WHERE prompt_id = ? AND user_id = ?').run(c.req.param('id'), user.id);
  if (result.changes === 0) return c.json({ error: 'Not found' }, 404);
  return c.json({ ok: true });
});

// ── Ratings ──
app.post('/api/prompts/:id/rate', auth, async (c) => {
  const user = c.get('user');
  const { rating, comment } = await c.req.json();
  if (!rating || rating < 1 || rating > 5) return c.json({ error: 'Rating 1-5' }, 400);
  db.prepare(`INSERT OR REPLACE INTO ratings (user_id, prompt_id, rating, comment) VALUES (?, ?, ?, ?)`)
    .run(user.id, c.req.param('id'), rating, comment || null);
  return c.json({ ok: true });
});

app.get('/api/prompts/:id/ratings', (c) => {
  const ratings = db.prepare('SELECT r.*, u.username FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.prompt_id = ?').all(c.req.param('id'));
  const avg = ratings.length > 0 ? ratings.reduce((a, r) => a + r.rating, 0) / ratings.length : 0;
  return c.json({ ratings, avg: Math.round(avg * 10) / 10, count: ratings.length });
});

// ── Collections ──
app.get('/api/collections', auth, (c) => {
  const user = c.get('user');
  return c.json(db.prepare('SELECT * FROM collections WHERE user_id = ?').all(user.id));
});

app.post('/api/collections', auth, async (c) => {
  const user = c.get('user');
  const { name, description, prompt_ids } = await c.req.json();
  if (!name) return c.json({ error: 'Name required' }, 400);
  const result = db.prepare('INSERT INTO collections (user_id, name, description, prompt_ids) VALUES (?, ?, ?, ?)')
    .run(user.id, name, description || '', JSON.stringify(prompt_ids || []));
  return c.json({ id: result.lastInsertRowid }, 201);
});

// ── Stats ──
app.get('/api/stats', (c) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM custom_prompts WHERE is_public = 1').get();
  const users = db.prepare('SELECT COUNT(*) as count FROM users').get();
  const topPrompts = db.prepare(`SELECT prompt_id, COUNT(*) as views FROM usage_stats
    WHERE action = 'view' GROUP BY prompt_id ORDER BY views DESC LIMIT 10`).all();
  return c.json({ prompts: total.count, users: users.count, topPrompts });
});

// ── Health ──
app.get('/api/health', (c) => c.json({ status: 'ok', version: '11.1', prompts: 150 }));

// Start
const PORT = process.env.PORT || 3001;
serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`AIAgent-Hub API running on http://localhost:${PORT}`);
});
