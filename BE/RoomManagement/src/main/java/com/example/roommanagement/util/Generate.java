package com.example.roommanagement.util;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class Generate {
    public static String generatePasswordAdmin(Integer length) {
        Random random = new Random();
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            Integer digit = random.nextInt(10);
            stringBuilder.append(digit);
        }
        return stringBuilder.toString();
    }

    public static String generateCode() {
        Random random = new Random();
        Integer radandomCode = 1000 + random.nextInt(9000);
        return "AD" + radandomCode;
    }


}
