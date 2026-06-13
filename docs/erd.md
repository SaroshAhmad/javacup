# Entity-Relationship Diagram

This is the entity-relationship diagram for the JavaCup database. It renders automatically
on GitHub. For the full column-level detail of each table, see [database.md](./database.md).

## Reading this diagram

- Solid lines are real foreign-key relationships enforced by the database.
- The Supabase `auth.users` table is shown for context but lives in a **separate database**. The dashed link to `profiles` is a **logical** link via the stored user UUID — it is not a database foreign key. Every other table that stores a user UUID has the same kind of logical, code-enforced link, omitted here to keep the diagram readable.

```mermaid
erDiagram
    auth_users ||..o| profiles : "logical link (no FK)"

    roadmap_stages ||--o{ roadmap_topics : has
    roadmap_stages ||--o{ profiles : "current stage"

    roadmap_topics ||--o{ resources : has
    roadmap_topics ||--o{ recommendations : has

    resources ||--o{ resource_votes : receives
    discussions ||--o{ discussion_replies : has
    discussions ||--o{ discussion_votes : receives
    discussion_replies ||--o{ discussion_replies : "nests (max 2)"

    recommendations ||--o{ recommendation_votes : receives

    weekly_digests ||--o{ polls : may_have
    polls ||--o{ poll_options : has
    polls ||--o{ poll_votes : receives
    poll_options ||--o{ poll_votes : "chosen in"

    auth_users {
        uuid id PK "managed by Supabase"
        varchar email
    }
    profiles {
        uuid id PK
        uuid user_id "Supabase UUID, unique"
        varchar display_name
        varchar background_tag
        int current_stage FK
        boolean is_admin
    }
    roadmap_stages {
        serial id PK
        varchar title
        int order_index
    }
    roadmap_topics {
        serial id PK
        int stage_id FK
        varchar title
        varchar priority
    }
    resources {
        uuid id PK
        int topic_id FK
        varchar title
        varchar resource_type
        boolean is_approved
        int vote_score
    }
    resource_votes {
        uuid id PK
        uuid resource_id FK
        uuid user_id "Supabase UUID"
        smallint vote
    }
    discussions {
        uuid id PK
        uuid user_id "Supabase UUID"
        varchar title
        varchar category
        int vote_score
        int reply_count
    }
    discussion_replies {
        uuid id PK
        uuid discussion_id FK
        uuid parent_reply_id FK
        uuid user_id "Supabase UUID"
        int vote_score
    }
    discussion_votes {
        uuid id PK
        uuid discussion_id FK
        uuid user_id "Supabase UUID"
        smallint vote
    }
    recommendations {
        uuid id PK
        int topic_id FK
        uuid user_id "Supabase UUID"
        int vote_score
    }
    recommendation_votes {
        uuid id PK
        uuid recommendation_id FK
        uuid user_id "Supabase UUID"
        smallint vote
    }
    weekly_digests {
        uuid id PK
        uuid created_by "Supabase UUID"
        varchar title
        varchar digest_type
        boolean is_published
    }
    polls {
        uuid id PK
        uuid digest_id FK
        varchar question
    }
    poll_options {
        uuid id PK
        uuid poll_id FK
        varchar option_text
        int vote_count
    }
    poll_votes {
        uuid id PK
        uuid poll_id FK
        uuid option_id FK
        uuid user_id "Supabase UUID"
    }
    email_subscriptions {
        uuid id PK
        uuid user_id "Supabase UUID, unique"
        varchar email
        boolean is_active
    }
    flags {
        uuid id PK
        uuid reporter_id "Supabase UUID"
        varchar content_type
        uuid content_id "polymorphic, no FK"
        boolean is_resolved
    }
```

The `email_subscriptions` and `flags` tables have no enforced foreign-key relationships to
other application tables (they link by user UUID and by polymorphic `content_id`
respectively), so they appear in the diagram as standalone entities.
