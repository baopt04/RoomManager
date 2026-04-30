package com.example.roommanagement.dto.request.statistical;

import java.math.BigDecimal;

public interface RoomStatisticalProjection {
    String getCode();
    String getName();
    BigDecimal getPrice();
    String getStatus();
    String getHouseName();
    String getAcreage();
}
