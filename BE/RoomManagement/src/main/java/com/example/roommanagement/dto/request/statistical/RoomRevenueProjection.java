package com.example.roommanagement.dto.request.statistical;

import java.math.BigDecimal;

public interface RoomRevenueProjection {
    String getRoomId();
    String getRoomName();
    BigDecimal getRoomPrice();
    BigDecimal getTotalWater();
    BigDecimal getTotalElectricity();
    BigDecimal getTotalService();
    BigDecimal getTotalAll();
}
