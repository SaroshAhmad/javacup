package dev.javacup.backend.roadmap;

/**
 * Priority of a roadmap topic. Values mirror the Postgres `topic_priority` enum exactly
 * (ESSENTIAL / IMPORTANT / OPTIONAL) — do not rename without a matching DB migration.
 */
public enum TopicPriority {
    ESSENTIAL,
    IMPORTANT,
    OPTIONAL
}
