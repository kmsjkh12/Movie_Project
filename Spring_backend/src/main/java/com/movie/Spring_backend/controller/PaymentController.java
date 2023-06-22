/*
  23-05-02 결제 페이지 수정(오병주)
*/
package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.dto.ReservationDto;
import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.PaymentService;
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
@RequestMapping("/Payment")
@Tag(name = "PaymentController", description = "결제 관련 컨트롤러")
public class PaymentController {

    private final PaymentService paymentService;

    // 결제 검증을 위한 컨트롤러
    @Operation(summary = "결제 검증 요청", description = "포트원 결제 이후 결제 내용에 대한 검증을 요청합니다.\n\n" +
            "Body값 예시 : {\n" +
            "  \"rpayid\": \"결제 고유번호\",\n" +
            "  \"miid\": \"상영번호\",\n" +
            "  \"price\": \"결제가격\",\n" +
            "  \"temp_people\": \"결제 인원 유형\",\n" +
            "  \"temp_seat\": \"결제 좌석\",\n" +
            "  \"rticket\": \"결제 인원수\"\n" +
            "}", tags = { "PaymentController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "결제 검증 완료"),
            @ApiResponse(responseCode = "400", description = "결제 검증에 실패한 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/auth/Check")
    public ResponseEntity<ReservationDto> PaymentCheck(@RequestBody Map<String, String> requestMap, HttpServletRequest request) {
        return ResponseEntity.ok().body(paymentService.CheckPayment(requestMap, request));
    }

    // 예매 취소를 위한 컨트롤러
    @Operation(summary = "예매 취소 요청", description = "회원의 예매를 취소 요청합니다.", tags = { "PaymentController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "예매 취소 완료"),
            @ApiResponse(responseCode = "400", description = "예매번호가 존재하지 않거나 다른 회원의 예매인경우 또는 이미 취소된 예매인경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/auth/cancel/ReserveDetail/{rid}")
    public ResponseEntity<String> PaymentCancel(@Parameter(description = "예매 ID", required = true, example = "1") @PathVariable("rid") Long rid, HttpServletRequest request) {
        paymentService.CancelPayment(rid, request);
        return ResponseEntity.noContent().build();
    }
}
