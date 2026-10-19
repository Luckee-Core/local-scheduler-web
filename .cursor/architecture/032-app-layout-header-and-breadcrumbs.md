# 032 – App layout header and breadcrumbs

## Status

Accepted

## Context

Operators need consistent chrome across list and detail screens: sidebar visibility, navigation context, and readable entity names in the breadcrumb trail.

## Decision

1. **Header** — `src/components/app-layout-header/` sits beside the main content; includes sidebar toggle (`PanelLeft` / `PanelLeftClose` from lucide-react), not a separate bordered “Dashboard” chip.

2. **Breadcrumb trail** — Plain text links and separators; show **full** entity names (no truncation for long task titles). Redux-driven trails and nav fallback are documented in [009 – Dashboard breadcrumbs and sidebar](./009-redux-dashboard-breadcrumbs-and-sidebar.md).

3. **Sidebar** — `src/components/sidebar/` uses light gray border / active nav styling consistent with list pages (see ops-tracker visual parity).

## Related

- [007 – Starter template layout](./007-starter-template-layout.md)
- [008 – Detail page routing](./008-detail-page-routing.md)
- [009 – Dashboard breadcrumbs and sidebar](./009-redux-dashboard-breadcrumbs-and-sidebar.md)
