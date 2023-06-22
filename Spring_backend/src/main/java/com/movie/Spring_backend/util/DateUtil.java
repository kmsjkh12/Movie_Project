/*
  23-03-22 날짜 관련 메소드 결합(오병주)
  23-04-06 상영정보 수정시 사용될 메소드 생성(오병주)
*/
package com.movie.Spring_backend.util;

import com.movie.Spring_backend.error.exception.InvalidValueException;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

// 날짜 사용할 경우 사용되는 클래스
public class DateUtil {

    private static final SimpleDateFormat DateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    // 현재 시간을 리턴하는 메소드
    public static String getNow() {
        Date nowDate = new Date();
        return DateFormat.format(nowDate);
    }

    // 현재 날짜에서 년, 월, 일을 빼주는 메소드
    public static String ChangeDateNow(int year, int month, int day) {
        Date nowDate = new Date();
        Calendar cal = Calendar.getInstance();

        try {
            Date date = DateFormat.parse(DateFormat.format(nowDate));
            cal.setTime(date);
        } catch (Exception e) {
            throw new InvalidValueException("형식이 올바르지 않습니다.");
        }

        cal.add(Calendar.YEAR,  year);
        cal.add(Calendar.MONTH, month);
        cal.add(Calendar.DATE,  day);

        return DateFormat.format(cal.getTime());
    }

    // 특정날짜의 값에서 시간을 빼거나 더해주는 함수(초단위)
    public static String ChangeDate(String day, int second) {
        Calendar cal = Calendar.getInstance();

        try {
            Date date = DateFormat.parse(day);
            cal.setTime(date);
        } catch (Exception e) {
            throw new InvalidValueException("형식이 올바르지 않습니다.");
        }

        cal.add(Calendar.SECOND,  second);

        return DateFormat.format(cal.getTime());
    }
}
