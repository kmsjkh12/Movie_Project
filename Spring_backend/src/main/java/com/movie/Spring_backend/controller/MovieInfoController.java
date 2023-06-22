/*
  23-04-22 ~ 23-04-24 상영시간표에 사용되는 컨트롤러 수정(오병주)
  23-04-27 ~ 23-04-29 예매페이지에 사용되는 컨트롤러 수정(오병주)
*/
package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.dto.*;
import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.MovieInfoService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/MovieInfo")
@Tag(name = "MovieInfoController", description = "상영정보 관련 컨트롤러")
public class MovieInfoController {

    private final MovieInfoService movieInfoService;

    // 예매 페이지에서 조건에 맞는 상영정보의 상영날짜를 불러오는 컨트롤러
    @Operation(summary = "조건에 맞는 상영날짜 요청(예매 페이지)", description = "예매 페이지에서 조건에 맞는 상영날짜를 요청합니다.\n\n" +
            "(파라미터는 현재값 그대로 사용가능)", tags = { "MovieInfoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "상영날짜 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/Ticket")
    public ResponseEntity<List<MovieInfoDayDto>> TicketMovieInfoDay(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(movieInfoService.getTicketMovieInfoDay(requestMap));
    }

    // 예매 페이지에서 영화, 극장, 날짜를 모두 골랐을경우 상영정보를 불러오는 컨트롤러
    @Operation(summary = "상영정보 요청(예매 페이지)", description = "예매 페이지에서 영화, 극장, 날짜에 따른 상영정보를 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"miday\": \"내일 날짜입력(YYYY-MM-DD에 맞춰서)\",\n" +
            "  \"mid\": \"1\",\n" +
            "  \"tid\": \"1\",\n" +
            "  \"uid\": \"temp1\"\n" +
            "}", tags = { "MovieInfoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "상영정보 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("normal/Schedule")
    public ResponseEntity<List<MovieInfoDto>> ScheduleMovieInfo(@RequestParam Map<String, String> requestMap){
        return ResponseEntity.ok().body(movieInfoService.getScheduleMovieInfo(requestMap));
    }

    // 조건에 맞는 상영정보의 상영날짜를 구하는 컨트롤러(상영시간표 페이지)
    @Operation(summary = "조건에 맞는 상영날짜 요청(상영시간표 페이지)", description = "상영시간표 페이지에서 영화, 극장, 지역에 따른 상영날짜를 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"mid\": \"1\",\n" +
            "  \"tarea\": \"서울\"\n" +
            "}", tags = { "MovieInfoController" })
    @GetMapping("/normal/findDay")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "상영날짜 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<List<MovieInfoDto>> movieInfoFindDay(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(movieInfoService.getMovieInfoDay(requestMap));
    }

    // 영화, 상영날짜, 지역을 이용하여 상영정보를 검색하는 컨트롤러(상영시간표 페이지)
    @Operation(summary = "영화에 따른 상영정보 요청(상영시간표 페이지)", description = "상영시간표 페이지에서 영화, 날짜, 지역에 따른 상영정보를 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"mid\": \"1\",\n" +
            "  \"miday\": \"내일 날짜입력(YYYY-MM-DD에 맞춰서)\",\n" +
            "  \"tarea\": \"서울\",\n" +
            "  \"uid\": \"temp1\"\n" +
            "}", tags = { "MovieInfoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "상영정보 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/timeTableByMovie")
    public ResponseEntity<List<TimeTableDto>> TimeTableByMovie(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(movieInfoService.getTimeTableByMovie(requestMap));
    }

    // 극장, 상영날짜를 이용하여 상영정보를 검색하는 컨트롤러(상영시간표 페이지)
    @Operation(summary = "극장에 따른 상영정보 요청(상영시간표 페이지)", description = "상영시간표 페이지에서 극장, 날짜에 따른 상영정보를 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"tid\": \"1\",\n" +
            "  \"miday\": \"내일 날짜입력(YYYY-MM-DD에 맞춰서)\",\n" +
            "  \"uid\": \"temp1\"\n" +
            "}", tags = { "MovieInfoController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "상영정보 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/timeTableByTheater")
    public ResponseEntity<List<TimeTableDto>> TimeTableByTheater(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(movieInfoService.getTimeTableByTheater(requestMap));
    }
}