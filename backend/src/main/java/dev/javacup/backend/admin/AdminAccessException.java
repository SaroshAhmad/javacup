package dev.javacup.backend.admin;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/** Thrown when a non-admin attempts an admin-only action → HTTP 403. */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class AdminAccessException extends RuntimeException {
    public AdminAccessException() {
        super("Administrator privileges are required for this action.");
    }
}
