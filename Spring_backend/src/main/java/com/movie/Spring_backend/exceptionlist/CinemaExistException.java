package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.ErrorCode;
import com.movie.Spring_backend.error.exception.InvalidValueException;

// 상영관이 존재할경우 예외처리
public class CinemaExistException extends InvalidValueException {
    // message와 error 코드를 이용하여 부모 클래스의 생성자 InvalidValueException 생성자 호출
    public CinemaExistException(String message) {super(message, ErrorCode.CINEMA_IS_EXIST);
    }
}