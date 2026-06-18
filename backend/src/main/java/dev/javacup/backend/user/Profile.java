package dev.javacup.backend.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Profile — the application-side record for a user, mirroring Supabase Auth.
 *
 * Maps the `profiles` table exactly (Hibernate runs in validate mode, so any drift
 * from the schema fails startup). Key points:
 *   - `id` is this table's own generated UUID (the PK).
 *   - `userId` holds the Supabase auth.users UUID — the value carried in the JWT `sub`
 *     claim and referenced as `user_id` by every other table. This is the join key to
 *     the authenticated principal, NOT `id`.
 *
 * background_tag is stored as text matching the DB CHECK constraint, so the enum is
 * mapped with EnumType.STRING.
 */
@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
public class Profile {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true, updatable = false)
    private UUID userId;

    @Column(name = "display_name", nullable = false, length = 50)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(name = "background_tag", nullable = false, length = 30)
    private BackgroundTag backgroundTag;

    @Column(name = "bio")
    private String bio;

    @Column(name = "current_stage")
    private Integer currentStage;

    @Column(name = "is_admin", nullable = false)
    private boolean admin;

    @Column(name = "onboarding_done", nullable = false)
    private boolean onboardingDone;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
