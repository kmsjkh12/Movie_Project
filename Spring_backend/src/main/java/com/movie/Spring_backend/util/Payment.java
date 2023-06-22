/*
  23-05-02 결제 페이지 수정(오병주)
*/
package com.movie.Spring_backend.util;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.movie.Spring_backend.dto.IamportDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.URL;
import java.util.Map;

@Component
public class Payment {

    @Value("${payment.key}")
    private String impKey;

    @Value("${payment.secretKey}")
    private String impSecretKey;

    // 포트원 access 토큰 생성 메소드
    public String getToken() throws IOException {
        // URL 객체 생성
        URL url = new URL("https://api.iamport.kr/users/getToken");

        // URL Connection 객체 생성
        HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();

        // URL Connection 구성
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);

        // 토큰 요청 시 필요한 키값 json으로 매핑
        JsonObject json = new JsonObject();
        json.addProperty("imp_key", impKey);
        json.addProperty("imp_secret", impSecretKey);

        // 서버로부터 데이터 요청을 위한 작업
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
        bw.write(json.toString()); // 버퍼에 json 담기
        bw.flush(); // 버퍼에 담긴 데이터 전달
        bw.close();

        // 서버로부터 데이터 읽어오기
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));

        // json 매핑을 위해 Gson 선언
        Gson gson = new Gson();

        // 서버로부터 받은 데이터를 두번 매핑하여 token값 추출
        String response = gson.fromJson(br.readLine(), Map.class).get("response").toString();
        String token = gson.fromJson(response, Map.class).get("access_token").toString();

        // 연결해체 및 객체 닫기
        br.close();
        conn.disconnect();

        return token;
    }

    // 결제 정보 요청 메소드(rest api 리턴값 : 포트원 고유번호에 대한 결제내역 조회)
    public IamportDto paymentInfo(String imp_uid) throws IOException {
        // URL 객체 생성 및 access 토큰생성
        URL url = new URL("https://api.iamport.kr/payments/" + imp_uid);
        String access_token = getToken();

        // URL Connection 객체 생성
        HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();

        // URL Connection 구성
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", access_token);
        conn.setDoOutput(true);

        // 서버로부터 데이터 읽어오기
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));

        // json 매핑을 위해 Gson 선언
        Gson gson = new Gson();

        // 서버로부터 받은 데이터를 IamportDto로 매핑
        IamportDto iamportDto = gson.fromJson(br.readLine(), IamportDto.class);

        // 연결해체 및 객체 닫기
        br.close();
        conn.disconnect();

        return iamportDto;
    }

    // 예매 취소 메소드
    public void paymentCancel(String imp_uid, int amount, String reason) throws IOException  {
        // URL 객체 생성 및 access 토큰생성
        URL url = new URL("https://api.iamport.kr/payments/cancel");
        String access_token = getToken();

        // URL Connection 객체 생성
        HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();

        // URL Connection 구성
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setRequestProperty("Authorization", access_token);
        conn.setDoOutput(true);

        // 주문 취소시 필요한 값 json으로 매핑
        JsonObject json = new JsonObject();
        json.addProperty("reason", reason);     // 취소사유
        json.addProperty("imp_uid", imp_uid);   // 결제 고유번호
        json.addProperty("amount", amount);     // 취소금액
        json.addProperty("checksum", amount);   // 요청자의 취소 가능 잔액과 포트원의 취소 가능 잔액이 일치하는지 검증

        // 서버로부터 데이터 요청을 위한 작업
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
        bw.write(json.toString()); // 버퍼에 json 담기
        bw.flush(); // 버퍼에 담긴 데이터 전달
        bw.close();

        // 서버로부터 데이터 읽어오기
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));

        // 연결해체 및 객체 닫기
        br.close();
        conn.disconnect();
    }
}