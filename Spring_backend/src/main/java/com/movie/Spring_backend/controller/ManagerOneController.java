/*
  23-04-03 ~ 23-04-05 관리자 페이지 상영정보관리 구현(오병주)
  23-04-17 상영관, 극장 관리자 페이지 수정(오병주)
  23-04-18 ~ 19 영화 관리자 페이지 수정(오병주)
*/
package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.dto.*;
import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.ManagerOneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/Manager")
@Tag(name = "1. ManagerOneController", description = "관리자 컨트롤러(영화 관련)")
public class ManagerOneController {

    private final ManagerOneService managerOneService;

    // 영화 조회 컨트롤러
    @Operation(summary = "영화 목록 요청", description = "관리자 페이지에서 모든 영화 목록을 요청합니다.", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allMovie")
    public ResponseEntity<List<MovieDto>> AllMovie(HttpServletRequest request) {
        return ResponseEntity.ok().body(managerOneService.AllMovieSearch(request));
    }

    // 영화 추가 컨트롤러
    @Operation(summary = "영화 추가 요청", description = "관리자 페이지에서 영화 추가를 요청합니다.\n\n" +
            "(영화 정보는 data에 포스터 파일은 MultipartFile형태로 전달해야함)", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "영화 추가 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/insertMovie")
    public ResponseEntity<String> InsertMovie(HttpServletRequest request, @RequestPart(value="data") MovieDto requestDto, @RequestPart(required = false) MultipartFile multipartFiles) {
        managerOneService.MovieInsert(request, requestDto, multipartFiles);
        return ResponseEntity.noContent().build();
    }

    // 영화 삭제 컨트롤러
    @Operation(summary = "영화 삭제 요청", description = "관리자 페이지에서 영화 삭제를 요청합니다.", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "영화 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "영화가 존재하지 않거나 상영정보가 있는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/deleteMovie")
    public ResponseEntity<String> DeleteMovie(HttpServletRequest request, @Parameter(description = "영화 ID", required = true, example = "1") @RequestParam Long mid) {
        managerOneService.MovieDelete(request, mid);
        return ResponseEntity.noContent().build();
    }

    // 영화 수정 컨트롤러
    @Operation(summary = "영화 수정 요청", description = "관리자 페이지에서 영화 수정을 요청합니다.\n\n" +
            "(영화 정보는 data에 포스터 파일은 MultipartFile형태로 전달해야함)", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "영화 수정 완료"),
            @ApiResponse(responseCode = "400", description = "영화가 존재하지 않을 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/auth/updateMovie")
    public ResponseEntity<String> UpdateMovie(HttpServletRequest request, @RequestPart(value="data") MovieDto requestDto, @RequestPart(required = false) MultipartFile multipartFiles) {
        managerOneService.MovieUpdate(request, requestDto, multipartFiles);
        return ResponseEntity.noContent().build();
    }

    // 배우 조회 컨트롤러
    @Operation(summary = "배우 목록 요청", description = "관리자 페이지에서 모든 배우 목록을 요청합니다.", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "배우 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allActor")
    public ResponseEntity<List<ActorDto>> AllActor(HttpServletRequest request) {
        return ResponseEntity.ok().body(managerOneService.AllActorSearch(request));
    }

    // 배우 추가 컨트롤러
    @Operation(summary = "배우 추가 요청", description = "관리자 페이지에서 배우 추가를 요청합니다.\n\n" +
            "(aname에 배우 이름, abirthplace에 배우 출생지 입력)", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "배우 추가 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/insertActor")
    public ResponseEntity<String> InsertActor(HttpServletRequest request, @RequestBody ActorDto requestDto) {
        managerOneService.ActorInsert(request, requestDto);
        return ResponseEntity.noContent().build();
    }

    // 배우 삭제 컨트롤러
    @Operation(summary = "배우 삭제 요청", description = "관리자 페이지에서 배우 삭제를 요청합니다.", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "배우 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "배우가 존재하지 않는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/deleteActor")
    public ResponseEntity<String> DeleteActor(HttpServletRequest request, @Parameter(description = "배우 ID", required = true, example = "80") @RequestParam Long aid) {
        managerOneService.ActorDelete(request, aid);
        return ResponseEntity.noContent().build();
    }

    // 배우 수정 컨트롤러
    @Operation(summary = "배우 수정 요청", description = "관리자 페이지에서 배우 수정을 요청합니다.\n\n" +
            "(aid에 배우 ID, aname에 배우 이름, abirthplace에 배우 출생지 입력)", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "배우 수정 완료"),
            @ApiResponse(responseCode = "400", description = "배우가 존재하지 않는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/auth/updateActor")
    public ResponseEntity<String> UpdateActor(HttpServletRequest request, @RequestBody ActorDto requestDto) {
        managerOneService.ActorUpdate(request, requestDto);
        return ResponseEntity.noContent().build();
    }

    // 극장 조회 컨트롤러
    @Operation(summary = "극장 목록 요청", description = "관리자 페이지에서 모든 극장 목록을 요청합니다.", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "극장 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allTheater")
    public ResponseEntity<List<TheaterDto>> AllTheater(@Parameter(name = "id", description = "posts 의 id", in = ParameterIn.PATH) HttpServletRequest request) {
        return ResponseEntity.ok().body(managerOneService.AllTheaterSearch(request));
    }

    // 극장 추가 컨트롤러
    @Operation(summary = "극장 추가 요청", description = "관리자 페이지에서 극장 추가를 요청합니다.\n\n" +
            "(tname에 극장 이름, taddr 극장 주소, tarea에 (서울, 경기, 인천, 부산)중 하나 입력)", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "극장 추가 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/insertTheater")
    public ResponseEntity<String> InsertTheater(HttpServletRequest request, @RequestBody TheaterDto requestDto) {
        managerOneService.TheaterInsert(request, requestDto);
        return ResponseEntity.noContent().build();
    }

    // 극장 삭제 컨트롤러
    @Operation(summary = "극장 삭제 요청", description = "관리자 페이지에서 극장 삭제를 요청합니다.", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "극장 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "극장이 존재하지 않거나 상영관을 보유하고 있는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/deleteTheater")
    public ResponseEntity<String> DeleteTheater(HttpServletRequest request, @Parameter(description = "극장 ID", required = true, example = "1") @RequestParam Long tid) {
        managerOneService.TheaterDelete(request, tid);
        return ResponseEntity.noContent().build();
    }

    // 극장 수정 컨트롤러
    @Operation(summary = "극장 수정 요청", description = "관리자 페이지에서 극장 수정을 요청합니다.\n\n" +
            "(tid에 극장 ID, tname에 극장 이름, taddr 극장 주소, tarea에 (서울, 경기, 인천, 부산)중 하나 입력)", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "극장 수정 완료"),
            @ApiResponse(responseCode = "400", description = "극장이 존재하지 않는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/auth/updateTheater")
    public ResponseEntity<String> UpdateTheater(HttpServletRequest request, @RequestBody TheaterDto requestDto) {
        managerOneService.TheaterUpdate(request, requestDto);
        return ResponseEntity.noContent().build();
    }

    // 상영관 조회 컨트롤러
    @Operation(summary = "상영관 목록 요청", description = "관리자 페이지에서 모든 상영관 목록을 요청합니다.", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "상영관 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allCinema")
    public ResponseEntity<List<CinemaDto>> AllCinema(HttpServletRequest request) {
        return ResponseEntity.ok().body(managerOneService.AllCinemaSearch(request));
    }

    // 상영관 추가 컨트롤러
    @Operation(summary = "상영관 추가 요청", description = "관리자 페이지에서 상영관 추가를 요청합니다.\n\n" +
            "(cname에 상영관 이름, ctype에 상영관 타입, cseat에 좌석수(30, 50, 70 중 하나), tid에 극장 ID 입력)", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "상영관 추가 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/insertCinema")
    public ResponseEntity<String> InsertCinema(HttpServletRequest request, @RequestBody CinemaDto requestDto) {
        managerOneService.CinemaInsert(request, requestDto);
        return ResponseEntity.noContent().build();
    }

    // 상영관 삭제 컨트롤러
    @Operation(summary = "상영관 삭제 요청", description = "관리자 페이지에서 상영관 삭제를 요청합니다.", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "상영관 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "상영관이 존재하지 않거나 상영정보를 보유하고 있는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/deleteCinema")
    public ResponseEntity<String> DeleteCinema(HttpServletRequest request, @Parameter(description = "상영관 ID", required = true, example = "1") @RequestParam Long cid) {
        managerOneService.CinemaDelete(request, cid);
        return ResponseEntity.noContent().build();
    }

    // 상영관 수정 컨트롤러
    @Operation(summary = "상영관 수정 요청", description = "관리자 페이지에서 상영관 수정을 요청합니다.\n\n" +
            "(cid에 상영관 ID, cname에 상영관 이름, ctype에 상영관 타입, cseat에 좌석수(30, 50, 70 중 하나), tid에 극장 ID 입력)\n\n" +
            "※ 상영관에 대한 상영정보가 있을경우 일부 정보만 수정됩니다.", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "상영관 수정 완료"),
            @ApiResponse(responseCode = "400", description = "상영관이 존재하지 않는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/auth/updateCinema")
    public ResponseEntity<String> UpdateCinema(HttpServletRequest request, @RequestBody CinemaDto requestDto) {
        managerOneService.CinemaUpdate(request, requestDto);
        return ResponseEntity.noContent().build();
    }

    // 상영정보 조회 컨트롤러
    @Operation(summary = "상영정보 목록 요청", description = "관리자 페이지에서 상영정보 목록을 요청합니다. (특정 조건 설정가능)\n\n" +
            "파라미터 예시 : {\n" +
            "  \"mid\": \"1\",\n" +
            "  \"tarea\": \"서울\"\n" +
            "}", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "상영정보 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/allMovieInfo")
    public ResponseEntity<List<MovieInfoDto>> GetMovieInfo(HttpServletRequest request, @RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(managerOneService.MovieInfoSearch(request, requestMap));
    }

    // 상영정보 추가 컨트롤러
    @Operation(summary = "상영정보 추가 요청", description = "관리자 페이지에서 상영정보 추가를 요청합니다.\n\n" +
            "Body값 예시 : {\n" +
            "  \"mid\": \"영화 ID\",\n" +
            "  \"cid\": \"상영관 ID\",\n" +
            "  \"insertStartDay\": \"영화 시작시간(yyyy-MM-dd HH:mm)\",\n" +
            "  \"insertEndDay\": \"영화 종료시간(yyyy-MM-dd HH:mm)\"\n" +
            "}", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "상영정보 추가 완료"),
            @ApiResponse(responseCode = "400", description = "상영정보간 시간 간격이 너무 짧은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/insertMovieInfo")
    public ResponseEntity<String> InsertMovieInfo(HttpServletRequest request, @RequestBody Map<String, String> requestMap) {
        managerOneService.MovieInfoInsert(request, requestMap);
        return ResponseEntity.noContent().build();
    }

    // 상영정보 삭제 컨트롤러
    @Operation(summary = "상영정보 삭제 요청", description = "관리자 페이지에서 상영정보 삭제를 요청합니다.", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "상영정보 삭제 완료"),
            @ApiResponse(responseCode = "400", description = "상영정보가 존재하지 않거나 예매기록을 보유하고 있는 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/deleteMovieInfo")
    public ResponseEntity<String> DeleteMovieInfo(HttpServletRequest request, @Parameter(description = "상영정보 ID", required = true, example = "2300") @RequestParam Long miid) {
        managerOneService.MovieInfoDelete(request, miid);
        return ResponseEntity.noContent().build();
    }

    // 상영정보 수정 컨트롤러
    @Operation(summary = "상영정보 수정 요청", description = "관리자 페이지에서 상영정보 수정을 요청합니다.\n\n" +
            "Body값 예시 : {\n" +
            "  \"miid\": \"상영정보 ID\",\n" +
            "  \"mid\": \"영화 ID\",\n" +
            "  \"cid\": \"상영관 ID\",\n" +
            "  \"updateStartDay\": \"영화 시작시간(yyyy-MM-dd HH:mm)\",\n" +
            "  \"updateEndDay\": \"영화 종료시간(yyyy-MM-dd HH:mm)\"\n" +
            "}", tags = { "1. ManagerOneController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "상영정보 수정 완료"),
            @ApiResponse(responseCode = "400", description = "상영정보가 존재하지 않거나 예매기록을 보유하고 있거나 상영정보간 시간 간격이 너무 짧은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없을경우(관리자 계정이 아님)", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/auth/updateMovieInfo")
    public ResponseEntity<String> UpdateMovieInfo(HttpServletRequest request, @RequestBody Map<String, String> requestMap) {
        managerOneService.MovieInfoUpdate(request, requestMap);
        return ResponseEntity.noContent().build();
    }
}
