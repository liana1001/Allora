import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import Fastify, { type FastifyError } from 'fastify';
import { randomUUID } from 'node:crypto';
import { healthResponseSchema } from '@allora/shared';

export function buildApp() {
  const app = Fastify({ logger: true, genReqId: () => randomUUID() });

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
