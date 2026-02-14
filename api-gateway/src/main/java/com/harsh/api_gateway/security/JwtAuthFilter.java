package com.harsh.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {

    private final SecretKey key;

    public JwtAuthFilter(@Value("${app.jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        if (path.startsWith("/api/events") && method == HttpMethod.GET) {
            return chain.filter(exchange);
        }

        // Public routes
        if (path.startsWith("/api/auth/")) {
            return chain.filter(exchange);
        }

        // Require token for everything else
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            System.out.println("JWT subject=" + claims.getSubject());
            System.out.println("JWT userId=" + claims.get("userId"));
            System.out.println("JWT role=" + claims.get("role"));


            String email = claims.getSubject();
            String userId = String.valueOf(claims.get("userId"));
            String role = String.valueOf(claims.get("role")); // ADMIN / USER

            // Role rules (MVP)
            if (!isAllowed(role, path, method)) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }

            // Pass user context downstream
            ServerWebExchange mutated = exchange.mutate()
                    .request(exchange.getRequest().mutate()
                            .header("X-User-Email", email)
                            .header("X-User-Id", userId)
                            .header("X-User-Role", role)
                            .build())
                    .build();

            return chain.filter(mutated);

        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    private boolean isAllowed(String role, String path, HttpMethod method) {


        //  Event service rules
        if (path.startsWith("/api/events")) {
            // Admin-only for write operations
            if (method == HttpMethod.POST || method == HttpMethod.PUT || method == HttpMethod.DELETE) {
                return "ADMIN".equalsIgnoreCase(role);
            }
            return "USER".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role);
        }

        // 2) Registration rules only USER should register
        if (path.startsWith("/api/register")) {
            if (method == HttpMethod.POST) {
                return "USER".equalsIgnoreCase(role);
            }

            return "USER".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role);
        }

        // 3) Payment rules USER makes payments
        if (path.startsWith("/api/payment")) {
            if (method == HttpMethod.POST) {
                return "USER".equalsIgnoreCase(role);
            }
            return "USER".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role);
        }

        // 4) Users endpoint
        //allow ADMIN to view all users, USER can only view self later (we'll do later)
        if (path.startsWith("/api/users")) {
            return "ADMIN".equalsIgnoreCase(role);
        }

        // Default: allow any authenticated
        return "USER".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role);
    }

    @Override
    public int getOrder() {
        return -1;
    }
}