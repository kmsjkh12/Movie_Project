/*
  23-01-13 아이디 중복 검사 컨트롤러구현(오병주)
  23-01-16 회원가입 및 로그인 컨트롤러구현(오병주)
  23-01-18 토큰 재발급 관련 컨트롤러구현(오병주)
  23-03-15 ~ 16 회원정보 수정 및 탈퇴 컨트롤러구현(오병주)
  23-04-15 아이디, 비밀번호 찾기 컨트롤러구현(오병주)
*/
package com.movie.Spring_backend.controller;

import com.movie.Spring_backend.error.ErrorResponse;
import com.movie.Spring_backend.service.MemberService;
import com.movie.Spring_backend.dto.MemberDto;
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
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/Member")
@Tag(name = "MemberController", description = "회원 관련 컨트롤러")
public class MemberController {

    private final MemberService memberService;

    // 아이디 중복 검사를 위한 컨트롤러, 중복된 아이디가 없을경우 noContent 리턴
    @Operation(summary = "아이디 중복검사 요청", description = "아이디의 중복여부가 조회됩니다.", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "중복검사 완료"),
            @ApiResponse(responseCode = "400", description = "아이디 중복", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/id")
    public ResponseEntity<String> existsId(@Parameter(description = "회원 ID", required = true, example = "sample1") @RequestParam("uid") String id) {
        memberService.existsId(id);
        return ResponseEntity.noContent().build();
    }

    // 이메일 중복 검사를 위한 컨트롤러, 중복된 이메일이 없을경우 noContent 리턴
    @Operation(summary = "이메일 중복검사 요청", description = "이메일의 중복여부가 조회됩니다.", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "중복검사 완료"),
            @ApiResponse(responseCode = "400", description = "이메일 중복", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/email")
    public ResponseEntity<String> existsEmail(@Parameter(description = "회원 Email", required = true, example = "sample1@gmail.com") @RequestParam("uemail") String email) {
        memberService.existsEmail(email);
        return ResponseEntity.noContent().build();
    }

    // 회원가입을 위한 컨트롤러, 회원가입을 성공할 경우 noContent 리턴
    @Operation(summary = "회원가입 요청", description = "회원가입이 진행됩니다. (newPw를 제외하고 입력)", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "회원가입 완료"),
            @ApiResponse(responseCode = "400", description = "아이디 또는 이메일 중복", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/normal/signup")
    public ResponseEntity<String> signup(@RequestBody MemberDto requestDto) {
        memberService.signup(requestDto);
        return ResponseEntity.noContent().build();
    }

    // 아이디 찾기에 사용되는 컨트롤러
    @Operation(summary = "아이디 찾기 요청", description = "회원의 아이디를 조회합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"uname\": \"임시계정\",\n" +
            "  \"uemail\": \"temp1@naver.com\"\n" +
            "}", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "아이디 조회 완료"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 회원", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/findId")
    public ResponseEntity<MemberDto> findId(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(memberService.findId(requestMap));
    }

    // 비밀번호 찾기에 사용되는 컨트롤러
    @Operation(summary = "비밀번호 찾기 요청", description = "회원가입 여부를 파악합니다.\n\n" +
            "파라미터 예시 : {\n" +
            "  \"uname\": \"임시계정\",\n" +
            "  \"uid\": \"temp1\",\n" +
            "  \"uemail\": \"temp1@naver.com\"\n" +
            "}", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원 존재(비밀번호 변경가능)"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 회원", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/findPw")
    public ResponseEntity<MemberDto> findPw(@RequestParam Map<String, String> requestMap) {
        return ResponseEntity.ok().body(memberService.findPw(requestMap));
    }

    // 비밀번호 변경 컨트롤러
    @Operation(summary = "비밀번호 변경 요청", description = "회원의 비밀번호를 변경합니다.\n\n" +
            "(uid에 현재 아이디, newPw에 새로운 비밀번호 입력)", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "비밀번호 변경 완료"),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/normal/changePw")
    public ResponseEntity<String> changePw(@RequestBody MemberDto requestDto) {
        memberService.changePw(requestDto);
        return ResponseEntity.noContent().build();
    }

    // 로그인을 위한 컨트롤러, id와 pw가 일치할 경우 Token을 생성하여 리턴
    @Operation(summary = "로그인 요청", description = "서버로부터 로그인을 요청합니다.\n\n" +
            "(uid에 아이디, upw에 비밀번호 입력)", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 완료"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 회원", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류 및 존재하지 않는 회원", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/normal/login")
    public ResponseEntity<MemberDto> login_check(@RequestBody MemberDto requestDto, HttpServletResponse response) {
        return ResponseEntity.ok().body(memberService.login(requestDto, response));
    }

    // 로그인 상태를 확인하는 컨트롤러
    @Operation(summary = "로그인 상태 조회", description = "회원의 로그인 상태를 조회합니다. (토큰 검사)", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "현재 로그인중"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 회원", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/normal/login_status")
    public ResponseEntity<MemberDto> getMyInfoBySecurity(HttpServletRequest request) {
        return ResponseEntity.ok(memberService.getMyInfoBySecurity(request));
    }

    // 리프레시 토큰을 이용한 토큰 재발급 컨트롤러
    @Operation(summary = "토큰 재발급 요청", description = "Refresh 토큰을 이용하여 Access 토큰을 재발급합니다.", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "토큰 재발급 완료"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 회원", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "올바르지 못한 토큰", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/normal/reissue")
    public ResponseEntity<String> reissue(HttpServletResponse response, HttpServletRequest request) {
        memberService.reissue(response, request);
        return ResponseEntity.noContent().build();
    }

    // 로그아웃 컨트롤러
    @Operation(summary = "로그아웃 요청", description = "서버로부터 로그아웃을 요청합니다.", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "로그아웃 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/normal/logout")
    public ResponseEntity<String> logoutUser(HttpServletResponse response, HttpServletRequest request) {
        memberService.logout(response, request);
        return ResponseEntity.noContent().build();
    }

    // 회원정보 수정 페이지 패스워드 확인 컨트롤러
    @Operation(summary = "비밀번호 확인 요청", description = "회원정보 수정페이지에 접근하기 위해 비밀번호 확인을 요청합니다.", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "비밀번호 확인 완료"),
            @ApiResponse(responseCode = "400", description = "비밀번호가 일치하지 않음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/auth/checkPw")
    public ResponseEntity<String> checkPw(HttpServletRequest request, @Parameter(description = "회원 비밀번호", required = true, example = "password") @RequestParam("upw") String pw) {
        memberService.CheckPw(request, pw);
        return ResponseEntity.noContent().build();
    }

    // 회원정보 수정 페이지 회원정보 수정 컨트롤러
    @Operation(summary = "회원정보 수정 요청", description = "회원정보 수정페이지에서 회원정보 수정을 요청합니다.", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "회원정보 수정 완료"),
            @ApiResponse(responseCode = "400", description = "아이디 또는 비밀번호가 일치하지 않음", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/auth/memberUpdate")
    public ResponseEntity<String> memberUpdate(HttpServletRequest request, @RequestBody MemberDto requestDto) {
        memberService.MemberUpdate(request, requestDto);
        return ResponseEntity.noContent().build();
    }

    // 회원탈퇴 컨트롤러
    @Operation(summary = "회원탈퇴 요청", description = "회원정보 수정페이지에서 회원탈퇴를 요청합니다.", tags = { "MemberController" })
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "회원탈퇴 완료"),
            @ApiResponse(responseCode = "401", description = "로그인 Token이 전달되지 않았거나 유효하지 않은 경우", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/auth/memberDrop")
    public ResponseEntity<String> memberDrop(HttpServletResponse response, HttpServletRequest request) {
        memberService.MemberDrop(response, request);
        return ResponseEntity.noContent().build();
    }
}