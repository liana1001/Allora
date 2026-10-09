import { describe, expect, it } from 'vitest';
import { canAccessRecord, ownerWhere } from './ownership.js';

describe('ownership checks', () => {
  it('allows only the owner to access active records', () => {
    expect(canAccessRecord({ ownerId: 'owner-1', deletedAt: null }, 'owner-1')).toBe(true);
    expect(canAccessRecord({ ownerId: 'owner-1', deletedAt: null }, 'owner-2')).toBe(false);
    expect(canAccessRecord({ ownerId: 'owner-1', deletedAt: new Date() }, 'owner-1')).toBe(false);
  });

  it('creates the common active-owner query predicate', () => {
    expect(ownerWhere('owner-1')).toEqual({ ownerId: 'owner-1', deletedAt: null });
  });
});
