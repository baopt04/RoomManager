package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.statistical.*;
import com.example.roommanagement.service.StatisticalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/statistical")
public class StatisicalController {
    @Autowired
    private StatisticalService statisticalService;
    @GetMapping("/revenue")
    public ResponseEntity<FindAllStatisticalProjection> findAllRevenue() {
        FindAllStatisticalProjection response = statisticalService.getTotalPriceStatisical();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/list/revenueMother")
    public ResponseEntity<List<RoomRevenueProjection>> findAllListRevenueMother() {
List<RoomRevenueProjection> reponse = statisticalService.getTotalPriceStatisicalMother();
        return ResponseEntity.ok(reponse);
    }
    @GetMapping("/revenueMother")
    public ResponseEntity<TotalRevenueProjection> findAllTotalRoomMother() {
        TotalRevenueProjection reponse = statisticalService.getTotalRevenueStatisical();
        return ResponseEntity.ok(reponse);
    }
    @GetMapping("/list/getMonthlyRevenueSummary")
    public ResponseEntity<List<RoomMonthlyDebtProjection>> getMonthlyRevenueSummary() {
        List<RoomMonthlyDebtProjection> response = statisticalService.getRoomMonthlyDebtDetails();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/list/getTotalPriceForMonth")
    public ResponseEntity<List<MonthlyTotalDTO>> getTotalPriceForMonth() {
        List<MonthlyTotalDTO> response = statisticalService.getTotalPriceForMonth();
        return ResponseEntity.ok(response);
    }

}
