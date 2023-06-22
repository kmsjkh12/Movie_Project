package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.dto.TheaterDto;
import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.TheaterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/Theater")
@Tag(name = "TheaterController", description = "극장 관련 컨트롤러")
public class TheaterController {

    private final TheaterService theaterService;

    // 예매가 가능한 극장 불러오는 컨트롤러
    @Operation(summary = "예매 가능한 극장 요청", description = "예매가 가능한 극장 목록을 요청합니다.", tags = { "TheaterController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "극장 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/ReservePossible")
    public ResponseEntity<List<TheaterDto>> PossibleTheater() {
        return ResponseEntity.ok().body(theaterService.getPossibleTheater());
    }

    // 예매 페이지에서 조건에 맞는 극장 불러오는 컨트롤러
    @Operation(summary = "조건에 맞는 극장 요청", description = "예매 페이지에서 조건에 맞는 극장을 요청합니다.\n\n" +
            "(파라미터는 현재값 그대로 사용가능)", tags = { "TheaterController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "극장 조회 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/Ticket")
    public ResponseEntity<List<TheaterDto>> TicketTheater(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(theaterService.getTicketTheater(requestMap));
    }
}


