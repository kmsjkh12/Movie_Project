/*
  23-03-27 관리자 페이지 사용자 관리 구현(오병주)
  23-03-28 ~ 30 관리자 페이지 사용자 예매 현황 구현(오병주)
  23-03-31 ~ 23-04-01 관리자 페이지 관람평 관리 구현(오병주)
  23-05-30 ~ 23-06-01 관리자 페이지 게시물 관리 구현(오병주)
*/
package com.movie.Spring_backend.service;

import com.movie.Spring_backend.dto.*;
import com.movie.Spring_backend.entity.*;
import com.movie.Spring_backend.exceptionlist.*;
import com.movie.Spring_backend.jwt.JwtValidCheck;
import com.movie.Spring_backend.mapper.MovieCommentMapper;
import com.movie.Spring_backend.mapper.MovieMapper;
import com.movie.Spring_backend.repository.*;
import com.movie.Spring_backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManagerTwoService {
    private final MemberRepository memberRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final ReservationRepository reservationRepository;
    private final MovieMemberRepository movieMemberRepository;
    private final CommentInfoRepository commentInfoRepository;
    private final BoardRepository boardRepository;
    private final BoardCommentRepository boardCommentRepository;
    private final MovieMapper movieMapper;
    private final MovieCommentMapper movieCommentMapper;
    private final JwtValidCheck jwtValidCheck;

    // 유저 조회 메소드
    @Transactional
    public List<MemberDto> AllMember(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        List<MemberEntity> Members = memberRepository.findAll();

        // 필요한 정보를 dto로 매핑 후 리턴
        return Members.stream().map(member -> MemberDto.builder()
                .uid(member.getUid())
                .uname(member.getUname())
                .uemail(member.getUemail())
                .utel(member.getUtel())
                .uaddr(member.getUaddr())
                .uaddrsecond(member.getUaddrsecond())
                .ubirth(member.getUbirth())
                .ujoindate(member.getUjoindate()).build()).collect(Collectors.toList());
    }

    // 유저 검색 메소드
    @Transactional
    public List<MemberDto> MemberSearch(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // requestMap 데이터 추출
        String search = requestMap.get("search").trim();
        String sort = requestMap.get("sort");

        List<MemberEntity> Members;
        // 유저를 계정명으로 조회
        if (sort.equals("id")) {
            Members = memberRepository.findByUidContainsOrderByUidAsc(search);
        }
        // 유저를 이름으로 조회
        else {
            Members = memberRepository.findByUnameContainsOrderByUidAsc(search);
        }

        // 필요한 정보를 dto로 매핑 후 리턴
        return Members.stream().map(member -> MemberDto.builder()
                        .uid(member.getUid())
                        .uname(member.getUname())
                        .uemail(member.getUemail())
                        .utel(member.getUtel())
                        .uaddr(member.getUaddr())
                        .uaddrsecond(member.getUaddrsecond())
                        .ubirth(member.getUbirth())
                        .ujoindate(member.getUjoindate()).build()).collect(Collectors.toList());
    }

    // 유저 추방 메소드
    @Transactional
    public void MemberDelete(HttpServletRequest request, String uid) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 중요한 임시계정 예외처리
        if (uid.equals("temp1") || uid.equals("manager")) {
            throw new RuntimeException("임시계정 추방 예외처리");
        }

        // JPA 사용을 위한 형 변환
        MemberEntity member = memberRepository.findById(uid).orElseThrow(()-> new MemberNotFoundException("사용자가 없습니다."));

        // 사용자 계정 탈퇴전 사용자가 작성한 게시물의 댓글과 관련된 모든 댓글, 답글을 제거하기 위한 작업
        List<BoardCommentEntity> boardComments = boardCommentRepository.findByMember(member);

        // List선언 및 댓글들의 id값 삽입
        List<Long> delList = new ArrayList<>();
        for (BoardCommentEntity BC : boardComments) {
            delList.add(BC.getBcid());
        }

        // List가 비어 있을때 까지 반복
        while (!delList.isEmpty()) {
            // List의 제일 앞 인덱스 값 추출 후 자식 답글들 검색
            long delNum = delList.get(0);
            boardComments = boardCommentRepository.findByBcparent(delNum);

            // 자식들의 id값 리스트에 삽입
            for (BoardCommentEntity BC : boardComments) {
                if (!delList.contains(BC.getBcid())) {
                    delList.add(BC.getBcid());
                }
            }

            // 제일 앞 인덱스 값 댓글 삭제 및 List에서 제거
            boardCommentRepository.deleteById(delNum);
            delList.remove(0);
        }

        // 사용자 테이블에서 사용자 제거(연관된 DB 내용은 CascadeType.REMOVE 때문에 연쇄 삭제)
        memberRepository.deleteById(uid);
    }

    // 예매기록 페이지에서 전체 영화 불러오는 메소드
    @Transactional
    public List<MovieDto> AllMovieSearch(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 영화 테이블에 존재하는 모든 영화 검색
        List<MovieEntity> Movies = movieRepository.findAll();

        // 영화 테이블에서 현재 예매가 가능한 영화들 조회
        List<MovieEntity> MoviePossible = movieRepository.findShowMoviesReserve();

        // 예매가 가능한 영화의 기본키를 List로 변환
        List<Long> MoviePossibleList = new ArrayList<>();
        for (MovieEntity m : MoviePossible) {
            MoviePossibleList.add(m.getMid());
        }

        // 위에서 검색한 영화 목록과 예매 가능 여부를 mapping 후 리턴
        return Movies.stream().map(movie ->
                movieMapper.toDtoManagerReserve(movie, MoviePossibleList.contains(movie.getMid()))).collect(Collectors.toList());
    }

    // 특정 영화의 예매기록을 불러오는 메소드
    @Transactional
    public ManagerReservationDto MovieReserveSearch(HttpServletRequest request, Long mid) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // JPA 사용을 위한 형 변환
        MovieEntity movie = movieRepository.findById(mid).orElseThrow(()-> new MovieNotFoundException("영화가 존재하지 않습니다."));

        // 특정 영화의 모든 예매기록 검색(예매일 순으로 내림차순)
        List<ReservationEntity> Reservations = reservationRepository.findManagerReserveMovie(movie);

        // 영화 테이블에서 현재 예매가 가능한 영화들 조회
        List<MovieEntity> MoviePossible = movieRepository.findShowMoviesReserve();

        // 예매가 가능한 영화들의 전체 예매 횟수(예매율 계산시 나누기 할때 사용)
        float cnt = 0;
        for (MovieEntity m : MoviePossible) {
            cnt += m.getCntreserve();
        }
        float reserveRate = movie.getCntreserve() / cnt * 100;

        // 예매기록을 매핑 후 리턴
        return ManagerReservationDto.builder()
                .reserveRate(reserveRate)
                .reservations(Reservations.stream().map(reservation -> ReservationDto.builder()
                        .rid(reservation.getRid())
                        .uid(reservation.getMember().getUid())
                        .rdate(reservation.getRdate())
                        .rcanceldate(reservation.getRcanceldate())
                        .tarea(reservation.getMovieInfo().getCinema().getTheater().getTarea())
                        .tname(reservation.getMovieInfo().getCinema().getTheater().getTname())
                        .cname(reservation.getMovieInfo().getCinema().getCname())
                        .mistarttime(reservation.getMovieInfo().getMistarttime())
                        .rpeople(reservation.getRpeople())
                        .rticket(reservation.getRticket())
                        .rpaytype(reservation.getRpaytype())
                        .rprice(reservation.getRprice())
                        .rstate_string(reservation.getRstate() ? "예매완료" : "예매취소").build()).collect(Collectors.toList())).build();
    }

    // 특정 극장의 예매기록을 불러오는 메소드
    @Transactional
    public List<ReservationDto> TheaterReserveSearch(HttpServletRequest request, Long tid) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // JPA 사용을 위한 형 변환
        TheaterEntity theater = theaterRepository.findById(tid)
                .orElseThrow(()-> new TheaterNotFoundException("극장이 존재하지 않습니다."));

        // 특정 극장의 예매기록 검색(예매일 순으로 내림차순)
        List<ReservationEntity> Reservations = reservationRepository.findManagerReserveTheater(theater);

        // 모든 영화의 이름 가공(Reservation 검색때 한번에 들고오려니깐 query문 성능이 나빠져서 따로 검색)
        List<MovieEntity> Movies = movieRepository.findAll();
        HashMap<Long, String> movie_name = new HashMap<>();
        for (MovieEntity movie : Movies) {
            movie_name.put(movie.getMid(), movie.getMtitle());
        }

        // 예매기록을 매핑 후 리턴
        return Reservations.stream().map(reservation -> ReservationDto.builder()
                .rid(reservation.getRid())
                .uid(reservation.getMember().getUid())
                .mtitle(movie_name.get(reservation.getMovieInfo().getMovie().getMid()))
                .rdate(reservation.getRdate())
                .rcanceldate(reservation.getRcanceldate())
                .tarea(reservation.getMovieInfo().getCinema().getTheater().getTarea())
                .tname(reservation.getMovieInfo().getCinema().getTheater().getTname())
                .cname(reservation.getMovieInfo().getCinema().getCname())
                .mistarttime(reservation.getMovieInfo().getMistarttime())
                .rpeople(reservation.getRpeople())
                .rticket(reservation.getRticket())
                .rpaytype(reservation.getRpaytype())
                .rprice(reservation.getRprice())
                .rstate_string(reservation.getRstate() ? "예매완료" : "예매취소").build()).collect(Collectors.toList());
    }

    // 특정 영화에 있는 관람평을 가져오는 메소드
    @Transactional
    public List<CommentInfoDto> MovieCommentSearch(HttpServletRequest request, Long mid) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 영화 id 정보를 entity 형으로 변환
        MovieEntity movie = movieRepository.findById(mid).orElseThrow(()-> new MovieNotFoundException("영화가 존재하지 않습니다."));

        // 영화 id를 기반으로 MovieMember table 검색(최신순)
        List<MovieMemberEntity> MovieMembers = movieMemberRepository.findByMovieAndUmcommentIsNotNullOrderByUmcommenttimeDesc(movie);

        // 관람평 목록과 좋아요 기록을 mapping 후 리턴
        return MovieMembers.stream().map(movieMember -> movieCommentMapper.toDto(movieMember, false)).collect(Collectors.toList());
    }

    // 특정 영화에 있는 관람평을 삭제하는 메소드
    @Transactional
    public void MovieCommentDelete(HttpServletRequest request, Long umid) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 관람평 id를 이용해서 관람평 튜플 검색
        MovieMemberEntity MovieMember = movieMemberRepository.findById(umid)
                .orElseThrow(()-> new MovieCommentNotFoundException("관람평이 존재하지 않습니다."));

        // 영화에 대한 좋아요 기록이 있으면 튜플 update
        if (MovieMember != null && MovieMember.getUmlike() != null && MovieMember.getUmlike()) {
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

    // 게시물 조회 메소드
    public List<BoardDto> getBoard(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 게시물 조회 후 리턴
        List<BoardEntity> Boards = boardRepository.findAll();

        return Boards.stream().map(board -> BoardDto.builder()
                .bid(board.getBid())
                .btitle(board.getBtitle())
                .bdetail(board.getBdetail())
                .bdate(board.getBdate())
                .bclickindex(board.getBclickindex())
                .bcategory(board.getBcategory())
                .uid(board.getMember().getUid())
                .likes(board.getLikes())
                .unlikes(board.getUnlikes())
                .commentCounts(board.getCommentCounts()).build()).collect(Collectors.toList());
    }

    // 게시물 검색 메소드
    public List<BoardDto> getSearchBoard(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // requestMap 안에 정보를 추출
        String category = requestMap.get("category");
        String title = requestMap.get("title").trim();

        // 게시물 검색
        List<BoardEntity> Boards;
        if (category.equals("title")) {
            Boards = boardRepository.findByBtitleContainsOrderByBidAsc(title);
        }
        else {
            Boards = boardRepository.findByMemberUidContainsOrderByBidAsc(title);
        }

        return Boards.stream().map(board -> BoardDto.builder()
                .bid(board.getBid())
                .btitle(board.getBtitle())
                .bdetail(board.getBdetail())
                .bdate(board.getBdate())
                .bclickindex(board.getBclickindex())
                .bcategory(board.getBcategory())
                .uid(board.getMember().getUid())
                .likes(board.getLikes())
                .unlikes(board.getUnlikes())
                .commentCounts(board.getCommentCounts()).build()).collect(Collectors.toList());
    }

    // 게시물 삭제 메소드
    @Transactional
    public void BoardDelete(HttpServletRequest request, Long bid){
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 게시물이 존재하지 않을경우 예외처리
        if (!boardRepository.existsById(bid)) {
            throw new BoardNotFoundException("게시물이 존재하지 않습니다.");
        }

        // 게시물 삭제
        boardRepository.deleteById(bid);
    }

    // 댓글 조회하는 메소드
    @Transactional
    public CountCommentDto getComment(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // requestMap 안에 정보를 추출
        Long bid = Long.valueOf(requestMap.get("bid"));
        String sort = requestMap.get("sort");

        // 댓글 조회에 필요한 정보 Entity형으로 변환
        BoardEntity board = BoardEntity.builder().bid(bid).build();

        // 정렬에 따른 최상위 부모 댓글 조회
        List<BoardCommentEntity> boardComments;
        if (sort.equals("like")) {
            boardComments = boardCommentRepository.findByCommentLike(board);
        }
        else {
            boardComments = boardCommentRepository.findByBoardAndBcrootIsNullOrderByBcidDesc(board);
        }

        // 전체 답글조회(작성 시간순으로 최신순)
        List<BoardCommentEntity> boardReply = boardCommentRepository.findByBoardAndBcrootIsNotNullOrderByBcrootAscBcparentAscBcidDesc(board);

        // 댓글 개수 count
        int count = 0;

        // 최상위 부모 댓글 매핑
        HashMap<Long, BoardCommentDto> result = new LinkedHashMap<>();
        for (BoardCommentEntity BC : boardComments) {
            result.put(BC.getBcid(), BoardCommentDto.builder()
                    .bcid(BC.getBcid())
                    .bccomment(BC.getBccomment())
                    .bcdate(BC.getBcdate())
                    .likes(BC.getLikes())
                    .unlikes(BC.getUnlikes())
                    .uid(BC.getMember().getUid())
                    .child(new ArrayList<>()).build());
            count++;
        }

        // 답글 매핑
        for (BoardCommentEntity BC : boardReply) {
            // 답글 중 최상위 답글일경우 답글을 그냥 삽입
            if (BC.getBcroot().equals(BC.getBcparent())) {
                result.get(BC.getBcroot()).getChild().add(0, BoardCommentDto.builder()
                        .bcid(BC.getBcid())
                        .bccomment(BC.getBccomment())
                        .bcdate(BC.getBcdate())
                        .bcroot(BC.getBcroot())
                        .uid(BC.getMember().getUid()).build());
            }
            else {
                // 최상위 부모 댓글의 자식들을 추출
                List<BoardCommentDto> temp = result.get(BC.getBcroot()).getChild();

                // 현재 답글 리스트중 자신의 부모를 찾은 뒤 다음 인덱스에 정보 삽입
                for (int i = 0; i < temp.size(); i++) {
                    if (temp.get(i).getBcid().equals(BC.getBcparent())) {
                        temp.add(i + 1, BoardCommentDto.builder()
                                .bcid(BC.getBcid())
                                .bccomment(BC.getBccomment())
                                .bcdate(BC.getBcdate())
                                .bcroot(BC.getBcroot())
                                .uid(BC.getMember().getUid())
                                .parentUid(temp.get(i).getUid()).build());
                    }
                }
            }
            count++;
        }

        // 댓글의 총개수 + 댓글내용을 리턴
        return CountCommentDto.builder().count(count).content(new ArrayList<>(result.values())).build();
    }

    // 댓글 삭제 메소드
    @Transactional
    public void CommentDelete(HttpServletRequest request, Long bcid){
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 댓글 삭제전 예외처리
        BoardCommentEntity boardComment = boardCommentRepository.findById(bcid).orElseThrow(()-> new BoardCommentNotFoundException("댓글이 존재하지 않습니다."));
        if (boardComment.getBcroot() != null) {
            throw new BoardCommentNotFoundException("댓글이 존재하지 않습니다.");
        }

        // 댓글 및 답글 모두 제거
        boardCommentRepository.deleteByBcroot(bcid);
        boardCommentRepository.deleteById(bcid);
    }

    // 답글 삭제 메소드
    @Transactional
    public void ReplyDelete(HttpServletRequest request, Long bcid) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 답글 삭제전 예외처리
        BoardCommentEntity boardComment = boardCommentRepository.findById(bcid).orElseThrow(()-> new BoardCommentNotFoundException("답글이 존재하지 않습니다."));
        if (boardComment.getBcroot() == null) {
            throw new BoardCommentNotFoundException("답글이 존재하지 않습니다.");
        }

        // 현재 답글과 관련된 모든 답글들을 제거하기위해 List선언 및 현재답글의 id값 삽입
        List<Long> delList = new ArrayList<>();
        delList.add(bcid);

        // List가 비어 있을때 까지 반복
        while (!delList.isEmpty()) {
            // List의 제일 앞 인덱스 값 추출 후 자식 답글들 검색
            long delNum = delList.get(0);
            List<BoardCommentEntity> boardComments = boardCommentRepository.findByBcparent(delNum);

            // 자식들의 id값 리스트에 삽입
            for (BoardCommentEntity BC : boardComments) {
                delList.add(BC.getBcid());
            }

            // 제일 앞 인덱스 값 답글 삭제 및 List에서 제거
            boardCommentRepository.deleteById(delNum);
            delList.remove(0);
        }
    }
}
