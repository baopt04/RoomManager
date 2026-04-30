package com.example.roommanagement.service.impl;

import com.example.roommanagement.config.TelegramConfig;
import com.example.roommanagement.service.TelegramService;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class TelegramServiceImpl implements TelegramService {
    private final TelegramConfig telegramConfig;
    private final RestTemplate restTemplate = new RestTemplate();
    @Override
    public void sendMessage(String message) {
        String url = "https://api.telegram.org/bot"
                + telegramConfig.getBotToken()
                + "/sendMessage";
        Map<String , Object> body = new HashMap<>();
        body.put("chat_id", telegramConfig.getChatId());
        body.put("text", message);
        body.put("parse_mode", "HTML");
        try {
            restTemplate.postForObject(url, body, String.class);
            log.info("Gửi Telegram thành công");
        } catch (Exception e) {
            log.error("Lỗi gửi Telegram: {}", e.getMessage());
        }
    }
}
