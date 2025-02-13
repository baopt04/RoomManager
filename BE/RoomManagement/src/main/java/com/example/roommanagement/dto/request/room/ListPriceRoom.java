package com.example.roommanagement.dto.request.room;

import jakarta.annotation.security.DenyAll;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListPriceRoom {
    private Long stt;
    private String id;
    private BigDecimal totalPriceService;
    private BigDecimal totalPriceWater;
    private BigDecimal totalPriceElectricity;
}
