package com.example.roommanagement.dto.request.room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Tổng hợp tiền phòng + điện nước + dịch vụ theo tất cả phòng thuộc một nhà trong một tháng.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseMonthlyBillingSummaryDTO {

    private String houseForRentId;
    private String houseForRentName;
    private Integer month;
    private Integer year;

    @Builder.Default
    private List<RoomMonthlyBillingDTO> rooms = new ArrayList<>();
}
