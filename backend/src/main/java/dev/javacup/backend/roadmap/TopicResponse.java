package dev.javacup.backend.roadmap;

/**
 * A topic as returned by the roadmap API. Resource links will be added in a later pass
 * (each topic links to 2+ curated resources, per F-01) once the resources feature exists.
 */
public record TopicResponse(
        Integer id,
        String title,
        String description,
        TopicPriority priority,
        Integer orderIndex
) {
    static TopicResponse of(RoadmapTopic t) {
        return new TopicResponse(t.getId(), t.getTitle(), t.getDescription(), t.getPriority(), t.getOrderIndex());
    }
}
