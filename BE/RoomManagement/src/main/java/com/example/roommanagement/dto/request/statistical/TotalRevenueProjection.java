package com.example.roommanagement.dto.request.statistical;

import java.math.BigDecimal;

public interface TotalRevenueProjection {
    Integer getMonthNow();
    BigDecimal getTotalRoomPrice();
    BigDecimal getTotalWater();
    BigDecimal getTotalElectricity();
    BigDecimal getTotalService();
    BigDecimal getTotalAll();
}
