/*
  23-02-09 로그인한 유저가 영화에 관련된 행위를 할때 사용되는 Service 구현(오병주)
  23-02-12 영화 관람평 조회 메소드 구현(오병주)
  23-02-13 관람평 작성 메소드 구현(오병주)
  23-02-25 관람평 작성 메소드 수정(오병주)
*/
package com.movie.Spring_backend.service;

import com.movie.Spring_backend.dto.CommentInfoDto;
import com.movie.Spring_backend.dto.MovieDto;
import com.movie.Spring_backend.entity.*;
import com.movie.Spring_backend.error.exception.BusinessException;
import com.movie.Spring_backend.error.exception.EntityNotFoundException;
import com.movie.Spring_backend.error.exception.ErrorCode;
import com.movie.Spring_backend.exceptionlist.MovieCommentNotFoundException;
import com.movie.Spring_backend.exceptionlist.MovieNotFoundException;
import com.movie.Spring_backend.jwt.JwtValidCheck;
import com.movie.Spring_backend.mapper.MovieCommentMapper;
import com.movie.Spring_backend.repository.*;
import com.movie.Spring_backend.util.DateUtil;
import com.movie.Spring_backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MovieMemberService {

    private final MovieRepository movieRepository;
    private final MovieMemberRepository movieMemberRepository;
    private final MovieInfoRepository movieInfoRepository;
    private final ReservationRepository reservationRepository;
    private final CommentInfoRepository commentInfoRepository;
    private final MovieCommentMapper movieCommentMapper;
    private final JwtValidCheck jwtValidCheck;

    // 영화 세부내용 관람평 조회 메소드
    @Transactional
    public List<CommentInfoDto> getMovieDetailComment(Long mid, Map<String, String> requestMap) {
        // 영화 id 정보를 entity 형으로 변환
        MovieEntity movie = MovieEntity.builder().mid(mid).build();

        // requestMap 데이터 추출
        String uid = requestMap.get("uid");
        String sort = requestMap.get("sort");

        // 정렬에 따라 다른 DB쿼리문 실행
        List<MovieMemberEntity> MovieMembers;
        if (sort.equals("new")) {
            // 영화 id를 기반으로 MovieMember table 검색(최신순)
            MovieMembers = movieMemberRepository.findByMovieAndUmcommentIsNotNullOrderByUmcommenttimeDesc(movie);
        }
        else {
            // 영화 id를 기반으로 MovieMember table 검색(공감순)
            MovieMembers = movieMemberRepository.findAllCommentLikeDESC(movie);
        }

        // 영화 관람평이 없는경우 예외처리
        if (MovieMembers.isEmpty()) {
            throw new MovieCommentNotFoundException("관람평이 없습니다.");
        }

        // 사용자 id 정보를 entity 형으로 변환
        MemberEntity member = MemberEntity.builder().uid(uid).build();

        // 사용자가 좋아요 누른 영화 관람평 검색
        List<CommentInfoEntity> CommentLikes = commentInfoRepository.findByMember(member);

        // 좋아요 누른 관람평 목록의 관람평 기본키를 List로 변환
        List<Long> CommentLikeList = new ArrayList<>();
        for (CommentInfoEntity CI : CommentLikes) {
            CommentLikeList.add(CI.getMoviemember().getUmid());
        }

        // 관람평 목록과 좋아요 기록을 mapping 후 리턴
        return MovieMembers.stream().map(MovieMember ->
                movieCommentMapper.toDto(MovieMember, CommentLikeList.contains(MovieMember.getUmid()))).collect(Collectors.toList());
    }

    // 사용자가 영화 좋아요를 누를 때 실행되는 메소드
    @Transactional
    public MovieDto MovieLikeUpdate(MovieDto requestDto, HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // requestDto 안에 영화 id 추출
        Long Movie_id = requestDto.getMid();

        // JPA를 사용 하기 위해 Movie_id 와 User_id 를 entity형으로 변환(영화는 검색)
        MovieEntity movie = movieRepository.findById(Movie_id).orElseThrow(() -> new MovieNotFoundException("영화 정보가 존재하지 않습니다."));
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();

        // 사용자의 영화 좋아요 기록 컬럼 조회
        MovieMemberEntity MovieMember = movieMemberRepository.findByMovieAndMember(movie, member).orElse(null);

        // 현재 시간을 sql에 사용할 수 있게 매핑
        String day = DateUtil.getNow();

        // 튜플이 존재하지 않는 경우 entity를 가공 후 insert 쿼리 실행
        if (MovieMember == null) {
            MovieMember = MovieMemberEntity.builder()
                    .umlike(true)
                    .umliketime(day)
                    .movie(movie)
                    .member(member).build();
            movieMemberRepository.save(MovieMember);

            // 프론트단에서 사용할 정보 리턴
            return MovieDto.builder()
                    .mid(movie.getMid())
                    .mlike(true)
                    .mlikes(movie.getCntMovieLike() + 1).build();
        }
        else {
            // 튜플의 like가 true일 경우 false로 update
            if (MovieMember.getUmlike() != null && MovieMember.getUmlike()) {
                movieMemberRepository.MovieLikeChangeFalse(member, movie);

                // 프론트단에서 사용할 정보 리턴
                return MovieDto.builder()
                        .mid(movie.getMid())
                        .mlike(false)
                        .mlikes(movie.getCntMovieLike() - 1).build();
            }
            // 튜플의 like가 false일 경우 true로 update
            else {
                movieMemberRepository.MovieLikeChangeTrue(member, movie);

                // 프론트단에서 사용할 정보 리턴
                return MovieDto.builder()
                        .mid(movie.getMid())
                        .mlike(true)
                        .mlikes(movie.getCntMovieLike() + 1).build();
            }
        }
    }

    // 사용자가 관람평 작성할 때 실행되는 메소드
    @Transactional
    public void CommentInsert(Map<String, String> requestMap, HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // requestMap 안에 정보를 추출
        String Movie_id = requestMap.get("mid");
        String Movie_comment = requestMap.get("mcomment");
        String Movie_score = requestMap.get("mscore");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // JPA를 사용하기 위해 Movie_id 와 User_id 를 entity형으로 변환
        MovieEntity movie = MovieEntity.builder().mid(Long.valueOf(Movie_id)).build();
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();

        // MovieMember table에 튜플의 존재 여부를 먼저 파악
        MovieMemberEntity MovieMember = movieMemberRepository.findByMovieAndMember(movie, member).orElse(null);

        // MovieMember table에 이미 작성한 관람평이 존재할 경우 예외처리
        if (MovieMember != null && MovieMember.getUmcomment() != null) {
            throw new BusinessException("작성된 관람평이 존재합니다.", ErrorCode.COMMENT_IS_EXIST);
        }

        // 상영이 끝난 영화정보 튜플 검색
        List<MovieInfoEntity> MovieInfos = movieInfoRepository.findInfoBeforeToday(movie);

        // 상영이 끝난 영화들 중 사용자가 영화를 관람한 기록이 있는지 조회 (예매취소 한것 제외)
        List<ReservationEntity> Reservations = reservationRepository.findByRstateTrueAndMemberAndMovieInfoIn(member, MovieInfos);

        // 관람기록이 존재하지 않을경우 예외처리
        if (Reservations.isEmpty()) {
            throw new EntityNotFoundException("영화 관람기록이 없습니다.", ErrorCode.WATCHING_IS_NONE);
        }
        // 관람기록이 존재하는 경우
        else {
            // 현재 시간을 sql에 사용할 수 있게 매핑
            String day = DateUtil.getNow();

            // 관람평을 쓰는 사용자가 영화에 대한 좋아요 기록이 있을 경우
            if (MovieMember != null && MovieMember.getUmlike() != null) {
                // MovieMember 테이블의 내용을 update
                movieMemberRepository.MovieCommentUpdate(Integer.parseInt(Movie_score), Movie_comment, member, movie);
            }
            // 관람평을 쓰는 사용자가 영화에 대한 좋아요 기록이 없을 경우
            else {
                // 튜플 생성 후 삽입
                MovieMember = MovieMemberEntity.builder()
                        .umcomment(Movie_comment)
                        .umscore(Integer.valueOf(Movie_score))
                        .umcommenttime(day)
                        .movie(movie)
                        .member(member).build();
                movieMemberRepository.save(MovieMember);
            }
        }
    }

    // 사용자가 관람평 좋아요를 누를 때 실행되는 메소드
    @Transactional
    public CommentInfoDto CommentLikeUpdate(CommentInfoDto requestDto, HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // requestDto 안에 정보를 추출
        Long MovieMember_id = requestDto.getUmid();

        // JPA를 사용하기 위해 현재 아이디와 MovieMember_id 를 entity형으로 변환(사용자 기록은 검색)
        MemberEntity Member = MemberEntity.builder().uid(currentMemberId).build();
        MovieMemberEntity MovieMember = movieMemberRepository.findById(MovieMember_id)
                .orElseThrow(()-> new MovieCommentNotFoundException("정보가 존재하지 않습니다."));

        // 영화 좋아요 기록만 존재하고 관람평이 존재하지 않을경우 예외 처리
        if (MovieMember.getUmcomment() == null) {
            throw new MovieCommentNotFoundException("정보가 존재하지 않습니다.");
        }

        // 사용자의 특정 관람평 좋아요 기록 조회
        CommentInfoEntity CommentInfo = commentInfoRepository.findByMemberAndMoviemember(Member, MovieMember).orElse(null);

        // 좋아요 기록이 존재하지 않을경우 튜플을 insert
        if (CommentInfo == null) {
            // Entity 생성후 insert
            CommentInfoEntity commentInfo = CommentInfoEntity.builder()
                    .member(Member)
                    .moviemember(MovieMember).build();
            commentInfoRepository.save(commentInfo);

            // 프론트단에서 사용할 정보 리턴
            return CommentInfoDto.builder()
                    .umid(MovieMember.getUmid())
                    .upcnt(MovieMember.getCntCommentLike() + 1)
                    .like(true).build();
        }
        // 좋아요 기록이 존재할 경우 튜플을 delete
        else {
            commentInfoRepository.deleteByMemberAndMoviemember(Member, MovieMember);

            // 프론트단에서 사용할 정보 리턴
            return CommentInfoDto.builder()
                    .umid(MovieMember.getUmid())
                    .upcnt(MovieMember.getCntCommentLike() - 1)
                    .like(false).build();
        }
    }

    // 사용자가 관람평을 삭제할 때 실행되는 메소드
    @Transactional
    public void CommentDelete(Long umid, HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 관람평 id를 이용해서 관람평 튜플 검색
        MovieMemberEntity MovieMember = movieMemberRepository.findById(umid).orElse(null);

        // 예외처리(사용자에게 경고 메시지를 위한 예외)
        if (MovieMember == null) {
            throw new MovieCommentNotFoundException("정보가 존재하지 않습니다.");
        }

        // 영화에 대한 좋아요 기록이 있으면 튜플 update
        if (MovieMember.getUmlike() != null && MovieMember.getUmlike()) {
            // 튜플 update 시 필요한 entity 생성
            MemberEntity Member = MemberEntity.builder().uid(MovieMember.getMember().getUid()).build();
            MovieEntity Movie = MovieEntity.builder().mid(MovieMember.getMovie().getMid()).build();

            // 관람평에 대한 내용을 모두 null 로 교체
            movieMemberRepository.MovieCommentNull(Member, Movie);
            // 관람평에 적용됐던 좋아요 모두 삭제
            commentInfoRepository.deleteByMoviemember(MovieMember);
        }
        // 영화에 대한 좋아요 기록이 없을경우 바로 MovieMember 튜플 제거
        else {
            movieMemberRepository.deleteById(umid);
        }
    }
}


