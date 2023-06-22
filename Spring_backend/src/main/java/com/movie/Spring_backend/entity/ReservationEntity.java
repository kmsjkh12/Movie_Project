package com.movie.Spring_backend.entity;

import javax.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="movie_reservation")
@Getter
@NoArgsConstructor
public class ReservationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rid;

    @Column(nullable = false)
    private String rdate;

    @Column(nullable = false)
    private Integer rprice;

    @Column(nullable = false)
    private String rpeople;

    // 티켓 매수
    @Column(nullable = false)
    private Integer rticket;

    @Column(nullable = false)
    private String rpayid;

    @Column(nullable = false)
    private String rpaytype;

    // 예매 취소 확인용(true -> 예매한 것, false -> 취소한 것)
    @Column(nullable = false)
    private Boolean rstate;

    private String rcanceldate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="miid")
    private MovieInfoEntity movieInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="uid")
    private MemberEntity member;

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "reservation",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<MovieInfoSeatEntity> infoSeats = new ArrayList<>();

    @Builder
    public ReservationEntity(Long rid, String rdate, Integer rprice, String rpeople, Integer rticket, String rpayid,
                             String rpaytype, Boolean rstate, String rcanceldate, MovieInfoEntity movieInfo,
                             MemberEntity member, List<MovieInfoSeatEntity> infoSeats) {
        this.rid = rid;
        this.rdate = rdate;
        this.rprice = rprice;
        this.rpeople = rpeople;
        this.rticket = rticket;
        this.rpayid = rpayid;
        this.rpaytype = rpaytype;
        this.rstate = rstate;
        this.rcanceldate = rcanceldate;
        this.movieInfo = movieInfo;
        this.member = member;
        this.infoSeats = infoSeats;
    }
}