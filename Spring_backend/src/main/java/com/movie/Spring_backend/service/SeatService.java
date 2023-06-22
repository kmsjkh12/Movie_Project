/*
  23-04-30 ~ 23-05-01 예매 좌석 페이지 수정(오병주)
*/
package com.movie.Spring_backend.service;

import com.movie.Spring_backend.dto.SeatDto;
import com.movie.Spring_backend.entity.*;
import com.movie.Spring_backend.exceptionlist.SeatOccupyException;
import com.movie.Spring_backend.jwt.JwtValidCheck;
import com.movie.Spring_backend.mapper.SeatMapper;
import com.movie.Spring_backend.repository.MovieInfoSeatRepository;
import com.movie.Spring_backend.repository.RedisSeatRepository;
import com.movie.Spring_backend.repository.SeatRepository;
import com.movie.Spring_backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.*;

import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class SeatService {
    private final JwtValidCheck jwtValidCheck;
    private final SeatRepository seatRepository;
    private final RedisSeatRepository redisSeatRepository;
    private final MovieInfoSeatRepository movieInfoSeatRepository;
    private final SeatMapper seatMapper;

    // 특정 상영정보에 좌석정보를 가져오는 메소드
    @Transactional
    public List<SeatDto> getSeatMovieInfo(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // requestMap 안에 정보를 추출
        Long cid = Long.valueOf(requestMap.get("cid"));
        long miid = Long.parseLong(requestMap.get("miid"));

        // 좌석정보 조회에 필요한 정보 Entity로 변환
        CinemaEntity cinema = CinemaEntity.builder().cid(cid).build();
        MovieInfoEntity movieInfo = MovieInfoEntity.builder().miid(miid).build();

        // 상영관에 모든 좌석 및 점유좌석들 조회
        List<SeatEntity> Seats = seatRepository.findByCinema(cinema);
        List<MovieInfoSeatEntity> movieInfoSeats = movieInfoSeatRepository.findByMovieInfo(movieInfo);
        List<RedisSeatEntity> redisSeats = redisSeatRepository.findAll();

        // authentication 객체에서 아이디 확보 및 리스트 선언
        String currentMemberId = SecurityUtil.getCurrentMemberId();
        List<Long> occupyNum = new ArrayList<>();

        // mysql에 있는 상영정보에 대한 점유좌석번호 추출
        for (MovieInfoSeatEntity mis : movieInfoSeats) {
            occupyNum.add(mis.getSeat().getSid());
        }

        // 레디스에 있는 상영정보에 대한 점유좌석번호 추출
        for (RedisSeatEntity rs : redisSeats) {
            // 레디스 정보가 null이 아니고 현재 사용자와 점유좌석에 있는 사용자 정보가 다를경우
            if (rs != null && !currentMemberId.equals(rs.getUser())) {
                // 레디스 데이터 매핑
                String [] SeatNumber = rs.getKey().split(",");

                // 사용자가 예매하려는 상영정보의 점유좌석일경우 좌석번호를 추출
                if (Long.parseLong(SeatNumber[0].trim()) == miid) {
                    occupyNum.add(Long.parseLong(SeatNumber[1].trim()));
                }
            }
        }
        // 정보를 매핑후 리턴
        return Seats.stream().map(seat -> seatMapper.toDtoReserve(seat, occupyNum)).collect(Collectors.toList());
    }

    // 예매 결제전 사용자가 선택한 자리의 점유 여부를 확인하는 메소드(레디스를 사용하여 임시 좌석점유도 구현)
    @Transactional
    public void getSeatCheck(HttpServletRequest request, Map<String, String> requestMap) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // requestMap 안에 정보를 추출
        String temp_seat = requestMap.get("temp_seat");
        long miid = Long.parseLong(requestMap.get("miid"));

        // 프론트단에서 전달받은 좌석 번호 분리
        List<String> SeatNumber = Arrays.asList(temp_seat.split(","));

        // 점유 좌석 조회에 필요한 정보 Entity로 변환
        MovieInfoEntity movieInfo = MovieInfoEntity.builder().miid(miid).build();

        // 상영정보에 대한 점유좌석들 조회
        List<MovieInfoSeatEntity> movieInfoSeats = movieInfoSeatRepository.findByMovieInfo(movieInfo);

        // 사용자가 예매하려는 좌석이 이미 점유된 좌석일경우 예외처리(mysql)
        for (MovieInfoSeatEntity mis : movieInfoSeats) {
            if (SeatNumber.contains(mis.getSeat().getSid().toString())) {
                throw new SeatOccupyException("이미 점유된 자리입니다.");
            }
        }

        // authentication 객체에서 아이디 확보 및 리스트 선언
        String currentMemberId = SecurityUtil.getCurrentMemberId();
        List<RedisSeatEntity> redisSeats = new ArrayList<>();

        // 사용자가 예매하려는 좌석이 이미 점유된 좌석일경우 예외처리(redis)
        for (String str : SeatNumber) {
            // 레디스 key 생성
            String key = miid + "," + str;

            // 레디스 데이터를 키값으로 조회
            Optional<RedisSeatEntity> seat = redisSeatRepository.findById(key);

            // 조회한 데이터가 null이 아니면서 사용자가 현재페이지에서 점유한 자리가 아닐경우 예외처리
            if (seat.isPresent()) {
                if (!currentMemberId.equals(seat.get().getUser())) {
                    throw new SeatOccupyException("이미 점유된 자리입니다.");
                }
            }
            // 현재 반복되고 있는 좌석번호 리스트에 삽입
            redisSeats.add(RedisSeatEntity.builder().key(key).user(currentMemberId).build());
        }
        // 사용자가 선택한 좌석정보 레디스에 저장
        redisSeatRepository.saveAll(redisSeats);
    }
}