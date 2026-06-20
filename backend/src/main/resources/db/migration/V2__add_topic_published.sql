-- Adds a draft/publish flag to roadmap topics.
--
-- Topics are composed in the admin UI as drafts and only appear on the public roadmap
-- once published. New topics default to draft (published = false); any topics that already
-- existed before this migration are set to published = true so nothing currently live
-- disappears.

ALTER TABLE roadmap_topics
    ADD COLUMN published BOOLEAN NOT NULL DEFAULT FALSE;

-- Existing rows were created before drafts existed and are considered live.
UPDATE roadmap_topics SET published = TRUE;
