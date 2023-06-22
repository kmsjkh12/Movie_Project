package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.ErrorCode;
import com.movie.Spring_backend.error.exception.InvalidValueException;

// 결제 정보가 일치하지 않을경우의 예외
public class PaymentNotCorrectException extends InvalidValueException {
    // message와 error 코드를 이용하여 부모 클래스의 생성자 InvalidValueException 생성자 호출
    public PaymentNotCorrectException(String message) {super(message, ErrorCode.PAYMENT_NOT_CORRECT);
    }
}