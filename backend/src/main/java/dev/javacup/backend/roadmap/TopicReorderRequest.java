package dev.javacup.backend.roadmap;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * Body for reordering topics within a stage. `orderedTopicIds` lists every topic id in
 * the stage in the desired order; the service rewrites each topic's order_index to match
 * its position in this list.
 */
public record TopicReorderRequest(
        @NotNull(message = "stageId is required.")
        Integer stageId,

        @NotEmpty(message = "orderedTopicIds must not be empty.")
        List<Integer> orderedTopicIds
) {
}
