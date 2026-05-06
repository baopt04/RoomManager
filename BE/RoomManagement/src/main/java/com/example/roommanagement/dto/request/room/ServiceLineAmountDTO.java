package com.example.roommanagement.dto.request.room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceLineAmountDTO {
    private String serviceName;
    private BigDecimal amount;
}
