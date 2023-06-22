package com.movie.Spring_backend.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "movie_cinema")
public class CinemaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cid;

    @Column(nullable = false)
    private String cname;

    @Column(nullable = false)
    private String ctype;

    @Column(nullable = false)
    private Integer cseat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="tid")
    private TheaterEntity theater;

    // 상영관이 지정된 상영정보 개수
    @Basic(fetch = FetchType.LAZY)
    @Formula("(SELECT COUNT(*) FROM movie_information mi WHERE mi.cid = cid)")
    private Integer cntMovieInfo;

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "cinema",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<SeatEntity> seats = new ArrayList<>();
    
    @Builder
    public CinemaEntity(Long cid, String cname, String ctype, Integer cseat ,TheaterEntity theater,
                        Integer cntMovieInfo, List<SeatEntity> seats) {
        this.cid = cid;
        this.cname = cname;
        this.ctype = ctype;
        this.cseat = cseat;
        this.theater = theater;
        this.cntMovieInfo = cntMovieInfo;
        this.seats = seats;
    }
}

