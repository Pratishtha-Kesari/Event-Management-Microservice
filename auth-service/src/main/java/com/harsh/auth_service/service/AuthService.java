package com.harsh.auth_service.service;

import com.harsh.auth_service.dto.AuthResponse;
import com.harsh.auth_service.dto.LoginRequest;
import com.harsh.auth_service.dto.RegisterRequest;
import com.harsh.auth_service.entity.AuthUser;
import com.harsh.auth_service.entity.Role;
import com.harsh.auth_service.repository.AuthUserRepository;
import com.harsh.auth_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthUserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (repo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Role role = Role.valueOf(req.getRole().toUpperCase());

        AuthUser saved = repo.save(AuthUser.builder()
                .email(req.getEmail())
                .passwordHash(encoder.encode(req.getPassword()))
                .role(role)
                .build());


        String token = jwtUtil.generateToken(saved.getId(), saved.getEmail(), saved.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(saved.getId())
                .email(saved.getEmail())
                .role(saved.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        AuthUser user = repo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }


        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
