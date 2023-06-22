package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class MovieInfoDayDto {
    private String yearMonth;
    private List<MovieInfoDto> movieInfos;

    @Builder
    public MovieInfoDayDto(String yearMonth, List<MovieInfoDto> movieInfos) {
        this.yearMonth = yearMonth;
        this.movieInfos = movieInfos;
    }
}




