package com.example.roommanagement.repository;

import com.example.roommanagement.entity.Admin;
import com.example.roommanagement.entity.RefreshToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);
    @Transactional
    @Modifying
    void deleteByAdminId(String idAdmin);

}
