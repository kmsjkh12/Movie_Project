/*
  23-03-17 마이페이지에 있는 영화 관련 컨트롤러 생성(오병주)
  23-03-24 마이페이지에 있는 예매내역 조회 구현(오병주)
*/
package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.dto.CommentInfoDto;
import com.movie.Spring_backend.dto.MovieDto;
import com.movie.Spring_backend.dto.ReservationDto;
import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.MyPageMovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/MyPageMovie")
@Tag(name = "MyPageMovieController", description = "마이페이지 관련 컨트롤러")
public class MyPageMovieController {

    private final MyPageMovieService myPageMovieService;

    // 사용자가 예매한 영화 내역을 불러오는 컨트롤러
    @Operation(summary = "예매 내역 요청", description = "회원의 예매 내역을 요청합니다.", tags = { "MyPageMovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "예매 내역 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/reserve")
    public ResponseEntity<List<ReservationDto>> MemberGetReserve(HttpServletRequest request) {
        return ResponseEntity.ok().body(myPageMovieService.MovieReserveSearch(request));
    }

    // 사용자가 예매한 영화의 세부 내역을 불러오는 컨트롤러
    @Operation(summary = "예매 세부내역 요청", description = "회원의 예매 세부내역을 요청합니다.", tags = { "MyPageMovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "예매 세부내역 조회 완료"),
            @ApiResponse(responseCode = "400", description = "예매번호가 존재하지 않거나 다른 회원의 예매인경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/ReserveDetail/{rid}")
    public ResponseEntity<ReservationDto> MemberGetReserveDetail(@Parameter(description = "예매 ID", required = true, example = "1") @PathVariable("rid") Long rid, HttpServletRequest request) {
        return ResponseEntity.ok().body(myPageMovieService.MovieReserveDetailSearch(rid, request));
    }

    // 사용자가 예매 취소한 영화 내역을 불러오는 컨트롤러
    @Operation(summary = "예매 취소내역 요청", description = "회원의 예매 취소내역을 요청합니다.", tags = { "MyPageMovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "예매 취소내역 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/reserve/cancel")
    public ResponseEntity<List<ReservationDto>> MemberGetCancel(HttpServletRequest request) {
        return ResponseEntity.ok().body(myPageMovieService.MovieReserveCancelSearch(request));
    }

    // 사용자가 예매 취소한 영화의 세부 내역을 불러오는 컨트롤러
    @Operation(summary = "예매 취소 세부내역 요청", description = "회원의 예매 취소 세부내역을 요청합니다.\n\n" +
            "(배포된 웹페이지에서는 취소되지 않은 예매일경우 프론트단에서 예외처리를 진행)", tags = { "MyPageMovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "예매 취소 세부내역 조회 완료"),
            @ApiResponse(responseCode = "400", description = "예매번호가 존재하지 않거나 다른 회원의 예매인경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/CancelDetail/{rid}")
    public ResponseEntity<ReservationDto> MemberGetCancelDetail(@Parameter(description = "예매 ID", required = true, example = "1") @PathVariable("rid") Long rid, HttpServletRequest request) {
        return ResponseEntity.ok().body(myPageMovieService.MovieReserveDetailSearch(rid, request));
    }

    // 사용자가 예매한 지난 관람내역을 불러오는 컨트롤러
    @Operation(summary = "지난 관람내역 요청", description = "회원의 지난 관람내역을 요청합니다.", tags = { "MyPageMovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "지난 관람내역 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/reserve/finish")
    public ResponseEntity<List<ReservationDto>> MemberGetFinish(HttpServletRequest request) {
        return ResponseEntity.ok().body(myPageMovieService.MovieReserveFinishSearch(request));
    }

    // 사용자가 예매한 지난 관람내역의 세부 내역을 불러오는 컨트롤러
    @Operation(summary = "지난 관람내역의 세부내역 요청", description = "회원의 지난 관람내역의 세부내역을 요청합니다.\n\n" +
            "(배포된 웹페이지에서는 관람이 끝나지 않은 예매일경우 프론트단에서 예외처리를 진행)", tags = { "MyPageMovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "지난 관람내역의 세부내역 조회 완료"),
            @ApiResponse(responseCode = "400", description = "예매번호가 존재하지 않거나 다른 회원의 예매인경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/FinishDetail/{rid}")
    public ResponseEntity<ReservationDto> MemberGetFinishDetail(@Parameter(description = "예매 ID", required = true, example = "1") @PathVariable("rid") Long rid, HttpServletRequest request) {
        return ResponseEntity.ok().body(myPageMovieService.MovieReserveDetailSearch(rid, request));
    }

    // 사용자가 좋아요 누른 영화 가져오는 컨트롤러
    @Operation(summary = "회원이 좋아요를 누른 영화 목록 요청", description = "회원이 좋아요를 누른 영화 목록을 요청합니다.", tags = { "MyPageMovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 목록 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/movieLike")
    public ResponseEntity<List<MovieDto>> MovieMemberLike(HttpServletRequest request) {
        return ResponseEntity.ok().body(myPageMovieService.MovieLikeGet(request));
    }

    // 관람평 작성이 가능한 영화 가져오는 컨트롤러
    @Operation(summary = "관람평 작성이 가능한 영화 목록 요청", description = "회원의 영화 관람이 끝나 관람평 작성이 가능한 영화 목록을 요청합니다.", tags = { "MyPageMovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 목록 조회 완료"),
            @ApiResponse(responseCode = "400", description = "관람이 끝난 영화가 없을경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/moviePossible")
    public ResponseEntity<List<MovieDto>> MovieMemberPossible(HttpServletRequest request) {
        return ResponseEntity.ok().body(myPageMovieService.MoviePossibleGet(request));
    }

    // 사용자가 작성한 관람평 가져오는 컨트롤러
    @Operation(summary = "회원이 작성한 관람평 목록 요청", description = "회원이 작성한 관람평 목록을 요청합니다.", tags = { "MyPageMovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "관람평 목록 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/GetComment")
    public ResponseEntity<List<CommentInfoDto>> MemberGetComment(HttpServletRequest request) {
        return ResponseEntity.ok().body(myPageMovieService.MovieCommentSearch(request));
    }
}
