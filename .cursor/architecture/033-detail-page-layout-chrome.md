# 033 – Detail page layout chrome

## Status

Accepted

## Context

Scheduler detail screens should match list/dashboard table framing and use the full content width. Action controls in panel headers must not be clipped by panel shells.

## Decision

1. **Shared styles** — `src/components/detail-page-styles.ts` exports `detailPageStyles` (page, panel, panelHeader, panelBody, buttons, field labels) for task detail, task create, and related packages.

2. **Full width** — All scheduler routes (`/`, `/runs`, `/task-detail-page`, `/task-create-page`) use `AppLayout` with no centered `max-w-*` column. Breadcrumbs follow [032](./032-app-layout-header-and-breadcrumbs.md).

3. **Summary panel** — Top of task detail is a summary `detailPageStyles.panel`: `panelHeader` with title/meta on the left and primary actions on the right (enable, run now, delete). Read-only fields in `panelBody`; configuration edits in a lower panel (`edit-form`).

4. **Panels** — Outer panel uses `overflow-visible` so controls are not clipped; tables keep `overflow-x-auto` on inner scroll wrappers only.

## Related

- [002 – Component composition](./002-component-composition.md)
- [013 – Scheduler dashboard UI](./013-scheduler-dashboard-ui.md)
