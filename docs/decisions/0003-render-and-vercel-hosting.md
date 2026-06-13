# 3. Host the backend on Render and the frontend on Vercel

**Status:** Accepted
**Date:** 2026-06
**Deciders:** Ahmad Sarosh

## Context

The two halves of JavaCup have very different hosting needs. The frontend is a static React
bundle that should be served fast from a CDN with preview deployments per pull request. The
backend is a long-running Spring Boot JVM process that needs a container-style host. We
needed hosting for both, on free tiers, with automatic deploys from GitHub.

## Decision

- **Frontend on Vercel.** Vercel is purpose-built for frontend frameworks, auto-detects Vite, deploys to a global CDN, and creates a preview URL for every pull request. It deploys automatically on push to `main`.
- **Backend on Render.** Render runs the Spring Boot JAR as a web service, reads a `render.yaml` for configuration, and deploys on push to `main` (triggered via a deploy hook from GitHub Actions).

Both connect directly to the GitHub repository, so deployment is "merge to `main`".

## Consequences

**Positive**
- Each half is hosted on a platform suited to it, both with generous free tiers.
- Deploys are automatic and require no manual steps.
- Vercel's per-PR previews make frontend review easy.
- Custom domains (`javacup.dev` → Vercel, `api.javacup.dev` → Render) are straightforward.

**Negative**
- Render's free tier sleeps after 15 minutes of inactivity, so the first request after idle is slow (a cold start). Acceptable pre-launch; may need a paid tier or a keep-warm ping later.
- Two hosting providers means two dashboards and two sets of environment variables to manage. Documented in [configuration.md](../configuration.md).

## Alternatives considered

- **One platform for both** (for example, both on Render). Possible, but Vercel's frontend tooling and preview deployments are materially better than a generic host's, and the split costs little.
- **A single VPS running everything.** Cheaper at scale but far more operational work — manual deploys, OS patching, web server config. The wrong trade-off for a solo developer pre-launch.
