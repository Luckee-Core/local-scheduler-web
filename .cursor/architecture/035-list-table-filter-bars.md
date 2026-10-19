# 035 – List and dashboard table filter bars

## Status

Accepted

## Context

When scheduler tables gain search or narrowing, they should match the same filter and table chrome as ops-tracker list pages. Table framing applies even before filter bars exist.

## Decision

1. **Filter section placement** — Any package-owned **data table** (tasks dashboard, `/runs`, task detail run history) renders a filter strip **immediately above** the table body when filters are added.

2. **Visual contract** — Use `listFilterBarStyles` from `src/components/list-filter-bar-styles.ts` for the outer `section` (and shared search input tokens where applicable). Table chrome uses `listTableStyles` from `src/components/list-table-styles.ts`: `border-gray-300`, `bg-gray-100` headers, `text-xs` cells.

3. **Package layout** — List packages add `filters/index.tsx` and optional `filters/inputs/{field}/index.tsx` per [012](./012-package-form-inputs.md). Pure filter functions live in `src/packages/{feature}/filter-*.ts` (not `src/utils/{table}/`).

4. **Redux** — When list filters are added, persist them in `src/store/filters/` slices. Use **live** `searchTerm` updates unless a product ADR requires an Apply button.

5. **Exclusions** — KPI-only strips that are not data tables.

## Related

- [005 – File organization](./005-file-organization.md)
- [012 – Package form inputs](./012-package-form-inputs.md)
- [013 – Scheduler dashboard UI](./013-scheduler-dashboard-ui.md)
- [033 – Detail page layout chrome](./033-detail-page-layout-chrome.md)
