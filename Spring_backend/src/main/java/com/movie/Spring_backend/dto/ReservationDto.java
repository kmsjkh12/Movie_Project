package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ReservationDto {
    private Long rid;
    private String uid;
    private String rdate;
    private Long mid;
    private String mtitle;
    private String mimagepath;
    private String tarea;
    private String tname;
    private String cname;
    private String mistarttime;
    private String miendtime;
    private String mrating;
    private List<String> seats;
    private String rpeople;
    private Integer rticket;
    private String rpaytype;
    private Integer rprice;
    private Boolean rstate;
    private String rstate_string;
    private String rcanceldate;

    @Builder
    public ReservationDto(Long rid, String uid, String rdate, Long mid, String mtitle, String mimagepath, String tarea, String tname,
                          String cname, String mistarttime, String miendtime, String mrating, List<String> seats, String rpeople,
                          Integer rticket, String rpaytype, Integer rprice, Boolean rstate, String rstate_string, String rcanceldate) {
        this.rid = rid;
        this.uid = uid;
        this.rdate = rdate;
        this.mid = mid;
        this.mtitle = mtitle;
        this.mimagepath = mimagepath;
        this.tarea = tarea;
        this.tname = tname;
        this.cname = cname;
        this.mistarttime = mistarttime;
        this.miendtime = miendtime;
        this.mrating = mrating;
        this.seats = seats;
        this.rpeople = rpeople;
        this.rticket = rticket;
        this.rpaytype = rpaytype;
        this.rprice = rprice;
        this.rstate = rstate;
        this.rstate_string = rstate_string;
        this.rcanceldate = rcanceldate;
    }
}