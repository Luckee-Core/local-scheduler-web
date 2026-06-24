# Next.js Template

Bare Next.js app with **src/app**, **src/store**, and **src/utils**. Redux and Tailwind are wired; no entity/dashboard/API code.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture & agent rules

Follow **`.cursor/rules/AGENTS.md`** and **`.cursor/architecture/`**.

| Rule | Summary |
|------|---------|
| Redux | **Zero selector functions** — `useAppSelector((s) => s.slice)` only; derive with `useMemo` |
| Routes | **No `[id]`** — use static `/entity-detail-page` + `current*` in Redux |
| Utils | **Generic** helpers (`date/`, `string/`) — not table-specific formatters |

## Layout

- **src/app** — routes and layout
- **src/store** — Redux (store, reducer, one minimal slice)
- **src/utils** — shared utilities
- **src/components** — shared UI (e.g. ReduxProvider)

## As GitHub template

Repo → Settings → General → check **Template repository**. Then use as `GITHUB_TEMPLATE_WEB` when creating new web repos from the panel.
