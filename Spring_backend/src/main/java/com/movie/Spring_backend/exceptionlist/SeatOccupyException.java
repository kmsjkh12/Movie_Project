package com.movie.Spring_backend.exceptionlist;

import com.movie.Spring_backend.error.exception.BusinessException;
import com.movie.Spring_backend.error.exception.ErrorCode;

// 좌석이 이미 점유되었을경우 예외처리
public class SeatOccupyException extends BusinessException {
    public SeatOccupyException( String message){
        super(message, ErrorCode.OCCUPY_SEAT_NONE);
    }
}
