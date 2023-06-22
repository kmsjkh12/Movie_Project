/*
  23-02-23 영화 관람평을 매핑하기 위한 클래스 생성(오병주)
 */

package com.movie.Spring_backend.mapper;

import com.movie.Spring_backend.dto.CommentInfoDto;
import com.movie.Spring_backend.entity.MovieMemberEntity;
import org.springframework.stereotype.Component;

@Component
public class MovieCommentMapper {
    // 영화 관람평과 로그인한 사용자의 좋아요 기록을 mapping 해주는 메소드
    public CommentInfoDto toDto(MovieMemberEntity entity, boolean like) {

        // 예외처리
        if (entity == null) {
            return null;
        }

        return CommentInfoDto.builder()
                .umid(entity.getUmid())
                .umscore(entity.getUmscore())
                .umcomment(entity.getUmcomment())
                .umcommenttime(entity.getUmcommenttime())
                .uid(entity.getMember().getUid())
                .upcnt(entity.getCntCommentLike())
                .like(like).build();
    }

    // 사용자가 작성한 관람평을 영화 정보와 같이 매핑해주는 메소드(마이 페이지)
    public CommentInfoDto toDtoMyPage(MovieMemberEntity entity, boolean like) {

        // 예외처리
        if (entity == null) {
            return null;
        }

        return CommentInfoDto.builder()
                .umid(entity.getUmid())
                .umscore(entity.getUmscore())
                .umcomment(entity.getUmcomment())
                .umcommenttime(entity.getUmcommenttime())
                .uid(entity.getMember().getUid())
                .upcnt(entity.getCntCommentLike())
                .like(like)
                .mid(entity.getMovie().getMid())
                .mtitle(entity.getMovie().getMtitle())
                .mimagepath(entity.getMovie().getMimagepath()).build();
    }
}
