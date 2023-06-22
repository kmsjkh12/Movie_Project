package com.movie.Spring_backend.util;

public class RemoveLastChar {
    // 마지막 글자 제거하는 메소드
    public static String removeLast(String str) {
        if (str == null || str.length() == 0) {
            return str;
        }
        return str.substring(0, str.length() - 1);
    }
}
