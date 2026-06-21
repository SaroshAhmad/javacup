package dev.javacup.backend.roadmap;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/** Thrown when a roadmap topic id does not exist → HTTP 404. */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class TopicNotFoundException extends RuntimeException {
    public TopicNotFoundException(Integer topicId) {
        super("No roadmap topic with id: " + topicId);
    }
}
