package com.harsh.event_service.controller;

import com.harsh.event_service.dto.EventCreateRequest;
import com.harsh.event_service.dto.EventResponse;
import com.harsh.event_service.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService service;

    @PostMapping
    public EventResponse create(@Valid @RequestBody EventCreateRequest req) {
        return service.create(req);
    }

    @GetMapping
    public List<EventResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public EventResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }
}
