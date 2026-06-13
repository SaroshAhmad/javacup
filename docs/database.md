# Database Schema

PostgreSQL 15, hosted on Neon. The schema is created and versioned by Flyway — the single
source of truth is `backend/src/main/resources/db/migration/V1__initial_schema.sql`. This
document describes that schema in human-readable form. If the two ever disagree, the
migration is correct and this document is wrong.

## Conventions

- UUID primary keys use `gen_random_uuid()` (from the `pgcrypto` extension). Sequence keys use `SERIAL`.
- All timestamps are `TIMESTAMPTZ DEFAULT NOW()`.
- Foreign keys within this database cascade on delete unless stated otherwise.

## The user identity model — read this first

Authentication is handled by Supabase, whose `auth.users` table lives in a **separate
database**. Because of that, **no application table has a foreign-key constraint to the
users table** — a cross-database foreign key is not possible.

Every column that identifies a user (`user_id`, `suggested_by`, `approved_by`,
`created_by`, `reporter_id`, `resolved_by`) holds the Supabase user UUID as a plain `UUID`
value with **no FK constraint**. The integrity of that link is enforced in application
code, not by the database.

> The original Phase 2 design described these as foreign keys to a `users` table. The built
> schema deliberately does not implement them as constraints, for the reason above. This
> document follows the built schema. See
> [decisions/0001-supabase-for-auth.md](./decisions/0001-supabase-for-auth.md).

The one place the schema *does* model user data is the `profiles` table, which extends the
Supabase user with application-specific fields.

## Tables

The schema has 16 application tables. They fall into five groups.

### Identity and roadmap

#### profiles
Extends a Supabase auth user with application data. One row per user.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| user_id | UUID | NOT NULL, UNIQUE | Supabase auth UUID (no FK — see above) |
| display_name | VARCHAR(50) | NOT NULL | Public name |
| background_tag | VARCHAR(30) | NOT NULL, CHECK | `career_switcher` · `student` · `self_taught` · `cs_graduate` · `professional` |
| bio | TEXT | | Optional |
| current_stage | INTEGER | FK → roadmap_stages(id), ON DELETE SET NULL | Stage the user is on |
| is_admin | BOOLEAN | NOT NULL, default FALSE | Founder/admin flag |
| onboarding_done | BOOLEAN | NOT NULL, default FALSE | |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, default NOW() | |

#### roadmap_stages
The five top-level stages of the roadmap. Seeded by the migration.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | SERIAL | PK | |
| title | VARCHAR(100) | NOT NULL | e.g. Foundations |
| description | TEXT | NOT NULL | |
| order_index | INTEGER | NOT NULL, UNIQUE | 1 = first |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |

#### roadmap_topics
Topics within a stage.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | SERIAL | PK | |
| stage_id | INTEGER | NOT NULL, FK → roadmap_stages(id), ON DELETE CASCADE | |
| title | VARCHAR(100) | NOT NULL | |
| description | TEXT | | |
| priority | VARCHAR(20) | NOT NULL, CHECK | `essential` · `important` · `optional` |
| order_index | INTEGER | NOT NULL | Order within the stage |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, default NOW() | |

### Resources

#### resources
Curated learning resources attached to a topic. Admin-approved before public visibility.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| topic_id | INTEGER | NOT NULL, FK → roadmap_topics(id), ON DELETE CASCADE | |
| title | VARCHAR(200) | NOT NULL | |
| url | VARCHAR(500) | NOT NULL | |
| resource_type | VARCHAR(20) | NOT NULL, CHECK | `documentation` · `video` · `article` · `book` · `tool` |
| description | TEXT | | |
| is_approved | BOOLEAN | NOT NULL, default FALSE | Admin approval gate |
| suggested_by | UUID | | Supabase UUID, nullable (no FK) |
| approved_by | UUID | | Supabase UUID, nullable (no FK) |
| vote_score | INTEGER | NOT NULL, default 0 | Cached vote total |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |

#### resource_votes
One vote per user per resource.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| resource_id | UUID | NOT NULL, FK → resources(id), ON DELETE CASCADE | |
| user_id | UUID | NOT NULL | Supabase UUID (no FK) |
| vote | SMALLINT | NOT NULL, CHECK (vote IN (1, -1)) | |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |
| | | UNIQUE (resource_id, user_id) | One vote per user per resource |

### Discussions

#### discussions
Top-level community threads.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| user_id | UUID | | Author, Supabase UUID, nullable (no FK) |
| title | VARCHAR(200) | NOT NULL | Min 10 chars enforced in the API |
| body | TEXT | NOT NULL | Markdown supported |
| category | VARCHAR(30) | NOT NULL, CHECK | `roadmap_help` · `career_switch` · `interview_prep` · `java_concepts` · `resources` |
| vote_score | INTEGER | NOT NULL, default 0 | Cached |
| reply_count | INTEGER | NOT NULL, default 0 | Cached |
| is_pinned | BOOLEAN | NOT NULL, default FALSE | |
| is_flagged | BOOLEAN | NOT NULL, default FALSE | |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, default NOW() | |

#### discussion_replies
Replies, supporting nesting up to two levels (enforced in the API).

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| discussion_id | UUID | NOT NULL, FK → discussions(id), ON DELETE CASCADE | |
| user_id | UUID | | Author, Supabase UUID, nullable (no FK) |
| parent_reply_id | UUID | FK → discussion_replies(id), ON DELETE SET NULL | Self-reference for nesting |
| body | TEXT | NOT NULL | Markdown supported |
| vote_score | INTEGER | NOT NULL, default 0 | Cached |
| is_flagged | BOOLEAN | NOT NULL, default FALSE | |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, default NOW() | |

#### discussion_votes
One vote per user per discussion.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| discussion_id | UUID | NOT NULL, FK → discussions(id), ON DELETE CASCADE | |
| user_id | UUID | NOT NULL | Supabase UUID (no FK) |
| vote | SMALLINT | NOT NULL, CHECK (vote IN (1, -1)) | |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |
| | | UNIQUE (discussion_id, user_id) | |

### Recommendations

#### recommendations
Per-topic advice. The `vote_score` here is the trust signal that ranks recommendations.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| topic_id | INTEGER | NOT NULL, FK → roadmap_topics(id), ON DELETE CASCADE | |
| user_id | UUID | | Author, Supabase UUID, nullable (no FK) |
| body | TEXT | NOT NULL | Markdown supported |
| vote_score | INTEGER | NOT NULL, default 0 | Cached — this is the trust score |
| is_flagged | BOOLEAN | NOT NULL, default FALSE | |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, default NOW() | |

#### recommendation_votes
One vote per user per recommendation.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| recommendation_id | UUID | NOT NULL, FK → recommendations(id), ON DELETE CASCADE | |
| user_id | UUID | NOT NULL | Supabase UUID (no FK) |
| vote | SMALLINT | NOT NULL, CHECK (vote IN (1, -1)) | |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |
| | | UNIQUE (recommendation_id, user_id) | |

### Digest, polls, and moderation

#### weekly_digests
Admin-authored digest entries.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| created_by | UUID | NOT NULL | Admin Supabase UUID (no FK) |
| title | VARCHAR(200) | NOT NULL | |
| body | TEXT | NOT NULL | Markdown supported |
| digest_type | VARCHAR(20) | NOT NULL, CHECK | `news` · `spotlight` · `poll` · `debate` |
| is_published | BOOLEAN | NOT NULL, default FALSE | |
| published_at | TIMESTAMPTZ | | Set on publish |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, default NOW() | |

#### polls
A poll attached to a digest.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| digest_id | UUID | NOT NULL, FK → weekly_digests(id), ON DELETE CASCADE | |
| question | VARCHAR(300) | NOT NULL | |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |

#### poll_options
The choices for a poll.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| poll_id | UUID | NOT NULL, FK → polls(id), ON DELETE CASCADE | |
| option_text | VARCHAR(200) | NOT NULL | |
| order_index | INTEGER | NOT NULL | |
| vote_count | INTEGER | NOT NULL, default 0 | Cached |

#### poll_votes
One vote per user per poll.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| poll_id | UUID | NOT NULL, FK → polls(id), ON DELETE CASCADE | |
| option_id | UUID | NOT NULL, FK → poll_options(id), ON DELETE CASCADE | |
| user_id | UUID | NOT NULL | Supabase UUID (no FK) |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |
| | | UNIQUE (poll_id, user_id) | |

#### flags
Polymorphic moderation reports. `content_id` points at a row in one of several tables,
identified by `content_type`. It is polymorphic, so it has no FK constraint.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| reporter_id | UUID | | Supabase UUID, nullable (no FK) |
| content_type | VARCHAR(20) | NOT NULL, CHECK | `discussion` · `reply` · `recommendation` · `resource` |
| content_id | UUID | NOT NULL | Polymorphic — no FK |
| reason | TEXT | | |
| is_resolved | BOOLEAN | NOT NULL, default FALSE | |
| resolved_by | UUID | | Admin Supabase UUID, nullable (no FK) |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |

#### email_subscriptions
Digest subscription, one per user.

| Column | Type | Constraint | Notes |
| --- | --- | --- | --- |
| id | UUID | PK, default `gen_random_uuid()` | |
| user_id | UUID | NOT NULL, UNIQUE | Supabase UUID (no FK) |
| email | VARCHAR(255) | NOT NULL | |
| is_active | BOOLEAN | NOT NULL, default TRUE | |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() | |

## Cached counters

Several tables carry denormalized counters: `vote_score` on resources, discussions,
replies, and recommendations; `reply_count` on discussions; `vote_count` on poll options.
These are caches that must be kept in step with the underlying vote and reply rows.

How they are kept correct (database trigger versus application logic in a transaction) is
an application-layer decision recorded as an open item in
[decisions/README.md](./decisions/README.md). Whichever mechanism is used, every write to a
vote or reply must update the corresponding cached counter in the same transaction so the
two never drift.

## Known gaps

These exist in the schema or were implied by earlier design and are tracked for later:

- **Recommendation comments.** An earlier API draft referenced commenting on recommendations, but there is no `recommendation_comments` table. Either the table is added in a future migration or the endpoint is dropped. Tracked, not yet decided.
- **Full-text search.** The search feature implies fast text search, but there is no `tsvector` column or GIN index yet. A future migration will add these when search is built.
