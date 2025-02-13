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

    public static String generateCodeAdmin() {
        Random random = new Random();
        Integer radandomCode = 1000 + random.nextInt(9000);
        return "AD" + radandomCode;
    }
public static String generateCodeCustomer(){
        Random random = new Random();
        Integer randomCode = 1000 + random.nextInt(9000);
        return "CT" + randomCode;
}
public static String generateCodeHost(){
        Random random = new Random();
        Integer randomCode = 1000 + random.nextInt(9000);
        return "CN" + randomCode;
    }
    public static String generateCodeHouseForRent(){
        Random random = new Random();
        Integer randomCode = 1000 + random.nextInt(9000);
        return "NT" + randomCode;
    }
    public static String generateCodeRoom(){
        Random random = new Random();
        Integer randomCode = 1000 + random.nextInt(9000);
        return "RM" + randomCode;
    }
    public static String generateCodeWater(){
        Random random = new Random();
        Integer randomCode = 1000 + random.nextInt(9000);
        return "WT" + randomCode;
    }
    public static String generateCodeElectricity() {
        Random random = new Random();
        Integer randomCode = 1000 + random.nextInt(9000);
        return "ET" + randomCode;
    }
    public static String generateCodeService() {
        Random random = new Random();
        Integer randomCode = 1000 + random.nextInt(9000);
        return "SR" + randomCode;
    }
    public static String generateCodeMaintenance() {
        Random random = new Random();
        Integer randomCode = 1000 + random.nextInt(9000);
        return "MT" + randomCode;
    }
    public static String generateCodeContract() {
        Random random = new Random();
        Integer randomCode = 1000 + random.nextInt(9000);
        return "CT" + randomCode;
    }
    public static String generateCodeBill() {
        Random random = new Random();
        Integer randomCode = 1000 + random.nextInt(9000);
        return "HD" + randomCode;
    }
}
