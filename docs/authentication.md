# Authentication

Authentication is handled entirely by Supabase Auth. The Spring Boot backend never stores
passwords or manages sessions — it only validates the JWT that Supabase issues. The reasons
for this split are recorded in
[decisions/0001-supabase-for-auth.md](./decisions/0001-supabase-for-auth.md).

## Email and password registration

1. The user submits email and password on the registration form.
2. The React client calls `supabase.auth.signUp({ email, password })`.
3. Supabase sends a confirmation email.
4. The user clicks the link; Supabase marks the email verified.
5. Supabase issues a JWT access token and a refresh token to the client.
6. The Supabase JS library stores the session.
7. The client calls `POST /api/v1/profiles/me` to create the profile row in Neon.
8. Spring Boot validates the JWT, extracts the user UUID, and creates the profile.
9. The user is redirected into onboarding (step 1: choose a background tag).

## Google OAuth registration

1. The user clicks "Sign in with Google".
2. The client calls `supabase.auth.signInWithOAuth({ provider: 'google' })`.
3. The user is redirected to Google's consent screen.
4. Google redirects back with an auth code.
5. Supabase exchanges the code for a JWT access token and refresh token.
6. The client checks whether a profile exists (`GET /api/v1/profiles/me`).
7. If none exists, the client creates one (`POST /api/v1/profiles/me`).
8. The user lands on onboarding (new) or the dashboard (returning).

## How Spring Boot validates a token

Every protected endpoint runs through a custom JWT filter in the Spring Security chain:

1. The request arrives with an `Authorization: Bearer <token>` header.
2. The filter extracts the token.
3. The filter verifies the token signature using the Supabase JWT secret.
4. The filter checks expiry and rejects expired tokens with `401 Unauthorized`.
5. The filter extracts the user UUID from the token's `sub` claim.
6. If the endpoint needs admin rights, the filter loads the profile to check `is_admin`.
7. The filter sets the authentication in the Spring Security context.
8. The request proceeds to the controller with the authenticated user available.

## Important: the JWT secret and Supabase's signing-key change

The validation above relies on Supabase's **legacy JWT secret** — a single shared HMAC
secret used to sign and verify tokens. This is the model the backend is built for, and the
secret is provided to the backend as the `SUPABASE_JWT_SECRET` environment variable.

Supabase now defaults **new projects to asymmetric JWT signing keys**, where verification
uses a public key fetched from a JWKS endpoint rather than a shared secret. JavaCup's
project still has the legacy secret active and uses it. Two consequences follow:

- The legacy secret is found in the Supabase dashboard under **Project Settings → API → JWT Keys → Legacy JWT Secret**, not under the newer signing-keys section.
- **Do not rotate or revoke the legacy secret** until the backend is migrated to verify asymmetric signing keys via JWKS. Doing so would break token validation for every user.

Migrating the backend to the signing-key model is a known future task, not part of the MVP.

## Secret handling

The Supabase JWT secret is never committed to source. It is provided as the
`SUPABASE_JWT_SECRET` environment variable — locally via `backend/.env`, and in production
via Render's environment panel. See [configuration.md](./configuration.md).
