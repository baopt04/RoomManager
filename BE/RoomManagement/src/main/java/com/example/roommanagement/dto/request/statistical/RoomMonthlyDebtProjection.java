package com.example.roommanagement.dto.request.statistical;

public interface RoomMonthlyDebtProjection {
    Integer getMonth();
    Integer getYear();

    Double getTotalRoom();
    Double getTotalElectricity();
    Double getTotalWater();
    Double getTotalService();
    Double getTotalAll();
}
