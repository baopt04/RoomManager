package com.example.roommanagement.dto.request.statistical;

import java.math.BigDecimal;

public interface SearchRoomProjection {
    String getRoomId();
    String getWaterId();
    String getElectricityId();
    String getRoomHistoryId();
    String getServiceId();
    String getServiceName();
    BigDecimal getServicePrice();
}
