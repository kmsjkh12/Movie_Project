// 23-01-17 Redis에 사용되는 RefreshTokenEntity 작성(오병주)
package com.movie.Spring_backend.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

// 리프레시 토큰 제한시간은 7일로 지정
@RedisHash(value = "RTK", timeToLive = 604800)
@Getter
@NoArgsConstructor
public class RefreshTokenEntity {
    @Id
    private String uid;
    private String refreshToken;
    private String state;

    @Builder
    public RefreshTokenEntity(String uid, String refreshToken, String state) {
        this.uid = uid;
        this.refreshToken = refreshToken;
        this.state = state;
    }
}
