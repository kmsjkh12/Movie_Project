// 23-02-01 Csrf 공격 방지 로직 구현(오병주)
package com.movie.Spring_backend.util;

import com.movie.Spring_backend.error.exception.ErrorCode;
import com.movie.Spring_backend.error.exception.InvalidValueException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

// Csrf 공격 방지를 위한 클래스
public class CsrfCheckUtil {
    // Double submit cookie을 구현한 메소드
    public static void CsrfCheck (HttpServletRequest request) {
        // 헤더에 있는 임의의 난수를 추출
        String HeaderToken = request.getHeader("Checktoken");

        // request에서 쿠키 추출
        Cookie [] Cookies = request.getCookies();

        // 쿠키가 없을 경우 예외처리
        if (Cookies == null) {
            throw new InvalidValueException("정보가 일치하지 않습니다.", ErrorCode.CSRF_ERROR);
        }

        // CTK 토큰의 값을 추출
        String CookieToken = "";
        for (Cookie cookie : Cookies) {
            if (cookie.getName().equals("CTK")) {
                CookieToken = cookie.getValue();
            }
        }

        // 뽑아낸 토큰값에 리액트에서 임의로 정한 난수를 합침, 헤더에는 저 값이 존재하지만 쿠키에는 존재하지 않음
        // 임의의 난수 때문에 쿠키를 탈취 당해도 공격자는 헤더의 난수값을 알아내지 못함
        CookieToken = CookieToken + "S1e2rfaSDASXx3sx631s1RVGcQsFEWZX5S11a2FdaT22fwLOa32q3";

        // 헤더와 쿠키의 값을 비교 후 일치하지 않으면 예외처리
        if (!HeaderToken.equals(CookieToken)) {
            throw new InvalidValueException("CSRF 공격이 의심됩니다.", ErrorCode.CSRF_ERROR);
        }
    }
}
