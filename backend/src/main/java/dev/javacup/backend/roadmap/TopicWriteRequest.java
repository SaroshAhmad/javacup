package dev.javacup.backend.roadmap;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Body for creating or updating a roadmap topic (admin only). order_index is NOT set here
 * — new topics are appended to the end of their stage, and ordering is changed via the
 * dedicated reorder endpoint, keeping positions consistent.
 */
public record TopicWriteRequest(
        @NotNull(message = "stageId is required.")
        Integer stageId,

        @NotBlank(message = "Title is required.")
        @Size(max = 100, message = "Title must be 100 characters or fewer.")
        String title,

        String description,

        @NotNull(message = "Priority is required.")
        TopicPriority priority
) {
}
