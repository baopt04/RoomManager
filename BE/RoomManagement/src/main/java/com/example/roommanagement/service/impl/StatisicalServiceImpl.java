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
    public List<RoomRevenueProjection> getTotalPriceStatisicalMother() {
        return statisticalRepository.getRoomRevenueDetails();
    }

    @Override
    public TotalRevenueProjection getTotalRevenueStatisical() {
        return statisticalRepository.getTotalRevenue();
    }

    @Override
    public List<RoomMonthlyDebtProjection> getRoomMonthlyDebtDetails() {
        return statisticalRepository.getMonthlyRevenueSummary();
    }

    @Override
    public List<MonthlyTotalDTO> getTotalPriceForMonth() {
        return statisticalRepository.findMonthlyTotals();
    }
}
