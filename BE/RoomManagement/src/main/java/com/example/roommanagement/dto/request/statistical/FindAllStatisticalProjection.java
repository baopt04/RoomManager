package com.example.roommanagement.dto.request.statistical;

import java.math.BigDecimal;

public interface FindAllStatisticalProjection {
    BigDecimal getTotalRoomPrice();
    BigDecimal getTotalWaterPrice();
    BigDecimal getTotalElectricityPrice();
    BigDecimal getTotalServicePrice();
    Integer getTotalAvailable();
    Integer getTotalRented();
    BigDecimal getTotalSystemRevenue();
}
