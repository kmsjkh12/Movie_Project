// 23-01-12 공통 예외처리 구현(오병주)
package com.movie.Spring_backend.error.exception;

public class EntityNotFoundException extends BusinessException {

    // 특정값만 파라미터로 전달되었을 경우 error 코드를 선정하여 부모 클래스인 BusinessException 생성자 호출
    public EntityNotFoundException(String value) {
        super(value, ErrorCode.ENTITY_NOT_FOUND);
    }

    // 특정값과 error 코드가 파라미터로 전달될 경우 그 값들을 이용하여 부모 클래스인 BusinessException 생성자 호출
    public EntityNotFoundException(String value, ErrorCode errorCode) {
        super(value, errorCode);
    }

}