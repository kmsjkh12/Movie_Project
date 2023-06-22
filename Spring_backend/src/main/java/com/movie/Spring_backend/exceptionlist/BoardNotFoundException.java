package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.EntityNotFoundException;
import com.movie.Spring_backend.error.exception.ErrorCode;

// 게시물이 없을경우 예외처리
public class BoardNotFoundException extends EntityNotFoundException {
    public BoardNotFoundException(String message) {super(message, ErrorCode.BOARD_IS_NONE);}
}

