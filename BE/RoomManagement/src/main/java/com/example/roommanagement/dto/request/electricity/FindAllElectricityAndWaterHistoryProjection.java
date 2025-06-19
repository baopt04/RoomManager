package com.example.roommanagement.dto.request.electricity;

import java.math.BigDecimal;

public interface FindAllElectricityAndWaterHistoryProjection {
    String getId();
    BigDecimal getNumberFirst();
    BigDecimal getNumberLast();
    BigDecimal getUsedNumber();
    BigDecimal getUnitPrice();
    BigDecimal getTotalPrice();
    Integer getMonth();
    Integer getYear();
    String getStatus();

}
