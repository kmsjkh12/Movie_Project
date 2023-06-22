// 23-01-16 회원정보가 DB에 없는 경우 예외처리 구현(오병주)
package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.EntityNotFoundException;
import com.movie.Spring_backend.error.exception.ErrorCode;

// DB에 회원정보가 없는경우 처리되는 예외
public class MemberNotFoundException extends EntityNotFoundException {
    // uid와 errorcode를 이용하여 부모 클래스의 생성자 EntityNotFoundException 생성자 호출
    public MemberNotFoundException(String uid) {
        super(uid, ErrorCode.MEMBER_NOT_FOUND);
    }
}
