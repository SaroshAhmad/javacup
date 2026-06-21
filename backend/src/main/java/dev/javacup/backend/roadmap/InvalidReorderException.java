package dev.javacup.backend.roadmap;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a reorder request's topic ids don't exactly match the stage's topics →
 * HTTP 400. Prevents partial or corrupt reorders.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidReorderException extends RuntimeException {
    public InvalidReorderException() {
        super("The reorder list must contain exactly the topics in the stage.");
    }
}
