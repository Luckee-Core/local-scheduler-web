# 006 - Constants & Utilities (Next.js)

## Status

Accepted

## Context

`src/utils/` holds **generic, cross-cutting helpers** (dates, strings, numbers). It is not a home for table- or entity-specific formatters tied to Redux dumps or API row shapes.

## Decision

### 1) What belongs in `src/utils/`

| ✅ Allowed (by **capability**, not table name) | Examples |
|------------------------------------------------|----------|
| Date/time | `format-date.ts`, `parse-iso-date.ts` |
| String | `truncate.ts`, `slugify.ts` |
| Number/currency | `format-currency.ts`, `clamp.ts` |
| Validation primitives | `is-email.ts` |
| Shared constants | `utils/date/constants.ts` — `MAX_PAGE_SIZE`, status codes |

Folders are named by **capability** (`date/`, `string/`, `number/`), **not** by database table or Redux slice (`jobs/`, `orders/`, `users/`).

### 2) What must NOT live in `src/utils/`

| ❌ Forbidden in `src/utils/` | Put it here instead |
|-----------------------------|-------------------|
| `format-job-status.ts`, `format-order-row.ts` | `src/packages/{feature}/` (colocated helper) or inline in the component |
| `build-job-table-columns.ts` | `src/packages/jobs/ui/` |
| `normalize-user-dto.ts` (single API entity) | `src/api/users/` or `src/packages/users/` |
| Redux access, hooks, `fetch` | thunks / `src/api/` |

**Test:** If the function only makes sense for one table or one screen, it is **not** a util.

### 3) Utility rules

1. Extract to `src/utils/{capability}/` when the same **generic** logic is used **2+ times** across features.
2. Constants live in `src/utils/{capability}/constants.ts`.
3. Functions must be **pure** — no React hooks, no Redux, no I/O.
4. One primary function per file; kebab-case filenames.
5. JSDoc on exported functions.

### Standard folder shape

```text
src/utils/
  date/
    format-date.ts
    constants.ts
    index.ts
  string/
    truncate.ts
    index.ts
```

## ✅ Good examples

```ts
// src/utils/date/format-date.ts

/**
 * Formats an ISO date for display in US locale.
 */
export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US');
```

```tsx
// src/packages/orders/ui/order-list-row.tsx
import { formatDate } from '@/utils/date';
import type { Order } from '../types';

type OrderListRowProps = { order: Order };

/**
 * Renders one order row (entity-specific copy stays in the package).
 */
export const OrderListRow = ({ order }: OrderListRowProps) => {
  const label = `${order.reference} — ${order.status}`;
  return (
    <tr>
      <td>{label}</td>
      <td>{formatDate(order.createdAt)}</td>
    </tr>
  );
};
```

## ❌ Bad examples

```ts
// src/utils/orders/format-order-status.ts  ❌ table-specific
export const formatOrderStatus = (order: Order) => `${order.id}: ${order.status}`;
```

```ts
// src/utils/jobs/build-job-row.ts  ❌ view-model for one screen
export const buildJobRow = (job: Job, companies: Record<string, Company>) => ({
  ...job,
  companyName: companies[job.companyId]?.name,
});
```

```ts
// src/app/api/orders/route.ts
import { useSelector } from 'react-redux'; // ❌ hooks in non-component code
```

## Pull request checklist

- [ ] `src/utils/` folders are capability-based (`date/`, `string/`), not table-based (`orders/`, `users/`)
- [ ] No entity/table-specific formatters under `src/utils/`
- [ ] Utilities are pure (no Redux, no hooks, no fetch)
- [ ] Repeated **generic** logic (2+ uses) extracted; screen-specific logic stays in `src/packages/`
