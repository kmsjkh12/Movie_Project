// 23-01-16 토큰을 주고받는데 사용되는 Dto 구현(오병주)
package com.movie.Spring_backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 로그인 성공시 리액트로 전달되는 Token의 Dto파일
@Getter
@NoArgsConstructor
public class TokenDto {
    private String grantType;
    private String accessToken;
    private String refreshToken;
    private Long AtokenExpiresIn;
    private Long RtokenExpiresIn;

    @Builder
    public TokenDto(String grantType, String accessToken, Long AtokenExpiresIn, String refreshToken, Long RtokenExpiresIn) {
        this.grantType = grantType;
        this.accessToken = accessToken;
        this.AtokenExpiresIn = AtokenExpiresIn;
        this.refreshToken = refreshToken;
        this.RtokenExpiresIn = RtokenExpiresIn;
    }
}