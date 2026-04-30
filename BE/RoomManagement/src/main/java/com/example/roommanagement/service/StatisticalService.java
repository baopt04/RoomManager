package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.statistical.*;

import java.util.List;

public interface StatisticalService {
    FindAllStatisticalProjection getTotalPriceStatisical();
    TotalRevenueProjection getTotalPriceMonth();
    List<MonthlyTotalDTO> getTotalPriceForMonth();
    List<SearchRoomProjection> searchRoomHistoryByIdRoom(String roomId);
    List<RoomStatisticalProjection> findAllRoomStatistical();
    List<CustomerStatisticalProjection> findAllCustomerStatistical();
    List<RevenueStatisticalProjection> findAllRevenueStatistical();
}
