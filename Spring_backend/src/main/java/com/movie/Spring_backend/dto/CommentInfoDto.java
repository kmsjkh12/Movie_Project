package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentInfoDto {
    private Long umid;
    private Integer umscore;
    private String umcomment;
    private String umcommenttime;
    private String uid;
    private Integer upcnt; // 현재 관람평의 좋아요 수
    private Boolean like;  // 사용자의 관람평 좋아요 여부
    private Long mid;
    private String mtitle;
    private String mimagepath; //이미지 주소

    @Builder
    public CommentInfoDto(Long umid, Integer umscore, String umcomment, String umcommenttime,
                          String uid, Integer upcnt, Boolean like, Long mid, String mtitle, String mimagepath) {
        this.umid = umid;
        this.umscore = umscore;
        this.umcomment = umcomment;
        this.umcommenttime = umcommenttime;
        this.uid = uid;
        this.upcnt = upcnt;
        this.like = like;
        this.mid = mid;
        this.mtitle = mtitle;
        this.mimagepath = mimagepath;
    }
}