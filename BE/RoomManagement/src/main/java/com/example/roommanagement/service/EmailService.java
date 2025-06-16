package com.example.roommanagement.service;

import com.example.roommanagement.entity.Bill;
import jakarta.mail.MessagingException;

public interface EmailService {
    void sendMail(String to , String subject ,String body) throws MessagingException;
    String generateEmailBody(Bill bill);
    void sendMailCreateAmdin(String to, String subject, String body) throws MessagingException;
}
