package dev.javacup.backend.user;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Body for POST /api/v1/onboarding. The user's name comes from their Supabase identity
 * (JWT / metadata), not from here, so onboarding only collects the background tag and an
 * optional display name override. background_tag is required (profiles.background_tag is
 * NOT NULL).
 */
public record OnboardingRequest(
        @NotNull(message = "Background tag is required.")
        BackgroundTag backgroundTag,

        @Size(max = 50, message = "Display name must be 50 characters or fewer.")
        String displayName
) {
}
