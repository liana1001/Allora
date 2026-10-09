import { describe, expect, it } from 'vitest';
import { AccountService } from './auth.js';

describe('AccountService', () => {
  it('creates an account and authenticates with an expiring session', async () => {
    const service = new AccountService();
    const account = await service.signUp({
      email: 'Liana@Example.com',
      password: 'correct horse battery staple',
      displayName: 'Liana',
    });
    const login = await service.login({
      email: account.email,
      password: 'correct horse battery staple',
    });

    expect(account.email).toBe('liana@example.com');
    expect(login.account.id).toBe(account.id);
    expect(service.getSession(login.token)?.accountId).toBe(account.id);
  });

  it('rejects duplicate accounts and invalid passwords', async () => {
    const service = new AccountService();
    await service.signUp({
      email: 'person@example.com',
      password: 'correct horse battery staple',
      displayName: 'Person',
    });
    await expect(
      service.signUp({
        email: 'person@example.com',
        password: 'another correct password',
        displayName: 'Person',
      }),
    ).rejects.toThrow('ACCOUNT_EXISTS');
    await expect(service.login({ email: 'person@example.com', password: 'wrong' })).rejects.toThrow(
      'INVALID_CREDENTIALS',
    );
  });

  it('supports verification, password recovery, profile updates, and password changes', async () => {
    const service = new AccountService();
    const account = await service.signUp({
      email: 'person@example.com',
      password: 'correct horse battery staple',
      displayName: 'Person',
    });
    service.verifyEmail(account.verificationToken);
    const resetToken = service.requestPasswordReset(account.email);
    expect(resetToken).toBeTruthy();
    await service.resetPassword(resetToken!, 'new correct password');
    await expect(
      service.login({ email: account.email, password: 'new correct password' }),
    ).resolves.toBeTruthy();
    await service.changePassword(account.id, {
      currentPassword: 'new correct password',
      newPassword: 'another correct password',
    });
    expect(
      service.updateProfile(account.id, {
        displayName: 'Updated',
        timeZone: 'UTC',
        currency: 'USD',
      }).displayName,
    ).toBe('Updated');
  });
});
