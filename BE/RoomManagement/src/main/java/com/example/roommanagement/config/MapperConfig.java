package com.example.roommanagement.config;

import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.ErrorRepsponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class MapperConfig {
    // Xử lý lỗi validate
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidateException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorRepsponse> handleBusinessException(BusinessException ex) {
        ErrorRepsponse error = new ErrorRepsponse(400, ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorRepsponse> handleGenericException(Exception ex) {
        ErrorRepsponse error = new ErrorRepsponse(500, "Lỗi hệ thống: " + ex.getMessage()) {
        };
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
