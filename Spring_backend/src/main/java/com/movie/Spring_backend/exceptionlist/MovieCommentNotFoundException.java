// 23-02-23 관람평이 없는 경우 예외처리 구현(오병주)
package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.EntityNotFoundException;
import com.movie.Spring_backend.error.exception.ErrorCode;

// 관람평이 없는 경우 예외처리
public class MovieCommentNotFoundException extends EntityNotFoundException {
    // message와 errorcode를 이용하여 부모 클래스의 생성자 EntityNotFoundException 생성자 호출
    public MovieCommentNotFoundException(String message) {
        super(message, ErrorCode.COMMENT_IS_NONE);
    }
}