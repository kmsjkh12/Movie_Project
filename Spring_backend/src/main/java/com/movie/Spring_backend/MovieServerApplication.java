package com.movie.Spring_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MovieServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MovieServerApplication.class, args);
		System.out.println("서버 작동");
	}
}
