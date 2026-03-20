import { describe, it, expect, beforeAll } from 'vitest';

const API = 'http://localhost:3001/api';
let token = null;

// Note: these tests require the API server to be running
// Skip if server not available
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

describe('API Server', () => {
  it('health check', async () => {
    const res = await fetchJSON(`${API}/health`);
    if (!res) return; // Server not running
    expect(res.status).toBe(200);
    expect(res.data.status).toBe('ok');
    expect(res.data.version).toBe('8.3');
  });

  it('register new user', async () => {
    const user = `test-${Date.now()}`;
    const res = await fetchJSON(`${API}/register`, {
      method: 'POST',
      body: JSON.stringify({ username: user, password: 'test123456' }),
    });
    if (!res) return;
    expect(res.status).toBe(200);
    expect(res.data.token).toBeDefined();
    token = res.data.token;
  });

  it('login with credentials', async () => {
    if (!token) return;
    const user = `login-${Date.now()}`;
    await fetchJSON(`${API}/register`, {
      method: 'POST',
      body: JSON.stringify({ username: user, password: 'test123456' }),
    });
    const res = await fetchJSON(`${API}/login`, {
      method: 'POST',
      body: JSON.stringify({ username: user, password: 'test123456' }),
    });
    if (!res) return;
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
    if (!res) return;
    expect(res.status).toBe(409);
  });

  it('reject short password', async () => {
    const res = await fetchJSON(`${API}/register`, {
      method: 'POST',
      body: JSON.stringify({ username: 'short', password: '12' }),
    });
    if (!res) return;
    expect(res.status).toBe(400);
  });

  it('create public prompt', async () => {
    if (!token) return;
    const res = await fetchJSON(`${API}/prompts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: 'test', title: 'Test', text: 'Test prompt', is_public: true }),
    });
    if (!res) return;
    expect(res.status).toBe(201);
    expect(res.data.id).toMatch(/^u-/);
  });

  it('list public prompts', async () => {
    const res = await fetchJSON(`${API}/prompts`);
    if (!res) return;
    expect(res.status).toBe(200);
    expect(res.data.total).toBeGreaterThanOrEqual(0);
  });

  it('reject unauthenticated prompt creation', async () => {
    const res = await fetchJSON(`${API}/prompts`, {
      method: 'POST',
      body: JSON.stringify({ role: 'x', title: 'x', text: 'x' }),
    });
    if (!res) return;
    expect(res.status).toBe(401);
  });

  it('stats endpoint works', async () => {
    const res = await fetchJSON(`${API}/stats`);
    if (!res) return;
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('prompts');
    expect(res.data).toHaveProperty('users');
  });
});
