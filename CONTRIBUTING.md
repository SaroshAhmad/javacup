# Contributing to JavaCup

Thanks for your interest in JavaCup. This document explains how the project is built,
how to set up your environment, and how to get a change merged. It is the source of
truth for the development workflow.

By participating, you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Before you start

JavaCup is a monorepo with two halves:

- `backend/` — Spring Boot 3, Java 21, Maven
- `frontend/` — React 18, Vite, Tailwind CSS

You need Java 21, Maven 3.9+, and Node.js 20+. Full setup instructions are in the
[README](./README.md) and every environment variable is documented in
[docs/configuration.md](./docs/configuration.md).

## Branching model

JavaCup uses a simple two-branch model. It is deliberately lightweight for a small team.

| Branch | Purpose | Accepts direct pushes? |
| --- | --- | --- |
| `main` | Production. Every merge here deploys live. | No — pull request only |
| `develop` | Integration branch for day-to-day work. | Yes |

Feature work happens on short-lived branches created from `develop`:

```bash
git checkout develop
git pull
git checkout -b feat/roadmap-stage-detail
```

When the work is ready, open a pull request **into `develop`**. Once `develop` is stable
and ready to ship, it is merged into `main` via pull request, which triggers deployment.

### Branch naming

Use a type prefix and a short, hyphenated description:

| Prefix | For |
| --- | --- |
| `feat/` | A new feature |
| `fix/` | A bug fix |
| `docs/` | Documentation only |
| `refactor/` | Code change that neither fixes a bug nor adds a feature |
| `chore/` | Tooling, config, dependencies |
| `test/` | Adding or fixing tests |

Examples: `feat/vote-button`, `fix/jwt-expiry-handling`, `docs/api-reference`.

## Commit messages

JavaCup follows [Conventional Commits](https://www.conventionalcommits.org/). The format
is:

```
<type>: <short summary in present tense>
```

The type matches the branch prefixes above (`feat`, `fix`, `docs`, `refactor`, `chore`,
`test`). Keep the summary under ~70 characters and write it as an instruction, not a past
event.

```
feat: add optimistic UI to vote button
fix: reject expired Supabase tokens with 401
docs: document Flyway migration workflow
chore: bump Spring Boot to 3.5.15
```

Why this matters: a consistent history can be read at a glance and can later generate a
changelog automatically.

## Pull request process

1. Branch off `develop` and make your change.
2. Make sure both halves still build:
   - Backend: `cd backend && mvn clean package`
   - Frontend: `cd frontend && npm run build`
3. Push your branch and open a pull request into `develop`.
4. Fill in the pull request template — what changed, why, and how you tested it.
5. CI must pass. The pipeline builds backend and frontend on every pull request.
6. Once reviewed and green, the PR is merged.

Keep pull requests small and focused. One logical change per PR is far easier to review
than a large mixed one.

## Coding standards

The detailed conventions live alongside the code, but the essentials:

**Backend (Java)**
- Package root is `dev.javacup.backend`.
- Follow standard Java conventions: `PascalCase` types, `camelCase` members, constructor injection over field injection.
- Never put secrets in source. Use environment variables — see [docs/configuration.md](./docs/configuration.md).

**Frontend (React)**
- Every colour, font, spacing, radius, and shadow value must come from a design token defined in the Brand Identity system. No hardcoded hex values or arbitrary pixel values.
- Components are function components with hooks.
- Path alias `@/` points at `src/`.

The design tokens are the contract. If a value you need is not a token, the fix is to add
it to the design system first — not to hardcode it.

## Database changes

The schema is managed by Flyway. The rules are strict and exist to keep every environment
in sync:

- Every schema change is a new migration file: `V<n>__<description>.sql`.
- **Never edit a migration that has already been applied.** Once `V1` has run anywhere, it is frozen. Make a `V2`.
- Migrations are forward-only. To undo something, write a new migration that reverses it.

See [docs/database.md](./docs/database.md) for the full schema and
[docs/decisions/0004-flyway-for-migrations.md](./docs/decisions/0004-flyway-for-migrations.md)
for why this approach was chosen.

## Reporting bugs and proposing features

Use the issue templates: [bug report](./.github/ISSUE_TEMPLATE/bug_report.md) or
[feature request](./.github/ISSUE_TEMPLATE/feature_request.md). For anything affecting the
MVP scope, check the PRD first — new features outside MVP scope need to be flagged and
agreed before they are built.

## Questions

Open a discussion or an issue. No question is too basic — that is the whole point of
JavaCup.
