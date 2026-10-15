# Architecture Documentation

Architecture Decision Records (ADRs) for **nextjs-template** and Next.js apps created from it.

## ADR index (on-disk)

1. [001 – Redux patterns](./001-redux-patterns.md) — Flat layers, manual thunks, **zero selector functions**.
2. [002 – Component composition](./002-component-composition.md) — Thin app routes, `src/packages/`.
3. [003 – Styling rules](./003-styling-rules.md) — Styles object + template literals.
4. [004 – API integration](./004-api-integration.md) — `src/api/` clients, thunks only.
5. [005 – File organization](./005-file-organization.md) — kebab-case, static detail routes.
6. [006 – Constants and utilities](./006-constants-utilities.md) — Generic formatters only (not table-specific).
7. [007 – Starter template layout](./007-starter-template-layout.md) — Minimal shipped store and folder growth path.
8. [008 – Detail page routing](./008-detail-page-routing.md) — `{entity}-detail-page`, no `[id]` routes.
9. [009 – Dashboard breadcrumbs and sidebar](./009-redux-dashboard-breadcrumbs-and-sidebar.md) — `AppLayout`, sidebar, nav fallback.
10. [010 – Public content reads from Express](./010-public-blog-express-fetch.md) — Optional; unused unless blog added.
11. [011 – Domain models (`src/model`)](./011-domain-models.md) — persisted entity types.
12. [012 – Package form inputs](./012-package-form-inputs.md) — Task create/edit forms.
13. [013 – Scheduler dashboard UI](./013-scheduler-dashboard-ui.md) — `packages/ptasks/` table/row composition.
15. [015 – No SQL functions](./015-no-sql-functions.md) — this app does not own schema.

Stripe ADRs (014 in template) are **not applicable**.

## How to use

1. Open the ADR most relevant to your feature.
2. Follow the approved patterns in implementation.
3. Add new ADRs here whenever architectural decisions change—and **update this index** when you do.
