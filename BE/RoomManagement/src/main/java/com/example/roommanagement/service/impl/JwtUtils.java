package com.example.roommanagement.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtils {
    private SecretKey secretKey;
    private static final long ACCESS_TOKEN = 1000 * 60 * 1;
    private static final long REFRESH_TOKEN = 1000 * 60 * 60 * 24 * 7;
    public JwtUtils() {
        String keyword = "843567893696976453275974432697R634976R738467TR678T34865R6834R8763T478378637664538745673865783678548735687R3";
        this.secretKey = Keys.hmacShaKeyFor(keyword.getBytes(StandardCharsets.UTF_8));
    }
    public String generateToken(UserDetails userDetails , long expirationMillis) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(secretKey , Jwts.SIG.HS256)
                .compact();
    }
    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(userDetails , ACCESS_TOKEN);
    }
    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails , REFRESH_TOKEN);
    }

    public String extractUserName(String token) {
        return extractClaims(token , Claims::getSubject);
    }
    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        return claimsTFunction.apply(Jwts
                .parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload());
    }
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername()) && !validateExpired(token));
    }
    public boolean validateExpired(String token) {
        return extractClaims(token  , Claims::getExpiration).before(new Date());
    }
    public boolean validateRefreshToken(String token ) {
        try {
            return !validateExpired(token);
        }catch (Exception e) {
            return false;
        }
    }
}
