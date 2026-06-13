# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in JavaCup, please report it privately. **Do not
open a public issue** for security problems, as that exposes the vulnerability before it
can be fixed.

Email **security@javacup.dev** with:

- A description of the vulnerability.
- Steps to reproduce it.
- The potential impact, if known.

You can expect an acknowledgement within a few days. Once the issue is confirmed and
fixed, we are happy to credit you for the discovery if you wish.

## Scope

This policy covers the JavaCup application: the Spring Boot backend, the React frontend,
and their configuration. Vulnerabilities in third-party services we depend on (Supabase,
Neon, Render, Vercel, Resend) should be reported to those providers directly, though we
appreciate a heads-up so we can mitigate on our side.

## Good practices already in place

- All secrets are stored as environment variables, never committed to source.
- All traffic is served over HTTPS.
- Authentication is delegated to Supabase; the backend only validates signed JWTs.
- The admin flag is set by direct database update only — there is no API path to elevate privileges.

See [docs/authentication.md](./docs/authentication.md) and the security checklist in the
architecture documentation for more detail.
