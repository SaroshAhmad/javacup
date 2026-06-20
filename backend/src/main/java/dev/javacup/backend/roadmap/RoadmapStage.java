package dev.javacup.backend.roadmap;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A roadmap stage (e.g. Foundations, Core Java). Maps roadmap_stages exactly: id (SERIAL),
 * title, description (NOT NULL), order_index (UNIQUE), created_at.
 *
 * id is a Postgres SERIAL, mapped with GenerationType.IDENTITY so the DB assigns it.
 * Stages are read-only content in the app today, but the mapping is correct for any future
 * stage creation. There is no slug or updated_at column — stages are addressed by their
 * unique order_index in the API.
 */
@Entity
@Table(name = "roadmap_stages")
@Getter
@Setter
@NoArgsConstructor
public class RoadmapStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
