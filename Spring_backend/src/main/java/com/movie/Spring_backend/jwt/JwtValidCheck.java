// 23-01-30 Jwt 토큰 유효성 검증 로직 분리(오병주)
package com.movie.Spring_backend.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

// Jwt 토큰의 유효성을 검사하여 예외처리를 실행하는 곳
@Component
@RequiredArgsConstructor
public class JwtValidCheck {

    // Access 토큰 정보를 추출할 때 사용되는 값
    private static final String AUTHORIZATION_HEADER = "ATK";
    // Access 토큰 정보를 확인할 때 사용되는 값
    private static final String BEARER_PREFIX = "Bearer";
    // Refresh 토큰 정보를 추출할 때 사용되는 값
    private static final String AUTHORIZATION_HEADER2 = "RTK";
    private final TokenProvider tokenProvider;

    // Jwt 토큰의 유효성을 검사한 뒤 예외처리를 해주는 메소드
    public void JwtCheck (HttpServletRequest request, String name) {
        // 만약에 Access 토큰에 대한 검증이 필요한 경우
        if (name.equals(AUTHORIZATION_HEADER)) {
            // Request Header에서 Access 토큰을 꺼내 jwt 변수에 저장
            String ATK = resolveAccessToken(request);
            // 추출한 Access 토큰에 대한 유효성 검사 실행
            tokenProvider.validateToken(ATK, "ATK");
            return;
        }

        // 만약 Refresh 토큰에 대한 검증이 필요한 경우
        if (name.equals(AUTHORIZATION_HEADER2)) {
            // Request Header에서 Refresh 토큰을 꺼내 jwt 변수에 저장
            String RTK = resolveRefreshToken(request);
            // 추출한 Refresh 토큰에 대한 유효성 검사 실행
            tokenProvider.validateToken(RTK, "RTK");
        }
    }

    // Access token을 리턴하는 메소드
    public String resolveAccessToken(HttpServletRequest request) {
        // Request Header의 내용중 쿠키의 값들을 추출
        Cookie [] Cookies = request.getCookies();

        // 쿠키가 없을 경우 예외처리
        if (Cookies == null) {
            return null;
        };

        // ATK 토큰의 값을 추출
        String bearerToken = "";
        for (Cookie cookie : Cookies) {
            if (cookie.getName().equals(AUTHORIZATION_HEADER)) {
                bearerToken = cookie.getValue();
            }
        }

        // 추출한 Value의 문자열 유효성 검사 및 문자열의 시작이 Bearer 인지 확인 후 true 이면 Value 값에서 Bearer 를 제거하여 리턴
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(6);
        }
        // 문자열 유효성 검사 실패 및 문자열의 시작이 다른 경우 null 리턴
        return null;
    }

    // Refresh token을 리턴하는 메소드
    public String resolveRefreshToken(HttpServletRequest request) {
        // Request Header의 내용중 쿠키의 값들을 추출
        Cookie [] Cookies = request.getCookies();

        // 쿠키가 없을 경우 예외처리
        if (Cookies == null) {
            return null;
        };

        // RTK 토큰의 값을 추출후 리턴
        String bearerToken = "";
        for (Cookie cookie : Cookies) {
            if (cookie.getName().equals(AUTHORIZATION_HEADER2)) {
                bearerToken = cookie.getValue();
                return bearerToken;
            }
        }
        // RTK 토큰이 없을경우 null 리턴
        return null;
    }
}
