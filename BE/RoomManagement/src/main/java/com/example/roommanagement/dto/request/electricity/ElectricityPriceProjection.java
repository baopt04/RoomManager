package com.example.roommanagement.dto.request.electricity;

import java.math.BigDecimal;

public interface ElectricityPriceProjection {
    String getRoomId();
    BigDecimal getUnitPrice();
}
