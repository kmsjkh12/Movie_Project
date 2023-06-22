package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.ErrorCode;
import com.movie.Spring_backend.error.exception.InvalidValueException;

// 비밀번호가 일치하지 않을경우의 예외
public class PwNotCorrectException extends InvalidValueException {
    // message와 error 코드를 이용하여 부모 클래스의 생성자 InvalidValueException 생성자 호출
    public PwNotCorrectException(String message) {super(message, ErrorCode.PASSWORD_NOT_CORRECT);
    }
}