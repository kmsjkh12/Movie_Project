package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ManagerReservationDto {
    private Float reserveRate;
    private List<ReservationDto> reservations;

    @Builder
    public ManagerReservationDto(Float reserveRate, List<ReservationDto> reservations) {
        this.reserveRate = reserveRate;
        this.reservations = reservations;
    }
}