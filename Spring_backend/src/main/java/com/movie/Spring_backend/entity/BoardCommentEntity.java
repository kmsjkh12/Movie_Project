package com.movie.Spring_backend.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "board_comment")
public class BoardCommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bcid;

    @Column(nullable = false)
    private String bccomment;

    @Column(nullable = false)
    private String bcdate;

    // 최상위 부모 댓글
    private Long bcroot;

    // 바로 위 부모 댓글
    private Long bcparent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bid")
    private BoardEntity board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="uid")
    private MemberEntity member;

    @Basic(fetch = FetchType.LAZY)
    @Formula("(SELECT COUNT(*) FROM board_like bl WHERE bl.bcid = bcid AND bl.bllike = true)")
    private Integer likes;

    @Basic(fetch = FetchType.LAZY)
    @Formula("(SELECT COUNT(*) FROM board_like bl WHERE bl.bcid = bcid AND bl.blunlike = true)")
    private Integer unlikes;

    @OneToMany(mappedBy = "boardcomment",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<BoardLikeEntity> boardLikes = new ArrayList<>();

    @Builder
    public BoardCommentEntity(Long bcid, String bccomment, String bcdate, Long bcroot, Long bcparent, BoardEntity board, MemberEntity member,
                               Integer likes, Integer unlikes, List<BoardLikeEntity> boardLikes) {
        this.bcid = bcid;
        this.bccomment = bccomment;
        this.bcdate = bcdate;
        this.bcroot = bcroot;
        this.bcparent = bcparent;
        this.board = board;
        this.member = member;
        this.likes = likes;
        this.unlikes = unlikes;
        this.boardLikes = boardLikes;
    }
}
