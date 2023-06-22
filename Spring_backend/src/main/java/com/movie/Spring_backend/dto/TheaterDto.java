package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TheaterDto {
    private Long tid;
    private String tname;
    private String taddr;
    private String tarea;
    private Boolean reserve; // 예매 가능 여부
    private Integer cntCinema;

    @Builder
    public TheaterDto(Long tid, String tname, String taddr, String tarea, Boolean reserve, Integer cntCinema) {
        this.tid = tid;
        this.tname = tname;
        this.taddr = taddr;
        this.tarea = tarea;
        this.reserve = reserve;
        this.cntCinema = cntCinema;
    }
}

