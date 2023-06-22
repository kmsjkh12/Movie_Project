package com.movie.Spring_backend.repository;

import com.movie.Spring_backend.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, String> {
    // 이메일 중복을 검사하는 메소드
    boolean existsByUemail(String email);

    // 회원 이름과 이메일을 이용하여 검색하는 메소드
    Optional<MemberEntity> findByUnameAndUemail(String uname, String Uemail);

    // 회원 이름, 아이디, 이메일을 이용하여 검색하는 메소드
    Optional<MemberEntity> findByUnameAndUidAndUemail(String uname, String uid, String Uemail);

    // 비밀번호 변경 메소드
    @Modifying
    @Query("UPDATE MemberEntity u SET u.upw = :upw WHERE u.uid = :uid")
    void MemberPwUpdate(@Param("uid") String uid, @Param("upw") String upw);

    // 회원정보를 수정했을 때 실행되는 메소드
    @Modifying
    @Query("UPDATE MemberEntity u " +
            "SET u.uid = :uid, u.upw = :upw, u.uname = :uname, u.uemail = :uemail, u.utel = :utel, " +
            "u.uaddr = :uaddr, u.uaddrsecond = :uaddrsecond, ubirth = :ubirth WHERE u.uid = :uid")
    void MemberInfoUpdate(@Param("uid") String uid, @Param("upw") String upw, @Param("uname") String uname,
                            @Param ("uemail") String uemail, @Param("utel") String utel, @Param("uaddr") String uaddr,
                            @Param("uaddrsecond") String uaddrsecond, @Param("ubirth") Date ubirth);

    // 사용자 조회 메소드(계정명으로 검색, 전체 검색)
    List<MemberEntity> findByUidContainsOrderByUidAsc(String uid);

    // 사용자 조회 메소드(이름으로 검색, 전체 검색)
    List<MemberEntity> findByUnameContainsOrderByUidAsc(String name);
}
