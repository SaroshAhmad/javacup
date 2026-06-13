# 2. Use Neon for the PostgreSQL database

**Status:** Accepted
**Date:** 2026-06
**Deciders:** Ahmad Sarosh

## Context

JavaCup needs a relational database. The schema is relational by nature — users, posts,
votes, roadmap stages, and the foreign keys between them — so PostgreSQL is the obvious
engine. The remaining question was where to host it.

The constraints: it must have a usable free tier (the project is pre-revenue), it must be a
standard PostgreSQL that Spring Data JPA and Flyway can talk to without special handling,
and it should require minimal operational effort from a solo developer.

## Decision

We will host PostgreSQL 15 on **Neon**. Neon is serverless Postgres with a free tier,
standard connection strings, and point-in-time recovery. Spring Boot connects to it
directly using the standard PostgreSQL JDBC driver.

Authentication users are **not** stored here — they live in Supabase (ADR 0001). This
database holds only application data.

## Consequences

**Positive**
- Standard PostgreSQL: no vendor lock-in at the query or schema level. Flyway and JPA work without adaptation.
- Free tier is sufficient for launch.
- Serverless scaling and point-in-time recovery come built in.
- Region can be set close to the backend (London / eu-west-2) to keep latency low.

**Negative**
- Neon's connection string is in libpq format and needs reformatting for the JDBC driver: it must be prefixed with `jdbc:` and the embedded credentials must be split into separate username and password properties. This is documented in [configuration.md](../configuration.md) so it is not rediscovered each time.
- The free tier may cold-start or pause an idle database, adding latency to the first query after a quiet period.

## Alternatives considered

- **Supabase's own Postgres.** Supabase includes a Postgres database, and using it would consolidate providers. Rejected to keep application data under the application's direct control and avoid coupling business data to the auth provider — the same separation reasoning as ADR 0001.
- **Render Postgres.** Workable, but Neon's free tier and recovery features were stronger at decision time.
