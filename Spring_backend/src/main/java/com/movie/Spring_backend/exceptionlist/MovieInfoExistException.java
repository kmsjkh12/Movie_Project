// 23-04-06 상영정보 수정시 필요한 예외처리 구현(오병주)
package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.ErrorCode;
import com.movie.Spring_backend.error.exception.InvalidValueException;

// 상영정보가 존재할 때 발생하는 예외처리
public class MovieInfoExistException extends InvalidValueException {
    // message와 error 코드를 이용하여 부모 클래스의 생성자 InvalidValueException 생성자 호출
    public MovieInfoExistException(String message) {super(message, ErrorCode.MOVIEINFO_IS_EXIST);
    }
}