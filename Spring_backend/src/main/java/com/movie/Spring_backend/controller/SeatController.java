/*
  23-04-30 ~ 23-05-01 예매 좌석 페이지 수정(오병주)
*/
package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.dto.SeatDto;
import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.SeatService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/Seat")
@Tag(name = "SeatController", description = "좌석 관련 컨트롤러")
public class SeatController {

    private final SeatService seatService;

    // 예매 페이지에서 좌석을 가져오는 컨트롤러
    @Operation(summary = "예매 페이지 좌석 요청", description = "예매 페이지에서 특정 상영정보에 대한 좌석을 요청합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"cid\": \"1\",\n" +
            "  \"miid\": \"1\"\n" +
            "}", tags = { "SeatController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "좌석 조회 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/MovieInfo")
    public ResponseEntity<List<SeatDto>> SeatMovieInfo(HttpServletRequest request, @RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(seatService.getSeatMovieInfo(request, requestMap));
    }

    // 결제전 점유좌석의 여부를 확인하는 컨트롤러
    @Operation(summary = "점유좌석 여부 확인 요청", description = "결제를 진행하기전 점유좌석에 대한 여부 확인을 요청합니다.\n\n" +
            "Body값 예시 : {\n" +
            "  \"temp_seat\": \"1\",\n" +
            "  \"miid\": \"1\"\n" +
            "}", tags = { "SeatController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "점유 여부 확인 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "406", description = "이미 점유된 좌석인 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/Check")
    public ResponseEntity<String> SeatCheck(HttpServletRequest request, @RequestBody Map<String, String> requestMap) {
        seatService.getSeatCheck(request, requestMap);
        return ResponseEntity.noContent().build();
    }
}


