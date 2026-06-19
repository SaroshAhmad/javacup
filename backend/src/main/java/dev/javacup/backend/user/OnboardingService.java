package dev.javacup.backend.user;

import java.time.OffsetDateTime;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Creates a user's profile at the end of onboarding.
 *
 * Idempotent: if a profile already exists for the user (e.g. the client retries), the
 * existing one is returned unchanged rather than erroring or duplicating. This is the
 * single point where a profiles row is created — sync never creates one (see Option B in
 * the auth flow), so a valid, complete profile only ever comes into existence here.
 */
@Service
public class OnboardingService {

    private final ProfileRepository profileRepository;

    public OnboardingService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional
    public Profile completeOnboarding(UUID userId, String fallbackName, OnboardingRequest request) {
        return profileRepository.findByUserId(userId).orElseGet(() -> {
            Profile profile = new Profile();
            profile.setId(UUID.randomUUID());
            profile.setUserId(userId);
            profile.setDisplayName(resolveName(request.displayName(), fallbackName));
            profile.setBackgroundTag(request.backgroundTag());
            profile.setAdmin(false);
            profile.setOnboardingDone(true);
            OffsetDateTime now = OffsetDateTime.now();
            profile.setCreatedAt(now);
            profile.setUpdatedAt(now);
            return profileRepository.save(profile);
        });
    }

    private static String resolveName(String provided, String fallback) {
        if (provided != null && !provided.isBlank()) {
            return provided.trim();
        }
        if (fallback != null && !fallback.isBlank()) {
            return fallback.trim();
        }
        return "Member";
    }
}
