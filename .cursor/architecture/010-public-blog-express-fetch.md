# 010 - Public content reads from Express (Server Components + client hydrate)

## Status

Accepted

## Context

[004-api-integration.md](./004-api-integration.md) states that client components should not call API modules directly and should use Redux thunks for outbound HTTP. Marketing and content sites also need **read-only, cacheable** fetches for published content from a companion **Express** server (e.g. `GET /api/blogs`, `GET /api/blogs/by-slug`).

## Decision

1. **Server Components** (and **Route Handlers** if added later) may import and call functions under **`src/api/`** (e.g. `src/api/blogs/`, `src/api/public-blogs/`) to `fetch` published content from Express. These functions return plain data (arrays, objects, or `null`) and use `next: { revalidate: … }` where appropriate. No secrets are sent; only published content is exposed by Express.

2. **Client-only list views** load through a **Redux thunk** (e.g. `hydrateBlogsListThunk`) that calls the API module and may persist the result in **`localStorage`** with a TTL **only when the list is non-empty** (empty API responses are not long-cached so the first publish shows up on the next visit). List rows live in a **`dumps/`** slice (`Record<id, Item>`); load status in a **`builders/`** slice. Do not fetch the list ad hoc from client components.

3. **Mutations and authenticated flows** continue to use **Redux thunks** + `src/api/**` patterns from ADR 004.

## Consequences

- **Detail/article pages** should use Server Components + direct API fetch (ISR as configured). **Index lists** are client views fed by Redux + cache where applicable.
- Do not use public read endpoints for draft or admin content; CMS traffic uses Express **`/api/data/**`** with **`Authorization: Bearer <SERVICES_API_KEY>`**, never from the public site bundle.

## References

- Prior art: luckee-marketing `src/api/public-blogs/*`, philly-ai-consulting `src/api/blogs/*`
