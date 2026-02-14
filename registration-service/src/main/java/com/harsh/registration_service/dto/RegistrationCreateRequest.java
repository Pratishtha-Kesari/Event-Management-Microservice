package com.harsh.registration_service.dto;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationCreateRequest {
    @NotNull
    private Long eventId;

}
