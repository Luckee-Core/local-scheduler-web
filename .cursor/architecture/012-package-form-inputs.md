# 012 – Package form inputs

## Status

Accepted

## Context

Package forms copied entity fields into `useState` and passed payloads into save thunks. That duplicated `current*` and hid validation errors. ADR 001 already stores the editing object in `current*` and UI flags in builders.

## Decision

### 1) One folder per field

```text
src/packages/{feature}/{form}/
  index.tsx
  inputs/
    {field}/index.tsx
```

Each field component:

- Reads **one** whole current slice: `useAppSelector((state) => state.currentJob)`
- Writes with `patchCurrentX({ field: value })`
- Does not take the field value as a prop

The form shell composes inputs and dispatches `saveXThunk()` with **no arguments**.

### 2) Hydrate current on open

- Create: `resetCurrentX()` (empty id)
- Edit: `setCurrentX(row)` (tables already do this)
- Snapshot-style screens: a mount thunk or `useEffect` copies today’s dump row (or `EMPTY_*` + defaults) into `current*`

**Modals take no props** — not the entity, not `isOpen`, not `onClose`. Visibility is `builder.isCreateOpen || current.id !== ''` (plus `isEditOpen` when that flag exists). Close dispatches `closeModal()` and `resetCurrentX()`. The package page renders `<JobFormModal />` only.

### 3) Save flags on the builder

Builders may hold `saveError: string` and `saveStatus: 'idle' | 'saving' | 'success' | 'error'`. Never store the entity there.

### 4) Current slices expose patch

```ts
patchCurrentJob: (state, action: PayloadAction<Partial<Job>>) => ({
  ...state,
  ...action.payload,
}),
```

### 5) Zero-arg save thunks

`saveXThunk()` reads `getState().current*` and branches on `id === ''` for create vs update. Returns `200 | 400 | 500`. On API failure, set `saveError` from `result.error.message`.

Related-row creates read **builder strings**, not a form payload object.

### 6) List tables

```text
src/packages/{feature}/{collection}/
  index.tsx
  row/index.tsx
```

Do not use a `*-table` suffix. Entity packages whose collection *is* the package use `table/row/`. The shell owns `<table>`, `<thead>`, empty state, and delete orchestration. `row/index.tsx` is one mapped `<tr>` and may take the row as a prop.

## Related

- [001 – Redux patterns](./001-redux-patterns.md)
- [002 – Component composition](./002-component-composition.md)
