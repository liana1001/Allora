# Allora Task List

Based on the Allora Specification and Implementation Plan. Requirement IDs in square brackets match the specification.

## Rules for the coding assistant

- Work in order, one task at a time. Tick a box only when tests and lint pass.
- Stack: React with TypeScript, Node.js REST API, PostgreSQL, object storage, and a job queue. Folders: `apps/web`, `apps/api`, `packages/shared`.
- Store money as whole numbers in the smallest currency unit with a currency code. Store times in UTC.
- Every record has owner, created at, created by, updated at, and deleted at. Every query checks ownership.
- Write tests with the code. Ask before changing the stack or skipping a task.

## Phase 0: Setup

- [x] 0.1 Create the repository (`apps/web`, `apps/api`, `packages/shared`) with TypeScript, linting, and formatting.
- [x] 0.2 Set up the React web app (router, data fetching, forms, Tailwind CSS) and the Node.js API (validation, error handling, health check).
- [ ] 0.3 Set up PostgreSQL with migrations and seed data.
- [ ] 0.4 Set up continuous integration, test and live environments, and automatic deployment to test.
- [x] 0.5 Define API conventions (`/api/v1`, pagination, sorting, filtering, one error format) and generate API documentation.
- [x] 0.6 Create design tokens: colors, spacing, type sizes, module accent colors, light and dark themes.
- [x] 0.7 Create the ownership model with one shared access check.
- [ ] 0.8 Add error tracking, logging, and an uptime check.

## Phase 1: Foundation

- [ ] 1.1 Accounts: sign up, email verification, login and logout, password reset, Google sign in, session expiry, active sessions list, rate limits, profile fields, password change [ACC1, ACC2, ACC4, SET5].
- [ ] 1.2 Data layer: common columns, soft delete with a 30 day purge job, notes, attachments, tags, and file upload with signed links.
- [ ] 1.3 App shell: sidebar and bottom navigation, light and dark themes, shared components, empty pages, error messages, quick add button, keyboard shortcuts, and accessibility to WCAG 2.1 AA [DSH3, SET1].
- [ ] 1.4 Onboarding and module settings: choose modules, set time zone and currency, add a first item, and hide modules that are off [ACC3, ACC5].
- [ ] 1.5 Calendar: events linked to items, user events, day, week, month, and agenda views, filter by module, ICS export [CAL1 to CAL4, CAL7].
- [ ] 1.6 Reminders: job queue and worker, reminder offsets, in app, email, and push delivery, channel choice, quiet hours, time zone tests [CAL5, CAL6, ACA9].
- [ ] 1.7 Tasks: tasks and subtasks, repeating tasks, list, board, calendar, Today, and Upcoming views, Work and Personal context, job details, timer, notes to tasks, filters, daily plan [JOB1 to JOB9].
- [ ] 1.8 Academics: terms, courses, timetable, exams with countdown, assignments, marks and course grade, GPA and CGPA, target grade planner, course notes and files, attendance warning [ACA1 to ACA8].
- [ ] 1.9 Habits: habits, frequency options, yes or no, count, and timed types, completion and backfill, streaks, heatmap and charts, pause and archive [HAB1 to HAB7].
- [ ] 1.10 Dashboard: widgets for tasks, habits, and exams and deadlines, rearranging, daily progress, weekly summary [DSH1, DSH2, DSH4, DSH5].
- [ ] 1.11 Settings and export: notification settings, module toggles, JSON export and import, account deletion [SET2 to SET4, ACC6].
- [ ] 1.12 Test and release: end to end tests, accessibility, security, and performance checks, then a closed beta.

Done when: the dashboard loads in under 2 seconds, reminders arrive on time, and all Phase 1 requirements pass their tests.

## Phase 2: Money and Projects

- [ ] 2.1 Finance: accounts, transactions with receipt photo, transfers, categories, budgets with warnings at 80 and 100 percent, recurring transactions, savings goals, debts, reports, currencies, CSV export, bills on the calendar [FIN1 to FIN11].
- [ ] 2.2 Projects: projects, milestones, tasks in the shared task table, progress, board, list, and timeline views, notes and files, dependencies with a loop check, templates [PRJ1 to PRJ7].
- [ ] 2.3 Goals: goals, links to habits, tasks, projects, and savings goals, progress, review prompts [GOL1 to GOL4, HAB8].
- [ ] 2.4 Search: PostgreSQL full text search across all modules [SRC1].
- [ ] 2.5 Add spending and project widgets to the dashboard, then test and run a beta.

Done when: all Phase 2 requirements pass their tests and search returns results in under 1 second.

## Phase 3: Research and Insights

- [ ] 3.1 Research tracker: topics, paper library, notes, experiment log, deadlines, DOI import, BibTeX export, paper planning, reading goals [RES1 to RES8].
- [ ] 3.2 Insights page and PDF reports [INS1, INS2].
- [ ] 3.3 Google Calendar sync, one way first [CAL7].
- [ ] 3.4 Study planner [ACA10].

Done when: all Phase 3 requirements pass their tests and report numbers match the modules.

## Phase 4: Growth

- [ ] 4.1 Collaboration: invitations, member roles, task assignment, comments, access checks through membership, notifications, security tests [PRJ8].
- [ ] 4.2 Installable app: manifest, service worker, offline viewing, push notifications.
- [ ] 4.3 Community templates with sharing, copying, and reporting.

## Before each live release

- [ ] Requirements tested against the specification.
- [ ] Security, accessibility, and performance reviews done.
- [ ] Migrations run automatically and can be rolled back.
- [ ] Unfinished modules hidden with feature switches.
- [ ] Release note written.
