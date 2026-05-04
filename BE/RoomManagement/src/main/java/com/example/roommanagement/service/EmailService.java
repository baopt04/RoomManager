package com.example.roommanagement.service;

import com.example.roommanagement.entity.Bill;
import jakarta.mail.MessagingException;

public interface EmailService {
    void sendMail(String to , String subject ,String body) throws MessagingException;
    void sendMailAsync(String to, String subject, String body);
    String generateEmailBody(Bill bill);
    void sendMailCreateAmdin(String to, String subject, String body) throws MessagingException;
}
