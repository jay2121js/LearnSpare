package com.example.SmartLearn.Configuration;

import com.example.SmartLearn.filter.JwtFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableAsync
public class SpringSecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtFilter jwtFilter;
    @Value("${Frontend_URI}")
    private String frontEndUrl;
    public SpringSecurityConfig(UserDetailsService userDetailsService, JwtFilter jwtFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1) CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 2) Disable CSRF
                .csrf(csrf -> csrf.disable())
                // 3) Stateless sessions
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 4) CSP headers (keep yours)
                .headers(h -> h.contentSecurityPolicy(csp ->
                        csp.policyDirectives(
                                "default-src 'self'; " +
                                        "img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com https://images.pexels.com https://randomuser.me https://burst.shopifycdn.com; " +
                                        "font-src 'self' data:; " +
                                        "style-src 'self' 'unsafe-inline'; " +
                                        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                                        "media-src 'self' https://res.cloudinary.com;"
                        )
                ))

                // 5) Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Allow all preflight CORS OPTIONS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public endpoints
                        .requestMatchers("/Public/**", "/webhook/**", "/auth/google/**").permitAll()

                        // Role-based secured routes
                        .requestMatchers("/Instructor/**").hasRole("TEACHER")

                        // Authenticated-only
                        .requestMatchers("/Courses/**", "/User/**", "/Video/**" , "/Admin/**").authenticated()

                        // Fallback: everything else must be authenticated
                        .anyRequest().permitAll()
                )

                // 6) JWT filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(frontEndUrl));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedOrigins(Arrays.asList(frontEndUrl, "http://localhost:3000", "https://*.onrender.com"));
        configuration.setAllowCredentials(true); // Crucial for cookies
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        return authBuilder.build();
    }
}