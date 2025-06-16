package com.example.roommanagement.infrastructure.error;

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
