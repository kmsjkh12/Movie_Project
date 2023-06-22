/*
  23-03-27 관리자 페이지 사용자 관리 구현(오병주)
  23-03-28 ~ 30 관리자 페이지 사용자 예매 현황 구현(오병주)
  23-03-31 ~ 23-04-01 관리자 페이지 관람평 관리 구현(오병주)
  23-05-30 ~ 23-06-01 관리자 페이지 게시물 관리 구현(오병주)
*/
package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.dto.*;
import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.ManagerTwoService;
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
@RequestMapping("/Manager")
@Tag(name = "2. ManagerTwoController", description = "관리자 컨트롤러(회원 관련)")
public class ManagerTwoController {

    private final ManagerTwoService managerTwoService;

    // 사용자 조회 컨트롤러
    @Operation(summary = "회원 목록 요청", description = "관리자 페이지에서 모든 회원 목록을 요청합니다.", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allMember")
    public ResponseEntity<List<MemberDto>> AllMember(HttpServletRequest request) {
        return ResponseEntity.ok().body(managerTwoService.AllMember(request));
    }

    // 사용자 검색 컨트롤러
    @Operation(summary = "회원 목록 검색 요청", description = "관리자 페이지에서 회원 목록 검색을 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"search\": \"temp1\",\n" +
            "  \"sort\": \"id\"\n" +
            "}", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원 검색 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/memberSearch")
    public ResponseEntity<List<MemberDto>> MemberSearch(HttpServletRequest request, @RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(managerTwoService.MemberSearch(request, requestMap));
    }

    // 특정 사용자 추방하는 컨트롤러
    @Operation(summary = "회원 추방 요청", description = "관리자 페이지에서 특정 회원 추방을 요청합니다.", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "회원 추방 완료"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 회원일경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/memberDelete")
    public ResponseEntity<String> MemberDelete(HttpServletRequest request, @Parameter(description = "회원 ID", required = true, example = "temp999") @RequestParam("uid") String uid) {
        managerTwoService.MemberDelete(request, uid);
        return ResponseEntity.noContent().build();
    }

    // 예매기록 페이지에서 전체 영화 불러오는 컨트롤러
    @Operation(summary = "영화 목록 요청(예매기록)", description = "관리자 페이지에서 전체 영화 목록을 요청합니다. (예매기록 조회에 사용)", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allMovie/Reservation")
    public ResponseEntity<List<MovieDto>> AllMovie(HttpServletRequest request) {
        return ResponseEntity.ok().body(managerTwoService.AllMovieSearch(request));
    }

    // 예매기록 조회 컨트롤러(영화 선택)
    @Operation(summary = "예매기록 요청(영화 선택)", description = "관리자 페이지에서 특정 영화의 예매기록을 요청합니다.", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "예매기록 조회 완료"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 영화일경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allMovieReserve")
    public ResponseEntity<ManagerReservationDto> MovieReserve(HttpServletRequest request, @Parameter(description = "영화 ID", required = true, example = "1") @RequestParam("mid") Long mid) {
        return ResponseEntity.ok().body(managerTwoService.MovieReserveSearch(request, mid));
    }

    // 예매기록 조회 컨트롤러(극장 선택)
    @Operation(summary = "예매기록 요청(극장 선택)", description = "관리자 페이지에서 특정 극장의 예매기록을 요청합니다.", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "예매기록 조회 완료"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 극장일경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allTheaterReserve")
    public ResponseEntity<List<ReservationDto>> TheaterReserve(HttpServletRequest request, @Parameter(description = "극장 ID", required = true, example = "2") @RequestParam("tid") Long tid) {
        return ResponseEntity.ok().body(managerTwoService.TheaterReserveSearch(request, tid));
    }

    // 관람평 조회 컨트롤러
    @Operation(summary = "관람평 목록 요청", description = "관리자 페이지에서 특정 영화의 관람평 목록을 요청합니다.", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "관람평 조회 완료"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 영화일경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allMovieComment")
    public ResponseEntity<List<CommentInfoDto>> MovieComment(HttpServletRequest request, @Parameter(description = "영화 ID", required = true, example = "1") @RequestParam("mid") Long mid) {
        return ResponseEntity.ok().body(managerTwoService.MovieCommentSearch(request, mid));
    }

    // 관람평 삭제 컨트롤러
    @Operation(summary = "관람평 삭제 요청", description = "관리자 페이지에서 특정 관람평의 삭제를 요청합니다.", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "관람평 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 관람평일경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/MovieCommentDelete")
    public ResponseEntity<String> MovieCommentDelete(HttpServletRequest request, @Parameter(description = "관람평 ID", required = true, example = "1") @RequestParam("umid") Long umid) {
        managerTwoService.MovieCommentDelete(request, umid);
        return ResponseEntity.noContent().build();
    }

    // 게시물 조회 컨트롤러
    @Operation(summary = "게시물 목록 요청", description = "관리자 페이지에서 모든 게시물 목록을 요청합니다.", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시물 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allBoard")
    public ResponseEntity<List<BoardDto>> AllBoard(HttpServletRequest request) {
        return ResponseEntity.ok().body(managerTwoService.getBoard(request));
    }

    // 게시물 검색 컨트롤러
    @Operation(summary = "게시물 목록 검색 요청", description = "관리자 페이지에서 게시물 목록 검색을 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"category\": \"title\",\n" +
            "  \"title\": \"\"\n" +
            "}", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시물 검색 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/boardSearch")
    public ResponseEntity<List<BoardDto>> BoardSearch(HttpServletRequest request, @RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(managerTwoService.getSearchBoard(request, requestMap));
    }

    // 게시물 삭제 컨트롤러
    @Operation(summary = "게시물 삭제 요청", description = "관리자 페이지에서 특정 게시물의 삭제를 요청합니다.", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "게시물 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 게시물일경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/boardDelete")
    public ResponseEntity<String> BoardDelete(HttpServletRequest request, @Parameter(description = "게시물 ID", required = true, example = "50") @RequestParam("bid") Long bid)  {
        managerTwoService.BoardDelete(request, bid);
        return ResponseEntity.noContent().build();
    }

    // 댓글 조회 컨트롤러
    @Operation(summary = "게시물 댓글 목록 요청", description = "관리자 페이지에서 특정 게시물의 댓글 목록을 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"bid\": \"1\",\n" +
            "  \"sort\": \"like\"\n" +
            "}", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "댓글 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allBoardComment")
    public ResponseEntity<CountCommentDto> AllComment(HttpServletRequest request, @RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(managerTwoService.getComment(request, requestMap));
    }

    // 댓글 삭제 컨트롤러
    @DeleteMapping("/auth/commentDelete")
    @Operation(summary = "게시물 댓글 삭제 요청", description = "관리자 페이지에서 특정 게시물의 댓글 삭제를 요청합니다.", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "게시물 댓글 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "게시물 댓글이 존재하지 않는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<String> CommentDelete(HttpServletRequest request, @Parameter(description = "게시물 댓글 ID", required = true, example = "25") @RequestParam("bcid") Long bcid) {
        managerTwoService.CommentDelete(request, bcid);
        return ResponseEntity.noContent().build();
    }

    // 답글 삭제 컨트롤러
    @DeleteMapping("/auth/replyDelete")
    @Operation(summary = "게시물 답글 삭제 요청", description = "관리자 페이지에서 특정 게시물의 답글 삭제를 요청합니다.", tags = { "2. ManagerTwoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "게시물 답글 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "게시물 답글이 존재하지 않는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<String> ReplyDelete(HttpServletRequest request, @Parameter(description = "게시물 답글 ID", required = true, example = "6") @RequestParam("bcid") Long bcid) {
        managerTwoService.ReplyDelete(request, bcid);
        return ResponseEntity.noContent().build();
    }
}
