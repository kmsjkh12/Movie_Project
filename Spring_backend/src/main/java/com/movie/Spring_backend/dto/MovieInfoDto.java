package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Getter
@NoArgsConstructor
public class MovieInfoDto {
    private Long miid;
    private Date miday;
    private String mistarttime;
    private String miendtime;
    private Long cid;
    private String cname;
    private String ctype;
    private Integer cntSeatAll; // 전체 좌석
    private Integer cntSeatInfo; // 점유좌석
    private Boolean reserve; // 예매 가능 여부
    private Long mid;
    private Date mdate;
    private String mtitle;
    private Long tid;
    private String tarea;
    private String tname;

    @Builder
    public MovieInfoDto(Long miid, Date miday, String mistarttime, String miendtime, Long cid, String cname, String ctype,
                        Integer cntSeatAll, Integer cntSeatInfo, Boolean reserve, Long mid, Date mdate, String mtitle,
                        Long tid, String tarea, String tname) {

        this.miid = miid;
        this.miday = miday;
        this.mistarttime = mistarttime;
        this.miendtime = miendtime;
        this.cid = cid;
        this.cname = cname;
        this.ctype = ctype;
        this.cntSeatAll = cntSeatAll;
        this.cntSeatInfo = cntSeatInfo;
        this.reserve = reserve;
        this.mid = mid;
        this.mtitle = mtitle;
        this.mdate = mdate;
        this.tid = tid;
        this.tarea = tarea;
        this.tname = tname;
    }
}
