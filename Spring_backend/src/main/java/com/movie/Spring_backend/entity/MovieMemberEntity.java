/*
  23-02-05 영화 좋아요 기능을 위한 entity 분리(오병주)
  23-02-23 관람평 formula 생성(오병주)
*/
package com.movie.Spring_backend.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Table(name="movie_member")
@Entity
@Getter
@NoArgsConstructor
public class MovieMemberEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long umid;

    private Boolean umlike;

    private String umliketime;

    private Integer umscore;

    private String umcomment;

    private String umcommenttime;

    // 관람평 좋아요 개수 추출
    // 테이블에는 존재하지 않고 Formula 어노테이션으로 테이블을 join 시켜서 들고옴
    @Basic(fetch = FetchType.LAZY)
    @Formula("(SELECT COUNT(*) from comment_info ci WHERE ci.umid = umid)")
    private Integer cntCommentLike;

    // 다대일 관계 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="mid")
    private MovieEntity movie;

    // 다대일 관계 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="uid")
    private MemberEntity member;

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "moviemember",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<CommentInfoEntity> commentInfos = new ArrayList<>();

    @Builder
    public MovieMemberEntity(Long umid, Boolean umlike, String umliketime, Integer umscore , String umcomment, String umcommenttime,
                             Integer cntCommentLike, MovieEntity movie, MemberEntity member, List<CommentInfoEntity> commentInfos) {
        this.umid = umid;
        this.umlike = umlike;
        this.umliketime = umliketime;
        this.umscore = umscore;
        this.umcomment = umcomment;
        this.umcommenttime = umcommenttime;
        this.cntCommentLike = cntCommentLike;
        this.movie = movie;
        this.member = member;
        this.commentInfos = commentInfos;
    }
}

