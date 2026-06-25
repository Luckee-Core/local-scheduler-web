# 009 — Redux dashboard breadcrumbs and sidebar

## Status

Accepted

## Context

The starter template ships a bare centered page with no dashboard chrome. Local Scheduler needs a sidebar, header breadcrumbs, and route-aware navigation matching Lead Studio / Luckee Hub patterns.

## Decision

1. **`AppLayout`** (`src/components/app-layout/index.tsx`) — sidebar toggle (localStorage), `useLayoutEffect` → `BreadcrumbBuilderActions.reset()` on pathname change, composes header + main content.
2. **`breadcrumbBuilder` slice** — serializable `base` + `segments` only (`src/model/breadcrumb/`). No functions in Redux state.
3. **Resolution** — `useResolvedDashboardBreadcrumbs()` maps builder state to `AppLayoutBreadcrumb[]` for the header.
4. **Nav fallback** — when builder trail is empty, `resolveDefaultNavBreadcrumbForPathname` maps pathname → single crumb from sidebar links.
5. **Static trail helpers** — `src/utils/dashboard-breadcrumbs/` with greenfield names (`setStaticDashboardBreadcrumbTrail`, `useRegisterStaticDashboardBreadcrumbs`). No "legacy" prop-migration layer.
6. **Sidebar** — `getSchedulerSidebarSections()` defines v1 links: Tasks (`/`), Run history (`/runs`).

## Consequences

- Feature UI in `src/packages/` never renders sidebar or breadcrumbs; routes wrap packages in `<AppLayout>`.
- List pages rely on nav fallback; detail pages (v2) register trails explicitly.
- Entity switcher kinds are out of scope v1.

## Related files

- `src/components/app-layout/`
- `src/components/app-layout-header/`
- `src/components/sidebar/`
- `src/components/navigation/`
- `src/store/builders/breadcrumbBuilder.ts`
- `src/utils/dashboard-breadcrumbs/`
