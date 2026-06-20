package dev.javacup.backend.roadmap;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A roadmap stage (e.g. Foundations, Core Java). Maps the roadmap_stages table exactly:
 * id (SERIAL), title, description (NOT NULL), order_index (UNIQUE), created_at.
 *
 * There is no slug or updated_at column — stages are addressed by their unique
 * order_index in the API. Topics are loaded separately by the service (not a JPA
 * relationship) to keep fetching explicit.
 */
@Entity
@Table(name = "roadmap_stages")
@Getter
@Setter
@NoArgsConstructor
public class RoadmapStage {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private Integer id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "order_index", nullable = false, unique = true)
    private Integer orderIndex;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
