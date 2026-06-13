package dev.javacup.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Base security configuration.
 *
 * For now this permits the health check and all public read endpoints, and
 * leaves the application stateless (no server-side sessions). This is the
 * foundation that the Supabase JWT validation filter will plug into in a later
 * sprint — see docs/authentication.md and ADR 0001.
 *
 * Until that filter is added, no endpoint requires authentication. That is
 * intentional for this stage: there are no protected resources yet. Write
 * endpoints will be locked down when the JWT filter lands.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // No browser session — this is a stateless API consumed by the
                // React client with bearer tokens.
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // CSRF protection is for session-cookie apps; a stateless token
                // API does not use it.
                .csrf(AbstractHttpConfigurer::disable)
                // Disable the default login form and HTTP basic prompt so the
                // generated password path is gone.
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Health check must be reachable by Render.
                        .requestMatchers("/api/v1/health").permitAll()
                        // Public read endpoints (roadmap, discussions, etc.) are
                        // open. Tighten per-endpoint when the JWT filter is added.
                        .requestMatchers(HttpMethod.GET, "/api/v1/**").permitAll()
                        // Everything else is open for now; locked down later.
                        .anyRequest().permitAll()
                );
        return http.build();
    }
}
