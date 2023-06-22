/*
  23-05-02 결제 페이지 수정(오병주)
*/
package com.movie.Spring_backend.service;

import com.movie.Spring_backend.dto.IamportDto;
import com.movie.Spring_backend.dto.ReservationDto;
import com.movie.Spring_backend.entity.*;
import com.movie.Spring_backend.exceptionlist.PaymentNotCorrectException;
import com.movie.Spring_backend.exceptionlist.ReserveNotFoundException;
import com.movie.Spring_backend.exceptionlist.SeatOccupyException;
import com.movie.Spring_backend.jwt.JwtValidCheck;
import com.movie.Spring_backend.util.Payment;
import com.movie.Spring_backend.repository.MovieInfoSeatRepository;
import com.movie.Spring_backend.repository.RedisSeatRepository;
import com.movie.Spring_backend.repository.ReservationRepository;
import com.movie.Spring_backend.util.DateUtil;
import com.movie.Spring_backend.util.RemoveLastChar;
import com.movie.Spring_backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

@RequiredArgsConstructor
@Service
@Slf4j
public class PaymentService {

    private final Payment payment;
    private final JwtValidCheck jwtValidCheck;
    private final MovieInfoSeatRepository movieInfoSeatRepository;
    private final ReservationRepository reservationRepository;
    private final RedisSeatRepository redisSeatRepository;

    // 결제 검증을 위한 메소드
    @Transactional
    public ReservationDto CheckPayment(Map<String, String> requestMap, HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // requestMap 안에 정보 추출 및 authentication 객체에서 아이디 확보
        String currentMemberId = SecurityUtil.getCurrentMemberId();
        String rpayid = requestMap.get("rpayid");
        Long miid = Long.valueOf(requestMap.get("miid"));
        Integer price = Integer.valueOf(requestMap.get("price"));
        String temp_people = requestMap.get("temp_people");
        String temp_seat = requestMap.get("temp_seat");
        Integer rticket = Integer.valueOf(requestMap.get("rticket"));

        // 프론트단에서 준 정보를 가공
        String rpeople = RemoveLastChar.removeLast(RemoveLastChar.removeLast(temp_people));
        MemberEntity member = MemberEntity.builder().uid(currentMemberId).build();
        MovieInfoEntity movieInfo = MovieInfoEntity.builder().miid(miid).build();
        String day = DateUtil.getNow(); // 현재 시간

        // 프론트단에서 전달받은 좌석 번호
        String [] SeatNumber = temp_seat.split(",");
        List<Long> sid = new ArrayList<>();
        for(String s : SeatNumber){
            sid.add(Long.parseLong(s));
        }

        // 사용자가 예매하려고하는 좌석에 대한 점유여부 확인(check가 true면 이미 점유된자리)
        boolean check = false;
        List<MovieInfoSeatEntity> movieInfoSeat = movieInfoSeatRepository.findByMovieInfo(movieInfo);
        for (MovieInfoSeatEntity mis : movieInfoSeat) {
            if (sid.contains(mis.getSeat().getSid())) {
                check = true;
                break;
            }
        }

        // 결제 정보를 포트원 서버로부터 요청
        IamportDto iamportDto;
        try {
            iamportDto = payment.paymentInfo(rpayid);

            // 프론트단에서 결제한 금액과 포트원 서버에서 보낸 결제금액 일치하지 않을경우(js 변경공격 방지)
            if (!price.equals(iamportDto.getResponse().getAmount())) {
                // 결제금액 환불후 예외처리
                payment.paymentCancel(rpayid, iamportDto.getResponse().getAmount(), "결제 에러");
                log.error("스크립트 공격이 의심됩니다.");
                throw new PaymentNotCorrectException("결제 정보가 올바르지 않습니다.");
            }

            // 사용자가 이미 점유된 좌석을 예매하려는 경우
            if (check) {
                // 결제금액 환불후 예외처리
                payment.paymentCancel(rpayid, iamportDto.getResponse().getAmount(), "점유 좌석 예매");
                throw new SeatOccupyException("이미 점유된 자리입니다.");
            }

            // 결제가 완료된 상태가 아닐경우 예외처리
            if (!iamportDto.getResponse().getStatus().equals("paid")) {
                throw new PaymentNotCorrectException("결제 정보가 올바르지 않습니다.");
            }
        }
        catch (IOException e) {
            log.error("결제 정보가 올바르지 않습니다.", e);
            throw new PaymentNotCorrectException("결제 정보가 올바르지 않습니다.");
        }

        // 결제유형 확인
        String payType = "카드결제";
        if (iamportDto.getResponse().getEmb_pg_provider() != null && iamportDto.getResponse().getEmb_pg_provider().equals("kakaopay")) {
            payType = "카카오페이";
        }
        if (iamportDto.getResponse().getEmb_pg_provider() != null && iamportDto.getResponse().getEmb_pg_provider().equals("naverpay")) {
            payType = "네이버페이";
        }

        // 결제 정보 데이터베이스에 저장
        reservationRepository.save(ReservationEntity.builder()
                .rdate(day)
                .rprice(price)
                .rpeople(rpeople)
                .rticket(rticket)
                .rpayid(rpayid)
                .rpaytype(payType)
                .rstate(true)
                .member(member)
                .movieInfo(movieInfo)
                .build());

        // 저장된 예매기록 조회
        ReservationEntity reservation = reservationRepository.findByRpayid(rpayid)
                .orElseThrow(() -> new ReserveNotFoundException("예매 기록이 존재하지 않습니다."));

        // 사용자가 예매한 좌석 mysql에 삽입 + redis에 있는 좌석정보 제거
        List<MovieInfoSeatEntity> infoSeat = new ArrayList<>();
        for (Long s : sid) {
            infoSeat.add(MovieInfoSeatEntity.builder()
                    .seat(SeatEntity.builder().sid(s).build())
                    .movieInfo(movieInfo)
                    .reservation(reservation)
                    .build());

           String key = miid + "," + s;
           redisSeatRepository.deleteById(key);
        }
        movieInfoSeatRepository.saveAll(infoSeat);

        // 예매번호를 리턴
        return ReservationDto.builder().rid(reservation.getRid()).build();
    }

    // 예매 취소 요청시 실행되는 메소드
    @Transactional
    public void CancelPayment(Long rid, HttpServletRequest request) {
        // Access Token에 대한 유효성 검사
        jwtValidCheck.JwtCheck(request, "ATK");

        // 예매 번호를 이용하여 예매기록 검색
        ReservationEntity Reservation = reservationRepository.findById(rid).orElseThrow(
                () -> new ReserveNotFoundException("예매 기록이 존재하지 않습니다."));

        // 사용자의 예매가 아닌경우 예외처리
        String currentMemberId = SecurityUtil.getCurrentMemberId();
        if (!currentMemberId.equals(Reservation.getMember().getUid())) {
            throw new ReserveNotFoundException("다른 사용자의 예매 기록입니다.");
        }

        // 이미 취소된 예매인경우 예외처리
        if (!Reservation.getRstate()) {
            throw new ReserveNotFoundException("이미 취소된 예매입니다.");
        }

        // 임의의 데이터가 아닌경우에만 결제취소 진행
        if (!Reservation.getRpayid().equals("temporary_value")) {
            // 결제 취소 실행
            try {
                payment.paymentCancel(Reservation.getRpayid(), Reservation.getRprice(), "예매 취소");
            }
            catch (IOException e) {
                log.error("결제 정보가 올바르지 않습니다.", e);
                throw new PaymentNotCorrectException("결제 정보가 올바르지 않습니다.");
            }
        }
        // 사용자가 예매했던 좌석정보 삭제
        movieInfoSeatRepository.deleteByReservation(Reservation);

        // 사용자가 취소한 예매정보를 변경
        reservationRepository.UserReservationCancel(Reservation.getRid());
    }
}




