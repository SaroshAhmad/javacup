# 4. Use Flyway for database migrations

**Status:** Accepted
**Date:** 2026-06
**Deciders:** Ahmad Sarosh

## Context

The database schema will change many times over the life of the project. Those changes must
be applied consistently across every environment — local, CI, and production — and the
history of changes must be reproducible. Relying on Hibernate to auto-generate or update the
schema (`ddl-auto: update`) is convenient but dangerous: it is opaque, non-reproducible, and
can silently make destructive changes. A real project needs explicit, versioned, reviewable
migrations.

The original Phase 2 design left this open, naming "Flyway or Liquibase" without choosing.

## Decision

We will use **Flyway**. Schema changes are written as versioned SQL files named
`V<n>__<description>.sql` in `backend/src/main/resources/db/migration/`. Flyway runs them in
order when the backend starts, and records what has been applied in a
`flyway_schema_history` table.

Hibernate is set to `ddl-auto: validate` — it checks that the entities match the schema
Flyway produced, but never modifies the schema itself. Flyway owns the schema; Hibernate
only reads it.

The rules:

- Every change is a new migration file. The first, `V1__initial_schema.sql`, creates all 16 tables and seeds the five roadmap stages.
- A migration that has been applied anywhere is **frozen** — never edited. Corrections are made in a new, higher-numbered migration.
- Migrations are forward-only. To reverse a change, write a new migration that undoes it.

## Consequences

**Positive**
- The schema is reproducible from an empty database by replaying the migrations in order.
- Every change is an explicit, reviewable SQL file in version control.
- Local, CI, and production schemas stay identical.
- `ddl-auto: validate` catches drift between the JPA entities and the real schema at startup.

**Negative**
- Slightly more upfront effort than letting Hibernate manage the schema: every change must be written as a migration by hand.
- The "never edit an applied migration" rule requires discipline; a mistake in an applied migration must be fixed forward, not edited.

## Alternatives considered

- **Liquibase.** Equivalent capability; uses XML/YAML/JSON changelogs as well as SQL. Flyway's plain-SQL-first approach is simpler and more transparent for a SQL-comfortable solo developer.
- **Hibernate `ddl-auto: update`.** Rejected: not reproducible, not reviewable, and capable of silent or destructive schema changes. Acceptable for throwaway prototypes, not for a real database.
