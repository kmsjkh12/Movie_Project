// 23-01-15 Jwt 토큰 암 복호화 검증 및 필터링 검증 로직 SecurityConfig에 적용(오병주)
package com.movie.Spring_backend.config;

import com.movie.Spring_backend.jwt.JwtFilter;
import com.movie.Spring_backend.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> 인터페이스를 구현하는 구현체
// TokenProvider 와 JwtFilter 파일을 SecurityConfig 에 적용할 때 사용
@RequiredArgsConstructor
public class JwtSecurityConfig extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {
    private final TokenProvider tokenProvider;

    // TokenProvider를 주입받아서 JwtFilter를 통해 SecurityConfig 안에 필터를 등록하게 되고, 스프링 시큐리티 전반적인 필터에 적용
    @Override
    public void configure(HttpSecurity http) {
        JwtFilter customFilter = new JwtFilter(tokenProvider);
        http.addFilterBefore(customFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
