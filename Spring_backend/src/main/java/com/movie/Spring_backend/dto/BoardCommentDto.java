package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class BoardCommentDto {
    private Long bcid;
    private String bccomment;
    private String bcdate;
    private Long bcroot;
    private Long bcparent;
    private Integer likes;
    private Integer unlikes;
    private boolean like;
    private boolean unlike;
    private String uid;
    private String parentUid;
    private List<BoardCommentDto> child = new ArrayList<>();

    @Builder
    public BoardCommentDto(Long bcid, String bccomment, String bcdate, Long bcroot, Long bcparent, Integer likes, Integer unlikes,
                           boolean like, boolean unlike, String uid, String parentUid, List<BoardCommentDto> child) {
        this.bcid = bcid;
        this.bccomment = bccomment;
        this.bcdate = bcdate;
        this.bcroot = bcroot;
        this.bcparent = bcparent;
        this.likes = likes;
        this.unlikes = unlikes;
        this.like = like;
        this.unlike = unlike;
        this.uid = uid;
        this.parentUid = parentUid;
        this.child = child;
    }
}
