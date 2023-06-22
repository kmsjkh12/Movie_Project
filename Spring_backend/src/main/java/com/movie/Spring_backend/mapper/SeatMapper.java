package com.movie.Spring_backend.mapper;

import com.movie.Spring_backend.dto.SeatDto;
import com.movie.Spring_backend.entity.SeatEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SeatMapper {
    // 예매 페이지에서 좌석을 매핑해주는 메소드
    public SeatDto toDtoReserve(SeatEntity Seat, List<Long> occupyNum) {
        // 점유된 좌석이면 reserve가 true 아니면 false
        if (occupyNum.contains(Seat.getSid())) {
            return SeatDto.builder()
                    .sid(Seat.getSid())
                    .sname(Seat.getSname())
                    .reserve(true).build();
        }
        else {
            return SeatDto.builder()
                    .sid(Seat.getSid())
                    .sname(Seat.getSname())
                    .reserve(false).build();
        }
    }
}
