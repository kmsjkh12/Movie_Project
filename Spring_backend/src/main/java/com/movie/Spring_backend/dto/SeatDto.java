package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SeatDto {
    private Long sid;
    private String sname;
    private Boolean reserve; // 좌석 점유 여부

    @Builder
    public SeatDto(Long sid ,String sname, Boolean reserve) {
        this.sid = sid;
        this.sname = sname;
        this.reserve = reserve;
    }
}
