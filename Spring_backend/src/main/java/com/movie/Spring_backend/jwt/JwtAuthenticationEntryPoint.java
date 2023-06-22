// 23-01-15 Security 단에서 발생하는 예외 처리 로직 구현(오병주)
package com.movie.Spring_backend.jwt;

import com.movie.Spring_backend.error.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

// Security 단에서 발생하는 예외는 ControllerAdvice를 통해 처리가 불가능 하여 따로 처리 해줘야 함
// 유효한 자격증명을 제공하지 않고 접근하려 할때 예외처리(401)
@Component
@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    // 한글 출력을 위해 getWriter() 사용, 프론트단으로 보내는 error 가공
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().println("{ \"message\" : \"" + ErrorCode.INVALID_TOKEN.getMessage()
                + "\", \"status\" : " + ErrorCode.INVALID_TOKEN.getStatus()
                + ", \"errors\" : [ ]"
                + ", \"code\" : " + "\"" + ErrorCode.INVALID_TOKEN.getCode()
                + "\"" + "}");
    }
}
