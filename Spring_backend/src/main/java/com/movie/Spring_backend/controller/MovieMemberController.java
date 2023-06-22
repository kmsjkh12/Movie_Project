/*
  23-02-09 로그인한 유저가 영화에 관련된 행위를 할때 사용되는 컨트롤러 구현(오병주)
  23-02-12 영화 관람평 조회 컨트롤러 구현(오병주)
  23-02-13 관람평 작성 컨트롤러 구현(오병주)
  23-02-25 관람평 작성 컨트롤러 수정(오병주)
*/
package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.dto.CommentInfoDto;
import com.movie.Spring_backend.dto.MovieDto;
import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.MovieMemberService;
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
@RequestMapping("/MovieMember")
@Tag(name = "MovieMemberController", description = "회원 영화평가 관련 컨트롤러")
public class MovieMemberController {

    private final MovieMemberService movieMemberService;

    // 영화 세부내용의 관람평을 가져오는 컨트롤러
    @Operation(summary = "관람평 요청(영화 세부내용 페이지)", description = "영화 세부내용 페이지에서 관람평을 요청합니다.\n\n" +
            "파라미터 예시(requestMap) : {\n" +
            "  \"sort\": \"new\",\n" +
            "  \"uid\": \"temp1\"\n" +
            "}", tags = { "MovieMemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "관람평 조회 완료"),
            @ApiResponse(responseCode = "400", description = "관람평이 존재하지 않음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/comment/Moviedetail/{mid}")
    public ResponseEntity<List<CommentInfoDto>> MovieDetailComment(@Parameter(description = "영화 ID", required = true, example = "1") @PathVariable("mid") Long mid, @RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(movieMemberService.getMovieDetailComment(mid, requestMap));
    }

    // 영화 좋아요 토글을 위한 컨트롤러, 좋아요 누른 영화정보 리턴
    @Operation(summary = "영화 좋아요 요청", description = "영화에 대한 좋아요를 요청합니다.\n\n" +
            "(mid에 영화 번호입력)", tags = { "MovieMemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 좋아요 완료"),
            @ApiResponse(responseCode = "400", description = "영화가 존재하지 않음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/MovieLikeToggle")
    public ResponseEntity<MovieDto> LikeToggle(@RequestBody MovieDto requestDto, HttpServletRequest request) {
        return ResponseEntity.ok().body(movieMemberService.MovieLikeUpdate(requestDto, request));
    }

    // 관람평 작성을 위한 컨트롤러, 작성에 성공할 경우 noContent 리턴
    @Operation(summary = "영화 관람평 작성 요청", description = "영화에 대한 관람평 작성을 요청합니다.\n\n" +
            "Body값 예시 : {\n" +
            "  \"mid\": \"1\",\n" +
            "  \"mcomment\": \"관람평 내용\",\n" +
            "  \"mscore\": \"9\"\n" +
            "}", tags = { "MovieMemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "영화 관람평 작성 완료"),
            @ApiResponse(responseCode = "400", description = "관람평을 이미 작성했거나 영화에 대한 관람기록이 없음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/InsertComment")
    public ResponseEntity<String> InsertComment(@RequestBody Map<String, String> requestMap, HttpServletRequest request) {
        movieMemberService.CommentInsert(requestMap, request);
        return ResponseEntity.noContent().build();
    }

    // 관람평 좋아요 토글을 위한 컨트롤러, 좋아요 누른 관람평 정보 리턴
    @Operation(summary = "영화 관람평 좋아요 요청", description = "영화 관람평에 대한 좋아요를 요청합니다.\n\n" +
            "(umid에 관람평 번호입력)", tags = { "MovieMemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 관람평 좋아요 완료"),
            @ApiResponse(responseCode = "400", description = "관람평이 존재하지 않음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/CommentLikeToggle")
    public ResponseEntity<CommentInfoDto> CommentLikeToggle(@RequestBody CommentInfoDto requestDto, HttpServletRequest request) {
        return ResponseEntity.ok().body(movieMemberService.CommentLikeUpdate(requestDto, request));
    }

    // 관람평을 삭제할때 사용되는 컨트롤러, 삭제에 성공할 경우 noContent 리턴
    @Operation(summary = "영화 관람평 삭제 요청", description = "영화 관람평에 대한 삭제를 요청합니다.", tags = { "MovieMemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "영화 관람평 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "관람평이 존재하지 않음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/CommentDelete")
    public ResponseEntity<String> CommentDelete(@Parameter(description = "관람평 ID", required = true, example = "1") @RequestParam("umid") Long umid, HttpServletRequest request) {
        movieMemberService.CommentDelete(umid, request);
        return ResponseEntity.noContent().build();
    }
}