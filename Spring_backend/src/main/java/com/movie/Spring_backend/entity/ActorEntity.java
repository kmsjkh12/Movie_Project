package com.movie.Spring_backend.entity;

import lombok.*;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "actor")
public class ActorEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long aid;

    private String aname;

    private String abirthplace;

    // 출연한 영화 횟수
    @Basic(fetch = FetchType.LAZY)
    @Formula("(SELECT COUNT(*) FROM movie_actor ma WHERE ma.aid = aid)")
    private Integer cntMovie;

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "actor",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<MovieActorEntity> movieActors = new ArrayList<>();

    @Builder
    public ActorEntity(Long aid, String aname, String abirthplace, Integer cntMovie, List<MovieActorEntity> movieActors) {
        this.aid = aid;
        this.aname = aname;
        this.abirthplace = abirthplace;
        this.cntMovie = cntMovie;
        this.movieActors = movieActors;
    }
}
