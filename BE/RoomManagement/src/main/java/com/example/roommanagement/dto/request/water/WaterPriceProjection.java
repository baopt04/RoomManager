package com.example.roommanagement.dto.request.water;

import java.math.BigDecimal;

public interface WaterPriceProjection {
    String getRoomId();
    BigDecimal getUnitPrice();
}
