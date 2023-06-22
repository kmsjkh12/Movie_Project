/*
  23-02-06 MovieEntity 좋아요, 평점 추출을 위한 수정(오병주)
 */
package com.movie.Spring_backend.entity;
import javax.persistence.*;

import lombok.*;
import org.hibernate.annotations.Formula;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Table(name="movie")
@Entity
@Getter
@NoArgsConstructor
public class MovieEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mid;

    @Column(nullable = false)
    private String mtitle;

    @Column(nullable = false)
    private String mdir;

    @Column(nullable = false)
    private String mgenre;

    @Column(nullable = false)
    private Integer mtime;

    @Column(nullable = false)
    private Date mdate;

    @Column(nullable = false)
    private String mrating;

    @Column(nullable = false)
    private String mstory;

    @Column(nullable = false)
    private String mimagepath;

    // 영화의 예매기록 갯수 (예매 취소 제외)
    @Column(nullable = false)
    private Integer cntreserve;

    // 좋아요 개수 추출
    @Basic(fetch = FetchType.LAZY)
    @Formula("(select count(*) from movie_member mm where mm.umlike = true and mm.mid = mid)")
    private Integer cntMovieLike;

    // 평점 추출
    @Basic(fetch = FetchType.LAZY)
    @Formula("(select avg(mm.umscore) from movie_member mm where mm.mid = mid)")
    private Float avgScore; // 평점의 평균

    // 영화가 지정된 상영정보 개수
    @Basic(fetch = FetchType.LAZY)
    @Formula("(SELECT COUNT(*) FROM movie_information mi WHERE mi.mid = mid)")
    private Integer cntMovieInfo;

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "movie",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<MovieMemberEntity> movieMembers = new ArrayList<>();

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "movie",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<MovieActorEntity> movieActors = new ArrayList<>();

    @Builder
    public MovieEntity(Long mid, String mtitle, String mdir, String mgenre, Integer mtime, Date mdate, String mrating,
                       String mstory, String mimagepath, Integer cntMovieLike, Float avgScore, Integer cntreserve, Integer cntMovieInfo,
                       List<MovieMemberEntity> movieMembers, List<MovieActorEntity> movieActors) {
        this.mid = mid;
        this.mtitle = mtitle;
        this.mdir = mdir;
        this.mgenre = mgenre;
        this.mtime = mtime;
        this.mdate = mdate;
        this.mrating = mrating;
        this.mstory = mstory;
        this.mimagepath = mimagepath;
        this.cntMovieLike = cntMovieLike;
        this.avgScore = avgScore;
        this.cntreserve = cntreserve;
        this.cntMovieInfo = cntMovieInfo;
        this.movieMembers = movieMembers;
        this.movieActors = movieActors;
    }
}

