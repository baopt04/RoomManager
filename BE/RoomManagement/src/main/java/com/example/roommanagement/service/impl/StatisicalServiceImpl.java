package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.statistical.*;
import com.example.roommanagement.repository.StatisticalRepository;
import com.example.roommanagement.service.StatisticalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatisicalServiceImpl implements StatisticalService {
@Autowired
private StatisticalRepository statisticalRepository;
    @Override
    public FindAllStatisticalProjection getTotalPriceStatisical() {
        return statisticalRepository.getTotalSystemRevenue();
    }

    @Override
    public TotalRevenueProjection getTotalPriceMonth() {
        return statisticalRepository.getTotalRevenueForCurrentMonth();
    }


    @Override
    public List<MonthlyTotalDTO> getTotalPriceForMonth() {
        return statisticalRepository.findMonthlyTotals();
    }

    @Override
    public List<SearchRoomProjection> searchRoomHistoryByIdRoom(String roomId) {
        return statisticalRepository.findRoomDetailsByRoomId(roomId);
    }
}
