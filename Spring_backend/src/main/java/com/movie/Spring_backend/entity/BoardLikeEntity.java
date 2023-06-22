package com.movie.Spring_backend.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@Table(name= "board_like")
public class BoardLikeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long blid;

    private Boolean bllike;

    private Boolean blunlike;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bid")
    private BoardEntity board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bcid")
    private BoardCommentEntity boardcomment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="uid")
    private MemberEntity member;

    @Builder
    public BoardLikeEntity(Long blid, boolean bllike, boolean blunlike, BoardEntity board,
                           BoardCommentEntity boardcomment, MemberEntity member) {
        this.blid = blid;
        this.bllike = bllike;
        this.blunlike = blunlike;
        this.board = board;
        this.boardcomment = boardcomment;
        this.member = member;
    }
}
