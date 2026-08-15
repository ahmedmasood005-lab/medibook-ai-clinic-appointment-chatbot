# MediBook AI

MediBook AI is a secure clinic appointment platform for Project **Mtech-DS26004** by **Ahmed Masood**. It combines traditional clinic operations with an OpenAI assistant that executes authenticated backend tools instead of simulating appointment success.

## Features

- Signed HTTP-only session authentication, password hashing, login throttling, logout auditing, and four-role RBAC.
- Database-backed overview KPIs, charts, upcoming appointments, patients, doctors, departments, analytics, calendar, audit logs, settings, and administrator-only users.
- Appointment search, filters, CSV export, creation, check-in, confirmation-gated cancellation, idempotency, and overlap prevention.
- Persistent AI conversations with ten strict tools, bounded function-calling loop, safe errors, tool activity, and grounded final responses.
- Fictional seed environment: 4 demo users, 60 patients, 12 doctors, 8 departments, and 220 appointments.
- Responsive navy-and-medical-blue interface with accessible desktop and mobile navigation.

## Architecture

Browser → Next.js Server Components/Route Handlers → Zod validation + RBAC → shared appointment services → SQLite development store / Prisma PostgreSQL-compatible schema. The AI route loops through OpenAI function calls and invokes the same services used by the dashboard.

The current development runtime uses the transactional JSON/SQLite fallback behavior so the project remains runnable without a local PostgreSQL server. `prisma/schema.prisma` defines the normalized production schema; switch its datasource provider to `postgresql` and use a PostgreSQL `DATABASE_URL` for deployment.

## Folder structure

- `src/app`: protected App Router pages, server actions, and API routes
- `src/components`: reusable shell, charts, appointment manager, assistant, and page components
- `src/lib`: authentication, clinic store, appointment rules, AI tool schemas, and shared types
- `prisma`: normalized schema, migration, and seed reset
- `tests`: executable business-rule tests and Playwright end-to-end specification
- `docs`: API documentation

## Setup

```bash
cp .env.example .env.local
npm install
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. On Windows PowerShell use `Copy-Item .env.example .env.local`.

## Environment variables

- `OPENAI_API_KEY`: server-only OpenAI project key
- `OPENAI_MODEL`: function-capable model, default `gpt-4.1-mini`
- `SESSION_SECRET`: at least 32 random characters in production
- `DATABASE_URL`: `file:./dev.db` locally or a PostgreSQL URL in production
- `APP_URL`: public application origin
- `CLINIC_TIMEZONE`: defaults to `Asia/Karachi`

Never expose `OPENAI_API_KEY` or `SESSION_SECRET` through `NEXT_PUBLIC_` variables.

## Database and production

```bash
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run build
npm start
```

Docker: `docker compose up --build`. Replace the compose demo password and use managed secrets in production.

## Test commands

```bash
npm run lint
npm run typecheck
npm test
npx playwright test
npm run build
```

## Demo credentials

All fictional accounts use password `Demo@123`:

- Administrator: `admin@medibook.demo`
- Receptionist: `reception@medibook.demo`
- Doctor: `doctor@medibook.demo`
- Viewer: `viewer@medibook.demo`

## Security and privacy

Server-side validation and authorization are mandatory for mutations. Cookies are HTTP-only, `SameSite=Lax`, and secure in production. Audit metadata excludes passwords, API keys, full prompts, and clinical data. Patient registration minimizes fields. Production deployments should add a distributed rate limiter, managed PostgreSQL transactions with serializable isolation, CSRF origin validation for cross-origin deployments, secret rotation, backup policies, and centralized monitoring.

## Ethical AI limitations

MediBook AI is strictly an appointment administration system. It must not diagnose, prescribe, interpret reports, or provide emergency guidance. Revenue is estimated because no verified payment processor is connected. Users must verify important appointment details.

## Troubleshooting

- `AI is not configured`: add a valid `OPENAI_API_KEY` to `.env.local` and restart.
- `Slot is not available`: choose a future time inside doctor hours, outside breaks, and without overlap.
- Redirected to login: the session is absent or expired.
- Unauthorized page: use an account whose role permits the action; user management requires Administrator.

## Future improvements

Distributed Redis throttling, verified email/phone ownership, external reminders, PostgreSQL exclusion constraints, holiday calendars, payment reconciliation, multilingual assistant output, and production observability.
