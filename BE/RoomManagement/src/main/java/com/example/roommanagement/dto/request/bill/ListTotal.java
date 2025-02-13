package com.example.roommanagement.dto.request.bill;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListTotal {
    private BigDecimal totalService;
    private BigDecimal totalWater;
    private BigDecimal totalElectricity;
}
