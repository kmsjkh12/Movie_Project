package com.movie.Spring_backend.repository;

import com.movie.Spring_backend.entity.MovieActorEntity;
import com.movie.Spring_backend.entity.MovieEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieActorRepository extends JpaRepository<MovieActorEntity, Long> {
    // 특정 영화에 출연하는 배우 검색하는 메소드
    @EntityGraph(attributePaths = {"actor"})
    List<MovieActorEntity> findByMovie(MovieEntity movie);

    // 배우의 정보까지 묶어서 불러오는 메소드
    @EntityGraph(attributePaths = {"actor"})
    List<MovieActorEntity> findAllByOrderByMovieAsc();

    // 특정 영화에 출연하는 배우를 삭제하는 메소드
    void deleteByMovie(MovieEntity movie);
}
