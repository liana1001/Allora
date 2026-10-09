import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from './app.js';

const app = buildApp();

describe('API health', () => {
  it('returns the versioned health response', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: 'ok', service: 'api' });
  });
});

describe('account endpoints', () => {
  it('supports sign-up, login, session listing, and logout', async () => {
    const account = await app.inject({
      method: 'POST',
      url: '/api/v1/accounts',
      payload: {
        email: 'new@example.com',
        password: 'correct horse battery staple',
        displayName: 'New User',
      },
    });
    expect(account.statusCode).toBe(201);

    const login = await app.inject({
      method: 'POST',
      url: '/api/v1/sessions',
      payload: { email: 'new@example.com', password: 'correct horse battery staple' },
    });
    expect(login.statusCode).toBe(200);
    const token = login.json().token as string;

    const sessions = await app.inject({
      method: 'GET',
      url: '/api/v1/sessions',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(sessions.statusCode).toBe(200);
    expect(sessions.json().sessions).toHaveLength(1);

    const logout = await app.inject({
      method: 'DELETE',
      url: '/api/v1/sessions/current',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(logout.statusCode).toBe(204);
  });
});

afterAll(() => app.close());
