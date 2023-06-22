//23-01-09 ~ 23-01-10 id 중복 확인 및 mysql 점검(오병주)
package com.movie.Spring_backend.entity;

import lombok.*;
import javax.persistence.*;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

// 빌더패턴을 사용한 entity 파일
@Entity
@Getter
@NoArgsConstructor
@Table(name = "member")     // 디비의 테이블명과 클래스 명이 다를 경우
public class MemberEntity {

    @Id
    @Column(nullable = false)
    private String uid;

    @Column(nullable = false)
    private String upw;

    @Column(nullable = false)
    private String uname;

    @Column(unique = true)
    private String uemail;

    @Column(nullable = false)
    private String utel;

    @Column(nullable = false)
    private String uaddr;

    @Column(nullable = false)
    private String uaddrsecond;

    @Column(nullable = false)
    private Date ubirth;

    @Column(nullable = false)
    private Date ujoindate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Authority uauthority;

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "member",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<MovieMemberEntity> movieMembers = new ArrayList<>();

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "member",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<ReservationEntity> reservations = new ArrayList<>();

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "member",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<CommentInfoEntity> commentInfos = new ArrayList<>();

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "member",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<BoardEntity> boards = new ArrayList<>();

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "member",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<BoardCommentEntity> boardComments = new ArrayList<>();

    // 일대다 관계 매핑
    @OneToMany(mappedBy = "member",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE)
    private List<BoardLikeEntity> boardLikes = new ArrayList<>();

    @Builder
    public MemberEntity(String uid, String upw, String uname, String uemail, String utel, String uaddr,
                        String uaddrsecond, Date ubirth, Date ujoindate, Authority uauthority, List<MovieMemberEntity> movieMembers,
                        List<ReservationEntity> reservations, List<CommentInfoEntity> commentInfos, List<BoardEntity> boards,
                        List<BoardCommentEntity> boardComments, List<BoardLikeEntity> boardLikes) {
        this.uid = uid;
        this.upw = upw;
        this.uname = uname;
        this.uemail = uemail;
        this.utel = utel;
        this.uaddr = uaddr;
        this.uaddrsecond = uaddrsecond;
        this.ubirth = ubirth;
        this.ujoindate = ujoindate;
        this.uauthority = uauthority;
        this.movieMembers = movieMembers;
        this.reservations = reservations;
        this.commentInfos = commentInfos;
        this.boards = boards;
        this.boardComments = boardComments;
        this.boardLikes = boardLikes;
    }
}
