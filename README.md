<div align="center">

# ☕ JavaCup

**Clarity for the Java journey.**

A community-driven platform where Java learners get community-validated roadmaps,
voted advice, and curated free resources. Not another tutorial site — a place where
community experience becomes ranked, trusted signal.

[Live site](https://javacup.dev) · [Documentation](./docs/README.md) · [Contributing](./CONTRIBUTING.md)

</div>

---

## What is JavaCup?

There is too much Java content online and no trusted way to navigate it. JavaCup does
not add more content — it organises what already exists into a clear path, validated by
people who have walked it.

The core idea is **voting as trust**. A career switcher who landed a job 18 months ago is
more useful to a beginner than a tutorial with two million views. JavaCup turns that lived
experience into a ranked, searchable signal.

Three things make up the product:

- **Roadmap** — five stages from Foundations to Employment Ready, each with topics and curated resources.
- **Community guidance** — discussions and per-topic recommendations, ranked by community votes.
- **Weekly digest** — a curated summary of what matters, with polls and debates.

## Tech stack

| Layer | Technology | Hosting |
| --- | --- | --- |
| Frontend | React 18, Vite, Tailwind CSS | Vercel |
| Backend | Spring Boot 3, Java 21, Maven | Render |
| Database | PostgreSQL 15 (Flyway migrations) | Neon |
| Auth | Supabase (email + Google OAuth, JWT) | Supabase |
| Email | Resend | — |
| Analytics | Umami (self-hosted) | Render |

A full breakdown lives in [docs/architecture.md](./docs/architecture.md).

## Repository structure

This is a monorepo. Backend and frontend are versioned together.

```
javacup/
├── backend/      Spring Boot API (Java 21, Maven)
├── frontend/     React app (Vite, Tailwind)
├── docs/         Technical documentation
└── .github/      CI workflows, issue and PR templates
```

## Quick start

You need [Java 21](https://adoptium.net/), [Maven 3.9+](https://maven.apache.org/),
and [Node.js 20+](https://nodejs.org/) installed.

### Backend

```bash
cd backend
cp .env.example .env          # fill in your values — see docs/configuration.md
mvn spring-boot:run           # starts on http://localhost:8080
```

### Frontend

```bash
cd frontend
cp .env.example .env.local    # fill in your values — see docs/configuration.md
npm install
npm run dev                   # starts on http://localhost:5173
```

Every environment variable and where to obtain it is documented in
[docs/configuration.md](./docs/configuration.md).

## Documentation

All technical documentation lives in [`docs/`](./docs/README.md). Start there for
architecture, the database schema, the API reference, and the decision log.

## Contributing

JavaCup is built in public. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the branching
model, commit conventions, and pull request process. By participating you agree to the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## License

Released under the [MIT License](./LICENSE).
