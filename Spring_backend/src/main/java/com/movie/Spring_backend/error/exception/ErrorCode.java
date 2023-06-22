// 23-01-12 공통 예외처리 구현(오병주)
package com.movie.Spring_backend.error.exception;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum ErrorCode {
    // Common
    INVALID_INPUT_VALUE(400, "C001", " Invalid Input Value"),
    METHOD_NOT_ALLOWED(405, "C002", " Invalid Input Value"),
    ENTITY_NOT_FOUND(400, "C003", " Entity Not Found"),
    INTERNAL_SERVER_ERROR(500, "C004", "Server Error"),
    INVALID_TYPE_VALUE(400, "C005", " Invalid Type Value"),
    HANDLE_ACCESS_DENIED(403, "C006", "Access is Denied"),

    // Member
    ID_DUPLICATION(400, "M001", "중복된 아이디입니다."),
    EMAIL_DUPLICATION(400, "M002", "중복된 이메일입니다."),
    SIGN_UNEXPECTED_ERROR(400, "M003", "예기치 못한 오류가 발생하였습니다. 다시 회원가입 해주십시오."),
    MEMBER_NOT_FOUND(400, "M004", "회원정보가 존재하지 않습니다."),
    PASSWORD_NOT_CORRECT(400, "M005", "비밀번호가 일치하지 않습니다."),

    // Security
    LOGIN_IS_NONE(401, "S001", "로그인 정보가 존재하지 않습니다."),
    EXPIRED_TOKEN(401, "S002", "로그인이 만료되었습니다."),
    INVALID_TOKEN(401, "S003", "로그인 정보가 불일치합니다."),
    SECURITY_ACCESS_DENIED(403, "S004", "권한이 필요합니다."),
    CSRF_ERROR(403, "S005", "CSRF 토큰이 없습니다."),

    // Movie
    MOVIE_IS_NONE(400, "MV001", "영화가 존재하지 않습니다."),
    OCCUPY_SEAT_NONE(406, "ST001", "점유된 좌석입니다"),
    PAYMENT_NOT_CORRECT(400, "P001", "결제 기록이 올바르지 않습니다."),
    COMMENT_IS_NONE(400, "MC001", "관람평이 존재하지 않습니다."),
    COMMENT_IS_EXIST(400, "MC002", "작성된 관람평이 존재합니다."),
    WATCHING_IS_NONE(400, "MC003", "영화 관람기록이 없습니다."),
    RESERVE_IS_NONE(400, "MR001", "영화 예매기록이 없습니다."),
    RESERVE_IS_EXIST(400, "MR002", "영화 예매기록이 존재합니다."),
    MOVIEINFO_IS_NONE(400, "MI001", "상영정보가 존재하지 않습니다."),
    MOVIEINFO_IS_EXIST(400, "MI002", "상영정보가 존재합니다."),
    ACTOR_IS_NONE(400, "MA001", "배우가 존재하지 않습니다."),

    // Theater
    THEATER_IS_NONE(400, "T001", "극장이 존재하지 않습니다."),
    CINEMA_IS_EXIST(400, "T002", "상영관이 존재합니다."),
    CINEMA_IS_NONE(400, "T003", "상영관이 존재하지 않습니다."),

    // Board
    BOARD_IS_NONE(400, "B001", "게시물이 존재하지 않습니다."),
    BOARD_COMMENT_IS_NONE(400, "B002", "댓글이 존재하지 않습니다.");

    private final String code;
    private final String message;
    private final int status;

    ErrorCode(final int status, final String code, final String message) {
        this.status = status;
        this.message = message;
        this.code = code;
    }

    public String getMessage() {
        return this.message;
    }

    public String getCode() {
        return code;
    }

    public int getStatus() {
        return status;
    }
}