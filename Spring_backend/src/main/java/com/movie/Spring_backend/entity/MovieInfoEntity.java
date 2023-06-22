package com.movie.Spring_backend.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Table(name="movie_information")
@Entity
@Getter
@NoArgsConstructor

public class MovieInfoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long miid;

    @Column(nullable = false)
    private Date miday;

    @Column(nullable = false)
    private String mistarttime;

    @Column(nullable = false)
    private String miendtime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="mid")
    private MovieEntity movie; //주인 N

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="cid")
    private CinemaEntity cinema;

    // 현재 상영정보가 점유한 좌석 개수
    @Basic(fetch = FetchType.LAZY)
    @Formula("(SELECT COUNT(*) FROM movie_infoseat mis WHERE mis.miid = miid)")
    private Integer cntSeatInfo;

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "movieInfo",
            fetch = FetchType.LAZY)
    private List<ReservationEntity> reservations = new ArrayList<>();

    @Builder
    public MovieInfoEntity(Long miid, Date miday, String mistarttime, String miendtime, MovieEntity movie, CinemaEntity cinema,
                           Integer cntSeatInfo, List<ReservationEntity> reservations) {
       this.miid = miid;
       this.miday = miday;
       this.mistarttime = mistarttime;
       this.miendtime = miendtime;
       this.movie = movie;
       this.cinema = cinema;
       this.cntSeatInfo = cntSeatInfo;
       this.reservations = reservations;
    }
}
