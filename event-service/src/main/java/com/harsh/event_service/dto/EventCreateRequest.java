package com.harsh.event_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventCreateRequest {

    @NotBlank
    private String title;

    @Size(max = 2000)
    private String description;

    @NotBlank
    private String location;

    @NotNull
    private LocalDateTime date;

    @NotNull
    @Min(1)
    private Integer totalSeats;

    @NotNull
    @DecimalMin("0.0")
    private Double price;

}
