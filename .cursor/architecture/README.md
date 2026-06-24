# Architecture Documentation

Architecture Decision Records (ADRs) for **nextjs-template** and Next.js apps created from it.

## Why ADRs?

ADRs keep implementation consistent by documenting:

- **What** standard we follow
- **Why** we chose it
- **How** to apply it in everyday development

## ADR index (on-disk)

### Shared conventions (001–008, 010)

1. [001 – Redux patterns](./001-redux-patterns.md) — Flat layers, manual thunks, **zero selector functions**.
2. [002 – Component composition](./002-component-composition.md) — Thin app routes, `src/packages/`.
3. [003 – Styling rules](./003-styling-rules.md) — Styles object + template literals.
4. [004 – API integration](./004-api-integration.md) — `src/api/` clients, thunks only.
5. [005 – File organization](./005-file-organization.md) — kebab-case, static detail routes.
6. [006 – Constants and utilities](./006-constants-utilities.md) — Generic formatters only (not table-specific).
7. [007 – Starter template layout](./007-starter-template-layout.md) — Minimal shipped store and folder growth path.
8. [008 – Detail page routing](./008-detail-page-routing.md) — `{entity}-detail-page`, no `[id]` routes.
10. [010 – Public content reads from Express](./010-public-blog-express-fetch.md) — Server Component reads + Redux list hydration.

## How to use

1. Open the ADR most relevant to your feature.
2. Follow the approved patterns in implementation.
3. Add new ADRs here whenever architectural decisions change—and **update this index** when you do.
