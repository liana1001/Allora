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

afterAll(() => app.close());
