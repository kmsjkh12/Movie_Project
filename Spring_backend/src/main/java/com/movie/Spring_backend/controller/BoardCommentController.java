/*
  23-05-24 ~ 26, 28 게시물 댓글 관련 컨트롤러 수정(오병주)
*/
package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.dto.BoardCommentDto;
import com.movie.Spring_backend.dto.CountCommentDto;
import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.BoardCommentService;
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
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/Board")
@Tag(name = "2. BoardCommentController", description = "게시물 댓글 관련 컨트롤러")
public class BoardCommentController {
    private final BoardCommentService boardCommentService;

    // 댓글을 불러오는 컨트롤러
    @Operation(summary = "게시물 댓글 목록 요청", description = "서버로부터 게시물에 있는 댓글 목록을 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"bid\": \"1\",\n" +
            "  \"sort\": \"like\",\n" +
            "  \"uid\": \"temp1\"\n" +
            "}", tags = { "2. BoardCommentController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시물 댓글 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/allComment")
    public ResponseEntity<CountCommentDto> AllComment(@RequestParam Map<String, String> requestMap) {
       return ResponseEntity.ok().body(boardCommentService.getComment(requestMap));
    }

    // 댓글을 작성하는 컨트롤러
    @Operation(summary = "게시물 댓글 작성 요청", description = "서버에게 게시물 댓글 저장을 요청합니다.\n\n" +
            "Body값 예시 : {\n" +
            "  \"comment\": \"임시 댓글\",\n" +
            "  \"bid\": \"1\"\n" +
            "}", tags = { "2. BoardCommentController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "게시물 댓글 저장 완료"),
            @ApiResponse(responseCode = "400", description = "게시물이 존재하지 않는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/commentWrite")
    public ResponseEntity<String> CommentWrite(HttpServletRequest request, @RequestBody Map<String, String> requestMap) {
        boardCommentService.CommentWrite(request, requestMap);
        return ResponseEntity.noContent().build();
    }

    // 댓글을 삭제하는 컨트롤러
    @Operation(summary = "게시물 댓글 삭제 요청", description = "서버에게 게시물 댓글 삭제를 요청합니다.", tags = { "2. BoardCommentController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "게시물 댓글 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "게시물 댓글이 존재하지 않거나 다른 사람의 댓글인 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/commentDelete")
    public ResponseEntity<String> CommentDelete(HttpServletRequest request, @Parameter(description = "게시물 댓글 ID", required = true, example = "1") @RequestParam("bcid") Long bcid) {
        boardCommentService.CommentDelete(request, bcid);
        return ResponseEntity.noContent().build();
    }

    // 댓글 좋아요 기능을 구현한 컨트롤러
    @Operation(summary = "게시물 댓글 좋아요 요청", description = "서버에게 게시물 댓글 좋아요를 요청합니다.\n\n" +
            "Body값 예시 : {\n" +
            "  \"bid\": \"1\",\n" +
            "  \"bcid\": \"1\",\n" +
            "  \"state\": \"like\"\n" +
            "}", tags = { "2. BoardCommentController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시물 댓글 좋아요 완료"),
            @ApiResponse(responseCode = "400", description = "게시물 또는 댓글이 존재하지 않는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/commentLike")
    public ResponseEntity<BoardCommentDto> CommentLike(HttpServletRequest request, @RequestBody Map<String, String> requestMap){
        return ResponseEntity.ok().body(boardCommentService.onLike(request, requestMap));
    }

    // 답글을 작성하는 컨트롤러
    @Operation(summary = "게시물 답글 작성 요청", description = "서버에게 게시물 답글 저장을 요청합니다.\n\n" +
            "Body값 예시 : {\n" +
            "  \"comment\": \"댓글 내용\",\n" +
            "  \"bid\": \"게시물 번호\",\n" +
            "  \"bcroot\": \"최상위 부모 댓글 번호\",\n" +
            "  \"bcparent\": \"부모 댓글 번호\"\n" +
            "}", tags = { "2. BoardCommentController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "게시물 답글 저장 완료"),
            @ApiResponse(responseCode = "400", description = "게시물 또는 댓글이 존재하지 않는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/replyWrite")
    public ResponseEntity<String> ReplyWrite(HttpServletRequest request, @RequestBody Map<String, String> requestMap) {
        boardCommentService.ReplyWrite(request, requestMap);
        return ResponseEntity.noContent().build();
    }

    // 답글을 삭제하는 컨트롤러
    @Operation(summary = "게시물 답글 삭제 요청", description = "서버에게 게시물 답글 삭제를 요청합니다.", tags = { "2. BoardCommentController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "게시물 답글 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "게시물 답글이 존재하지 않거나 다른 사람의 답글인 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/replyDelete")
    public ResponseEntity<String> ReplyDelete(HttpServletRequest request, @Parameter(description = "게시물 답글 ID", required = true, example = "1") @RequestParam("bcid") Long bcid) {
        boardCommentService.ReplyDelete(request, bcid);
        return ResponseEntity.noContent().build();
    }
}