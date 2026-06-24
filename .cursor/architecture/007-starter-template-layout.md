# 007 - Starter Template Layout

## Status

Accepted

## Context

**nextjs-template** ships as a bare App Router app: `src/app`, a minimal `src/store`, `src/utils`, and `src/components` (e.g. `ReduxProvider`). Product apps add `src/packages/`, `src/api/`, and the full Redux layers from [001 – Redux patterns](./001-redux-patterns.md). Agents need a clear growth path without violating ADRs on day one.

## Decision

### 1) Shipped layout (day one)

```text
src/
  app/              # routes, layout, globals.css
  store/            # store.ts, reducer.ts, appSlice.ts
  components/       # cross-app client wrappers
  utils/            # pure helpers
```

- `ReduxProvider` wraps the tree in `layout.tsx`.
- One slice (`appSlice`) is allowed until you introduce entity catalogs.

### 2) Add `src/packages/{feature}/` for feature UI

Move feature-specific screens and components out of `src/app/` page files:

```text
src/packages/home/
  HomeHero.tsx
  index.ts
```

Keep `src/app/*/page.tsx` thin—compose packages only.

### 3) Grow Redux per [001](./001-redux-patterns.md)

| Step | Add |
|------|-----|
| List/catalog data | `src/store/dumps/{entity}.ts` |
| Detail screen | `src/store/current/{entity}.ts` |
| UI flags / wizards | `src/store/builders/{feature}Builder.ts` |
| Async loads | `src/store/thunks/...` with `AppThunk<Promise<200 \| 400 \| 500>>` |

Refactor `appSlice` into domain slices rather than expanding one god slice.

### 4) Add `src/api/` before client HTTP

- All browser-side HTTP goes through **`src/api/{domain}/`** and **thunks** ([004 – API integration](./004-api-integration.md)).
- Published marketing/content reads may use Server Components + `src/api/` per [010](./010-public-blog-express-fetch.md).

### 5) Conventions from day one

- **Redux:** no selector modules; identity `useAppSelector` + `useMemo` ([001](./001-redux-patterns.md) §5).
- **Utils:** only generic capability folders under `src/utils/` ([006](./006-constants-utilities.md)).
- **Detail screens:** static `*-detail-page` routes, not `[id]` ([008](./008-detail-page-routing.md)).

### 6) ESLint

Use root **`eslint.config.mjs`** with `eslint-config-next` flat config. Run `npm run lint` (`eslint .`).

## Consequences

- New repos may temporarily violate “dumps/current/builders” until the first entity ships—that is expected for the starter only.
- Pair with **express-server-template** using ADR 010 and §8 of ADR 004 when adding a backend.

## References

- Repository root `README.md` — run instructions and folder summary.
