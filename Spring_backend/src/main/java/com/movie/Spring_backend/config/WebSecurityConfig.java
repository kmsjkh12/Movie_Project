/*
  23-01-16 Security 기본적인 설정 구현(오병주)
  23-02-10 Cors 전역 설정 구현(오병주)
*/
package com.movie.Spring_backend.config;

import com.movie.Spring_backend.jwt.JwtAccessDeniedHandler;
import com.movie.Spring_backend.jwt.JwtAuthenticationEntryPoint;
import com.movie.Spring_backend.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Component;

// Spring Security의 기본적인 설정을 클래스
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@Component
public class WebSecurityConfig {

    private final TokenProvider tokenProvider;
    private final CorsConfig corsConfig;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    // request로부터 받은 비밀번호를 암호화하기 위해 PasswordEncoder 메소드를 Bean 객체로 생성
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 실질적인 로직인 filterChain 메소드 HttpSecurity를 Configuring해서 사용
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                // 리액트와 스프링부트 사이에 REST API 사용을 위해 csrf 방지 disable
                .csrf().disable()
                // REST API를 통해 세션 없이 토큰을 주고받으며 데이터를 주고받기 때문에 세션설정을 STATELESS로 설정
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                // 사전에 만든 예외처리를 위한 클래스를 추가
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler)

                // 모든 request에서 /**/normal/**를 제외한 모든 url의 request는 로그인 토큰이 필요
                .and()
                .authorizeRequests()
                .antMatchers("/**/normal/**").permitAll()
                .antMatchers("/api-docs/**", "/swagger-ui.html", "/swagger-ui/**", "/swagger-resources/**", "/favicon.ico").permitAll() // 스웨거 관련 예외처리
                .antMatchers("/Manager/**").hasRole("ADMIN") // ADMIN 권한을 가진 사용자만 접근 허용(관리자)
                .anyRequest().authenticated()

                .and()
                // cors 관련 필터 적용(전역 설정)
                .addFilter(corsConfig.corsFilter())
                // 사전에 만든 JwtSecurityConfig 클래스를 통해 tokenProvider를 적용(Security 필터 적용)
                .apply(new JwtSecurityConfig(tokenProvider));

        return httpSecurity.build();
    }
}