package dev.javacup.backend.auth;

import dev.javacup.backend.user.Profile;
import dev.javacup.backend.user.ProfileRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication handshake endpoints.
 *
 * The frontend calls POST /api/v1/auth/sync immediately after a successful Supabase
 * login/signup. We do NOT create a profile here: a profile is only valid once the user
 * has chosen a background tag during onboarding (profiles.background_tag is NOT NULL).
 * Instead, sync confirms the token is valid and reports whether a complete profile
 * already exists, so the frontend knows whether to show the app or route to onboarding.
 *
 * The profile row itself is created in one shot at the end of onboarding (a later step).
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final ProfileRepository profileRepository;

    public AuthController(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @PostMapping("/sync")
    public AuthSyncResponse sync(Authentication authentication) {
        UUID userId = AuthenticatedUser.id(authentication);
        Optional<Profile> profile = profileRepository.findByUserId(userId);
        boolean hasProfile = profile.isPresent();
        boolean onboardingRequired = profile.map(p -> !p.isOnboardingDone()).orElse(true);
        return new AuthSyncResponse(userId, hasProfile, onboardingRequired);
    }
}
