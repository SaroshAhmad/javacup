package dev.javacup.backend.roadmap;

import java.util.List;

/**
 * A stage with its ordered topics, as returned by the roadmap API. Stages are addressed
 * by orderIndex (their stable, unique position), since the table has no slug.
 */
public record StageResponse(
        Integer id,
        Integer orderIndex,
        String title,
        String description,
        List<TopicResponse> topics
) {
    static StageResponse of(RoadmapStage s, List<TopicResponse> topics) {
        return new StageResponse(s.getId(), s.getOrderIndex(), s.getTitle(), s.getDescription(), topics);
    }
}
