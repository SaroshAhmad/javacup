# Deployment

JavaCup deploys automatically on merge to `main`. There are no manual production
deployments — merging to `main` is the deploy action.

## What deploys where

| Service | Trigger | What happens |
| --- | --- | --- |
| Vercel (frontend) | Push to `main` | Vercel builds the React app (`npm run build`) and deploys to its CDN. Live in roughly 90 seconds. Every pull request also gets a preview deployment. |
| Render (backend) | Push to `main` | Render builds the Spring Boot app (`mvn clean package`) and runs the JAR. Live in roughly 3 minutes. The free tier sleeps after 15 minutes idle, so the first request after idle is slow (a cold start). |
| Neon (database) | Manual only | Migrations are applied by Flyway when the backend starts. The database itself is never redeployed. |
| Supabase (auth) | Manual only | Auth providers and settings are configured in the Supabase dashboard. |
| Umami (analytics) | Runs continuously on Render | Deployed once as a separate Render service. |

## The CI/CD pipeline

Two GitHub Actions workflows drive this:

- **`ci.yml`** runs on every push (except to `main`) and every pull request. It builds and checks both backend and frontend. This is the gate that keeps broken code out of `main`.
- **`deploy.yml`** runs on push to `main`. It triggers the Render deploy via a deploy hook. Vercel deploys on its own, watching the repository directly.

## Database migrations

Migrations are managed by Flyway and run automatically when the backend boots. The rules:

- Each change is a new versioned file: `V<n>__<description>.sql` in `backend/src/main/resources/db/migration/`.
- **Never edit a migration that has already been applied.** Once applied anywhere, it is frozen. Write a new migration instead.
- Migrations are forward-only. To reverse something, write a new migration that undoes it.
- Always have a database backup before applying a migration in production (Neon supports point-in-time recovery — enable it).

The reasoning behind choosing Flyway is in
[decisions/0004-flyway-for-migrations.md](./decisions/0004-flyway-for-migrations.md).

## Custom domains

| Domain | Points to |
| --- | --- |
| `javacup.dev` | Vercel (frontend) |
| `api.javacup.dev` | Render (backend) |

Both are configured by adding the DNS records each provider specifies at the domain
registrar.

## Rolling back

If a deploy breaks production:

1. **Frontend (Vercel).** Open the Vercel dashboard, find the previous good deployment, and promote it to production. Vercel keeps every past deployment, so rollback is instant.
2. **Backend (Render).** Open the Render dashboard and redeploy the previous successful build, or revert the breaking commit on `main` and let the pipeline redeploy.
3. **Database.** If a migration caused the problem, do **not** try to edit it. Write a new migration that corrects the state, and restore from a Neon backup if data was affected. This is why backups before migrations are non-negotiable.

The fastest general recovery is usually to revert the offending commit on `main`, which
triggers a fresh deploy of the last known-good state.

## Health check

Render is configured to poll `GET /api/v1/health`, which returns `200 OK` when the service
is up. If it stops responding, Render considers the service unhealthy.
