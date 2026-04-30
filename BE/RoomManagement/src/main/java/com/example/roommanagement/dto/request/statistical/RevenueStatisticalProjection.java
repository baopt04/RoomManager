package com.example.roommanagement.dto.request.statistical;

import java.math.BigDecimal;

public interface RevenueStatisticalProjection {
    String getRoomName();
    Integer getMonth();
    Integer getYear();
    BigDecimal getRoomPrice();
    BigDecimal getElectricityPrice();
    BigDecimal getWaterPrice();
    BigDecimal getServicePrice();
    BigDecimal getTotalAmount();
}
