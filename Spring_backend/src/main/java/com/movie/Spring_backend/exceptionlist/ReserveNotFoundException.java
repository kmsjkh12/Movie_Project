package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.EntityNotFoundException;
import com.movie.Spring_backend.error.exception.ErrorCode;

// DB에 예매기록이 없는경우 처리되는 예외
public class ReserveNotFoundException extends EntityNotFoundException {
    // message와 errorcode를 이용하여 부모 클래스의 생성자 EntityNotFoundException 생성자 호출
    public ReserveNotFoundException(String message) {
        super(message, ErrorCode.RESERVE_IS_NONE);
    }
}