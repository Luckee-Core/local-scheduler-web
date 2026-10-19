# Local Scheduler Web

Dashboard UI for **local-scheduler-express-server**. View scheduled tasks, add tasks, toggle enable flags, run tasks manually, and browse run history.

Default port: **3023** (Luckee Hub `webPortStart`); legacy standalone dev may use **4121** if configured in the Next app.

Run **only on the same Mac as the scheduler API** (127.0.0.1). Not required on laptops used only for Gmail web.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3023](http://localhost:3023) (or the port shown in the terminal).

Ensure the express server is running on `http://127.0.0.1:3022` with Postgres configured (`DATABASE_URL`).

## Routes

| Path | Page |
|------|------|
| `/` | Scheduled tasks table |
| `/task-create-page` | Create task (POST to express API) |
| `/runs` | Run history |
| `/task-detail-page` | Task detail (Redux `currentTask`) |

## Architecture

Follow **`.cursor/rules/AGENTS.md`** and **`.cursor/architecture/`** (ADRs 001–013, 015).

## Related

- **local-scheduler-express-server** — scheduler API + cron engine + Postgres
