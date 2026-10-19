# 013 — Scheduler dashboard UI

## Status

Accepted

## Context

Local Scheduler web needs a tasks dashboard with run history, enable toggles, and manual run actions. UI must follow package composition (dashboard → tabs + task timeline → rows) and Redux data flow.

## Decision

### Package layout (`src/packages/ptasks/`)

| File | Role |
|------|------|
| `index.tsx` | Page orchestrator: load tasks + runs on mount |
| `dashboard/index.tsx` | Toolbar (refresh) + renders task list |
| `table/index.tsx` | Project tabs (All + each business), column headers, hour timeline |
| `table/project-tabs/index.tsx` | Tab bar: All and one tab per `schedulerProject` |
| `table/task-timeline/index.tsx` | Hour dividers and task rows |
| `table/task-row/index.tsx` | One row: name, frequency, active/inactive, last run (click → detail) |
| `group-tasks-for-dashboard.ts` | `listProjectTabs`, `groupTasksByHour` |
| `format-task-frequency.ts` | Short “how often” copy for rows |

Optional `src/packages/runs/` for full run history page at `/runs`.

### Layout and visual chrome

- **All routes** (`/`, `/runs`, `/task-detail-page`, `/task-create-page`) use full-width `AppLayout` (no centered `max-w-*` column). See [033 – Detail page layout chrome](./033-detail-page-layout-chrome.md).
- List and run tables use `listTableStyles`; detail panels use `detailPageStyles`.
- Home route task list spans the full main column.
- **Tabs:** `All` plus one tab per business project (`schedulerProject`).
- **List:** No per-project panel; filtered tasks only. Ordered by schedule start hour with hour divider rows (e.g. `9 AM`).
- **Row fields:** task name (full name on All; short name on a project tab), how often (`formatTaskFrequency`), Active/Inactive (`enabled`), last run time.
- Toggle and run-now stay on `/task-detail-page`. Row click opens detail via `setCurrentTaskThunk`.

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
| `overview/index.tsx` | Summary panel: read-only fields + header actions (with `actions/`) |
| `actions/index.tsx` | Enable toggle, run now, delete (rendered in summary `panelHeader`) |
| `edit-form/index.tsx` | Form wrapper for configuration section panels |
| `edit-form/task-section/` | Task identity panel |
| `edit-form/worker-process-section/` | Worker process panel |
| `edit-form/http-request-section/` | HTTP request panel |
| `edit-form/schedule-section/` | Schedule panel |
| `edit-form/configuration-section-shell/` | Read mode, ellipsis Edit, per-section Save/Cancel |
| `run-history/index.tsx` | Runs filtered to `currentTask.id` from `dumps/runs` |

## Related files

- `src/packages/ptasks/`
- `src/packages/task-detail-page/`
- `src/packages/runs/`
- `src/store/current/currentTask.ts`
- `src/store/dumps/tasks.ts`, `runs.ts`
- `src/store/builders/schedulerBuilder.ts`
- `src/store/thunks/tasks/`, `runs/`
