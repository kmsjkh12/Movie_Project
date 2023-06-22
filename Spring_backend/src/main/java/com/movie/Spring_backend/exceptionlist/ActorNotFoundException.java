package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.EntityNotFoundException;
import com.movie.Spring_backend.error.exception.ErrorCode;

public class ActorNotFoundException extends EntityNotFoundException {
    // 배우를 검색했을 때 값이 NULL이면 사용하는 예외처리
    public ActorNotFoundException(String message) {super(message, ErrorCode.ACTOR_IS_NONE);}
}

