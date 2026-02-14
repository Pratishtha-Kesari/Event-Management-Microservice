package com.harsh.registration_service.clients;

import com.harsh.registration_service.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "event-service", configuration = FeignConfig.class)
public interface EventClient {

    @GetMapping("/api/events/{id}")
    Object getEventById(@PathVariable Long id);
}

