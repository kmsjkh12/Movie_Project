// 23-01-15 Jwt 토큰 필터링 검증 로직 구현(오병주)
// 23-02-01 Csrf 공격 방지 로직 구현(오병주)
package com.movie.Spring_backend.jwt;

import com.movie.Spring_backend.util.CsrfCheckUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

// Jwt의 필터링이 실행되는 곳, OncePerRequestFilter 인터페이스를 구현하기 때문에 요청 받을 때 단 한번만 실행됨
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    // 토큰 정보를 추출할 때 사용되는 값
    public static final String AUTHORIZATION_HEADER = "ATK";
    // 토큰 정보를 확인할 때 사용되는 값
    public static final String BEARER_PREFIX = "Bearer";
    private final TokenProvider tokenProvider;

    // 실제 필터링 로직이 수행되는 메소드
    // 모든 Request 요청은 이 필터를 거치기 때문에 토큰 정보가 유효하지 않으면 정상적으로 수행되지 않음(/**/normal/** url 제외)
    // 반대로 Request가 정상적으로 Controller까지 도착했으면 SecurityContext에 Member ID가 존재한다는 것이 보장함
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // axios 요청이 POST, DELETE, PUT, PATCH인 경우 Double submit cookie 메소드 실행(csrf 공격 방지)
        // Header에 TestID가 존재하면 검사X (Swagger에서 요청한 방식)
        // 현재 프로젝트는 포트폴리오를 위한 프로젝트라 Rest Api 명세서를 공개하므로 실제 배포와 달리 예외사항을 처리한 것
        if (request.getMethod().equals("POST")
         || request.getMethod().equals("DELETE")
         || request.getMethod().equals("PUT")
         || request.getMethod().equals("PATCH")) {
            if (request.getHeader("TestID") == null) {
                CsrfCheckUtil.CsrfCheck(request);
                System.out.println("CSRF 공격 검사 완료");
            }
        }

        // Request Header에서 토큰을 꺼내 jwt 변수에 저장
        String jwt = resolveToken(request);

        // 정상 토큰이면 해당 토큰으로 Authentication을 가져와서 SecurityContext에 저장
        if (StringUtils.hasText(jwt)) {
            Authentication authentication = tokenProvider.getAuthentication(jwt);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 체인의 다음 필터를 호출
        filterChain.doFilter(request, response);
    }

    // Request Header에서 토큰 정보를 꺼내오는 메소드
    private String resolveToken(HttpServletRequest request) {
        // Request Header의 내용중 쿠키의 값들을 추출
        Cookie [] Cookies = request.getCookies();

        // 로그인이 필요 없을경우 쿠키가 전송되지 않으니까 예외처리
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
}