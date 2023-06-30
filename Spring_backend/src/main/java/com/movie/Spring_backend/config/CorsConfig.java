/*
  23-02-10 Cors 전역 설정 구현(오병주)
*/
package com.movie.Spring_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        // 프론트단에서 호출하는 요청은 모두 허용하고 쿠키도 같이 받아오게함
        config.setAllowCredentials(true);
        config.addAllowedOrigin("https://www.moviepjo.com");
	config.addAllowedOrigin("http://52.79.78.98");
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**",config);
        return new CorsFilter(source);
    }
}
