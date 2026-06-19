package dev.javacup.backend.user;

import dev.javacup.backend.auth.AuthenticatedUser;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Current-user endpoints.
 *
 *  - GET  /api/v1/users/me        → the authenticated user's profile, or a "not onboarded"
 *                                   marker if they have signed up but not completed onboarding.
 *  - POST /api/v1/users/onboarding → completes onboarding by creating the profile row.
 *
 * Both require a valid Supabase JWT (enforced by SecurityConfig).
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final ProfileRepository profileRepository;
    private final OnboardingService onboardingService;

    public UserController(ProfileRepository profileRepository, OnboardingService onboardingService) {
        this.profileRepository = profileRepository;
        this.onboardingService = onboardingService;
    }

    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {
        UUID userId = AuthenticatedUser.id(authentication);
        return profileRepository.findByUserId(userId)
                .map(MeResponse::of)
                .orElseGet(() -> MeResponse.notOnboarded(userId));
    }

    @PostMapping("/onboarding")
    public MeResponse onboarding(Authentication authentication, @Valid @RequestBody OnboardingRequest request) {
        UUID userId = AuthenticatedUser.id(authentication);
        String nameFromToken = nameClaim(authentication);
        Profile profile = onboardingService.completeOnboarding(userId, nameFromToken, request);
        return MeResponse.of(profile);
    }

    /** Best-effort display name from the Supabase token's user_metadata.name claim. */
    private static String nameClaim(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            Object metadata = jwt.getClaim("user_metadata");
            if (metadata instanceof java.util.Map<?, ?> map) {
                Object name = map.get("name");
                if (name != null) {
                    return name.toString();
                }
            }
            return jwt.getClaimAsString("name");
        }
        return null;
    }
}
