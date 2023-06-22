package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.EntityNotFoundException;
import com.movie.Spring_backend.error.exception.ErrorCode;

public class MovieInfoNotFoundException extends EntityNotFoundException {
    // 상영정보를 검색했을 때 값이 NULL이면 사용하는 예외처리
    public MovieInfoNotFoundException(String message) {super(message, ErrorCode.MOVIEINFO_IS_NONE);}
}