package dev.javacup.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration — Supabase JWT (ES256) validation via OAuth2 resource server.
 *
 * Tokens are asymmetric (ES256), so Spring validates each bearer token's signature
 * against Supabase's published JWKS (public keys), plus issuer and expiry. No shared
 * secret. JWKS/issuer URIs + the ES256 algorithm are in application.yml under
 * spring.security.oauth2.resourceserver.jwt.
 *
 * Access model (matches the API spec):
 *   - Public:  the health check, and GET on the genuinely public read endpoints
 *              (roadmap, resources, discussions, recommendations). No token required.
 *   - Member:  everything else — including GET /users/me and POST /auth/sync — requires
 *              a valid Supabase JWT.
 *   - Admin:   tightened per-endpoint later via method security against the profile's
 *              is_admin flag (role lives in our DB, not the JWT).
 *
 * CORS: the cross-origin source is defined in CorsConfig and wired in below, so the
 * React app (different origin) can call the API with its bearer token.
 *
 * Stateless: no server-side sessions; the React client sends the bearer token.
 */
@Configuration
public class SecurityConfig {

    /** GET paths that are genuinely public (guest-readable). */
    private static final String[] PUBLIC_GET = {
            "/api/v1/roadmap/**",
            "/api/v1/resources/**",
            "/api/v1/discussions/**",
            "/api/v1/recommendations/**"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Apply the CORS source from CorsConfig.
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // CORS preflight requests must not require auth.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Health check — reachable by Render.
                        .requestMatchers("/api/v1/health").permitAll()
                        // Genuinely public guest-readable GET endpoints.
                        .requestMatchers(HttpMethod.GET, PUBLIC_GET).permitAll()
                        // Everything else — writes, /auth/sync, /users/me — needs a valid JWT.
                        .anyRequest().authenticated()
                )
                // Validate incoming bearer tokens as JWTs against the configured JWKS.
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}));
        return http.build();
    }
}
