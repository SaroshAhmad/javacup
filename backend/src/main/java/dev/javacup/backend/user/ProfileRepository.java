package dev.javacup.backend.user;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Data access for profiles. Lookups are by the Supabase user UUID (`user_id`), since
 * that is what the authenticated principal carries, not the table's own `id`.
 */
public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    Optional<Profile> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);
}
