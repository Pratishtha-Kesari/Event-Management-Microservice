package com.harsh.payment_service.service;
import com.harsh.payment_service.clients.EventClient;
import com.harsh.payment_service.clients.RegistrationClient;
import com.harsh.payment_service.dto.PaymentRequestDto;
import com.harsh.payment_service.dto.PaymentResponseDto;
import com.harsh.payment_service.entity.Payment;
import com.harsh.payment_service.entity.PaymentStatus;
import com.harsh.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository repo;
    private final ModelMapper modelMapper;

    private final RegistrationClient registrationClient;
    private final EventClient eventClient;


    public PaymentResponseDto pay(PaymentRequestDto req) {

        PaymentStatus status = Boolean.TRUE.equals(req.getSuccess())
                ? PaymentStatus.SUCCESS
                : PaymentStatus.FAILED;

        Payment payment = Payment.builder()
                .registrationId(req.getRegistrationId())
                .amount(req.getAmount())
                .status(status)
                .paymentDate(LocalDateTime.now())
                .build();

        Payment saved = repo.save(payment);

        // If SUCCESS -> confirm registration
        if (status == PaymentStatus.SUCCESS) {
            registrationClient.confirm(req.getRegistrationId());

             eventClient.decreaseSeat(req.getEventId());
        }


        return modelMapper.map(saved, PaymentResponseDto.class);
    }

}
