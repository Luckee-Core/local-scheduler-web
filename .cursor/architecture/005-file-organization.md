# 005 - File Organization (Next.js)

## Status
Accepted

## Context
This ADR defines the required file-organization standard for **nextjs-template** so module ownership, exports, and imports stay predictable as the codebase grows.

## Decision

### 1) Canonical folder structure
All feature and shared code must follow this structure under `src/`:

```text
src/
  app/          # Next.js routes, layouts, pages, and route handlers
  packages/     # feature packages (domain-owned code)
  components/   # cross-feature reusable UI
  utils/        # pure utilities and shared constants
  store/        # Redux store, slices, thunks (no selector modules)
  config/       # route path constants (e.g. ORDER_DETAIL_PAGE_PATH)
  api/          # API clients/services and API contracts
  model/        # persisted entity types (one file per table entity)
```

✅ **Do**
```text
src/app/orders/page.tsx
src/packages/orders/table/index.tsx
src/packages/orders/table/row/index.tsx
src/components/Button.tsx
```

❌ **Don't**
```text
src/features/orders/*
src/lib/helpers/*
src/state/*
src/services/*
```

---

### 2) One function or component per file; kebab-case filenames
Each file must own one primary function or one primary React component. File names use **kebab-case** (e.g. `load-jobs-thunk.ts`, `job-list-row.tsx`).

✅ **Do**
```ts
// src/utils/string/truncate.ts
export const truncate = (value: string, max: number): string =>
  value.length <= max ? value : `${value.slice(0, max)}…`;
```

```ts
// src/store/thunks/crm/load-jobs-thunk.ts
export const loadJobsThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch) => {
  // ...
};
```

❌ **Don't**
```ts
// src/utils/orders/format-order-label.ts — table-specific (belongs in packages/orders/)
export const formatOrderLabel = (order: Order) => `${order.id} — ${order.status}`;
```

---

### 3) Use `type`, not `interface`
For consistency across the codebase, use `type` for object shapes and props.

✅ **Do**
```ts
type Job = {
  id: string;
  title: string;
};
```

❌ **Don't**
```ts
interface Job {
  id: string;
  title: string;
}
```

---

### 4) Package root is `index.tsx` only; optional barrels inside subfolders
The package entry is **`index.tsx`** with `export const FeatureName`. Do **not** add a root `index.ts` barrel alongside a separate `{feature}.tsx`. Optional `index.ts` barrels are allowed **inside** subfolders only (e.g. `header/buttons/index.ts`).

✅ **Do**
```text
src/packages/orders/
  index.tsx              # export const Orders
  table/
    index.tsx
    row/index.tsx
  header/
    index.tsx
    buttons/refresh-orders/index.tsx
```

❌ **Don't**
```text
src/packages/orders/
  OrdersPage.tsx
  index.ts               # root barrel + separate component file
  ui/
    OrdersTable.tsx
  actions/
    row-actions/index.tsx
```

---

### 5) Named exports only
Use named exports everywhere. `default` exports are forbidden **except** Next.js page files (`src/app/**/page.tsx`), where Next.js requires default export.

✅ **Do**
```ts
// src/components/Button.tsx
type ButtonProps = {
  label: string;
};

export const Button = ({ label }: ButtonProps) => {
  return <button className={styles.button}>{label}</button>;
};
```

```tsx
// src/app/orders/page.tsx (allowed default export)
import { OrdersPage } from "@/packages/orders";

export default function Page() {
  return <OrdersPage />;
}
```

❌ **Don't**
```ts
// src/components/Button.tsx
export default function Button() {
  return <button>Save</button>;
}
```

---

### 6) App routes: static detail pages, not `[id]`

List and detail are separate **static** routes. Detail identity comes from Redux `current*`, not from dynamic segments.

✅ **Do**
```text
src/app/orders/page.tsx
src/app/order-detail-page/page.tsx
src/config/routes.ts          # ORDERS_PATH, ORDER_DETAIL_PAGE_PATH
src/packages/order-detail-page/
```

❌ **Don't**
```text
src/app/orders/[id]/page.tsx
src/app/orders/[orderId]/page.tsx
```

See [008 – Detail page routing](./008-detail-page-routing.md).

---

### 7) Import boundaries
Consumers must import through folder barrels (`index.ts`) instead of deep relative paths.

✅ **Do**
```ts
import { OrdersPage } from "@/packages/orders";
import { Button } from "@/components";
import { truncate } from "@/utils/string";
```

❌ **Don't**
```ts
import { OrdersPage } from "@/packages/orders/OrdersPage";
import { Button } from "@/components/Button";
import { formatOrderLabel } from "@/utils/orders/format-order-label";
```

## Consequences
- Clear ownership per folder (`app`, `packages`, `components`, `utils`, `store`, `api`).
- Smaller files with one responsibility and easier review/testing.
- Stable import paths through barrel exports.
- Consistent export style with fewer refactor breaks.
