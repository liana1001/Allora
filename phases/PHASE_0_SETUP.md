# Phase 0: Setup

- [x] 0.1 Create the repository (`apps/web`, `apps/api`, `packages/shared`) with TypeScript, linting, and formatting.
- [x] 0.2 Set up the React web app (router, data fetching, forms, Tailwind CSS) and the Node.js API (validation, error handling, health check).
- [ ] 0.3 Set up PostgreSQL with migrations and seed data.
- [ ] 0.4 Set up continuous integration, test and live environments, and automatic deployment to test.
- [x] 0.5 Define API conventions (`/api/v1`, pagination, sorting, filtering, one error format) and generate API documentation.
- [x] 0.6 Create design tokens: colors, spacing, type sizes, module accent colors, light and dark themes.
- [x] 0.7 Create the ownership model with one shared access check.
- [ ] 0.8 Add error tracking, logging, and an uptime check.

## Validation status

Local typecheck, lint, tests, builds, and formatting pass. Task 0.3 requires PostgreSQL, task 0.4 requires a GitHub Actions run and test deployment, and task 0.8 requires an external error-tracking provider and deployed uptime target; those environments are not installed or configured locally yet.
