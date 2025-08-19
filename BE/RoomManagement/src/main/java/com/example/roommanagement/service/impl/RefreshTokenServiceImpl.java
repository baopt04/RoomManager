package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.admin.RefreshTokenDTO;
import com.example.roommanagement.dto.request.admin.SignIn;
import com.example.roommanagement.entity.RefreshToken;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.repository.AdminRepository;
import com.example.roommanagement.repository.RefreshTokenRepository;
import com.example.roommanagement.service.RefreshTokenService;
import io.jsonwebtoken.Jwt;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
    @Value("${jwt.refresh.expiration}") //  1 ngày
    private Long refreshTokenDurationMs;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private JwtUtils jwtUtils;


    @Override
    public RefreshToken createRefreshToken(String idAdmin, String token) {
        refreshTokenRepository.deleteByAdminId(idAdmin);
        RefreshToken refreshToken = RefreshToken.builder()
                .admin(adminRepository.findById(idAdmin).orElseThrow())
                .token(token)
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new BusinessException(Constrants.TOKEN_EXPIRATION);
        }
        return token;
    }

    @Override
    public ResponseEntity<SignIn> refreshTokenAccess(HttpServletRequest request) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        }
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException(Constrants.REFRESH_TOKEN_FOUND));
        if (storedToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(storedToken);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        var user = storedToken.getAdmin();
        String newAccessToken = jwtUtils.generateAccessToken(user);
        String newRefreshToken = jwtUtils.generateRefreshToken(user);
        refreshTokenRepository.delete(storedToken);
        refreshTokenRepository.save(RefreshToken.builder()
                .admin(user)
                .token(newRefreshToken)
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .build());

        ResponseCookie cookie = ResponseCookie.from("refreshToken" , newRefreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(refreshTokenDurationMs /1000)
                .sameSite("Lax")
                .build();

        SignIn response = new SignIn(
                user.getEmail() ,
                null ,
                user.getName() ,
                user.getRole().toString() ,
                newAccessToken
        );
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE , cookie.toString())
                .body(response);

    }

    @Override
    public String extractRefreshTokenFromCookie(HttpServletRequest request) {
        System.out.println("Check cookie" + request.getCookies());
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }


}
