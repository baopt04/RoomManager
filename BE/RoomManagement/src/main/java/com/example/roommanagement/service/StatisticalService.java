package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.statistical.*;

import java.util.List;

public interface StatisticalService {
    FindAllStatisticalProjection getTotalPriceStatisical();
    List<RoomRevenueProjection> getTotalPriceStatisicalMother();
    TotalRevenueProjection getTotalRevenueStatisical();
    List<RoomMonthlyDebtProjection> getRoomMonthlyDebtDetails();
    List<MonthlyTotalDTO> getTotalPriceForMonth();
}
