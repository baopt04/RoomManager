package com.example.roommanagement.dto.request.room;

import java.math.BigDecimal;
import java.util.Date;

public interface FindAllRoomHistoryProjection{
    Long getStt();
    String getId();
    BigDecimal getPrice();
    Date getStartDate();
    Date getEndDate();
    String getStatus();
    Boolean getIsPaid();
    String getCustomer();

}
