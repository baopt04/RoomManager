package com.example.roommanagement.dto.request.room;

import java.math.BigDecimal;

public interface RoomDetailProjection {
    String getRoomId();
    String getRoomName();
    BigDecimal getRoomPrice();

    Integer getTotalElectricUsage();
    BigDecimal getElectricUnitPrice();
    BigDecimal getTotalElectricPrice();

    Integer getTotalWaterUsage();
    BigDecimal getWaterUnitPrice();
    BigDecimal getTotalWaterPrice();

    BigDecimal getTotalServicePrice();
}
