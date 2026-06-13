# JavaCup Documentation

Technical documentation for JavaCup. Everything here describes how the system actually
works — it is kept next to the code and versioned with it, so when the code changes the
docs change in the same pull request.

## Reference

| Document | What it covers |
| --- | --- |
| [architecture.md](./architecture.md) | System overview, the three tiers, external services, data flow |
| [database.md](./database.md) | Full schema: every table, column, constraint, and relationship |
| [erd.md](./erd.md) | Entity-relationship diagram |
| [api.md](./api.md) | REST API reference: every endpoint, auth level, and contract |
| [authentication.md](./authentication.md) | How Supabase auth and JWT validation work end to end |
| [configuration.md](./configuration.md) | Every environment variable and where to obtain it |
| [deployment.md](./deployment.md) | How the app is deployed, and how to roll back |

## Decisions

The [decision log](./decisions/README.md) records significant technical choices and the
reasoning behind them — why Supabase, why Neon, why Render, why Flyway.

## Source-of-truth rules

When documents disagree, this is the order of authority:

1. **The running code and migrations** — `backend/src/main/resources/db/migration/` is the ground truth for the schema. If a doc and a migration disagree, the migration wins and the doc is wrong.
2. **The Brand Identity document** — the source of truth for all design tokens (colours, fonts, spacing, components).
3. **The Architecture & Design document** — the source of truth for everything else not covered above.

These reference docs are written to match (1) and (2). Where the original Phase 2
Architecture document described something that the built code later changed, these docs
follow the code and note the difference.
