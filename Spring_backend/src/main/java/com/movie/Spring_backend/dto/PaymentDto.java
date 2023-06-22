package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PaymentDto {
    private Integer amount;
    private String status;
    private String emb_pg_provider;

    @Builder
    public PaymentDto(Integer amount, String status, String emb_pg_provider) {
        this.amount = amount;
        this.status = status;
        this.emb_pg_provider = emb_pg_provider;
    }
}
