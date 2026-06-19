package dev.javacup.backend.auth;

import java.util.UUID;

/**
 * Result of the post-login handshake. Tells the frontend who it is authenticated as and
 * whether onboarding still needs to happen (i.e. no complete profile exists yet).
 */
public record AuthSyncResponse(
        UUID userId,
        boolean hasProfile,
        boolean onboardingRequired
) {
}
