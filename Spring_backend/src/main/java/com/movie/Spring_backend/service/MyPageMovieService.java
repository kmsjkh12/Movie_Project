/*
  23-03-17 마이페이지에 있는 영화 관련 메소드 생성(오병주)
  23-03-21 마이페이지에 있는 영화 좋아요 구현(오병주)
  23-03-24 마이페이지에 있는 예매내역 조회 구현(오병주)
*/
package com.movie.Spring_backend.service;

import com.movie.Spring_backend.dto.CommentInfoDto;
import com.movie.Spring_backend.dto.MovieDto;
import com.movie.Spring_backend.dto.ReservationDto;
import com.movie.Spring_backend.entity.*;
import com.movie.Spring_backend.exceptionlist.MovieNotFoundException;
import com.movie.Spring_backend.exceptionlist.ReserveNotFoundException;
import com.movie.Spring_backend.jwt.JwtValidCheck;
import com.movie.Spring_backend.mapper.MovieCommentMapper;
import com.movie.Spring_backend.mapper.MovieMapper;
import com.movie.Spring_backend.mapper.ReservationMapper;
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
public class MyPageMovieService {

    private final MovieInfoRepository movieInfoRepository;
    private final MovieRepository movieRepository;
    private final MovieMemberRepository movieMemberRepository;
    private final CommentInfoRepository commentInfoRepository;
    private final ReservationRepository reservationRepository;
    private final MovieInfoSeatRepository movieInfoSeatRepository;
    private final MovieMapper movieMapper;
    private final MovieCommentMapper movieCommentMapper;
    private final ReservationMapper reservationMapper;
    private final JwtValidCheck jwtValidCheck;

    // 사용자가 현재 예매한 영화 내역 불러오는 메소드
    @Transactional
    public List<ReservationDto> MovieReserveSearch(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // JPA를 사용하기 위해 현재 아이디를 entity형으로 변환
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();

        // 현재 시점으로 부터 6개월 전 날짜 생성
        String BeforeMonth = DateUtil.ChangeDateNow(0, -6, 0);

        // 사용자가 예매한 영화의 정보 및 좌석 조회
        List<ReservationEntity> Reserve = reservationRepository.findMyPageReserve(member, BeforeMonth);
        List<MovieInfoSeatEntity> ReserveSeat = movieInfoSeatRepository.findMyPageReserveSeat(member, BeforeMonth);

        return reservationMapper.MyPageListMapping(Reserve, ReserveSeat);
    }

    // 사용자가 현재 예매취소한 영화 내역 불러오는 메소드
    @Transactional
    public List<ReservationDto> MovieReserveCancelSearch(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // JPA를 사용하기 위해 현재 아이디를 entity형으로 변환
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();

        // 현재 시점으로 부터 6개월 전 날짜 생성
        String BeforeMonth = DateUtil.ChangeDateNow(0, -6, 0);

        // 사용자가 예매 취소한 영화의 정보 조회
        List<ReservationEntity> ReserveCancel = reservationRepository.findMyPageReserveCancel(member, BeforeMonth);

        return ReserveCancel.stream().map(Reserve -> ReservationDto.builder()
                .rid(Reserve.getRid())
                .rdate(Reserve.getRdate())
                .rcanceldate(Reserve.getRcanceldate())
                .mtitle(Reserve.getMovieInfo().getMovie().getMtitle())
                .mimagepath(Reserve.getMovieInfo().getMovie().getMimagepath())
                .tarea(Reserve.getMovieInfo().getCinema().getTheater().getTarea())
                .tname(Reserve.getMovieInfo().getCinema().getTheater().getTname())
                .cname(Reserve.getMovieInfo().getCinema().getCname())
                .mistarttime(Reserve.getMovieInfo().getMistarttime())
                .rticket(Reserve.getRticket())
                .rprice(Reserve.getRprice()).build()).collect(Collectors.toList());
    }

    // 사용자가 예매한 지난 관람내역 불러오는 메소드
    @Transactional
    public List<ReservationDto> MovieReserveFinishSearch(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // JPA를 사용하기 위해 현재 아이디를 entity형으로 변환
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();

        // 현재 시점으로 부터 6개월 전 날짜 생성
        String BeforeMonth = DateUtil.ChangeDateNow(0, -6, 0);

        // 사용자가 예매한 지난 관람내역의 정보 및 좌석 조회
        List<ReservationEntity> ReserveFinish = reservationRepository.findMyPageReserveFinish(member, BeforeMonth);
        List<MovieInfoSeatEntity> ReserveFinishSeat = movieInfoSeatRepository.findMyPageReserveFinishSeat(member, BeforeMonth);

        return reservationMapper.MyPageListMapping(ReserveFinish, ReserveFinishSeat);
    }

    // 사용자가 예매한 영화의 세부 내역 불러오는 메소드
    @Transactional
    public ReservationDto MovieReserveDetailSearch(Long rid, HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // 사용자가 예매한 영화의 세부내역 조회
        ReservationEntity Reserve = reservationRepository.findMyPageReserveDetail(rid)
                .orElseThrow(() -> new ReserveNotFoundException("예매 기록이 존재하지 않습니다."));

        // 조회하려는 예매의 예매자 id가 현재 사용자의 id와 다를 경우 예외처리
        if (!Reserve.getMember().getUid().equals(currentMemberId)) {
            throw new ReserveNotFoundException("예매 기록이 존재하지 않습니다.");
        }

        // 취소된 예매일 경우 좌석을 제외하고 매핑한 값을 리턴
        if (!Reserve.getRstate()) {
            return ReservationDto.builder()
                    .rid(Reserve.getRid())
                    .rdate(Reserve.getRdate())
                    .rcanceldate(Reserve.getRcanceldate())
                    .mid(Reserve.getMovieInfo().getMovie().getMid())
                    .mtitle(Reserve.getMovieInfo().getMovie().getMtitle())
                    .mimagepath(Reserve.getMovieInfo().getMovie().getMimagepath())
                    .tarea(Reserve.getMovieInfo().getCinema().getTheater().getTarea())
                    .tname(Reserve.getMovieInfo().getCinema().getTheater().getTname())
                    .cname(Reserve.getMovieInfo().getCinema().getCname())
                    .mistarttime(Reserve.getMovieInfo().getMistarttime())
                    .miendtime(Reserve.getMovieInfo().getMiendtime())
                    .mrating(Reserve.getMovieInfo().getMovie().getMrating())
                    .rpeople(Reserve.getRpeople())
                    .rticket(Reserve.getRticket())
                    .rpaytype(Reserve.getRpaytype())
                    .rprice(Reserve.getRprice())
                    .rstate(Reserve.getRstate()).build();
        }

        // 사용자가 예매한 영화의 세부내역 좌석 조회
        List<MovieInfoSeatEntity> ReserveSeat = movieInfoSeatRepository.findMyPageReserveDetailSeat(rid);

        return reservationMapper.MyPageReserveDetail(Reserve, ReserveSeat);
    }

    // 사용자가 좋아요 누른 영화 불러오는 메소드
    @Transactional
    public List<MovieDto> MovieLikeGet(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // JPA를 사용하기 위해 현재 아이디를 entity형으로 변환
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();

        // 사용자가 좋아요 누른 영화 목록 검색
        List<MovieEntity> Movies = movieRepository.findMemberLikeMovieDESC(member);

        // 영화 테이블에서 현재 예매가 가능한 영화들 조회
        List<MovieEntity> MovieReserve = movieRepository.findShowMoviesReserve();

        // 예매가 가능한 영화들의 전체 예매 횟수(예매율 계산시 나누기 할때 사용)
        float cnt = 0;
        for (MovieEntity m : MovieReserve) {
            cnt += m.getCntreserve();
        }
        // 람다식에서 사용하기 위해 final 선언
        final float Cnt = cnt;

        // 예매가 가능한 영화 ID를 List로 변환
        // Mapper에서 Screen true, false를 위해 사용
        List<Long> MovieIDCheck = new ArrayList<>();
        for (MovieEntity M : MovieReserve) {
            MovieIDCheck.add(M.getMid());
        }

        return Movies.stream().map(Movie ->
                movieMapper.toDtoMyPage(Movie, MovieIDCheck.contains(Movie.getMid()), Cnt)).collect(Collectors.toList());
    }

    // 사용자가 관람평을 작성할 수 있는 영화 목록을 불러오는 메소드
    @Transactional
    public List<MovieDto> MoviePossibleGet(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // JPA를 사용하기 위해 현재 아이디를 entity형으로 변환
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();

        // 사용자의 관람이 끝난 영화 정보를 조회
        List<MovieInfoEntity> MovieInfos = movieInfoRepository.findMemberPossible(member);

        // 관람이 끝난 영화가 없을 경우 예외처리
        if (MovieInfos.isEmpty()) {
            throw new MovieNotFoundException("관람된 영화 정보가 없습니다.");
        }

        // 사용자가 작성한 관람평 목록 조회
        List<MovieMemberEntity> MovieMembers = movieMemberRepository.findByUmcommentIsNotNullAndMember(member);

        // 관람평을 이미 적은 영화의 ID 추출
        List<Long> MovieIDCheck = new ArrayList<>();
        for (MovieMemberEntity MM : MovieMembers) {
            MovieIDCheck.add(MM.getMovie().getMid());
        }

        // 관람이 끝난 영화 정보들 중 관람평을 작성하지 않은 영화 ID를 HashSet으로 변환(중복 제거)
        Set<Long> MovieID = new HashSet<>();
        for (MovieInfoEntity MI : MovieInfos) {
            if (!MovieIDCheck.contains(MI.getMovie().getMid())) {
                MovieID.add(MI.getMovie().getMid());
            }
        }

        // 관람평을 작성하지 않은 영화 ID를 이용하여 영화 튜플 검색 (관람객 평점 기준으로 내림차순)
        List<MovieEntity> Movies = movieRepository.findMoviesScoreDESC(MovieID);

        // 영화 테이블에서 현재 예매가 가능한 영화들 조회
        List<MovieEntity> MovieReserve = movieRepository.findShowMoviesReserve();

        // 예매가 가능한 영화들의 전체 예매 횟수(예매율 계산시 나누기 할때 사용)
        float cnt = 0;
        for (MovieEntity m : MovieReserve) {
            cnt += m.getCntreserve();
        }
        // 람다식에서 사용하기 위해 final 선언
        final float Cnt = cnt;

        // 예매가 가능한 영화 ID를 List로 변환
        // Mapper에서 Screen true, false를 위해 사용
        MovieIDCheck.clear();
        for (MovieEntity M : MovieReserve) {
            MovieIDCheck.add(M.getMid());
        }

        return Movies.stream().map(Movie ->
                movieMapper.toDtoMyPage(Movie, MovieIDCheck.contains(Movie.getMid()), Cnt)).collect(Collectors.toList());
    }

    // 마이페이지에서 작성한 관람평을 조회하는 메소드
    @Transactional
    public List<CommentInfoDto> MovieCommentSearch(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();

        // JPA를 사용하기 위해 현재 아이디를 entity형으로 변환
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();

        // 사용자가 작성한 관람평 목록 조회(영화 내용까지 들고옴)
        List<MovieMemberEntity> MovieMembers = movieMemberRepository.findByUmcommentIsNotNullAndMemberOrderByUmcommenttimeDesc(member);

        // 사용자가 좋아요 누른 영화 관람평 검색
        List<CommentInfoEntity> CommentLikes = commentInfoRepository.findByMember(member);

        // 좋아요 누른 관람평 목록의 관람평 기본키를 List로 변환
        List<Long> CommentLikeList = new ArrayList<>();
        for (CommentInfoEntity CI : CommentLikes) {
            CommentLikeList.add(CI.getMoviemember().getUmid());
        }

        // 관람평 목록과 좋아요 기록을 mapping 후 리턴
        return MovieMembers.stream().map(MovieMember ->
                movieCommentMapper.toDtoMyPage(MovieMember, CommentLikeList.contains(MovieMember.getUmid()))).collect(Collectors.toList());
    }
}


