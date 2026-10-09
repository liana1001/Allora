import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import Fastify, { type FastifyError } from 'fastify';
import { randomUUID } from 'node:crypto';
import { healthResponseSchema, loginSchema, signUpSchema } from '@allora/shared';
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
    return reply.code(201).send({ account });
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
