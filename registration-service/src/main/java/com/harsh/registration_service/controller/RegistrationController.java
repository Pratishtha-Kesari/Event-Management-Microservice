package com.harsh.registration_service.controller;

import com.harsh.registration_service.dto.RegistrationCreateRequest;
import com.harsh.registration_service.dto.RegistrationResponse;
import com.harsh.registration_service.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/register")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService service;

    @PostMapping
    public RegistrationResponse create(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody RegistrationCreateRequest req
    ) {
        return service.create(userId, req);
    }

    @GetMapping
    public List<RegistrationResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public RegistrationResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/user/{userId}")
    public List<RegistrationResponse> getByUser(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }

    @PutMapping("/{id}/cancel")
    public RegistrationResponse cancel(@PathVariable Long id) {
        return service.cancel(id);
    }

    @PutMapping("/{id}/confirm")
    public RegistrationResponse confirm(@PathVariable Long id) {
        return service.confirm(id);
    }
}

