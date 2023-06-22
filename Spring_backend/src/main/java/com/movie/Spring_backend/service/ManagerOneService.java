/*
  23-04-03 ~ 23-04-05 관리자 페이지 상영정보관리 구현(오병주)
  23-04-17 상영관, 극장 관리자 페이지 수정(오병주)
  23-04-18 ~ 19영화 관리자 페이지 수정(오병주)
*/
package com.movie.Spring_backend.service;

import com.movie.Spring_backend.dto.*;
import com.movie.Spring_backend.entity.*;
import com.movie.Spring_backend.error.exception.EntityNotFoundException;
import com.movie.Spring_backend.error.exception.ErrorCode;
import com.movie.Spring_backend.exceptionlist.*;
import com.movie.Spring_backend.jwt.JwtValidCheck;
import com.movie.Spring_backend.mapper.MovieMapper;
import com.movie.Spring_backend.repository.*;
import com.movie.Spring_backend.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.sql.Date;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManagerOneService {
    private final JwtValidCheck jwtValidCheck;
    private final MovieRepository movieRepository;
    private final MovieActorRepository movieActorRepository;
    private final MovieInfoRepository movieInfoRepository;
    private final ReservationRepository reservationRepository;
    private final ActorRepository actorRepository;
    private final TheaterRepository theaterRepository;
    private final CinemaRepository cinemaRepository;
    private final SeatRepository seatRepository;
    private final MovieMapper movieMapper;

    // 전체 영화 불러오는 메소드
    public List<MovieDto> AllMovieSearch(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 전체 영화 검색
        List<MovieEntity> Movies = movieRepository.findAll();

        // 출연 정보까지 포함된 전체 배우 검색
        List<MovieActorEntity> MovieActors = movieActorRepository.findAllByOrderByMovieAsc();

        // 정보를 매핑하여 리턴
        return movieMapper.toDtoManagerMovie(Movies, MovieActors);
    }

    // 영화 추가하는 메소드
    @Transactional
    public void MovieInsert(HttpServletRequest request, MovieDto requestDto, MultipartFile multipartFiles) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 포스터를 저장 후 경로를 추출
        String path = PosterSave(multipartFiles);
        String imagePath = path.substring(path.lastIndexOf("img/"));

        // 영화 정보 추가
        movieRepository.save(MovieEntity.builder()
                .mtitle(requestDto.getMtitle())
                .mdir(requestDto.getMdir())
                .mgenre(requestDto.getMgenre())
                .mtime(requestDto.getMtime())
                .mdate(requestDto.getMdate())
                .mrating(requestDto.getMrating())
                .mstory(requestDto.getMstory())
                .mimagepath(imagePath)
                .cntreserve(0).build());

        // 추가한 영화의 ID값으로 Entity 생성
        List<MovieEntity> movies = movieRepository.findAll();
        MovieEntity movie = MovieEntity.builder().mid(movies.get(movies.size()-1).getMid()).build();

        // 영화에 출연하는 배우 List 생성
        List<MovieActorEntity> mainActor = new ArrayList<>();
        List<MovieActorEntity> subActor = new ArrayList<>();
        List<MovieActorEntity> voiceActor = new ArrayList<>();

        // 주연 배우 List 매핑
        for (int i = 0; i < requestDto.getMainactorId().size(); i++) {
            MovieActorEntity movieActor = MovieActorEntity.builder()
                    .marole("주연")
                    .actor(ActorEntity.builder().aid(Long.valueOf(requestDto.getMainactorId().get(i))).build())
                    .movie(movie).build();
            mainActor.add(movieActor);
        }
        // 주연 배우가 존재할경우 DB에 삽입
        if (!mainActor.isEmpty()) {
            movieActorRepository.saveAll(mainActor);
        }

        // 조연 배우 List 매핑
        for (int i = 0; i < requestDto.getSubactorId().size(); i++) {
            MovieActorEntity movieActor = MovieActorEntity.builder()
                    .marole("조연")
                    .actor(ActorEntity.builder().aid(Long.valueOf(requestDto.getSubactorId().get(i))).build())
                    .movie(movie).build();
            subActor.add(movieActor);
        }
        // 조연 배우가 존재할경우 DB에 삽입
        if (!subActor.isEmpty()) {
            movieActorRepository.saveAll(subActor);
        }

        // 성우 List 매핑
        for (int i = 0; i < requestDto.getVoiceactorId().size(); i++) {
            MovieActorEntity movieActor = MovieActorEntity.builder()
                    .marole("성우")
                    .actor(ActorEntity.builder().aid(Long.valueOf(requestDto.getVoiceactorId().get(i))).build())
                    .movie(movie).build();
            voiceActor.add(movieActor);
        }
        // 성우가 존재할경우 DB에 삽입
        if (!voiceActor.isEmpty()) {
            movieActorRepository.saveAll(voiceActor);
        }
    }

    // 영화를 삭제하는 메소드
    @Transactional
    public void MovieDelete(HttpServletRequest request, Long mid) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 영화 검색
        MovieEntity movie = movieRepository.findById(mid)
                .orElseThrow(() -> new MovieNotFoundException("영화가 존재하지 않습니다."));

        // 영화 삭제전 영화가 사용된 상영정보 조회
        List<MovieInfoEntity> movieInfos = movieInfoRepository.findByMovie(movie);

        // 상영정보가 존재할 경우 예외처리
        if (!movieInfos.isEmpty()) {
            throw new MovieInfoExistException("상영정보가 존재합니다.");
        }

        // 영화 제거
        movieRepository.deleteById(mid);

        // 저장된 포스터 삭제
        File file = new File("/home/ubuntu/Movie_Project/React_frontend/build/" + movie.getMimagepath());
        boolean delete = file.delete();
    }

    // 영화를 수정하는 메소드
    @Transactional
    public void MovieUpdate(HttpServletRequest request, MovieDto requestDto, MultipartFile multipartFiles) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 영화 검색
        MovieEntity movie = movieRepository.findById(requestDto.getMid())
                .orElseThrow(() -> new MovieNotFoundException("영화가 존재하지 않습니다."));

        String imagePath = "";
        // 새로운 포스터가 첨부 되었을경우
        if (multipartFiles != null) {
            // 포스터를 저장 후 경로를 추출
            String path = PosterSave(multipartFiles);
            imagePath = path.substring(path.lastIndexOf("img/"));
        }
        else {
            // 이미지 변수를 기존의 값으로 지정
            imagePath = movie.getMimagepath();
        }

        // 영화 수정전 영화가 사용된 상영정보 조회
        List<MovieInfoEntity> movieInfos = movieInfoRepository.findByMovie(movie);

        // 상영정보가 존재할 경우 일부 정보만 수정
        if (!movieInfos.isEmpty()) {
            movieRepository.MovieUpdate(requestDto.getMtitle(), requestDto.getMdir(), requestDto.getMgenre(),
                    movie.getMtime(), movie.getMdate(), movie.getMrating(), requestDto.getMstory(), imagePath, requestDto.getMid());
        }
        // 상영정보가 없을경우 모든 정보 수정
        else {
            movieRepository.MovieUpdate(requestDto.getMtitle(), requestDto.getMdir(), requestDto.getMgenre(), requestDto.getMtime(),
                    requestDto.getMdate(), requestDto.getMrating(), requestDto.getMstory(), imagePath, requestDto.getMid());
        }

        // 영화에 출연하는 배우 제거
        movieActorRepository.deleteByMovie(movie);

        // 영화에 출연하는 배우 List 생성
        List<MovieActorEntity> mainActor = new ArrayList<>();
        List<MovieActorEntity> subActor = new ArrayList<>();
        List<MovieActorEntity> voiceActor = new ArrayList<>();

        // 주연 배우 List 매핑
        for (int i = 0; i < requestDto.getMainactorId().size(); i++) {
            MovieActorEntity movieActor = MovieActorEntity.builder()
                    .marole("주연")
                    .actor(ActorEntity.builder().aid(Long.valueOf(requestDto.getMainactorId().get(i))).build())
                    .movie(movie).build();
            mainActor.add(movieActor);
        }
        // 주연 배우가 존재할경우 DB에 삽입
        if (!mainActor.isEmpty()) {
            movieActorRepository.saveAll(mainActor);
        }

        // 조연 배우 List 매핑
        for (int i = 0; i < requestDto.getSubactorId().size(); i++) {
            MovieActorEntity movieActor = MovieActorEntity.builder()
                    .marole("조연")
                    .actor(ActorEntity.builder().aid(Long.valueOf(requestDto.getSubactorId().get(i))).build())
                    .movie(movie).build();
            subActor.add(movieActor);
        }
        // 조연 배우가 존재할경우 DB에 삽입
        if (!subActor.isEmpty()) {
            movieActorRepository.saveAll(subActor);
        }

        // 성우 List 매핑
        for (int i = 0; i < requestDto.getVoiceactorId().size(); i++) {
            MovieActorEntity movieActor = MovieActorEntity.builder()
                    .marole("성우")
                    .actor(ActorEntity.builder().aid(Long.valueOf(requestDto.getVoiceactorId().get(i))).build())
                    .movie(movie).build();
            voiceActor.add(movieActor);
        }
        // 성우가 존재할경우 DB에 삽입
        if (!voiceActor.isEmpty()) {
            movieActorRepository.saveAll(voiceActor);
        }

        // 포스터를 교체했다면 기존에 있던 포스터 파일 삭제(모든 쿼리 실행후)
        if (multipartFiles != null) {
            File file = new File("/home/ubuntu/Movie_Project/React_frontend/build/" + movie.getMimagepath());
            boolean delete = file.delete();
        }
    }

    // 포스터를 저장하는 메소드
    public String PosterSave(MultipartFile multipartFiles) {
        // 원본 포스터명
        String originFileName = multipartFiles.getOriginalFilename();
        // 저장될 포스터명
        String newFilename = System.currentTimeMillis() + originFileName;
        // 포스터 파일 저장할 경로
        String POSTER_PATH = "/home/ubuntu/Movie_Project/React_frontend/build/img/ranking";

        try {
            // 포스터를 저장
            File file = new File(POSTER_PATH, newFilename);
            multipartFiles.transferTo(file);
        }
        catch (IOException e) {
            throw new RuntimeException("포스터 저장 실패");
        }
        // 저장된 파일 경로를 return
        return POSTER_PATH + "/" + newFilename;
    }

    // 전체 배우 불러오는 메소드
    public List<ActorDto> AllActorSearch(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 배우 검색
        List<ActorEntity> Actors = actorRepository.findAll();

        // 정보를 매핑하여 리턴
        return Actors.stream().map(actor -> ActorDto.builder()
                .aid(actor.getAid())
                .aname(actor.getAname())
                .abirthplace(actor.getAbirthplace())
                .cntMovie(actor.getCntMovie()).build()).collect(Collectors.toList());
    }

    // 배우 추가하는 메소드
    @Transactional
    public void ActorInsert(HttpServletRequest request, ActorDto requestDto) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 배우 정보 추가
        actorRepository.save(ActorEntity.builder()
                .aname(requestDto.getAname())
                .abirthplace(requestDto.getAbirthplace()).build());
    }

    // 배우 삭제하는 메소드
    @Transactional
    public void ActorDelete(HttpServletRequest request, Long aid) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 배우가 존재하지 않을경우 예외처리
        if (!actorRepository.existsById(aid)) {
            throw new ActorNotFoundException("배우가 존재하지 않습니다.");
        }

        // 배우정보 삭제
        actorRepository.deleteById(aid);
    }

    // 배우 수정하는 메소드
    @Transactional
    public void ActorUpdate(HttpServletRequest request, ActorDto requestDto) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 배우가 존재하지 않을경우 예외처리
        if (!actorRepository.existsById(requestDto.getAid())) {
            throw new ActorNotFoundException("배우가 존재하지 않습니다.");
        }

        // 배우 정보 수정
        actorRepository.ActorUpdate(requestDto.getAname(), requestDto.getAbirthplace(), requestDto.getAid());
    }

    // 전체 극장 불러오는 메소드
    @Transactional
    public List<TheaterDto> AllTheaterSearch(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 모든 극장 검색
        List<TheaterEntity> Theaters = theaterRepository.findAll();

        // 검색한 극장 리턴
        return Theaters.stream().map(theater -> TheaterDto.builder()
                .tid(theater.getTid())
                .tname(theater.getTname())
                .taddr(theater.getTaddr())
                .tarea(theater.getTarea())
                .cntCinema(theater.getCntCinema()).build()).collect(Collectors.toList());
    }

    // 극장을 추가하는 메소드
    @Transactional
    public void TheaterInsert(HttpServletRequest request, TheaterDto requestDto) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 극장 정보 추가
        theaterRepository.save(TheaterEntity.builder()
                .tname(requestDto.getTname())
                .tarea(requestDto.getTarea())
                .taddr(requestDto.getTaddr()).build());
    }

    // 극장을 삭제하는 메소드
    @Transactional
    public void TheaterDelete(HttpServletRequest request, Long tid) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 극장이 존재하지 않을경우 예외처리
        if (!theaterRepository.existsById(tid)) {
            throw new TheaterNotFoundException("극장이 존재하지 않습니다.");
        }

        // 극장 삭제에 필요한 정보 Entity로 변환
        TheaterEntity theater = TheaterEntity.builder().tid(tid).build();

        // 극장 삭제전 극장에 대한 상영관 정보 조회
        List<CinemaEntity> cinema = cinemaRepository.findByTheater(theater);

        // 상영관이 존재할경우 예외처리
        if (!cinema.isEmpty()) {
            throw new CinemaExistException("상영관이 존재합니다.");
        }

        // 극장 삭제
        theaterRepository.deleteById(tid);
    }

    // 극장을 수정하는 메소드
    @Transactional
    public void TheaterUpdate(HttpServletRequest request, TheaterDto requestDto) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 극장이 존재하지 않을경우 예외처리
        if (!theaterRepository.existsById(requestDto.getTid())) {
            throw new TheaterNotFoundException("극장이 존재하지 않습니다.");
        }

        // 극장 정보 수정
        theaterRepository.TheaterUpdate(requestDto.getTname(), requestDto.getTarea(),
                requestDto.getTaddr(), requestDto.getTid());
    }

    // 전체 상영관 불러오는 메소드
    public List<CinemaDto> AllCinemaSearch(HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 모든 상영관 검색
        List<CinemaEntity> Cinemas = cinemaRepository.findAll();

        // 검색한 상영관 리턴
        return Cinemas.stream().map(cinema -> CinemaDto.builder()
                .cid(cinema.getCid())
                .cname(cinema.getCname())
                .ctype(cinema.getCtype())
                .cseat(cinema.getCseat())
                .tid(cinema.getTheater().getTid())
                .tname(cinema.getTheater().getTname())
                .cntMovieInfo(cinema.getCntMovieInfo())
                .build()).collect(Collectors.toList());
    }

    // 상영관을 추가하는 메소드
    @Transactional
    public void CinemaInsert(HttpServletRequest request, CinemaDto requestDto) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 상영관 정보 추가
        cinemaRepository.save(CinemaEntity.builder()
                .cname(requestDto.getCname())
                .ctype(requestDto.getCtype())
                .cseat(requestDto.getCseat())
                .theater(TheaterEntity.builder().tid(requestDto.getTid()).build()).build());

        // 추가한 상영관의 ID값으로 Entity 생성
        List<CinemaEntity> cinemas = cinemaRepository.findAll();
        CinemaEntity cinema = CinemaEntity.builder().cid(cinemas.get(cinemas.size()-1).getCid()).build();

        // 상영관에 좌석수에 따라 알파벳 순서대로 10자리씩 상영관에 대한 개별 좌석 생성 후 SeatEntity 리스트에 삽입
        // ex) 30자리 -> A1~A10, B1~B10, C1~C10
        List<SeatEntity> seats = new ArrayList<>();
        int num = 65;
        for (int i = 0; i < requestDto.getCseat() / 10; i++) {
            String alpha = String.valueOf((char) (num+i));
            for (int j = 1; j <= 10; j++) {
                SeatEntity seat = SeatEntity.builder().sname(alpha + j).cinema(cinema).build();
                seats.add(seat);
            }
        }
        // 상영관에 대한 개별 좌석 Insert(DB 테이블)
        seatRepository.saveAll(seats);
    }

    // 상영관을 삭제하는 메소드
    @Transactional
    public void CinemaDelete(HttpServletRequest request, Long cid) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 상영관 삭제에 필요한 정보 Entity로 변환
        CinemaEntity cinema = cinemaRepository.findById(cid)
                .orElseThrow(()-> new CinemaNotFoundException("상영관이 존재하지 않습니다."));

        // 상영관 삭제전 상영관이 사용된 상영정보 조회
        List<MovieInfoEntity> movieInfos = movieInfoRepository.findByCinema(cinema);

        // 상영정보가 존재할 경우 예외처리
        if (!movieInfos.isEmpty()) {
            throw new MovieInfoExistException("상영정보가 존재합니다.");
        }

        // 상영관 제거
        cinemaRepository.deleteById(cid);
    }

    // 상영관을 수정하는 메소드
    @Transactional
    public void CinemaUpdate(HttpServletRequest request, CinemaDto requestDto) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 상영관 수정에 필요한 정보 Entity로 변환
        CinemaEntity cinema = cinemaRepository.findById(requestDto.getCid())
                .orElseThrow(() -> new CinemaNotFoundException("상영관이 존재하지 않습니다."));
        TheaterEntity theater = TheaterEntity.builder().tid(requestDto.getTid()).build();

        // 상영관 수정전 상영관이 사용된 상영정보 조회
        List<MovieInfoEntity> movieInfos = movieInfoRepository.findByCinema(cinema);

        // 상영정보가 존재할 경우 일부만 update
        if (!movieInfos.isEmpty()) {
            // 상영관 정보 수정
            cinemaRepository.CinemaUpdate(requestDto.getCname(), requestDto.getCtype(), cinema.getCseat(),
                    TheaterEntity.builder().tid(cinema.getTheater().getTid()).build(), requestDto.getCid());
            return;
        }
        else {
            // 상영관 정보 수정
            cinemaRepository.CinemaUpdate(requestDto.getCname(), requestDto.getCtype(), requestDto.getCseat(),
                    theater, requestDto.getCid());
        }

        // 상영관의 수정하는 좌석수와 DB에 저장된 좌석수가 일치하는지에 대한 변수
        boolean equal = Objects.equals(cinema.getCseat(), requestDto.getCseat());

        // 좌석수를 변경했을 경우
        if (!equal) {
            // 상영관에 대한 개별좌석 제거
            seatRepository.deleteByCinema(cinema);

            // 상영관에 좌석수에 따라 알파벳 순서대로 10자리씩 상영관에 대한 개별 좌석 생성 후 SeatEntity 리스트에 삽입
            // ex) 30자리 -> A1~A10, B1~B10, C1~C10
            List<SeatEntity> seats = new ArrayList<>();
            int num = 65;
            for (int i = 0; i < requestDto.getCseat() / 10; i++) {
                String alpha = String.valueOf((char) (num+i));
                for (int j = 1; j <= 10; j++) {
                    SeatEntity seat = SeatEntity.builder().sname(alpha + j).cinema(cinema).build();
                    seats.add(seat);
                }
            }
            // 상영관에 대한 개별 좌석 Insert(DB 테이블)
            seatRepository.saveAll(seats);
        }
    }

    // 상영정보를 불러오는 메소드
    public List<MovieInfoDto> MovieInfoSearch(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // requestMap 데이터 추출 및 형변환
        String mid = requestMap.get("mid");
        String tarea = requestMap.get("tarea");
        String tid = requestMap.get("tid");
        String startDay = requestMap.get("startDay");
        String endDay = requestMap.get("endDay");

        // 프론트단에서 영화를 선택 안했을경우 파라미터를 null로 주기위한 과정
        MovieEntity movie = null;
        if (mid != null) {
            movie = MovieEntity.builder().mid(Long.valueOf(mid)).build();
        }

        // 프론트단에서 극장을 선택 안했을경우 파라미터를 null로 주기위한 과정
        Long theater = null;
        if (tid != null) {
            theater = Long.valueOf(tid);
        }

        // 프론트단에서 날짜를 선택 안했을경우 파라미터를 null로 주기위한 과정
        Date Start = null;
        Date End = null;
        if (startDay != null) {
            Start = Date.valueOf(startDay);
        }
        if (endDay != null) {
            End = Date.valueOf(endDay);
        }

        // 조건에 맞는 상영관 정보 조회
        List<CinemaEntity> cinemaEntities = cinemaRepository.findByTidAndTarea(theater, tarea);

        // 프론트단에서 보낸 조건과 상영관 정보를 이용해서 상영정보 검색
        List<MovieInfoEntity> movieInfos = movieInfoRepository.findManagerMovieInfo(movie, Start, End, cinemaEntities);

        // 영화 정보 가공
        List<MovieEntity> movies = movieRepository.findAll();
        HashMap<Long, String> m_title = new HashMap<>();
        HashMap<Long, Date> m_date = new HashMap<>();
        for (MovieEntity m : movies) {
            m_title.put(m.getMid(), m.getMtitle());
            m_date.put(m.getMid(), m.getMdate());
        }

        return movieInfos.stream().map(movieInfo -> MovieInfoDto.builder()
                .mid(movieInfo.getMovie().getMid())
                .miid(movieInfo.getMiid())
                .mtitle(m_title.get(movieInfo.getMovie().getMid()))
                .mdate(m_date.get(movieInfo.getMovie().getMid()))
                .tid(movieInfo.getCinema().getTheater().getTid())
                .cid(movieInfo.getCinema().getCid())
                .tarea(movieInfo.getCinema().getTheater().getTarea())
                .tname(movieInfo.getCinema().getTheater().getTname())
                .cname(movieInfo.getCinema().getCname())
                .miday(movieInfo.getMiday())
                .mistarttime(movieInfo.getMistarttime())
                .miendtime(movieInfo.getMiendtime())
                .cntSeatAll(movieInfo.getCinema().getCseat())
                .cntSeatInfo(movieInfo.getCntSeatInfo()).build()).collect(Collectors.toList());
    }

    // 상영정보를 추가하는 메소드
    @Transactional
    public void MovieInfoInsert(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // requestMap 데이터 추출 및 형변환
        Long mid = Long.valueOf(requestMap.get("mid"));
        Long cid = Long.valueOf(requestMap.get("cid"));
        String insertStartDay = requestMap.get("insertStartDay");
        String insertEndDay = requestMap.get("insertEndDay");

        // 상영정보 추가에 필요한 정보 Entity로 변환
        MovieEntity movie = MovieEntity.builder().mid(mid).build();
        CinemaEntity cinema = CinemaEntity.builder().cid(cid).build();

        // 상영정보간 시간 확인
        String CheckStart = DateUtil.ChangeDate(insertStartDay+":00", -1799);
        String CheckEnd = DateUtil.ChangeDate(insertEndDay+":00", +1799);
        List<MovieInfoEntity> CheckInfo = movieInfoRepository.findExistMovieInfo(cinema, CheckStart, CheckEnd);

        // 상영정보를 추가 못할경우 예외처리
        if (!CheckInfo.isEmpty()) {
            throw new MovieInfoExistException("상영정보간 시간 간격이 너무 짧습니다.");
        }

        // 상영정보 추가
        movieInfoRepository.save(MovieInfoEntity.builder()
                .miday(Date.valueOf(insertStartDay.substring(0, 10)))
                .mistarttime(insertStartDay+":00")
                .miendtime(insertEndDay+":00")
                .movie(movie)
                .cinema(cinema).build());
    }

    // 상영정보를 삭제하는 메소드
    @Transactional
    public void MovieInfoDelete(HttpServletRequest request, Long miid) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // JPA 사용을 위한 형 변환
        MovieInfoEntity movieInfo = movieInfoRepository.findById(miid)
                .orElseThrow(()-> new MovieInfoNotFoundException("상영정보가 존재하지 않습니다."));

        // 상영정보 삭제전 상영정보에 대한 예매기록 조회
        List<ReservationEntity> reservation = reservationRepository.findByMovieInfo(movieInfo);

        // 예매기록이 존재할경우 예외처리
        if (!reservation.isEmpty()) {
            throw new ReserveExistException("상영정보에 예매 기록이 존재합니다.");
        }

        // 상영정보 삭제
        movieInfoRepository.deleteById(miid);
    }

    // 상영정보를 수정하는 메소드
    @Transactional
    public void MovieInfoUpdate(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // requestMap 데이터 추출 및 형변환
        Long miid = Long.valueOf(requestMap.get("miid"));
        Long mid = Long.valueOf(requestMap.get("mid"));
        Long cid = Long.valueOf(requestMap.get("cid"));
        String updateStartDay = requestMap.get("updateStartDay");
        String updateEndDay = requestMap.get("updateEndDay");

        // 상영정보 수정에 필요한 정보 Entity로 변환
        MovieEntity movie = MovieEntity.builder().mid(mid).build();
        CinemaEntity cinema = CinemaEntity.builder().cid(cid).build();
        MovieInfoEntity movieInfo = movieInfoRepository.findById(miid)
                .orElseThrow(()-> new MovieInfoNotFoundException("상영정보가 존재하지 않습니다."));

        // 상영정보간 시간 확인
        String CheckStart = DateUtil.ChangeDate(updateStartDay+":00", -1799);
        String CheckEnd = DateUtil.ChangeDate(updateEndDay+":00", +1799);
        List<MovieInfoEntity> CheckInfo = movieInfoRepository.findExistMovieInfo(cinema, CheckStart, CheckEnd);

        // 상영정보를 수정 못할경우 예외처리
        for (MovieInfoEntity MI : CheckInfo) {
            if (!Objects.equals(MI.getMiid(), miid)) {
                throw new MovieInfoExistException("상영정보간 시간 간격이 너무 짧습니다.");
            }
        }

        // 상영정보 수정전 상영정보에 대한 예매기록 조회
        List<ReservationEntity> reservation = reservationRepository.findByMovieInfo(movieInfo);

        // 예매기록이 존재할경우 예외처리
        if (!reservation.isEmpty()) {
            throw new ReserveExistException("상영정보에 예매 기록이 존재합니다.");
        }

        // 상영정보 수정
        movieInfoRepository.MovieInfoUpdate(miid, Date.valueOf(updateStartDay.substring(0, 10)),
                updateStartDay+":00", updateEndDay+":00", movie, cinema);
    }
}
