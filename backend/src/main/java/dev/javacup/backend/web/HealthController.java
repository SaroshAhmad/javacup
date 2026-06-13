package dev.javacup.backend.web;

import java.time.Instant;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Health endpoint.
 *
 * Returns a 200 response so the platform (Render) can confirm the service is
 * alive. This is the path configured as the Render health check:
 * {@code /api/v1/health}.
 */
@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "service", "javacup-backend",
                "timestamp", Instant.now().toString()
        );
    }
}
