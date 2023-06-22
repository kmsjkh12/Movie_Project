package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class CountCommentDto {
    private Integer count;
    private List<BoardCommentDto> content = new ArrayList<>();

    @Builder
    public CountCommentDto(Integer count, List<BoardCommentDto> content) {
        this.count = count;
        this.content = content;
    }
}
