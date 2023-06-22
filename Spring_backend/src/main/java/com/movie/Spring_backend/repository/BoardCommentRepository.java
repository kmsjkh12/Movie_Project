package com.movie.Spring_backend.repository;

import com.movie.Spring_backend.entity.BoardCommentEntity;
import com.movie.Spring_backend.entity.BoardEntity;
import com.movie.Spring_backend.entity.MemberEntity;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardCommentRepository extends JpaRepository<BoardCommentEntity, Long> {
    // 댓글 조회 메소드(최상위 부모 댓글만, 최신순)
    List<BoardCommentEntity> findByBoardAndBcrootIsNullOrderByBcidDesc(BoardEntity board);

    // 댓글 조회 메소드(최상위 부모 댓글만, 인기순)
    @Query("SELECT bc FROM BoardCommentEntity AS bc WHERE bc.board = :board AND bc.bcroot IS NULL " +
            "ORDER BY bc.likes - bc.unlikes DESC, bc.bcid ASC")
    List<BoardCommentEntity> findByCommentLike(@Param("board") BoardEntity board);

    // 답글 조회 메소드(작성 시간순으로 최신순)
    List<BoardCommentEntity> findByBoardAndBcrootIsNotNullOrderByBcrootAscBcparentAscBcidDesc(BoardEntity board);

    // 최상위 부모댓글에 관련된 답글 제거하는 메소드
    void deleteByBcroot(Long bcroot);

    // 특정 답글 조회 메소드(부모로 조회)
    List<BoardCommentEntity> findByBcparent(Long bcparent);

    // 특정 사용자가 적은 모든 댓글 조회
    List<BoardCommentEntity> findByMember(MemberEntity member);
}
