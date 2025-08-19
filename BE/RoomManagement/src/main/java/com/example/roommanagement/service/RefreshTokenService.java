package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.admin.RefreshTokenDTO;
import com.example.roommanagement.dto.request.admin.SignIn;
import com.example.roommanagement.entity.RefreshToken;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(String idAdmin , String token);
    Optional<RefreshToken> findByToken(String token);
    RefreshToken verifyExpiration(RefreshToken token);
    ResponseEntity<SignIn> refreshTokenAccess(HttpServletRequest request);
    String extractRefreshTokenFromCookie(HttpServletRequest request);
}
