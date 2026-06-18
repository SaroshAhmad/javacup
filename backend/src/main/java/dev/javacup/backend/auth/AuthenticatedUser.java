package dev.javacup.backend.auth;

import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Helpers for reading the authenticated Supabase user from the security context.
 *
 * After Spring validates the bearer token, the principal is a {@link Jwt}. Supabase
 * puts the user's UUID in the standard `sub` claim — that UUID is the value every
 * table references as `user_id`, so it is our canonical "who is calling" identifier.
 */
public final class AuthenticatedUser {

    private AuthenticatedUser() {
    }

    /** The Supabase user UUID from the validated JWT's `sub` claim. */
    public static UUID id(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new IllegalStateException("No authenticated JWT principal present");
        }
        return UUID.fromString(jwt.getSubject());
    }

    /** The user's email from the JWT, if present (Supabase includes it). */
    public static String email(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getClaimAsString("email");
        }
        return null;
    }
}
