# 011 – Domain models (`src/model`)

## Status

Accepted

## Context

Persisted table entities are the contract between Express JSON and Redux dumps. They must not live in API clients, packages, or store slices. ADR 005 omitted `src/model` from the canonical tree.

## Decision

### 1) Canonical location

Every **table / API entity** lives in **`src/model/{entity}.ts`** (singular kebab-case). Related status unions and `EMPTY_*` defaults stay in that file.

```text
src/model/
  job.ts
  order.ts
  index.ts
```

Import through the barrel:

```ts
import type { Order } from '@/model';
```

### 2) What belongs here

- Row shapes returned by Express (`id`, timestamps, table columns)
- Status / category unions for those rows
- Empty defaults used by `current*` slices

### 3) What does **not** belong here

| Location | Types |
|----------|--------|
| `src/api/{domain}/client.ts` | HTTP write payloads (`CreateXPayload`, `UpdateXPayload`) |
| `src/packages/{feature}/` | View rows (`OrderTableRow`) |
| `src/store/` | Redux-only UI state (wizard steps) |
| `src/api/types.ts` | Transport (`ApiResponse`) |

### 4) Alignment with Express

Express stores the same entities in `src/model/` (companion template ADR 008). File names and row fields should match.

## Consequences

- New tables: add `src/model/{entity}.ts` and export from `src/model/index.ts` **before** dumps, API clients, or packages.
- Do not add `src/data/` to this Next.js app.

## Related

- [005 – File organization](./005-file-organization.md)
- [004 – API integration](./004-api-integration.md)
- [001 – Redux patterns](./001-redux-patterns.md)
