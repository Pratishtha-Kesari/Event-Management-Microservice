package com.harsh.event_service.service;


import com.harsh.event_service.dto.EventCreateRequest;
import com.harsh.event_service.dto.EventResponse;
import com.harsh.event_service.entity.Event;
import com.harsh.event_service.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository repo;

    public EventResponse create(EventCreateRequest req) {
        Event e = Event.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .location(req.getLocation())
                .date(req.getDate())
                .totalSeats(req.getTotalSeats())
                .availableSeats(req.getTotalSeats()) // initial same
                .price(req.getPrice())
                .createdBy(req.getCreatedBy())
                .build();

        Event saved = repo.save(e);
        return toResponse(saved);
    }

    public List<EventResponse> getAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public EventResponse getById(Long id) {
        Event e = repo.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        return toResponse(e);
    }

    private EventResponse toResponse(Event e) {
        return new EventResponse(
                e.getEventId(),
                e.getTitle(),
                e.getDescription(),
                e.getLocation(),
                e.getDate(),
                e.getTotalSeats(),
                e.getAvailableSeats(),
                e.getPrice(),
                e.getCreatedBy()
        );
    }
}
