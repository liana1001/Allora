# Monitoring

The API logs structured request data through Fastify, including request IDs. The error handler redacts response details for server errors and never logs credentials.

- Health endpoint: `GET /api/v1/health`
- Uptime workflow: `.github/workflows/uptime.yml`
- Error tracking hook: configure `SENTRY_DSN` when the production provider is selected.

Set the `TEST_API_URL` GitHub variable to enable the scheduled uptime check.
