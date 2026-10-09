import { describe, expect, it } from 'vitest';
import { moneySchema } from './index.js';

describe('moneySchema', () => {
  it('requires integer minor units and a three-letter currency', () => {
    expect(moneySchema.parse({ amountMinor: 1250, currency: 'usd' })).toEqual({
      amountMinor: 1250,
      currency: 'USD',
    });
    expect(() => moneySchema.parse({ amountMinor: 12.5, currency: 'USD' })).toThrow();
  });
});
