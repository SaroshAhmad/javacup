# API Reference

The JavaCup REST API is served by the Spring Boot backend. All endpoints are prefixed with
`/api/v1`. Request and response bodies are JSON. Standard HTTP status codes are used.

## Authentication levels

| Level | Meaning |
| --- | --- |
| Public | No token required. Anyone can call it. |
| Required | A valid Supabase JWT must be sent in the `Authorization: Bearer <token>` header. |
| Admin | A valid JWT **and** the caller's profile must have `is_admin = true`. |

How tokens are validated is described in [authentication.md](./authentication.md).

## Profiles

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/profiles/{userId}` | Public | Get a user's public profile, including background tag and contribution history. |
| PUT | `/profiles/me` | Required | Update own display name, bio, background tag, or current stage. |
| POST | `/profiles/me/onboarding` | Required | Record completion of an onboarding step. |

## Roadmap

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/roadmap` | Public | All five stages with their topics and priority labels. |
| GET | `/roadmap/stages/{stageId}` | Public | Full stage detail with topics and linked resources. |
| GET | `/roadmap/topics/{topicId}` | Public | Topic detail with resources and top recommendations. |

## Resources

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/resources?topicId=&type=&sort=&page=&size=` | Public | List resources. Filter by topic and type. Sort by `votes` or `newest`. |
| GET | `/resources/{id}` | Public | A single resource with vote score and metadata. |
| POST | `/resources` | Required | Submit a resource suggestion. Queued for admin approval. |
| POST | `/resources/{id}/votes` | Required | Cast or toggle a vote. Body: `{ "vote": 1 }` or `{ "vote": -1 }`. |
| DELETE | `/resources/{id}/votes` | Required | Remove own vote. |
| PUT | `/admin/resources/{id}/approve` | Admin | Approve a suggested resource and make it public. |

## Discussions

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/discussions?category=&sort=&page=&size=` | Public | List discussions. Sort by `votes`, `newest`, or `active`. |
| GET | `/discussions/{id}` | Public | A discussion with replies and vote counts. |
| POST | `/discussions` | Required | Create a discussion. Title minimum 10 characters. |
| PUT | `/discussions/{id}` | Required | Edit own discussion body within 24 hours of posting. |
| DELETE | `/discussions/{id}` | Required | Delete own discussion. Admin can delete any. |
| POST | `/discussions/{id}/votes` | Required | Vote on a discussion. Call again to toggle. |
| GET | `/discussions/{id}/replies` | Public | All replies, threaded up to two levels. |
| POST | `/discussions/{id}/replies` | Required | Reply to a discussion or to another reply. |
| POST | `/discussions/{id}/flag` | Required | Flag a discussion for admin review. |
| PUT | `/admin/discussions/{id}/pin` | Admin | Pin or unpin a discussion within its category. |

## Recommendations

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/recommendations?topicId=&sort=&page=&size=` | Public | List recommendations for a topic, sorted by trust score. |
| POST | `/recommendations` | Required | Create a recommendation on a topic. |
| POST | `/recommendations/{id}/votes` | Required | Vote on a recommendation. Call again to toggle. |
| POST | `/recommendations/{id}/flag` | Required | Flag a recommendation for admin review. |

> Note: an earlier draft included `POST /recommendations/{id}/comments`. There is no
> comments table in the schema, so this endpoint is **not** part of the current API. It is
> tracked as a known gap in [database.md](./database.md).

## Search

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/search?q=&type=&page=&size=` | Public | Full-text search across discussions, recommendations, resources, and roadmap. Returns vote score and author background tag. |

## Weekly digest

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/digest?page=&size=` | Public | List published digests, newest first. |
| GET | `/digest/{id}` | Public | A single digest, with its poll if present. |
| POST | `/admin/digest` | Admin | Create a digest draft. |
| PUT | `/admin/digest/{id}/publish` | Admin | Publish a digest. Triggers the email notification to subscribers. |
| POST | `/polls/{pollId}/votes` | Required | Vote on a digest poll. One vote per user. |
| GET | `/polls/{pollId}/results` | Public | Current poll results with per-option counts. |

## Email subscriptions

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/subscriptions` | Required | Subscribe to the weekly digest. |
| DELETE | `/subscriptions` | Required | Unsubscribe. Sets `is_active = false`. |

## Admin

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/admin/flags?resolved=false` | Admin | List unresolved flags for review. |
| PUT | `/admin/flags/{id}/resolve` | Admin | Mark a flag resolved, optionally acting on the content. |
| GET | `/admin/metrics` | Admin | Basic platform metrics: users, posts, votes, search usage. |

## Health

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | Public | Returns 200 OK when the service is running. Used by Render's health check. |

## A note on this document

This is a hand-maintained reference. As the API grows, the intention is to generate
interactive documentation from the code itself using OpenAPI (Swagger). That decision is
recorded in the [decision log](./decisions/README.md) as a future improvement, not yet
implemented.
