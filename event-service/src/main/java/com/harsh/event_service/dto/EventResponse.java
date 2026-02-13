package com.harsh.event_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {
    private Long eventId;
    private String title;
    private String description;
    private String location;
    private LocalDateTime date;
    private Integer totalSeats;
    private Integer availableSeats;
    private Double price;
    private Long createdBy;
}
