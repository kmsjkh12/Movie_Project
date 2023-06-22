/*
  23-02-14 출연진 다중값 사용을 위한 entity 분리(오병주)
 */
package com.movie.Spring_backend.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Table(name="movie_actor")
@Entity
@Getter
@NoArgsConstructor
public class MovieActorEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maid;

    @Column(nullable = false)
    private String marole;

    // 다대일 관계 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="mid")
    private MovieEntity movie;

    // 다대일 관계 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="aid")
    private ActorEntity actor;

    @Builder
    public MovieActorEntity(Long maid, String marole, MovieEntity movie, ActorEntity actor) {
        this.maid = maid;
        this.marole = marole;
        this.movie = movie;
        this.actor = actor;
    }
}

