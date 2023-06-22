package com.movie.Spring_backend.dto;

import com.movie.Spring_backend.entity.MovieInfoEntity;
import com.movie.Spring_backend.entity.ReservationEntity;
import com.movie.Spring_backend.entity.SeatEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MovieInfoSeatDto {
    private Long misid;
    private SeatEntity seat;
    private MovieInfoEntity info;
    private ReservationEntity reserve;

    @Builder
    public MovieInfoSeatDto(Long misid,  SeatEntity seat, MovieInfoEntity info, ReservationEntity reserve) {
        this.misid=misid;
        this.seat=seat;
        this.info=info;
        this.reserve=reserve;
    }
}
