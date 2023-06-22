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
@Table(name = "board")
public class BoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bid;

    @Column(nullable = false)
    private String btitle;

    @Column(nullable = false)
    private String bdetail;

    @Column(nullable = false)
    private String bdate;

    @Column(nullable = false)
    private Integer bclickindex;

    @Column(nullable = false)
    private String bcategory;

    @Column(nullable = false)
    private String bthumbnail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="uid")
    private MemberEntity member;

    @Basic(fetch = FetchType.LAZY)
    @Formula("(SELECT COUNT(*) FROM board_like AS bl WHERE bl.bid = bid AND bl.bllike = true AND bl.bcid IS NULL)")
    private Integer likes;

    @Basic(fetch = FetchType.LAZY)
    @Formula("(SELECT COUNT(*) FROM board_like AS bl WHERE bl.bid = bid AND bl.blunlike = true AND bl.bcid IS NULL)")
    private Integer unlikes;

    @Basic(fetch = FetchType.LAZY)
    @Formula("(SELECT COUNT(*) FROM board_comment AS comment WHERE comment.bid = bid)")
    private Integer commentCounts;

    @OneToMany(mappedBy = "board",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<BoardCommentEntity> boardComments = new ArrayList<>();

    @OneToMany(mappedBy = "board",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<BoardLikeEntity> boardLikes = new ArrayList<>();

    @Builder
    public BoardEntity(Long bid, String btitle, String bdetail, String bdate, Integer bclickindex, String bcategory,
                       String bthumbnail, MemberEntity member, Integer likes, Integer unlikes, Integer commentCounts,
                       List<BoardCommentEntity> boardComments, List<BoardLikeEntity> boardLikes) {
        this.bid = bid;
        this.btitle = btitle;
        this.bdetail = bdetail;
        this.bdate = bdate;
        this.bclickindex = bclickindex;
        this.bcategory = bcategory;
        this.bthumbnail = bthumbnail;
        this.member = member;
        this.likes = likes;
        this.unlikes = unlikes;
        this.commentCounts = commentCounts;
        this.boardComments = boardComments;
        this.boardLikes = boardLikes;
    }
}
