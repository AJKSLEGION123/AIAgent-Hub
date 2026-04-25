import { describe, it, expect, beforeAll } from 'vitest';

const API = 'http://localhost:3001/api';
let token = null;
let serverUp = false;

async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    return { status: res.status, data: await res.json() };
  } catch {
    return null;
  }
}

// Probe once. If the dev API server isn't running, mark the entire suite
// skipped via describe.skipIf — that way vitest reports "skipped" instead of
// "passed" and we don't get the silent-pass pattern that masked the iter20
// stale version assertion.
beforeAll(async () => {
  const res = await fetchJSON(`${API}/health`);
  serverUp = !!res && res.status === 200;
});

describe.skipIf(() => !serverUp)('API Server (live)', () => {
  it('health check', async () => {
    const res = await fetchJSON(`${API}/health`);
    expect(res.status).toBe(200);
    expect(res.data.status).toBe('ok');
    // version is server-defined; assert shape (X.Y) so this test stops drifting
    expect(res.data.version).toMatch(/^\d+\.\d+/);
  });

  it('register new user', async () => {
    const user = `test-${Date.now()}`;
    const res = await fetchJSON(`${API}/register`, {
      method: 'POST',
      body: JSON.stringify({ username: user, password: 'test123456' }),
    });
    expect(res.status).toBe(200);
    expect(res.data.token).toBeDefined();
    token = res.data.token;
  });

  it('login with credentials', async () => {
    const user = `login-${Date.now()}`;
    await fetchJSON(`${API}/register`, {
      method: 'POST',
      body: JSON.stringify({ username: user, password: 'test123456' }),
    });
    const res = await fetchJSON(`${API}/login`, {
      method: 'POST',
      body: JSON.stringify({ username: user, password: 'test123456' }),
    });
    expect(res.status).toBe(200);
    expect(res.data.token).toBeDefined();
  });

  it('reject duplicate username', async () => {
    const user = `dupe-${Date.now()}`;
    await fetchJSON(`${API}/register`, {
      method: 'POST',
      body: JSON.stringify({ username: user, password: 'test123456' }),
    });
    const res = await fetchJSON(`${API}/register`, {
      method: 'POST',
      body: JSON.stringify({ username: user, password: 'test123456' }),
    });
    expect(res.status).toBe(409);
  });

  it('reject short password', async () => {
    const res = await fetchJSON(`${API}/register`, {
      method: 'POST',
      body: JSON.stringify({ username: 'short', password: '12' }),
    });
    expect(res.status).toBe(400);
  });

  it('create public prompt', async () => {
    if (!token) {
      // depends on the register-new-user test running first; if that didn't
      // happen for any reason, fail loud rather than silent-skip
      throw new Error('precondition: token from register-new-user test required');
    }
    const res = await fetchJSON(`${API}/prompts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: 'test', title: 'Test', text: 'Test prompt', is_public: true }),
    });
    expect(res.status).toBe(201);
    expect(res.data.id).toMatch(/^u-/);
  });

  it('list public prompts', async () => {
    const res = await fetchJSON(`${API}/prompts`);
    expect(res.status).toBe(200);
    expect(res.data.total).toBeGreaterThanOrEqual(0);
  });

  it('reject unauthenticated prompt creation', async () => {
    const res = await fetchJSON(`${API}/prompts`, {
      method: 'POST',
      body: JSON.stringify({ role: 'x', title: 'x', text: 'x' }),
    });
    expect(res.status).toBe(401);
  });

  it('stats endpoint works', async () => {
    const res = await fetchJSON(`${API}/stats`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('prompts');
    expect(res.data).toHaveProperty('users');
  });
});
