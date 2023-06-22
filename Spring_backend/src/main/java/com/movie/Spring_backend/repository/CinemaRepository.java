package com.movie.Spring_backend.repository;

import com.movie.Spring_backend.entity.CinemaEntity;
import com.movie.Spring_backend.entity.TheaterEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CinemaRepository extends JpaRepository<CinemaEntity, Long> {
    // 영화관 정보까지 묶어서 검색하는 메소드
    @Override
    @EntityGraph(attributePaths = {"theater"})
    List<CinemaEntity> findAll();

    // 특정 지역 또는 극장에 대한 상영관 조회하는 메소드
    @Query("SELECT c FROM CinemaEntity as c WHERE c.theater IN " +
            "(SELECT t FROM TheaterEntity as t WHERE (:tid is null or t.tid = :tid) AND (:tarea is null or t.tarea = :tarea))")
    List<CinemaEntity> findByTidAndTarea(@Param("tid") Long tid, @Param("tarea") String tarea);

    // 극장 ID를 이용해서 상영관을 검색하는 메소드
    List<CinemaEntity> findByTheater(TheaterEntity theater);

    // 상영관 수정하는 메소드
    @Modifying
    @Query("UPDATE CinemaEntity as c " +
            "SET c.cname = :cname, c.ctype = :ctype, c.cseat = :cseat, " +
            "c.theater = :theater WHERE c.cid = :cid")
    void CinemaUpdate(@Param("cname") String cname, @Param("ctype") String ctype, @Param("cseat") Integer cseat,
                      @Param("theater") TheaterEntity theater, @Param("cid") Long cid);
}


