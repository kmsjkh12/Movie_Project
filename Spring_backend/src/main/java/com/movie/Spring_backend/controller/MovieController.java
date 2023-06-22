package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.dto.MovieDto;
import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.MovieService;
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
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/Movie")
@Tag(name = "MovieController", description = "영화 관련 컨트롤러")
public class MovieController {
    private final MovieService movieService;

    // 전체 영화 가져오는 컨트롤러
    @Operation(summary = "전체 영화 요청", description = "전체 영화 페이지에서 전체 영화를 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"uid\": \"temp1\",\n" +
            "  \"button\": \"rate\",\n" +
            "  \"search\": \"\"\n" +
            "}", tags = { "MovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/allmovie")
    public ResponseEntity<List<MovieDto>> AllMovie(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(movieService.getAllMovie(requestMap));
    }

    // 현재상영작 영화 가져오는 컨트롤러
    @Operation(summary = "현재 상영중인 영화 요청", description = "현재상영작 페이지에서 상영중인 영화를 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"uid\": \"temp1\",\n" +
            "  \"button\": \"rate\",\n" +
            "  \"search\": \"\"\n" +
            "}", tags = { "MovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/screenmovie")
    public ResponseEntity<List<MovieDto>> ScreenMovie(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(movieService.getScreenMovie(requestMap));
    }

    // 상영예정작 영화 가져오는 컨트롤러
    @Operation(summary = "상영 예정인 영화 요청", description = "상영예정작 페이지에서 상영예정인 영화를 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"uid\": \"temp1\",\n" +
            "  \"button\": \"rate\",\n" +
            "  \"search\": \"\"\n" +
            "}", tags = { "MovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/comingmovie")
    public ResponseEntity<List<MovieDto>> ComingMovie(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(movieService.getComingMovie(requestMap));
    }

    // 영화 세부내용을 보여줄 때 사용되는 컨트롤러
    @Operation(summary = "영화 세부내용 요청", description = "영화의 세부내용을 요청합니다.", tags = { "MovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 세부내용 조회 완료"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 영화", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/Moviedetail/{mid}")
    public ResponseEntity<MovieDto> MovieDetail(@Parameter(description = "영화 ID", required = true, example = "1") @PathVariable("mid") Long mid,
                                                @Parameter(description = "회원 ID", required = true, example = "temp1") @RequestParam(value = "uid") String uid){
        return ResponseEntity.ok().body(movieService.getMovieDetail(mid, uid));
    }

    // 현재 예매가 가능한 영화를 가져오는 컨트롤러(예매율 순으로 내림차순)
    @Operation(summary = "예매 가능한 영화 요청", description = "현재 예매가 가능한 영화를 요청합니다. (예매율 순으로 내림차순)", tags = { "MovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/ReservePossibleDESC")
    public ResponseEntity<List<MovieDto>> PossibleDESCMovie() {
        return ResponseEntity.ok().body(movieService.getPossibleDESCMovie());
    }

    // 예매 페이지에서 조건에 맞는 영화를 가져오는 컨트롤러
    @Operation(summary = "예매 페이지 영화 요청", description = "예매 페이지에서 조건에 맞는 영화를 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"tid\": \"1\",\n" +
            "  \"sort\": \"true\"\n" +
            "}", tags = { "MovieController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "영화 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/Ticket")
    public ResponseEntity<List<MovieDto>> TicketMovie(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(movieService.getTicketMovie(requestMap));
    }
}