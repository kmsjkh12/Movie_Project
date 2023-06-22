/*
  23-02-07 MovieEntity를 dto로 매핑하기 위한 클래스 생성(오병주)
  23-02-14 상세영화 페이지 dto 매핑 메소드 생성(오병주)
*/

package com.movie.Spring_backend.mapper;

import com.movie.Spring_backend.dto.MovieDto;
import com.movie.Spring_backend.entity.MovieActorEntity;
import com.movie.Spring_backend.entity.MovieEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class MovieMapper {
    // 전체 영화 페이지와 상영 예정작 페이지에 사용되는 mapping 메소드
    public List<MovieDto> toDtoAllORComingMovie(List<MovieEntity> ShowMovies, List<MovieEntity> NotShowMovies, Set<Long> MovieLikes, float AllReserveCnt) {

        List<MovieDto> result = new ArrayList<>();

        // 예매가 가능한 영화 List에 삽입
        for (MovieEntity m : ShowMovies) {
            result.add(MovieDto.builder()
                        .mid(m.getMid())
                        .mdir(m.getMdir())
                        .mtitle(m.getMtitle())
                        .mgenre(m.getMgenre())
                        .mtime(m.getMtime())
                        .mdate(m.getMdate())
                        .mrating(m.getMrating())
                        .mstory(m.getMstory())
                        .mimagepath(m.getMimagepath())
                        .mlikes(m.getCntMovieLike())
                        .mscore(m.getAvgScore())
                        .mlike(MovieLikes.contains(m.getMid()))
                        .reserve(true)
                        .reserveRate(m.getCntreserve() / AllReserveCnt * 100).build());
        }

        // 예매가 불가능한 영화 리스트에 삽입
        for (MovieEntity m : NotShowMovies) {
            result.add(MovieDto.builder()
                    .mid(m.getMid())
                    .mdir(m.getMdir())
                    .mtitle(m.getMtitle())
                    .mgenre(m.getMgenre())
                    .mtime(m.getMtime())
                    .mdate(m.getMdate())
                    .mrating(m.getMrating())
                    .mstory(m.getMstory())
                    .mimagepath(m.getMimagepath())
                    .mlikes(m.getCntMovieLike())
                    .mscore(m.getAvgScore())
                    .mlike(MovieLikes.contains(m.getMid()))
                    .reserve(false)
                    .reserveRate(m.getCntreserve() / AllReserveCnt * 100).build());
        }
        return result;
    }

    // 현재 상영작 페이지에 사용되는 mapping 메소드
    public List<MovieDto> toDtoScreenMovie(List<MovieEntity> ShowMovies, Set<Long> MovieLikes, float AllReserveCnt) {

        List<MovieDto> result = new ArrayList<>();

        // 예매가 가능하고 개봉한 영화 List에 삽입
        for (MovieEntity m : ShowMovies) {
            result.add(MovieDto.builder()
                    .mid(m.getMid())
                    .mdir(m.getMdir())
                    .mtitle(m.getMtitle())
                    .mgenre(m.getMgenre())
                    .mtime(m.getMtime())
                    .mdate(m.getMdate())
                    .mrating(m.getMrating())
                    .mstory(m.getMstory())
                    .mimagepath(m.getMimagepath())
                    .mlikes(m.getCntMovieLike())
                    .mscore(m.getAvgScore())
                    .mlike(MovieLikes.contains(m.getMid()))
                    .reserve(true)
                    .reserveRate(m.getCntreserve() / AllReserveCnt * 100).build());
        }
        return result;
    }

    // 영화 상세페이지에 필요한 내용들을 mapping 해주는 메소드
    public MovieDto toDtoDetail(MovieEntity entity, boolean like, boolean Screen, List<String> Actors, float AllReserveCnt) {

        // 예외처리
        if (entity == null) {
            return null;
        }

        // 영화 예매가 가능할 경우 예매율까지 계산해서 전달, 아닐경우 예매율을 제외하고 전달
        if (Screen) {
            return MovieDto.builder()
                    .mid(entity.getMid())
                    .mdir(entity.getMdir())
                    .mtitle(entity.getMtitle())
                    .mgenre(entity.getMgenre())
                    .mtime(entity.getMtime())
                    .mdate(entity.getMdate())
                    .mrating(entity.getMrating())
                    .mstory(entity.getMstory())
                    .mimagepath(entity.getMimagepath())
                    .mlikes(entity.getCntMovieLike())
                    .mscore(entity.getAvgScore())
                    .mlike(like)
                    .actors(Actors)
                    .reserve(true)
                    .reserveRate(entity.getCntreserve() / AllReserveCnt * 100).build();
        }
        else {
            return MovieDto.builder()
                    .mid(entity.getMid())
                    .mdir(entity.getMdir())
                    .mtitle(entity.getMtitle())
                    .mgenre(entity.getMgenre())
                    .mtime(entity.getMtime())
                    .mdate(entity.getMdate())
                    .mrating(entity.getMrating())
                    .mstory(entity.getMstory())
                    .mimagepath(entity.getMimagepath())
                    .mlikes(entity.getCntMovieLike())
                    .mscore(entity.getAvgScore())
                    .mlike(like)
                    .actors(Actors)
                    .reserve(false).build();
        }
    }

    // 예매페이지에서 필요한 영화 내용들을 mapping 해주는 메소드
    public List<MovieDto> toDtoTicketMovie(List<MovieEntity> conditionMovie, List<MovieEntity> allMovie) {

        // 사용될 변수들 초기화
        List<MovieDto> Movies = new ArrayList<>();
        List<Long> checkNum = new ArrayList<>();

        // 조건에 맞는 영화 반복
        for (MovieEntity m : conditionMovie) {
            // 영화를 리턴할 MovieDto 배열에 넣고 영화 ID는 조건문을 위해 다른 배열에 삽입
            Movies.add(MovieDto.builder()
                    .mid(m.getMid())
                    .mtitle(m.getMtitle())
                    .mrating(m.getMrating())
                    .mgenre(m.getMgenre())
                    .mimagepath(m.getMimagepath())
                    .reserve(true).build());
            checkNum.add(m.getMid());
        }

        // 예매가 가능한 영화 반복
        for (MovieEntity m : allMovie) {
            // MovieDto 배열에 들어가지 않은 영화 삽입
            if (!checkNum.contains(m.getMid())) {
                Movies.add(MovieDto.builder()
                        .mid(m.getMid())
                        .mtitle(m.getMtitle())
                        .mrating(m.getMrating())
                        .mgenre(m.getMgenre())
                        .mimagepath(m.getMimagepath())
                        .reserve(false).build());
            }
        }
        return Movies;
    }

    // 마이페이지에 필요한 영화 내용들을 mapping 해주는 메소드
    public MovieDto toDtoMyPage(MovieEntity entity, boolean Screen, float AllReserveCnt) {

        // 예외처리
        if (entity == null) {
            return null;
        }

        // 영화 예매가 가능할 경우 예매율까지 계산해서 전달, 아닐경우 예매율을 제외하고 전달
        if (Screen) {
            return MovieDto.builder()
                    .mid(entity.getMid())
                    .mdir(entity.getMdir())
                    .mtitle(entity.getMtitle())
                    .mgenre(entity.getMgenre())
                    .mtime(entity.getMtime())
                    .mdate(entity.getMdate())
                    .mrating(entity.getMrating())
                    .mimagepath(entity.getMimagepath())
                    .mlikes(entity.getCntMovieLike())
                    .mscore(entity.getAvgScore())
                    .mlike(true)
                    .reserve(true)
                    .reserveRate(entity.getCntreserve() / AllReserveCnt * 100).build();
        }
        else {
            return MovieDto.builder()
                    .mid(entity.getMid())
                    .mdir(entity.getMdir())
                    .mtitle(entity.getMtitle())
                    .mgenre(entity.getMgenre())
                    .mtime(entity.getMtime())
                    .mdate(entity.getMdate())
                    .mrating(entity.getMrating())
                    .mimagepath(entity.getMimagepath())
                    .mlikes(entity.getCntMovieLike())
                    .mscore(entity.getAvgScore())
                    .mlike(true)
                    .reserve(false).build();
        }
    }

    // 관리자 페이지(영화관리)에 필요한 영화 내용들을 mapping 해주는 메소드
    public List<MovieDto> toDtoManagerMovie(List<MovieEntity> movieList, List<MovieActorEntity> movieActorList) {

        // 사용될 변수들 초기화
        List<MovieDto> Movies = new ArrayList<>();
        Long movieId = 0L;
        Long actorMovieId = 0L;
        Long actorId = 0L;
        int num = 0;
        String role = "";
        String name = "";

        // 반복문을 통해 영화에 출연하는 배우들을 분리
        for (MovieEntity movieEntity : movieList) {
            List<String> mainActor = new ArrayList<>();
            List<String> mainActorId = new ArrayList<>();
            List<String> subActor = new ArrayList<>();
            List<String> subActorId = new ArrayList<>();
            List<String> voiceActor = new ArrayList<>();
            List<String> voiceActorId = new ArrayList<>();
            int cnt = 0;
            // 현재 돌고있는 반복문 순번 영화의 Id
            movieId = movieEntity.getMid();

            for (int j = num; j < movieActorList.size(); j++) {
                // 현재 돌고있는 반복문 순번 배우의 출연 영화 Id
                actorMovieId = movieActorList.get(j).getMovie().getMid();

                // 현재 영화의 Id와 배우의 출연 영화 Id가 같을경우
                if (movieId.equals(actorMovieId)) {
                    role = movieActorList.get(j).getMarole();
                    name = movieActorList.get(j).getActor().getAname();
                    actorId = movieActorList.get(j).getActor().getAid();

                    // 배우들의 역할에 따라 이름을 할당
                    if (role.equals("주연")) {
                        mainActor.add(name);
                        mainActorId.add(String.valueOf(actorId));
                    } else if (role.equals("조연")) {
                        subActor.add(name);
                        subActorId.add(String.valueOf(actorId));
                    } else {
                        voiceActor.add(name);
                        voiceActorId.add(String.valueOf(actorId));
                    }
                    // 배우들을 할당한 횟수 count
                    cnt++;
                }
                // 현재 영화의 Id와 배우의 출연 영화 Id가 다르면 break
                else {
                    break;
                }
            }
            // 배우와 영화 정보를 리턴할 배열에 삽입
            Movies.add(MovieDto.builder()
                    .mid(movieId)
                    .mtitle(movieEntity.getMtitle())
                    .mdir(movieEntity.getMdir())
                    .mdate(movieEntity.getMdate())
                    .mgenre(movieEntity.getMgenre())
                    .mtime(movieEntity.getMtime())
                    .mrating(movieEntity.getMrating())
                    .mimagepath(movieEntity.getMimagepath())
                    .mainactor(mainActor)
                    .mainactorId(mainActorId)
                    .subactor(subActor)
                    .subactorId(subActorId)
                    .voiceactor(voiceActor)
                    .voiceactorId(voiceActorId)
                    .cntMovieInfo(movieEntity.getCntMovieInfo())
                    .mstory(movieEntity.getMstory()).build());
            // 배우에 대한 반복문 시작위치 조정(이미 추가된 배우를 건너뛰기 위한 과정)
            num += cnt;
        }
        return Movies;
    }

    // 관리자 페이지(예매기록관리)에 필요한 영화 내용들을 mapping 해주는 메소드
    public MovieDto toDtoManagerReserve(MovieEntity entity, boolean Screen) {

        // 영화 예매가 불가능 하면 (상영예정)을 이름에 붙여서 보냄
        if (Screen) {
            return MovieDto.builder()
                    .mid(entity.getMid())
                    .mtitle(entity.getMtitle())
                    .mtime(entity.getMtime())
                    .mdate(entity.getMdate())
                    .mimagepath(entity.getMimagepath())
                    .reserve(true).build();
        }
        else {
            return MovieDto.builder()
                    .mid(entity.getMid())
                    .mtitle(entity.getMtitle()+" (상영예정)")
                    .mtime(entity.getMtime())
                    .mdate(entity.getMdate())
                    .mimagepath(entity.getMimagepath())
                    .reserve(false).build();
        }
    }
}
