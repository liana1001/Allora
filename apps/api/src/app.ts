import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import Fastify, { type FastifyError } from 'fastify';
import { randomUUID } from 'node:crypto';
import {
  healthResponseSchema,
  loginSchema,
  passwordChangeSchema,
  profileUpdateSchema,
  signUpSchema,
} from '@allora/shared';
import { AccountService } from './auth.js';

export function buildApp() {
  const app = Fastify({ logger: true, genReqId: () => randomUUID() });
  const accounts = new AccountService();

  app.register(helmet);
  app.register(cors, { origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' });

  app.get('/api/v1/health', async (_request, reply) => {
    return reply.send(
      healthResponseSchema.parse({
        status: 'ok',
        service: 'api',
        timestamp: new Date().toISOString(),
      }),
    );
  });

  app.post('/api/v1/accounts', async (request, reply) => {
    const input = signUpSchema.parse(request.body);
    const account = await accounts.signUp(input);
    const { verificationToken, ...publicAccount } = account;
    return reply.code(201).send({
      account: publicAccount,
      ...(process.env.NODE_ENV === 'test' ? { verificationToken } : {}),
    });
  });

  app.post('/api/v1/accounts/verify-email', async (request, reply) => {
    const body = request.body as { token?: string };
    accounts.verifyEmail(body.token ?? '');
    return reply.send({ verified: true });
  });

  app.post('/api/v1/password-resets', async (request, reply) => {
    const body = request.body as { email?: string };
    const token = accounts.requestPasswordReset(body.email ?? '');
    return reply.send({
      accepted: true,
      ...(process.env.NODE_ENV === 'test' && token ? { token } : {}),
    });
  });

  app.post('/api/v1/password-resets/complete', async (request, reply) => {
    const body = request.body as { token?: string; password?: string };
    await accounts.resetPassword(body.token ?? '', body.password ?? '');
    return reply.send({ reset: true });
  });

  app.post('/api/v1/sessions', async (request, reply) => {
    const input = loginSchema.parse(request.body);
    const session = await accounts.login(input);
    return reply.send(session);
  });

  app.get('/api/v1/sessions', async (request, reply) => {
    const token = getBearerToken(request.headers.authorization);
    const session = token ? accounts.getSession(token) : null;
    if (!session)
      return reply.code(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
          details: [],
          requestId: request.id,
        },
      });
    return reply.send({ sessions: accounts.listSessions(session.accountId) });
  });

  app.delete('/api/v1/sessions/current', async (request, reply) => {
    const token = getBearerToken(request.headers.authorization);
    if (!token || !accounts.getSession(token))
      return reply.code(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
          details: [],
          requestId: request.id,
        },
      });
    accounts.revokeSession(token);
    return reply.code(204).send();
  });

  app.patch('/api/v1/profile', async (request, reply) => {
    const token = getBearerToken(request.headers.authorization);
    const session = token ? accounts.getSession(token) : null;
    if (!session)
      return reply.code(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
          details: [],
          requestId: request.id,
        },
      });
    return reply.send({
      account: accounts.updateProfile(session.accountId, profileUpdateSchema.parse(request.body)),
    });
  });

  app.post('/api/v1/profile/password', async (request, reply) => {
    const token = getBearerToken(request.headers.authorization);
    const session = token ? accounts.getSession(token) : null;
    if (!session)
      return reply.code(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
          details: [],
          requestId: request.id,
        },
      });
    await accounts.changePassword(session.accountId, passwordChangeSchema.parse(request.body));
    return reply.code(204).send();
  });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    request.log.error({ err: error }, 'request failed');
    return reply.status(error.statusCode && error.statusCode >= 400 ? error.statusCode : 500).send({
      error: {
        code: error.code ?? 'INTERNAL_ERROR',
        message:
          error.statusCode && error.statusCode < 500 ? error.message : 'Internal server error',
        details: [],
        requestId: request.id,
      },
    });
  });

  return app;
}

function getBearerToken(authorization: string | undefined) {
  const [scheme, token] = authorization?.split(' ') ?? [];
  return scheme?.toLowerCase() === 'bearer' && token ? token : null;
}
