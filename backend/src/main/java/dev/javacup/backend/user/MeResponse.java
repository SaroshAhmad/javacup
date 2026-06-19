package dev.javacup.backend.user;

import java.util.UUID;

/**
 * The current user's profile as returned by GET /api/v1/users/me. Null profile fields
 * (when onboarding is not yet done) are simply absent — the frontend keys off
 * onboardingRequired to decide whether to route into onboarding.
 */
public record MeResponse(
        UUID userId,
        boolean hasProfile,
        boolean onboardingRequired,
        String displayName,
        BackgroundTag backgroundTag,
        String bio,
        Integer currentStage,
        boolean admin
) {
    static MeResponse notOnboarded(UUID userId) {
        return new MeResponse(userId, false, true, null, null, null, null, false);
    }

    static MeResponse of(Profile p) {
        return new MeResponse(
                p.getUserId(),
                true,
                !p.isOnboardingDone(),
                p.getDisplayName(),
                p.getBackgroundTag(),
                p.getBio(),
                p.getCurrentStage(),
                p.isAdmin()
        );
    }
}
