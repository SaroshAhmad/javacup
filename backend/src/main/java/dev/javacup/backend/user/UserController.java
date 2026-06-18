package dev.javacup.backend.user;

import dev.javacup.backend.auth.AuthenticatedUser;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Current-user endpoints. GET /api/v1/users/me returns the authenticated user's profile,
 * or a "not onboarded" marker if they have signed up but not yet completed onboarding.
 *
 * This is also the simplest end-to-end proof that JWT validation works: a valid Supabase
 * token resolves to a known user; an invalid/absent one is rejected by Spring Security
 * before reaching this method.
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final ProfileRepository profileRepository;

    public UserController(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {
        UUID userId = AuthenticatedUser.id(authentication);
        return profileRepository.findByUserId(userId)
                .map(MeResponse::of)
                .orElseGet(() -> MeResponse.notOnboarded(userId));
    }
}
