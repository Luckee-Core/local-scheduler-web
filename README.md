# Local Scheduler Web

Dashboard UI for **local-scheduler-express-server**. View scheduled tasks, toggle enable flags, run tasks manually, and browse run history.

Default port: **4121**.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:4121](http://localhost:4121).

Ensure the express server is running on `http://127.0.0.1:4120`.

## Routes

| Path | Page |
|------|------|
| `/` | Scheduled tasks table |
| `/runs` | Run history |

## Architecture

Follow **`.cursor/rules/AGENTS.md`** and **`.cursor/architecture/`** (ADRs 001–011).

- Dashboard chrome: `AppLayout`, sidebar, breadcrumbs (ADR 009)
- Feature UI: `src/packages/ptasks/` (ADR 011)
- Redux: `dumps/tasks`, `dumps/runs`, manual thunks only

## Related

- **local-scheduler-express-server** — scheduler API + cron engine
