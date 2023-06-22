package com.movie.Spring_backend.repository;

import com.movie.Spring_backend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardLikeRepository extends JpaRepository<BoardLikeEntity, Long> {
    // 게시물 좋아요 조회 메소드
    Optional<BoardLikeEntity> findByBoardAndMemberAndBllikeTrueAndBoardcommentIsNull(BoardEntity board, MemberEntity member);

    // 게시물 싫어요 조회 메소드
    Optional<BoardLikeEntity> findByBoardAndMemberAndBlunlikeTrueAndBoardcommentIsNull(BoardEntity board, MemberEntity member);

    // 게시물 좋아요 삭제하는 메소드
    void deleteByBoardAndMemberAndBllikeTrueAndBoardcommentIsNull(BoardEntity board, MemberEntity member);

    // 게시물 싫어요 삭제하는 메소드
    void deleteByBoardAndMemberAndBlunlikeTrueAndBoardcommentIsNull(BoardEntity board, MemberEntity member);

    // 댓글 좋아요 조회 메소드
    List<BoardLikeEntity> findByBoardAndMemberAndBllikeTrueAndBoardcommentIsNotNull(BoardEntity board, MemberEntity member);

    // 댓글 싫어요 조회 메소드
    List<BoardLikeEntity> findByBoardAndMemberAndBlunlikeTrueAndBoardcommentIsNotNull(BoardEntity board, MemberEntity member);

    // 개별 댓글 좋아요 조회 메소드
    Optional<BoardLikeEntity> findByBoardAndMemberAndBoardcommentAndBllikeTrue(BoardEntity board, MemberEntity member, BoardCommentEntity boardComment);

    // 개별 댓글 싫어요 조회 메소드
    Optional<BoardLikeEntity> findByBoardAndMemberAndBoardcommentAndBlunlikeTrue(BoardEntity board, MemberEntity member, BoardCommentEntity boardComment);

    // 댓글 좋아요 삭제하는 메소드
    void deleteByBoardAndMemberAndBoardcommentAndBllikeTrue(BoardEntity board, MemberEntity member, BoardCommentEntity boardComment);

    // 댓글 싫어요 삭제하는 메소드
    void deleteByBoardAndMemberAndBoardcommentAndBlunlikeTrue(BoardEntity board, MemberEntity member, BoardCommentEntity boardComment);
}
