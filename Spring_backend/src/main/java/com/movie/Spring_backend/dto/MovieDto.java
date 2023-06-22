/*
  23-02-06 MovieDto 좋아요, 평점 추출을 위한 수정(오병주)
 */

package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;

@Getter
@NoArgsConstructor
public class MovieDto {
    private Long mid;
    private String mtitle;
    private String mdir;
    private String mgenre;
    private Integer mtime;
    private Date mdate;
    private String mrating;
    private String mstory;
    private String mimagepath; //이미지 주소
    private Integer mlikes; // 좋아요 개수
    private Float mscore; // 평점 평균
    private Boolean mlike; // 사용자 개인별 좋아요 여부
    private List<String> actors; // 영화에 출연하는 배우들
    private Boolean reserve;    // 예매 가능 여부
    private Float reserveRate;  // 예매율
    private Integer reserveCnt; // 예매횟수
    // 관리자 페이지
    private Integer reserveCntAll; // 전체 예매 횟수
    private List<String> mainactor;  // 주연
    private List<String> mainactorId; // 주연배우 Id (프론트단에서 사용)
    private List<String> subactor;  // 조연
    private List<String> subactorId; // 조연배우 Id (프론트단에서 사용)
    private List<String> voiceactor;  // 성우
    private List<String> voiceactorId; // 성우 Id (프론트단에서 사용)
    private Integer cntMovieInfo; // 영화가 사용된 상영정보 개수

    @Builder
    public MovieDto(Long mid, String mtitle, String mdir, String mgenre, Integer mtime, Date mdate, String mrating,
                    String mstory , String mimagepath, Integer mlikes, Float mscore, Boolean mlike,
                    List<String> actors, Boolean reserve, Float reserveRate, Integer reserveCnt, Integer reserveCntAll,
                    List<String> mainactor, List<String> subactor, List<String> voiceactor, List<String> mainactorId,
                    List<String> subactorId, List<String> voiceactorId, Integer cntMovieInfo) {
        this.mid = mid;
        this.mtitle = mtitle;
        this.mdir = mdir;
        this.mgenre = mgenre;
        this.mtime = mtime;
        this.mdate = mdate;
        this.mrating = mrating;
        this.mstory = mstory;
        this.mimagepath = mimagepath;
        this.mlikes = mlikes;
        this.mscore = mscore;
        this.mlike = mlike;
        this.actors = actors;
        this.reserve = reserve;
        this.reserveRate = reserveRate;
        this.reserveCnt = reserveCnt;
        this.reserveCntAll = reserveCntAll;
        this.mainactor = mainactor;
        this.mainactorId = mainactorId;
        this.subactor = subactor;
        this.subactorId = subactorId;
        this.voiceactor = voiceactor;
        this.voiceactorId = voiceactorId;
        this.cntMovieInfo = cntMovieInfo;
    }
}




