package com.movie.Spring_backend.service;

import com.movie.Spring_backend.entity.MovieEntity;
import com.movie.Spring_backend.dto.TheaterDto;
import com.movie.Spring_backend.entity.TheaterEntity;
import com.movie.Spring_backend.mapper.TheaterMapper;
import com.movie.Spring_backend.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TheaterService {

    private final TheaterRepository theaterRepository;
    private final TheaterMapper theaterMapper;

    // 예매가 가능한 극장 조회하는 메소드
    @Transactional
    public List<TheaterDto> getPossibleTheater() {
        List<TheaterEntity> Theaters = theaterRepository.findPossibleTheater();

        return Theaters.stream().map(theater -> TheaterDto.builder()
                .tid(theater.getTid())
                .tname(theater.getTname())
                .tarea(theater.getTarea()).build()).collect(Collectors.toList());
    }

    // 예매 페이지에서 조건에 맞는 극장을 가져오는 메소드
    public List<TheaterDto> getTicketTheater(Map<String, String> requestMap) {
        // requestMap 안에 정보를 추출
        String miday = requestMap.get("miday");
        String mid = requestMap.get("mid");

        // 프론트단에서 날짜를 선택 안했을경우 파라미터를 null로 주기위한 과정
        Date day = null;
        if (miday != null) {
            day = java.sql.Date.valueOf(miday);
        }

        // 프론트단에서 영화를 선택 안했을경우 파라미터를 null로 주기위한 과정
        MovieEntity movie = null;
        if (mid != null) {
            movie = MovieEntity.builder().mid(Long.valueOf(mid)).build();
        }

        // 극장 테이블에서 조건에 맞는 극장들 조회
        List<TheaterEntity> conditionTheater = theaterRepository.findTheaterOnTicket(day, movie);

        // 극장 테이블에서 현재 예매가 가능한 극장들 조회
        List<TheaterEntity> allTheater = theaterRepository.findPossibleTheater();

        // 검색한 극장 목록 리턴
        return theaterMapper.toDtoTicketTheater(conditionTheater, allTheater);
    }
}