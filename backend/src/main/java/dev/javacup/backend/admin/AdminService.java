package dev.javacup.backend.admin;

import dev.javacup.backend.auth.AuthenticatedUser;
import dev.javacup.backend.user.ProfileRepository;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Central admin-authorization check, reusable by ANY feature that needs admin-only
 * actions (topics now; resources, moderation, etc. later).
 *
 * Admin status is read from the database (profiles.is_admin) on each call, not from the
 * JWT — so granting or revoking admin takes effect immediately, with no token refresh.
 * The per-request lookup is a single indexed query and negligible in cost.
 *
 * Usage in an admin endpoint:
 *     adminService.requireAdmin(authentication);   // throws 403 if not an admin
 *     ... proceed ...
 */
@Service
public class AdminService {

    private final ProfileRepository profileRepository;

    public AdminService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    /** True if the authenticated user has a profile with is_admin = true. */
    @Transactional(readOnly = true)
    public boolean isAdmin(Authentication authentication) {
        UUID userId = AuthenticatedUser.id(authentication);
        return profileRepository.findByUserId(userId)
                .map(p -> p.isAdmin())
                .orElse(false);
    }

    /** Throws AdminAccessException (403) unless the authenticated user is an admin. */
    @Transactional(readOnly = true)
    public void requireAdmin(Authentication authentication) {
        if (!isAdmin(authentication)) {
            throw new AdminAccessException();
        }
    }
}
