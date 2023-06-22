package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.EntityNotFoundException;
import com.movie.Spring_backend.error.exception.ErrorCode;

public class TheaterNotFoundException extends EntityNotFoundException {
    // 극장을 검색했을 때 값이 NULL이면 사용하는 예외처리
    public TheaterNotFoundException(String message) {super(message, ErrorCode.THEATER_IS_NONE);}
}

