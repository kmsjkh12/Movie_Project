// 23-01-15 Jwt 토큰 암 복호화 검증 로직 구현(오병주)
// 23-01-17 리프레시 토큰 구현(오병주)
package com.movie.Spring_backend.jwt;

import com.movie.Spring_backend.dto.TokenDto;
import com.movie.Spring_backend.error.exception.EntityNotFoundException;
import com.movie.Spring_backend.error.exception.ErrorCode;
import com.movie.Spring_backend.error.exception.InvalidValueException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

// Jwt 토큰에 관련된 암호화, 복호화, 검증 로직이 이루어 지는 곳
@Slf4j
@Component
public class TokenProvider {
    private static final String AUTHORITIES_KEY = "auth";
    private static final String BEARER_TYPE = "bearer";
    // access 토큰의 만료시간(30분)
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 30;
    // refresh 토큰의 만료시간(7일)
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7;
    // jwt를 만들기 위해 사용되는 key 값
    private final Key key;

    // 여기서 @Value는 `springframework.beans.factory.annotation.Value`소속이다! lombok의 @Value와 착각하지 말것!
    // application.yml에 있는 secret key 값을 가져와서 decode 한 후 의존성이 주입된 key 값으로 설정
    public TokenProvider(@Value("${jwt.secret}") String secretKey) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // 토큰을 생성하는 메소드
    public TokenDto generateTokenDto(Authentication authentication) {
        // Authentication 인터페이스를 확장한 파라미터를 stream을 통한 함수형 프로그래밍으로
        // String 형의 authorities로 변환
        // ex) ROLE_USER, ROLE_ADMIN
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        long now = (new Date()).getTime();

        // AccessToken 생성
        Date tokenExpiresIn = new Date(now + ACCESS_TOKEN_EXPIRE_TIME);
        String accessToken = Jwts.builder()
                .setSubject(authentication.getName())
                .claim(AUTHORITIES_KEY, authorities)
                .setExpiration(tokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();

        // RefreshToken 생성
        Date tokenExpiresIn2 = new Date(now + REFRESH_TOKEN_EXPIRE_TIME);
        String refreshToken = Jwts.builder()
                .setExpiration(new Date(now + REFRESH_TOKEN_EXPIRE_TIME))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();

        // TokenDto에 Token의 필요한 정보를 넣어 build 한 뒤 리턴
        return TokenDto.builder()
                .grantType(BEARER_TYPE)
                .accessToken(accessToken)
                .AtokenExpiresIn(tokenExpiresIn.getTime())
                .refreshToken(refreshToken)
                .RtokenExpiresIn(tokenExpiresIn2.getTime())
                .build();
    }

    // 토큰을 받았을 때 토큰의 인증을 꺼내는 메소드
    public Authentication getAuthentication(String accessToken) {
        // parseClaims 메소드를 통해 string 형의 토큰을 claims 형으로 변경
        Claims claims = parseClaims(accessToken);

        // 만약 토큰의 정보가 들어간 claims에 auth가 없을 경우 예외를 반환해줌
        if (claims.get(AUTHORITIES_KEY) == null) {
            throw new AccessDeniedException("권한 정보가 없는 토큰입니다.");
        }

        // GrantedAuthority을 상속받은 타입만이 사용 가능한 Collection을 반환하는데
        // stream을 통한 함수형 프로그래밍으로 claims 형의 토큰을 정렬한 후
        // GrantedAuthority을 상속받은 SimpleGrantedAuthority 형의 인가가 들어간 List를 생성
        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        // Spring Security의 유저 정보를 담는 인터페이스인 UserDetails에 token에서 얻은 정보와, 아까 생성한 List(인가)를 넣음
        UserDetails principal = new User(claims.getSubject(), "", authorities);

        // 위에서 만든 유저 정보와 인가 정보를 UsernamePasswordAuthenticationToken에 넣고 반환
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    // Jwts 모듈을 통해 토큰을 검증하기 위한 메소드
    public void validateToken(String token, String name) {
        // 토큰의 정보가 검증 되었을 경우 true를 리턴
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
        }
        // 토큰이 null인 경우의 예외처리
        catch (IllegalArgumentException e) {
            throw new EntityNotFoundException("로그인 정보가 없음", ErrorCode.LOGIN_IS_NONE);
        }
        // 토큰이 만료되었을 경우의 예외처리
        catch (ExpiredJwtException e) {
            // Refresh 토큰과 Access 토큰의 만료됐을때 예외를 다르게 해줘야함(axios interceptor 때문에)
            if (name.equals("ATK")) {
                throw new InvalidValueException("토큰이 만료 됐음", ErrorCode.EXPIRED_TOKEN);
            }
            else {
                throw new InvalidValueException("토큰이 만료 됐음", ErrorCode.INVALID_TOKEN);
            }
        }
        // 토큰의 시그니처가 잘못되었을 경우의 예외처리
        catch (JwtException e) {
            throw new InvalidValueException("토큰의 정보가 잘못 됐음", ErrorCode.INVALID_TOKEN);
        }
    }

    // 토큰을 claims 형으로 만드는 메소드, String 형의 토큰을 변환하여 권한을 확인하기 위해 사용되는 메소드
    private Claims parseClaims(String accessToken) {
        // 파라미터 accessToken의 정보를 통해 claims 형의 토큰 생성
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken).getBody();
        }
        // Jwt의 지정된 유효기간 초과할 때 사용되는 예외처리 (auth가 없는 claims를 리턴)
        catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }
}
