import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';
import type { LoginInput, SignUpInput } from '@allora/shared';

const scrypt = promisify(scryptCallback);
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 15;
const RATE_LIMIT_MAX_ATTEMPTS = 10;

type Account = {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  emailVerifiedAt: Date | null;
  createdAt: Date;
};

type Session = { tokenHash: string; accountId: string; expiresAt: Date; createdAt: Date };
type Attempt = { count: number; windowStartedAt: number };

export class AccountService {
  private readonly accounts = new Map<string, Account>();
  private readonly sessions = new Map<string, Session>();
  private readonly attempts = new Map<string, Attempt>();

  async signUp(input: SignUpInput) {
    const email = input.email.toLowerCase();
    if ([...this.accounts.values()].some((account) => account.email === email)) {
      throw new Error('ACCOUNT_EXISTS');
    }
    const account: Account = {
      id: randomUUID(),
      email,
      displayName: input.displayName,
      passwordHash: await hashPassword(input.password),
      emailVerifiedAt: null,
      createdAt: new Date(),
    };
    this.accounts.set(account.id, account);
    return { id: account.id, email: account.email, displayName: account.displayName };
  }

  async login(input: LoginInput) {
    const email = input.email.toLowerCase();
    this.checkRateLimit(email);
    const account = [...this.accounts.values()].find((candidate) => candidate.email === email);
    if (!account || !(await verifyPassword(input.password, account.passwordHash))) {
      this.recordAttempt(email);
      throw new Error('INVALID_CREDENTIALS');
    }
    const token = randomBytes(32).toString('base64url');
    const tokenHash = hashToken(token);
    const session: Session = {
      tokenHash,
      accountId: account.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    };
    this.sessions.set(tokenHash, session);
    return {
      token,
      account: { id: account.id, email: account.email, displayName: account.displayName },
    };
  }

  getSession(token: string) {
    const session = this.sessions.get(hashToken(token));
    if (!session || session.expiresAt.getTime() <= Date.now()) {
      if (session) this.sessions.delete(session.tokenHash);
      return null;
    }
    return session;
  }

  listSessions(accountId: string) {
    return [...this.sessions.values()].filter(
      (session) => session.accountId === accountId && session.expiresAt.getTime() > Date.now(),
    );
  }

  revokeSession(token: string) {
    this.sessions.delete(hashToken(token));
  }

  private checkRateLimit(email: string) {
    const attempt = this.attempts.get(email);
    if (
      attempt &&
      Date.now() - attempt.windowStartedAt < RATE_LIMIT_WINDOW_MS &&
      attempt.count >= RATE_LIMIT_MAX_ATTEMPTS
    ) {
      throw new Error('RATE_LIMITED');
    }
  }

  private recordAttempt(email: string) {
    const current = this.attempts.get(email);
    if (!current || Date.now() - current.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
      this.attempts.set(email, { count: 1, windowStartedAt: Date.now() });
    } else {
      current.count += 1;
    }
  }
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [, salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const expectedKey = Buffer.from(key, 'hex');
  return expectedKey.length === derivedKey.length && timingSafeEqual(expectedKey, derivedKey);
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
