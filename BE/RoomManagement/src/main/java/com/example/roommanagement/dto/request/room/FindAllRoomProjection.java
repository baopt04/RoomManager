package com.example.roommanagement.dto.request.room;

import java.math.BigDecimal;

public interface FindAllRoomProjection {
    Long getStt();

    String getId();

    String getCode();

    String getName();

    BigDecimal getPrice();

    String getAcreage();

    Integer getPeopleMax();

    String getDescription();

    String getType();

    String getStatus();

    String getCustomer();

    String getHouseForRent();
}
