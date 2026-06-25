# 011 — Scheduler dashboard UI

## Status

Accepted

## Context

Local Scheduler web needs a tasks dashboard with run history, enable toggles, and manual run actions. UI must follow package composition (dashboard → table → row) and Redux data flow.

## Decision

### Package layout (`src/packages/ptasks/`)

| File | Role |
|------|------|
| `index.tsx` | Page orchestrator: load tasks + runs on mount |
| `dashboard/index.tsx` | Toolbar (refresh) + renders table |
| `table/index.tsx` | Column headers, empty state, maps rows |
| `table/row/index.tsx` | One task row: enable toggle, run now, status |

Optional `src/packages/runs/` for full run history page at `/runs`.

### Table columns (v1)

| Column | Source |
|--------|--------|
| Name | `task.name` |
| Worker / repo | `workerProjectId`, `worker.expressRepoName`, `expressDir` |
| Endpoint | `METHOD path` |
| Schedule | `formatTaskSchedule(task.schedule)` in package |
| Enabled | toggle → `patchTaskEnabledThunk` |
| Last run | latest run for `taskId` from `dumps/runs` |
| Next run | `task.nextRunAt` from API |
| Status | `schedulerBuilder` running state + last run status |

### Redux

- `dumps/tasks`, `dumps/runs` — normalized records from API
- `currentTask` — selected task for `/task-detail-page` (ADR 008)
- `schedulerBuilder` — loading flags, `runningTaskIds`, last error
- Manual thunks only; components dispatch thunks, never call `fetch` directly

### Detail page (`src/packages/task-detail-page/`)

Row click on the tasks table dispatches `setCurrentTaskThunk(taskId)` then navigates to `/task-detail-page`. The detail package reads `currentTask` from Redux (no route params). Direct visits with an empty `currentTask` redirect to `/`.

| File | Role |
|------|------|
| `index.tsx` | Orchestrator: breadcrumb trail, load tasks/runs, redirect guard |
| `overview/index.tsx` | Task config, schedule, status |
| `actions/index.tsx` | Enable toggle, run now, back link |
| `run-history/index.tsx` | Runs filtered to `currentTask.id` from `dumps/runs` |

## Related files

- `src/packages/ptasks/`
- `src/packages/task-detail-page/`
- `src/packages/runs/`
- `src/store/current/currentTask.ts`
- `src/store/dumps/tasks.ts`, `runs.ts`
- `src/store/builders/schedulerBuilder.ts`
- `src/store/thunks/tasks/`, `runs/`
