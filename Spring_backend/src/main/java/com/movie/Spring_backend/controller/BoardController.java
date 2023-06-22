/*
  23-05-19 ~ 23 게시물 관련 컨트롤러 수정(오병주)
*/
package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.dto.BoardDto;
import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/Board")
@Tag(name = "1. BoardController", description = "게시물 관련 컨트롤러")
public class BoardController {
    private final BoardService boardService;

    // 게시물 조회 컨트롤러
    @Operation(summary = "게시물 목록 요청", description = "서버로부터 게시물 목록을 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"category\": \"free\",\n" +
            "  \"sort\": \"all\",\n" +
            "  \"uid\": \"temp1\",\n" +
            "  \"page\": \"0\"\n" +
            "}", tags = { "1. BoardController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시물 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/allBoard")
    public ResponseEntity<Page<BoardDto>> AllBoard(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(boardService.getBoard(requestMap));
    }

    // 게시물 검색 컨트롤러
    @Operation(summary = "검색한 게시물 목록 요청", description = "서버로부터 검색한 게시물 목록을 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"category\": \"title\",\n" +
            "  \"title\": \"\",\n" +
            "  \"page\": \"0\"\n" +
            "}", tags = { "1. BoardController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시물 검색 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/boardSearch")
    public ResponseEntity<Page<BoardDto>> BoardSearch(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(boardService.getSearchBoard(requestMap));
    }

    // 게시물 상세조회 컨트롤러
    @Operation(summary = "게시물 상세조회 요청", description = "특정 게시물의 상세 내용을 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"bid\": \"1\",\n" +
            "  \"uid\": \"temp1\"\n" +
            "}", tags = { "1. BoardController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시물 상세조회 완료"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 게시물인 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/boardContent")
    public ResponseEntity<BoardDto> BoardContent(@RequestParam Map<String, String> requestMap){
        return ResponseEntity.ok().body(boardService.getBoardDetail(requestMap));
    }

    // 이미지를 저장하는 컨트롤러
    @Operation(summary = "게시물 작성시 이미지 저장 요청", description = "게시물 작성 페이지에서 이미지 첨부시 서버에게 이미지 저장을 요청합니다.\n\n" +
            "(MultipartFile 형태로 이미지를 보내야 하며 저장 성공시 이미지의 경로를 리턴합니다.)", tags = { "1. BoardController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "이미지 저장 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류(이미지 저장 실패)", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/uploadImage")
    public ResponseEntity<BoardDto> BoardImage(HttpServletRequest request, @RequestPart(required = false) MultipartFile multipartFiles) {
        return ResponseEntity.ok().body(boardService.ImageUpload(request, multipartFiles));
    }

    // 게시물 작성 컨트롤러
    @Operation(summary = "게시물 작성 요청", description = "서버에게 게시물 저장을 요청합니다.\n\n" +
            "Body값 예시 : {\n" +
            "  \"title\": \"임시 게시물\",\n" +
            "  \"detail\": \"임시 게시물\",\n" +
            "  \"category\": \"자유 게시판\"\n" +
            "}", tags = { "1. BoardController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "게시물 저장 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/boardWrite")
    public ResponseEntity<String> BoardWrite(HttpServletRequest request, @RequestBody Map<String, String> requestMap) {
        boardService.BoardWrite(request, requestMap);
        return ResponseEntity.noContent().build();
    }

    // 게시물 수정 컨트롤러
    @Operation(summary = "게시물 수정 요청", description = "서버에게 게시물 수정을 요청합니다.\n\n" +
            "Body값 예시 : {\n" +
            "  \"bid\": \"게시물 번호\",\n" +
            "  \"title\": \"수정 내용\",\n" +
            "  \"detail\": \"수정 내용\",\n" +
            "  \"category\": \"수정할 카테고리\"\n" +
            "}", tags = { "1. BoardController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "게시물 수정 완료"),
            @ApiResponse(responseCode = "400", description = "게시물이 존재하지 않거나 다른 사람의 게시물인 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/auth/boardUpdate")
    public ResponseEntity<String> BoardUpdate(HttpServletRequest request, @RequestBody Map<String, String> requestMap) {
        boardService.BoardUpdate(request, requestMap);
        return ResponseEntity.noContent().build();
    }

    // 게시물 삭제 컨트롤러
    @Operation(summary = "게시물 삭제 요청", description = "서버에게 게시물 삭제를 요청합니다.", tags = { "1. BoardController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "게시물 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "게시물이 존재하지 않거나 다른 사람의 게시물인 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/boardDelete")
    public ResponseEntity<String> BoardDelete(HttpServletRequest request, @Parameter(description = "게시물 ID", required = true, example = "1") @RequestParam("bid") Long bid)  {
        boardService.BoardDelete(request, bid);
        return ResponseEntity.noContent().build();
    }

    // 좋아요 기능을 구현한 컨트롤러
    @Operation(summary = "게시물 좋아요 요청", description = "서버에게 게시물 좋아요를 요청합니다.\n\n" +
            "Body값 예시 : {\n" +
            "  \"bid\": \"1\",\n" +
            "  \"state\": \"like\"\n" +
            "}", tags = { "1. BoardController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시물 좋아요 완료"),
            @ApiResponse(responseCode = "400", description = "게시물이 존재하지 않는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/boardLike")
    public ResponseEntity<BoardDto> BoardLike(HttpServletRequest request, @RequestBody Map<String, String> requestMap){
        return ResponseEntity.ok().body(boardService.onLike(request, requestMap));
    }
}
