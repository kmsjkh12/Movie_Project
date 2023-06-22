package com.movie.Spring_backend.repository;

import com.movie.Spring_backend.entity.CommentInfoEntity;
import com.movie.Spring_backend.entity.MemberEntity;
import com.movie.Spring_backend.entity.MovieMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentInfoRepository extends JpaRepository<CommentInfoEntity, Long> {
    // 사용자 ID와 관람평 번호를 이용해서 좋아요 기록을 조회하는 메소드
    Optional<CommentInfoEntity> findByMemberAndMoviemember(MemberEntity member, MovieMemberEntity moviemember);

    // 사용자가 좋아요 누른 관람평 목록 구하는 메소드
    List<CommentInfoEntity> findByMember(MemberEntity member);

    // 사용자 ID와 관람평 번호를 이용해서 좋아요 기록을 삭제하는 메소드
    void deleteByMemberAndMoviemember(MemberEntity member, MovieMemberEntity moviemember);

    // 특정 관람평의 좋아요 기록을 모두 삭제하는 메소드
    void deleteByMoviemember(MovieMemberEntity moviemember);
}

