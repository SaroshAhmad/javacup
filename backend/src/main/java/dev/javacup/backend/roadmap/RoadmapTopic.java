package dev.javacup.backend.roadmap;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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
 * A topic within a roadmap stage. Maps roadmap_topics exactly.
 *
 * id is a Postgres SERIAL (GenerationType.IDENTITY). priority is VARCHAR with a lowercase
 * CHECK constraint, mapped via TopicPriorityConverter. `published` is the draft/publish
 * flag: topics are composed as drafts (false) and only appear on the public roadmap once
 * published (true). stage_id is a plain FK value; topics are grouped under stages by the
 * service.
 */
@Entity
@Table(name = "roadmap_topics")
@Getter
@Setter
@NoArgsConstructor
public class RoadmapTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Integer id;

    @Column(name = "stage_id", nullable = false)
    private Integer stageId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Convert(converter = TopicPriorityConverter.class)
    @Column(name = "priority", nullable = false)
    private TopicPriority priority;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "published", nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
