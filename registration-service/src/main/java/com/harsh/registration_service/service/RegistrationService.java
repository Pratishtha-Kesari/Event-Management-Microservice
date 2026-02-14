package com.harsh.registration_service.service;
import com.harsh.registration_service.clients.EventClient;
import com.harsh.registration_service.clients.UserClient;
import com.harsh.registration_service.dto.RegistrationCreateRequest;
import com.harsh.registration_service.dto.RegistrationResponse;
import com.harsh.registration_service.entity.Registration;
import com.harsh.registration_service.entity.RegistrationStatus;
import com.harsh.registration_service.exception.InvalidEventException;
import com.harsh.registration_service.exception.InvalidUserException;
import com.harsh.registration_service.exception.RegistrationNotFoundException;
import com.harsh.registration_service.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository repo;
    private final ModelMapper modelMapper;
    private final UserClient userClient;
    private final EventClient eventClient;

    public RegistrationResponse create(RegistrationCreateRequest req) {

        // validate user exists
        try {
            userClient.getUserById(req.getUserId());
        } catch (Exception e) {
            throw new InvalidUserException("User not found with id " + req.getUserId());
        }

        // validate event exists
        try {
            eventClient.getEventById(req.getEventId());
        } catch (Exception e) {
            throw new InvalidEventException("Event not found with id " + req.getEventId());
        }

        Registration reg = Registration.builder()
                .userId(req.getUserId())
                .eventId(req.getEventId())
                .status(RegistrationStatus.PENDING)
                .ticketNumber(null)
                .registeredAt(LocalDateTime.now())
                .build();

        return modelMapper.map(repo.save(reg), RegistrationResponse.class);
    }

    public List<RegistrationResponse> getAll() {
        return repo.findAll()
                .stream()
                .map(registration ->
                        modelMapper.map(registration, RegistrationResponse.class))
                .toList();
    }

    public RegistrationResponse getById(Long id) {
        Registration reg = repo.findById(id)
                .orElseThrow(() -> new RegistrationNotFoundException("Registration not found with id " + id));
        return modelMapper.map(reg, RegistrationResponse.class);
    }

    public List<RegistrationResponse> getByUserId(Long userId) {
        return repo.findByUserId(userId)
                .stream()
                .map(registration ->
                        modelMapper.map(registration, RegistrationResponse.class))
                .toList();
    }

    public RegistrationResponse cancel(Long id) {
        Registration reg = repo.findById(id)
                .orElseThrow(() -> new RegistrationNotFoundException("Registration not found with id " + id));
        reg.setStatus(RegistrationStatus.CANCELLED);
        reg.setTicketNumber(null);
        return modelMapper.map(repo.save(reg), RegistrationResponse.class);
    }

    // Optional endpoint for now (later Payment success will call it)
    public RegistrationResponse confirm(Long id) {
        Registration reg = repo.findById(id)
                .orElseThrow(() -> new RegistrationNotFoundException("Registration not found with id " + id));

        reg.setStatus(RegistrationStatus.CONFIRMED);
        if (reg.getTicketNumber() == null) {
            reg.setTicketNumber("TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        return modelMapper.map(repo.save(reg), RegistrationResponse.class);
    }

}