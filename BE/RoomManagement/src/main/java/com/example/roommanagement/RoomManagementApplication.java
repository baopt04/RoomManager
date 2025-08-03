package com.example.roommanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableAsync
@SpringBootApplication
@EnableScheduling
public class RoomManagementApplication {
	public static void main(String[] args) {
		SpringApplication.run(RoomManagementApplication.class, args);
		System.out.println("Hello world");
	}

}
