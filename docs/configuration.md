# Configuration

Every secret and environment-specific value is provided as an environment variable. Nothing
sensitive is ever committed to source. This document lists every variable, where it is used,
and where to obtain it.

## Backend (`backend/.env` locally, Render env panel in production)

| Variable | Purpose | Where to get it |
| --- | --- | --- |
| `DATABASE_URL` | JDBC connection string for Neon. Must start with `jdbc:postgresql://` and end with `?sslmode=require`. Credentials are **not** embedded here. | Neon dashboard → Connection Details, reformatted (see note below) |
| `DATABASE_USERNAME` | Database user. | Neon connection string (the part before `:` in the credentials) |
| `DATABASE_PASSWORD` | Database password. | Neon connection string (the part after `:` in the credentials) |
| `SUPABASE_JWT_SECRET` | Used by Spring Boot to verify JWT signatures. The **legacy** secret. | Supabase → Project Settings → API → JWT Keys → Legacy JWT Secret |
| `RESEND_API_KEY` | Sending transactional and digest email. | Resend dashboard → API Keys |
| `RESEND_FROM_EMAIL` | Verified sender address, e.g. `digest@javacup.dev`. | Your verified Resend domain |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile (`development` or `production`). | Set per environment |

### Important: the Neon connection string needs reformatting

Neon provides a connection string in libpq format:

```
postgresql://user:password@host/neondb?sslmode=require
```

Spring Boot's JDBC driver needs two changes:

1. Prefix it with `jdbc:` so the driver recognises it.
2. Remove the `user:password@` part from the URL and supply them as `DATABASE_USERNAME` and `DATABASE_PASSWORD` instead. The JDBC driver cannot parse credentials embedded in the URL — it misreads them as a port.

So the Neon string above becomes:

```
DATABASE_URL=jdbc:postgresql://host/neondb?sslmode=require
DATABASE_USERNAME=user
DATABASE_PASSWORD=password
```

The `application.yml` reads all three:

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
```

## Frontend (`frontend/.env.local` locally, Vercel env panel in production)

| Variable | Purpose | Where to get it |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL of the Spring Boot API. Local: `http://localhost:8080/api/v1`. Production: `https://api.javacup.dev/api/v1`. | Set per environment |
| `VITE_SUPABASE_URL` | Supabase project URL for the React client. | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key. Safe to expose in the browser. | Supabase → Project Settings → API |

## CI (GitHub Actions secrets)

The CI pipeline builds the backend with `mvn clean package -DskipTests`, which does not
touch the database, so no database secrets are needed in CI. Only the frontend build needs
secrets:

| Secret | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Frontend build |
| `VITE_SUPABASE_ANON_KEY` | Frontend build |
| `RENDER_DEPLOY_HOOK_URL` | Used by the deploy workflow to trigger a Render deploy on merge to main |

## Golden rules

- `.env` and `.env.local` are git-ignored and must never be committed.
- `.env.example` files **are** committed — they document the shape without the secret values.
- Production secrets live only in the Render and Vercel dashboards.
- If a secret is ever exposed (for example, pasted into a chat or a screenshot), rotate it: reset it at the provider, then update every place that holds it.
