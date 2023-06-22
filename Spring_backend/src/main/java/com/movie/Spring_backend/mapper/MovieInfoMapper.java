package com.movie.Spring_backend.mapper;

import com.movie.Spring_backend.dto.*;
import com.movie.Spring_backend.entity.MovieInfoEntity;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Component
public class MovieInfoMapper {
    // 예매페이지에서 필요한 상영정보의 날짜를 mapping 해주는 메소드
    public List<MovieInfoDayDto> toDtoTicketInfoDay(List<MovieInfoEntity> conditionDay, List<MovieInfoEntity> allDay) {
        // 사용될 변수들 초기화 및 초기값 설정
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM");
        List<Date> Dates = new ArrayList<>();
        List<String> CheckYearMonth = new ArrayList<>();
        List<MovieInfoDayDto> movieInfoDays = new ArrayList<>();
        int start = 0;

        // 검색된 조건에 맞는 상영정보의 날짜 추출
        for (MovieInfoEntity MI : conditionDay) {
            Dates.add(MI.getMiday());
        }

        // 전체 상영정보의 YYYY-MM 추출(중복 없이)
        for (MovieInfoEntity MI : allDay) {
            if (!CheckYearMonth.contains(dateFormat.format(MI.getMiday()))) {
                CheckYearMonth.add(dateFormat.format(MI.getMiday()));
            }
        }

        // 월의 개수 만큼 반복문을 돌림
        for (String yearMonth : CheckYearMonth) {
            List<MovieInfoDto> InfoDays = new ArrayList<>();

            for (int i = start; i < allDay.size(); i++) {
                // 반복되고 있는 리스트의 년,월이 같은경우
                if (yearMonth.equals(dateFormat.format(allDay.get(i).getMiday()))) {
                    // 조건에 맞는 상영정보일경우 reserve를 true 아니면 false로 배열에 삽입
                    if (Dates.contains(allDay.get(i).getMiday())) {
                        InfoDays.add(MovieInfoDto.builder()
                                .miday(allDay.get(i).getMiday())
                                .reserve(true).build());
                    }
                    else {
                        InfoDays.add(MovieInfoDto.builder()
                                .miday(allDay.get(i).getMiday())
                                .reserve(false).build());
                    }
                    // 반복문의 시작위치 조정을 위해 변수값 조정
                    start++;
                }
                // 년,월이 다를경우 break
                else {
                    break;
                }
            }
            // 가공된 정보를 삽입
            movieInfoDays.add(MovieInfoDayDto.builder()
                    .yearMonth(yearMonth)
                    .movieInfos(InfoDays).build());
        }
        return movieInfoDays;
    }

    // 극장별로 상영관 및 상영정보를 매핑해주는 메소드(상영시간표에 사용)
    public List<TimeTableDto> MappingTimeTableByTheater(List<String> TheaterNameList, List<CinemaDto> entityList) {

        List<TimeTableDto> timeTables = new ArrayList<>();
        // 반복문 시작하는 위치
        int start = 0;

        // 극장 이름의 개수만큼 반복
        for (String name : TheaterNameList) {
            List<CinemaDto> cinema = new ArrayList<>();

            // 매개변수로 전달받은 CinemaDto 리스트 크기만큼 반복
            for (int i = start; i < entityList.size(); i++) {
                // 반복되고 있는 리스트들의 극장 이름이 같을경우
                if (entityList.get(i).getTname().equals(name)) {
                    // 상영관 배열에 값 추가
                    cinema.add(entityList.get(i));
                    // 반복문의 시작위치 조정을 위해 변수값 조정
                    start++;
                }
                // 극장 이름이 다를경우 break
                else {
                    break;
                }
            }
            // 가공된 정보 삽입
            timeTables.add(TimeTableDto.builder().theaterName(name).cinemaDtoList(cinema).build());
        }
        return timeTables;
    }

    // 영화별로 상영관 및 상영정보를 매핑해주는 메소드(상영시간표에 사용)
    public List<TimeTableDto> MappingTimeTableByMovie(List<Long> MovieIDList, List<CinemaDto> entityList) {

        List<TimeTableDto> timeTables = new ArrayList<>();
        // 반복문 시작하는 위치
        int start = 0;

        // 영화의 개수만큼 반복
        for (Long mid : MovieIDList) {
            List<CinemaDto> cinema = new ArrayList<>();

            // 매개변수로 전달받은 CinemaDto 리스트 크기만큼 반복
            for (int i = start; i < entityList.size(); i++) {
                // 반복되고 있는 리스트들의 영화 ID가 같을경우
                if (entityList.get(i).getMid().equals(mid)) {
                    // 상영관 배열에 값 추가
                    cinema.add(entityList.get(i));
                    // 반복문의 시작위치 조정을 위해 변수값 조정
                    start++;
                }
                // 영화 ID가 다를경우 break
                else {
                    break;
                }
            }
            // 가공된 정보 삽입
            timeTables.add(TimeTableDto.builder()
                    .mid(mid)
                    .mtitle(entityList.get(start-1).getMtitle())
                    .mtime(entityList.get(start-1).getMtime())
                    .mrating(entityList.get(start-1).getMrating())
                    .mgenre(entityList.get(start-1).getMgenre())
                    .mimagepath(entityList.get(start-1).getMimagepath())
                    .cinemaDtoList(cinema).build());
        }
        return timeTables;
    }
}
