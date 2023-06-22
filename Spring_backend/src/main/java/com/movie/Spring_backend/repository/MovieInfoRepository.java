package com.movie.Spring_backend.repository;

import com.movie.Spring_backend.entity.*;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface MovieInfoRepository extends JpaRepository<MovieInfoEntity, Long> {
    // 현재 예매가 가능한 상영정보 조회 메소드(날짜 구할때 사용)
    @Query(value = "SELECT mi FROM MovieInfoEntity as mi " +
            "WHERE mi.mistarttime >= function('addtime', now(), '0:30:00') " +
            "GROUP BY mi.miday " +
            "ORDER BY mi.miday ASC")
    List<MovieInfoEntity> findPossibleMovieInfoDay();

    // 특정 조건을 가진 상영정보들을 구하는 메소드(날짜 구할때 사용)
    @Query(value = "SELECT mi FROM MovieInfoEntity as mi WHERE mi.mistarttime >= function('addtime', now(), '0:30:00') AND " +
            "(:movie is null or mi.movie = :movie) AND mi.cinema IN " +
            "(SELECT c FROM CinemaEntity as c WHERE c.theater IN " +
            "(SELECT t FROM TheaterEntity as t WHERE (:tid is null or t.tid = :tid) AND (:tarea is null or t.tarea = :tarea))) " +
            "GROUP BY mi.miday " +
            "ORDER BY mi.miday ASC")
    List<MovieInfoEntity> findMovieInfoDay(@Param("movie") MovieEntity movie, @Param("tid") Long tid, @Param("tarea") String tarea);

    // 영화 상영 스케줄 검색하는 메소드(예매 페이지)
    @Query(value = "SELECT mi FROM MovieInfoEntity as mi WHERE mi.mistarttime >= function('addtime', now(), '0:30:00') AND " +
            "mi.miday = :miday AND mi.movie = :movie AND mi.cinema IN " +
            "(SELECT c FROM CinemaEntity as c WHERE c.theater = :theater) " +
            "ORDER BY mi.mistarttime ASC")
    @EntityGraph(attributePaths = {"cinema"})
    List<MovieInfoEntity> findSchedule(@Param("miday") Date miday, @Param("movie") MovieEntity movie, @Param("theater") TheaterEntity theater);

    // 상영시간표에서 상영정보를 가져오는 메소드 (영화 선택)
    @Query(value = "SELECT mi FROM MovieInfoEntity as mi INNER JOIN CinemaEntity as ci ON mi.cinema = ci.cid " +
            "INNER JOIN TheaterEntity as t ON ci.theater = t.tid " +
            "WHERE mi.movie = :movie AND mi.miday = :miday AND mi.mistarttime >= function('addtime', now(), '0:30:00') AND t.tarea = :tarea " +
            "ORDER BY mi.cinema ASC, mi.mistarttime ASC")
    @EntityGraph(attributePaths = {"cinema.theater"})
    List<MovieInfoEntity> findTimeTableMovieInfoByMovie(@Param("movie") MovieEntity movie,
                                                        @Param("miday") Date miday, @Param("tarea") String tarea);

    // 상영시간표에서 상영정보를 가져오는 메소드 (극장 선택)
    @Query(value = "SELECT mi FROM MovieInfoEntity as mi INNER JOIN CinemaEntity as ci ON mi.cinema = ci.cid " +
            "INNER JOIN MovieEntity as m ON mi.movie = m.mid " +
            "WHERE mi.miday = :miday AND mi.mistarttime >= function('addtime', now(), '0:30:00') AND ci.theater = :theater " +
            "ORDER BY m.cntreserve DESC, mi.cinema ASC, mi.mistarttime ASC")
    @EntityGraph(attributePaths = {"movie", "cinema"})
    List<MovieInfoEntity> findTimeTableMovieInfoByTheater(@Param("miday") Date miday,
                                                          @Param("theater") TheaterEntity theater);

    // 상영이 끝난 특정 영화 정보를 들고오는 메소드
    @Query(value = "SELECT mi FROM MovieInfoEntity as mi " +
            "WHERE mi.movie = :movie AND mi.miendtime <= now()")
    List<MovieInfoEntity> findInfoBeforeToday(@Param("movie") MovieEntity movie);

    // 특정 사용자가 예매후 관람이 끝난 영화 정보를 들고오는 메소드
    @Query(value = "SELECT mi FROM MovieInfoEntity as mi INNER JOIN mi.reservations rs " +
            "WHERE mi.miendtime <= NOW() AND rs.rstate = 1 AND rs.member = :member")
    List<MovieInfoEntity> findMemberPossible(@Param("member") MemberEntity member);

    // 특정 상영관에 대한 상영정보를 가져오는 메소드
    List<MovieInfoEntity> findByCinema(CinemaEntity cinema);

    // 특정 영화에 대한 상영정보를 가져오는 메소드
    List<MovieInfoEntity> findByMovie(MovieEntity movie);

    // 관리자 페이지에서 상영정보를 가져오는 메소드
    @Query(value = "SELECT mi FROM MovieInfoEntity as mi WHERE (:movie is null or mi.movie = :movie) " +
            "AND (:startDay is null or mi.miday >= :startDay) AND (:endDay is null or mi.miday <= :endDay) " +
            "AND mi.cinema IN :cinemaEntities " +
            "ORDER BY mi.miday DESC, mi.mistarttime DESC")
    @EntityGraph(attributePaths = {"cinema.theater"})
    List<MovieInfoEntity> findManagerMovieInfo(@Param("movie") MovieEntity movie,
                                               @Param("startDay") Date startDay,
                                               @Param("endDay") Date endDay,
                                               @Param("cinemaEntities") List<CinemaEntity> cinemaEntities);

    // 상영정보간 시간을 확인하는 메소드(앞뒤 30분 여유 확인)
    @Query(value = "SELECT mi FROM MovieInfoEntity as mi WHERE mi.cinema = :cinema AND " +
            "(mi.mistarttime BETWEEN :CheckStart AND :CheckEnd OR mi.miendtime BETWEEN :CheckStart AND :CheckEnd)")
    List<MovieInfoEntity> findExistMovieInfo(@Param("cinema") CinemaEntity cinema,
                                             @Param("CheckStart") String CheckStart,
                                             @Param("CheckEnd") String CheckEnd);

    // 상영정보를 수정하는 메소드
    @Modifying
    @Query("UPDATE MovieInfoEntity as mi " +
            "SET mi.miday = :miday, mi.mistarttime = :mistarttime, mi.miendtime = :miendtime, " +
            "mi.movie = :movie, mi.cinema = :cinema WHERE mi.miid = :miid")
    void MovieInfoUpdate(@Param("miid") Long miid, @Param("miday") Date miday, @Param("mistarttime") String mistarttime,
                          @Param ("miendtime") String miendtime, @Param("movie") MovieEntity movie, @Param("cinema") CinemaEntity cinema);
}

