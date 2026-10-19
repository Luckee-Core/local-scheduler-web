# 016 – Interactive cursor affordance

## Status

Accepted

## Context

ADR 003 forbids inline styles but does not require pointer affordance on clickable UI. Inconsistent `cursor-pointer` makes controls look inert, especially for `appearance-none` selects and full-width list row buttons.

## Decision

1. **In scope:** `<button>`, `<Link>`, `<select>` used as a picker, sidebar nav links, breadcrumb controls, tab bars, list/table row click targets, and icon buttons.
2. **Required:** Enabled interactive elements include `cursor-pointer` in their `styles.*` template literal (className).
3. **Disabled:** When `disabled` is used, include `disabled:cursor-not-allowed` on the same style token.
4. **Out of scope:** Read-only text, non-clickable rows, and documented preview-pane runtime `style` exceptions in product ADRs.
5. **Rows:** `{collection}/row/index.tsx` — `styles.rowButton` (or equivalent) must include `cursor-pointer`.
6. **Do not** set cursor via global element selectors in `globals.css`.

## Related

- [003 – Styling rules](./003-styling-rules.md)
- [012 – Package form inputs](./012-package-form-inputs.md)
- [015 – No SQL functions](./015-no-sql-functions.md)
