/*
    23-02-06 좋아요 및 평점 관리를 위한 Repository 생성(오병주)
 */
package com.movie.Spring_backend.repository;

import com.movie.Spring_backend.entity.MemberEntity;
import com.movie.Spring_backend.entity.MovieEntity;
import com.movie.Spring_backend.entity.MovieMemberEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieMemberRepository extends JpaRepository<MovieMemberEntity, Long> {
    // 사용자가 좋아요 누른 영화 목록 구하는 메소드
    List<MovieMemberEntity> findByUmlikeTrueAndMember(MemberEntity member);

    // 사용자가 작성한 관람평 목록을 구하는 메소드
    List<MovieMemberEntity> findByUmcommentIsNotNullAndMember(MemberEntity member);

    // 사용자가 작성한 관람평 목록을 구하는 메소드(작성시간 기준으로 내림차순, EntityGraph 써서 movie 정보도 같이 들고옴)
    @EntityGraph(attributePaths = {"movie"})
    List<MovieMemberEntity> findByUmcommentIsNotNullAndMemberOrderByUmcommenttimeDesc(MemberEntity member);

    // MovieMember 테이블에 튜플이 있는지 확인하는 메소드
    Optional<MovieMemberEntity> findByMovieAndMember(MovieEntity movie, MemberEntity member);

    // MovieMember 테이블에 튜플이 존재할경우 관람평 내용을 update 하는 메소드
    @Modifying
    @Query("UPDATE MovieMemberEntity mm " +
            "SET mm.umscore = :umscore, mm.umcomment = :umcomment, mm.umcommenttime = now() " +
            "WHERE mm.member = :member AND mm.movie = :movie")
    void MovieCommentUpdate(@Param("umscore") int umscore, @Param("umcomment") String umcomment,
                            @Param("member") MemberEntity member, @Param("movie") MovieEntity movie);

    // 사용자의 좋아요 기록을 true에서 false로 바꾸는 메소드
    @Modifying
    @Query("UPDATE MovieMemberEntity mm " +
            "SET mm.umlike = false, mm.umliketime = null " +
            "WHERE mm.member = :member AND mm.movie = :movie")
    void MovieLikeChangeFalse(@Param("member") MemberEntity member, @Param("movie") MovieEntity movie);

    // 사용자의 좋아요 기록을 false에서 true로 바꾸는 메소드
    @Modifying
    @Query("UPDATE MovieMemberEntity mm " +
            "SET mm.umlike = true, mm.umliketime = NOW() " +
            "WHERE mm.member = :member AND mm.movie = :movie")
    void MovieLikeChangeTrue(@Param("member") MemberEntity member, @Param("movie") MovieEntity movie);

    // 특정 영화의 MovieMember 관람평 정보를 들고오는 메소드(최신순 --> 작성시간 내림차순)
    List<MovieMemberEntity> findByMovieAndUmcommentIsNotNullOrderByUmcommenttimeDesc(MovieEntity movie);

    // 특정 영화의 MovieMember 관람평 정보를 들고오는 메소드(좋아요순, 작성시간 오름차순)
    @Query(value = "SELECT mm FROM MovieMemberEntity as mm " +
            "WHERE mm.movie = :movie AND mm.umcomment is not null " +
            "ORDER BY mm.cntCommentLike DESC, mm.umcommenttime ASC")
    List<MovieMemberEntity> findAllCommentLikeDESC(@Param("movie") MovieEntity movie);

    // 영화 관람평에 대한 기록을 지우는 메소드
    @Modifying
    @Query("UPDATE MovieMemberEntity mm " +
            "SET mm.umscore = null, mm.umcomment = null, mm.umcommenttime = null " +
            "WHERE mm.member = :member AND mm.movie = :movie")
    void MovieCommentNull(@Param("member") MemberEntity member, @Param("movie") MovieEntity movie);
}
