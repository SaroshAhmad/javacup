package dev.javacup.backend.roadmap;

/**
 * A topic as returned by the roadmap API. `published` lets the admin UI distinguish draft
 * from live; the public API only ever returns published topics, so for public consumers it
 * is always true.
 */
public record TopicResponse(
        Integer id,
        String title,
        String description,
        TopicPriority priority,
        Integer orderIndex,
        boolean published
) {
    static TopicResponse of(RoadmapTopic t) {
        return new TopicResponse(t.getId(), t.getTitle(), t.getDescription(),
                t.getPriority(), t.getOrderIndex(), t.isPublished());
    }
}
