package dev.javacup.backend.roadmap;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/** Thrown when a roadmap stage position does not exist → HTTP 404. */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class StageNotFoundException extends RuntimeException {
    public StageNotFoundException(Integer orderIndex) {
        super("No roadmap stage at position: " + orderIndex);
    }
}
