package dev.javacup.backend.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * CORS configuration.
 *
 * The browser blocks cross-origin requests unless the server explicitly allows the
 * calling origin. The React app (dev: localhost; prod: javacup.dev) and the API live on
 * different origins, so we allow-list the frontend origins here. SecurityConfig wires
 * this source in via http.cors(...).
 *
 * We allow the Authorization header (bearer token) and the methods the API uses.
 * Credentials are enabled for completeness; the app authenticates via bearer token, not
 * cookies, but this keeps the door open without weakening anything.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",          // Vite dev server
                "http://localhost:4173",          // Vite preview
                "https://javacup.dev",            // production
                "https://www.javacup.dev"         // production (www)
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
