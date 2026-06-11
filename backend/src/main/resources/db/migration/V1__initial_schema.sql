-- V1__initial_schema.sql
-- JavaCup initial database schema.
-- Source of truth: Architecture & Design v1.0 §2 (Database Schema).
-- Run by Flyway on first application start. Never edit this file after it
-- has been applied — create V2__*.sql for any changes.

-- ── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- provides gen_random_uuid()

-- ── profiles ───────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with application-specific data.
-- user_id is a FK to auth.users(id) managed by Supabase.
CREATE TABLE profiles (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID        NOT NULL UNIQUE,
    display_name     VARCHAR(50) NOT NULL,
    background_tag   VARCHAR(30) NOT NULL
                                 CHECK (background_tag IN (
                                     'career_switcher', 'student',
                                     'self_taught', 'cs_graduate', 'professional'
                                 )),
    bio              TEXT,
    current_stage    INTEGER,
    is_admin         BOOLEAN     NOT NULL DEFAULT FALSE,
    onboarding_done  BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── roadmap_stages ─────────────────────────────────────────────────────────
CREATE TABLE roadmap_stages (
    id           SERIAL      PRIMARY KEY,
    title        VARCHAR(100) NOT NULL,
    description  TEXT         NOT NULL,
    order_index  INTEGER      NOT NULL UNIQUE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Add FK from profiles.current_stage now that roadmap_stages exists.
ALTER TABLE profiles
    ADD CONSTRAINT fk_profiles_current_stage
    FOREIGN KEY (current_stage) REFERENCES roadmap_stages(id) ON DELETE SET NULL;

-- ── roadmap_topics ─────────────────────────────────────────────────────────
CREATE TABLE roadmap_topics (
    id           SERIAL       PRIMARY KEY,
    stage_id     INTEGER      NOT NULL REFERENCES roadmap_stages(id) ON DELETE CASCADE,
    title        VARCHAR(100) NOT NULL,
    description  TEXT,
    priority     VARCHAR(20)  NOT NULL CHECK (priority IN ('essential', 'important', 'optional')),
    order_index  INTEGER      NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── resources ──────────────────────────────────────────────────────────────
CREATE TABLE resources (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id       INTEGER      NOT NULL REFERENCES roadmap_topics(id) ON DELETE CASCADE,
    title          VARCHAR(200) NOT NULL,
    url            VARCHAR(500) NOT NULL,
    resource_type  VARCHAR(20)  NOT NULL
                                CHECK (resource_type IN (
                                    'documentation', 'video', 'article', 'book', 'tool'
                                )),
    description    TEXT,
    is_approved    BOOLEAN      NOT NULL DEFAULT FALSE,
    suggested_by   UUID,        -- FK to auth.users — set null if account deleted
    approved_by    UUID,        -- FK to auth.users — set null if account deleted
    vote_score     INTEGER      NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── resource_votes ─────────────────────────────────────────────────────────
CREATE TABLE resource_votes (
    id           UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id  UUID       NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id      UUID       NOT NULL,  -- FK to auth.users
    vote         SMALLINT   NOT NULL CHECK (vote IN (1, -1)),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (resource_id, user_id)
);

-- ── discussions ────────────────────────────────────────────────────────────
CREATE TABLE discussions (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID,        -- SET NULL if account deleted
    title        VARCHAR(200) NOT NULL,
    body         TEXT         NOT NULL,
    category     VARCHAR(30)  NOT NULL
                              CHECK (category IN (
                                  'roadmap_help', 'career_switch',
                                  'interview_prep', 'java_concepts', 'resources'
                              )),
    vote_score   INTEGER      NOT NULL DEFAULT 0,
    reply_count  INTEGER      NOT NULL DEFAULT 0,
    is_pinned    BOOLEAN      NOT NULL DEFAULT FALSE,
    is_flagged   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── discussion_replies ─────────────────────────────────────────────────────
CREATE TABLE discussion_replies (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id    UUID        NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    user_id          UUID,       -- SET NULL if account deleted
    parent_reply_id  UUID        REFERENCES discussion_replies(id) ON DELETE SET NULL,
    body             TEXT        NOT NULL,
    vote_score       INTEGER     NOT NULL DEFAULT 0,
    is_flagged       BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── discussion_votes ───────────────────────────────────────────────────────
CREATE TABLE discussion_votes (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id  UUID        NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    user_id        UUID        NOT NULL,
    vote           SMALLINT    NOT NULL CHECK (vote IN (1, -1)),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (discussion_id, user_id)
);

-- ── recommendations ────────────────────────────────────────────────────────
CREATE TABLE recommendations (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id     INTEGER     NOT NULL REFERENCES roadmap_topics(id) ON DELETE CASCADE,
    user_id      UUID,       -- SET NULL if account deleted
    body         TEXT        NOT NULL,
    vote_score   INTEGER     NOT NULL DEFAULT 0,
    is_flagged   BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── recommendation_votes ───────────────────────────────────────────────────
CREATE TABLE recommendation_votes (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id  UUID        NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    user_id            UUID        NOT NULL,
    vote               SMALLINT    NOT NULL CHECK (vote IN (1, -1)),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (recommendation_id, user_id)
);

-- ── weekly_digests ─────────────────────────────────────────────────────────
CREATE TABLE weekly_digests (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by    UUID         NOT NULL,  -- FK to auth.users (admin)
    title         VARCHAR(200) NOT NULL,
    body          TEXT         NOT NULL,
    digest_type   VARCHAR(20)  NOT NULL
                               CHECK (digest_type IN ('news', 'spotlight', 'poll', 'debate')),
    is_published  BOOLEAN      NOT NULL DEFAULT FALSE,
    published_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── polls ──────────────────────────────────────────────────────────────────
CREATE TABLE polls (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    digest_id   UUID         NOT NULL REFERENCES weekly_digests(id) ON DELETE CASCADE,
    question    VARCHAR(300) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── poll_options ───────────────────────────────────────────────────────────
CREATE TABLE poll_options (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id      UUID         NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_text  VARCHAR(200) NOT NULL,
    order_index  INTEGER      NOT NULL,
    vote_count   INTEGER      NOT NULL DEFAULT 0
);

-- ── poll_votes ─────────────────────────────────────────────────────────────
CREATE TABLE poll_votes (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id     UUID        NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id   UUID        NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (poll_id, user_id)
);

-- ── flags ──────────────────────────────────────────────────────────────────
CREATE TABLE flags (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id   UUID,       -- SET NULL if account deleted
    content_type  VARCHAR(20) NOT NULL
                              CHECK (content_type IN (
                                  'discussion', 'reply', 'recommendation', 'resource'
                              )),
    content_id    UUID        NOT NULL,
    reason        TEXT,
    is_resolved   BOOLEAN     NOT NULL DEFAULT FALSE,
    resolved_by   UUID,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── email_subscriptions ────────────────────────────────────────────────────
CREATE TABLE email_subscriptions (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Seed: 5 roadmap stages (PRD MVP v2 §F-01) ──────────────────────────────
INSERT INTO roadmap_stages (title, description, order_index) VALUES
    ('Foundations',
     'Java syntax, data types, control flow, methods, and the development environment. The absolute starting point.',
     1),
    ('Core Java',
     'Collections, exceptions, I/O, generics, and the Java standard library. What every employer will test you on.',
     2),
    ('OOP and Design',
     'Object-oriented principles, design patterns, and writing code that is maintainable at scale.',
     3),
    ('Java Ecosystem',
     'Spring Boot, build tools (Maven/Gradle), testing (JUnit, Mockito), and databases with JPA.',
     4),
    ('Employment Ready',
     'Interview preparation, portfolio projects, Git workflows, and what the hiring process actually looks like.',
     5);
