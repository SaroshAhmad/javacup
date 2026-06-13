# 1. Use Supabase for authentication

**Status:** Accepted
**Date:** 2026-06
**Deciders:** Ahmad Sarosh

## Context

JavaCup needs user accounts with email/password sign-up and Google sign-in. Authentication
is security-critical, easy to get wrong, and not where a solo founder should spend scarce
time. Passwords must be hashed correctly, tokens issued and rotated, OAuth flows handled,
confirmation emails sent, and sessions managed safely.

The backend is Spring Boot. The obvious "default" path would be to build auth directly into
Spring Security — managing a password table, issuing our own JWTs, and wiring up an OAuth
client. That is a large amount of sensitive code to write, test, and maintain, and any
mistake in it is a direct security liability.

We needed to decide whether to build authentication ourselves or delegate it to a managed
provider.

## Decision

We will use **Supabase Auth** as the identity provider. Supabase handles registration,
email confirmation, Google OAuth, password hashing, and token issuance. It issues a JWT to
the client on sign-in.

Spring Boot does **not** manage passwords or sessions. It only **validates** the JWT that
Supabase issues, on every protected endpoint, via a custom filter in the Spring Security
chain. The user's identity is the UUID in the token's `sub` claim.

Application data lives in a separate database (Neon — see ADR 0002). The Supabase user
UUID is stored on application rows as a plain `UUID` value. It is **not** a foreign key,
because the auth users live in a different database and a cross-database foreign key is not
possible. That integrity is enforced at the application layer instead.

## Consequences

**Positive**
- No password or session-management code to write, secure, or maintain.
- Email/password, email confirmation, and Google OAuth work out of the box.
- Free tier covers 50,000 monthly active users — far beyond launch needs.
- The client uses Supabase's own JS library for session storage and token refresh.

**Negative**
- An external dependency sits on the critical path of every login.
- Token validation in Spring Boot depends on the Supabase **legacy JWT secret** (a shared HMAC secret). Supabase now defaults new projects to asymmetric signing keys, so the legacy secret must be located and kept active; it must not be rotated or revoked until the backend is migrated to verify signing keys via JWKS. This is a known future migration.
- User identity spans two systems (Supabase for auth, Neon for profile data), so the link between them is an application-level invariant, not a database constraint.

## Alternatives considered

- **Build auth in Spring Security ourselves.** Rejected: too much security-critical surface area for a solo project, and no real upside over a managed provider at this stage.
- **Auth0 / Clerk / Firebase Auth.** Reasonable managed options, but Supabase also provides Postgres-friendly tooling and storage we use elsewhere, and its free tier is generous. Consolidating on one provider reduced moving parts.
