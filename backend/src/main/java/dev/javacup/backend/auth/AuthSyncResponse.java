package dev.javacup.backend.auth;

import java.util.UUID;

/**
 * Result of the post-login handshake. Tells the frontend who it is authenticated as,
 * whether onboarding still needs to happen, and whether the user is an admin (so the
 * client can reveal admin-only UI without a separate request).
 */
public record AuthSyncResponse(
        UUID userId,
        boolean hasProfile,
        boolean onboardingRequired,
        boolean isAdmin
) {
}
