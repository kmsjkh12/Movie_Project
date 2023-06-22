package com.movie.Spring_backend.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Table(name="comment_info")
@Entity
@Getter
@NoArgsConstructor
public class CommentInfoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cuid;

    // 다대일 관계 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="umid")
    private MovieMemberEntity moviemember;

    // 다대일 관계 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="uid")
    private MemberEntity member;

    @Builder
    public CommentInfoEntity(Long cuid, MovieMemberEntity moviemember, MemberEntity member) {
        this.cuid = cuid;
        this.moviemember = moviemember;
        this.member = member;
    }
}

