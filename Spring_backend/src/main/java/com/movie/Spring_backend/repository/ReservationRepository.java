package com.movie.Spring_backend.repository;

import com.movie.Spring_backend.entity.*;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
    // 사용자 id와 영화정보 id를 이용하여 엔티티 조회하는 메소드 (예매 취소된것 제외)
    List<ReservationEntity> findByRstateTrueAndMemberAndMovieInfoIn(MemberEntity member, List<MovieInfoEntity> movieInfos);

    // 결제 고유번호를 이용하여 예매기록 조회하는 메소드
    Optional<ReservationEntity> findByRpayid(String rpayid);

    // 사용자가 예매한 영화 정보들을 가져오는 메소드(예매시간 순으로 내림차순, 아직 영화가 끝나지 않은 예매들)
    @Query(value = "SELECT rs FROM ReservationEntity as rs INNER JOIN MovieInfoEntity as mi " +
            "ON rs.movieInfo = mi.miid " +
            "WHERE rs.member = :member AND rs.rstate = true AND rs.rdate > :rdate AND mi.miendtime > now() " +
            "ORDER BY rs.rdate DESC")
    @EntityGraph(attributePaths = {"movieInfo.movie", "movieInfo.cinema.theater"})
    List<ReservationEntity> findMyPageReserve(@Param("member") MemberEntity member, @Param("rdate") String rdate);

    // 사용자가 예매취소한 영화 정보들을 가져오는 메소드(취소시간 순으로 내림차순)
    @Query(value = "SELECT rs FROM ReservationEntity as rs INNER JOIN MovieInfoEntity as mi " +
             "ON rs.movieInfo = mi.miid " +
             "WHERE rs.member = :member AND rs.rstate = false AND rs.rdate > :rdate " +
             "ORDER BY rs.rcanceldate DESC")
    @EntityGraph(attributePaths = {"movieInfo.movie", "movieInfo.cinema.theater"})
    List<ReservationEntity> findMyPageReserveCancel(@Param("member") MemberEntity member, @Param("rdate") String rdate);

    // 사용자가 예매한 지난 관람내역들을 가져오는 메소드(예매시간 순으로 내림차순, 영화가 끝난 예매들)
    @Query(value = "SELECT rs FROM ReservationEntity as rs INNER JOIN MovieInfoEntity as mi " +
            "ON rs.movieInfo = mi.miid " +
            "WHERE rs.member = :member AND rs.rstate = true AND rs.rdate > :rdate AND mi.miendtime <= now() " +
            "ORDER BY rs.rdate DESC")
    @EntityGraph(attributePaths = {"movieInfo.movie", "movieInfo.cinema.theater"})
    List<ReservationEntity> findMyPageReserveFinish(@Param("member") MemberEntity member, @Param("rdate") String rdate);

    // 사용자가 예매한 영화의 세부내역을 가져오는 메소드
    @Query(value = "SELECT rs FROM ReservationEntity as rs INNER JOIN MovieInfoEntity as mi " +
            "ON rs.movieInfo = mi.miid " +
            "WHERE rs.rid = :rid")
    @EntityGraph(attributePaths = {"movieInfo.movie", "movieInfo.cinema.theater"})
    Optional<ReservationEntity> findMyPageReserveDetail(@Param("rid") Long rid);

    // 예매 취소시 컬럼을 수정하는 메소드(예매 상태를 false, 취소시간을 현재 시간으로)
    @Modifying
    @Query("UPDATE ReservationEntity as rs " +
            "SET rs.rstate = false, rs.rcanceldate = now() " +
            "WHERE rs.rid = :rid")
    void UserReservationCancel(@Param("rid") Long rid);

    // 특정 영화의 예매 기록을 전부 들고오는 메소드(예매시간 순으로 내림차순, 예매취소 제외)
    @Query(value = "SELECT rs FROM ReservationEntity as rs INNER JOIN MovieInfoEntity as mi " +
            "ON rs.movieInfo = mi.miid " +
            "WHERE mi.movie = :movie " +
            "ORDER BY rs.rdate DESC")
    @EntityGraph(attributePaths = {"movieInfo.cinema.theater"})
    List<ReservationEntity> findManagerReserveMovie(@Param("movie") MovieEntity movie);

    // 특정 극장의 예매 기록을 들고오는 메소드(예매시간 순으로 내림차순)
    @Query(value = "SELECT rs FROM ReservationEntity as rs INNER JOIN MovieInfoEntity as mi ON rs.movieInfo = mi.miid " +
            "INNER JOIN CinemaEntity as ci ON mi.cinema = ci.cid " +
            "WHERE ci.theater = :theater " +
            "ORDER BY rs.rdate DESC")
    @EntityGraph(attributePaths = {"movieInfo.cinema.theater"})
    List<ReservationEntity> findManagerReserveTheater(@Param("theater") TheaterEntity theater);

    // 특정 상영정보에 예매기록을 조회하는 메소드
    List<ReservationEntity> findByMovieInfo(MovieInfoEntity movieInfo);
}
