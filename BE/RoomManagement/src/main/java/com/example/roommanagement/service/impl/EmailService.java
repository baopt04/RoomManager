package com.example.roommanagement.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    public void sendMail(String to , String subject , String content) throws MailException , MessagingException {
MimeMessage mimeMessage = mailSender.createMimeMessage();
MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage );
mimeMessageHelper.setTo(to);
mimeMessageHelper.setSubject(subject);
mimeMessageHelper.setText(content);
mimeMessageHelper.setFrom("phamthaibao2410@gmail.com");
mailSender.send(mimeMessage);


    }
}
