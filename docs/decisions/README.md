# Architecture Decision Records

An Architecture Decision Record (ADR) captures a single significant technical decision:
what was decided, why, and what the trade-offs were. They exist so that anyone — including
future you — can understand *why* the system is the way it is, without having to ask or
reverse-engineer it.

Each record is short and immutable. We do not edit a decision after it is accepted; if we
later change our minds, we write a new ADR that supersedes the old one and mark the old one
as superseded. The history is the point.

## Format

Every ADR has the same shape: a status, the context that forced a decision, the decision
itself, and the consequences (good and bad). They are numbered in the order they were made.

## Log

| # | Decision | Status |
| --- | --- | --- |
| [0001](./0001-supabase-for-auth.md) | Use Supabase for authentication | Accepted |
| [0002](./0002-neon-for-database.md) | Use Neon for the PostgreSQL database | Accepted |
| [0003](./0003-render-and-vercel-hosting.md) | Host backend on Render, frontend on Vercel | Accepted |
| [0004](./0004-flyway-for-migrations.md) | Use Flyway for database migrations | Accepted |

## Writing a new ADR

Copy the structure of an existing record. Give it the next number, set the status to
`Proposed`, and open it in a pull request. Once agreed, change the status to `Accepted` and
merge. Keep it to one page — an ADR that needs more than that is probably two decisions.
