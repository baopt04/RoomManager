package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.statistical.*;
import com.example.roommanagement.service.StatisticalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/getTotalPriceMonth")
    public ResponseEntity<TotalRevenueProjection> getTotalPriceMonth() {
        TotalRevenueProjection reponse = statisticalService.getTotalPriceMonth();
        return ResponseEntity.ok(reponse);
    }

    @GetMapping("/list/getTotalPriceForMonth")
    public ResponseEntity<List<MonthlyTotalDTO>> getTotalPriceForMonth() {
        List<MonthlyTotalDTO> response = statisticalService.getTotalPriceForMonth();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/searchRoomHistoryByIdRoom/{roomId}")
    public ResponseEntity<List<SearchRoomProjection>> searchRoomHistoryByIdRoom(@PathVariable String roomId) {
        List<SearchRoomProjection> response = statisticalService.searchRoomHistoryByIdRoom(roomId);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/all-room")
    public ResponseEntity<List<RoomStatisticalProjection>> findAllRoomStatistical() {
        List<RoomStatisticalProjection> response = statisticalService.findAllRoomStatistical();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/all-customer")
    public ResponseEntity<List<CustomerStatisticalProjection>> findAllCustomerStatistical() {
        List<CustomerStatisticalProjection> response = statisticalService.findAllCustomerStatistical();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/revenue-by-room")
    public ResponseEntity<List<RevenueStatisticalProjection>> findAllRevenueStatistical() {
        List<RevenueStatisticalProjection> response = statisticalService.findAllRevenueStatistical();
        return ResponseEntity.ok(response);
    }

}
