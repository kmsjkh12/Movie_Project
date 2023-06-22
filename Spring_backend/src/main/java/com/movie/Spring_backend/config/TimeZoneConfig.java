package com.movie.Spring_backend.config;

import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@Configuration
// Linux TimeZone 설정
public class TimeZoneConfig {
    // Linux 환경에서의 한국 기준으로 시간 설정
    @PostConstruct
    public void started() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
    }
}
