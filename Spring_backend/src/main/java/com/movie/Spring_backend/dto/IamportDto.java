package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class IamportDto {
    private Integer code;
    private String message;
    private PaymentDto response;

    @Builder
    private IamportDto(Integer code, String message, PaymentDto response) {
        this.code = code;
        this.message = message;
        this.response = response;
    }
}
