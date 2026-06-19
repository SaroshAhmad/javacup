package dev.javacup.backend.user;

/**
 * A user's self-declared background, chosen during onboarding. Values mirror the
 * CHECK constraint on profiles.background_tag exactly — do not rename without a
 * matching DB migration.
 */
public enum BackgroundTag {
    career_switcher,
    student,
    self_taught,
    cs_graduate,
    professional
}
