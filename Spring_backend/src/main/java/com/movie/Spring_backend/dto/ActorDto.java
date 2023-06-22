package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ActorDto {
    private Long aid;
    private String aname;
    private String abirthplace;
    private Integer cntMovie;

    @Builder
    public ActorDto(Long aid, String aname, String abirthplace, Integer cntMovie) {
        this.aid = aid;
        this.aname = aname;
        this.abirthplace = abirthplace;
        this.cntMovie = cntMovie;
    }
}

