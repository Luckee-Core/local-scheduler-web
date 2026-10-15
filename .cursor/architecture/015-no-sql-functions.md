# 015 – No SQL functions

## Status

Accepted

## Context

This Next.js app does not own the database schema. Companion Express or Python servers run migrations. SQL functions and triggers must not appear here either, so a copy-pasted migration cannot hide writes from `src/data/` on the server.

## Decision

1. Do not add `supabase/migrations`, `.sql` schema files, or `CREATE FUNCTION` / `CREATE TRIGGER` in this repo.
2. Table DDL belongs on the companion Express or Python server, which also forbids SQL functions (Express ADR 010, Python ADR 015).
3. `updated_at` and similar columns are set by that server's data layer, not by Postgres.

## Related

- [011 – Domain models](./011-domain-models.md)
