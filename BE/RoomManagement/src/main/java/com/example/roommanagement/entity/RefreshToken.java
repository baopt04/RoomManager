package com.example.roommanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "refresh_token")
@Entity
@Builder
public class RefreshToken extends BaseEntity {
    @Column(nullable = false , unique = true)
    private String token;
    @OneToOne
    @JoinColumn(name = "id_admin" , referencedColumnName = "id")
    private Admin admin;
    @Column(nullable = false , name = "expiry_date")
    private Instant expiryDate;

}
