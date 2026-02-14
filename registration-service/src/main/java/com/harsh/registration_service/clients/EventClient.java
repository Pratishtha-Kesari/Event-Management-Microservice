package com.harsh.registration_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "event-service", url = "http://localhost:8080")
public interface EventClient {

    @GetMapping("/api/events/{id}")
    Object getEventById(@PathVariable Long id);
}
