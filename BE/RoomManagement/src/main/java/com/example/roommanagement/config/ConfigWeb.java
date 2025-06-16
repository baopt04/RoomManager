package com.example.roommanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ConfigWeb implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Cho phép tất cả các domain truy cập API của bạn
        registry.addMapping("/**") // Áp dụng CORS cho tất cả các API endpoint
                .allowedOrigins("http://localhost:3000") // Chỉ cho phép origin này
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các phương thức HTTP được phép
                .allowedHeaders("*") // Cho phép tất cả các header
                .allowCredentials(true); // Nếu bạn cần gửi cookie hoặc thông tin xác thực
    }
}