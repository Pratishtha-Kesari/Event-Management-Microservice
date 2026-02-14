package com.harsh.payment_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "registration-service", url = "http://localhost:8080")
public interface RegistrationClient {

    @PutMapping("/api/register/{id}/confirm")
    void confirm(@PathVariable Long id);
}
