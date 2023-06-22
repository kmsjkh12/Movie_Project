//23-01-09 ~ 23-01-10 id 중복 확인 및 mysql 점검(오병주)
package com.movie.Spring_backend.dto;

import com.movie.Spring_backend.entity.Authority;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Date;

// 빌더패턴을 사용한 Dto 파일
@Getter
@NoArgsConstructor
public class MemberDto {
    private String uid;
    private String upw;
    private String uname;
    private String uemail;
    private String utel;
    private String uaddr;
    private String uaddrsecond;
    private Date ubirth;
    private Date ujoindate;
    private Authority uauthority;
    private String newPw;

    @Builder
    public MemberDto(String uid, String upw, String uname, String uemail, String utel,
                     String uaddr, String uaddrsecond, Date ubirth, Date ujoindate, Authority uauthority, String newPw) {
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
        this.newPw = newPw;
    }
}