package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.EntityNotFoundException;
import com.movie.Spring_backend.error.exception.ErrorCode;

// 게시물 댓글이 없을경우 예외처리
public class BoardCommentNotFoundException extends EntityNotFoundException {
    public BoardCommentNotFoundException(String message) {
        super(message, ErrorCode.BOARD_COMMENT_IS_NONE);
    }
}