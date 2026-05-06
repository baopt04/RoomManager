package com.example.roommanagement.dto.request.room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Dữ liệu một cột phòng trong bảng tổng hợp (xuất Excel): điện, nước, dịch vụ, tiền nhà, tổng.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomMonthlyBillingDTO {

    private String roomId;
    private String roomName;
    private BigDecimal roomPrice;
    /** Khách đang gán phòng (nếu có), để FE ghép tiêu đề cột như Excel. */
    private String customerName;
    /** Gợi ý tiêu đề cột: tên phòng [ - tên khách]. */
    private String columnTitle;

    private BigDecimal electricityNumberFirst;
    private BigDecimal electricityNumberLast;
    /** Điện sử dụng (ưu tiên số cuối − số đầu; không có thì lấy data_close). */
    private BigDecimal electricityUsed;
    /** Thành tiền điện (ưu tiên total_price). */
    private BigDecimal electricityAmount;

    private BigDecimal waterNumberFirst;
    private BigDecimal waterNumberLast;
    private BigDecimal waterUsed;
    private BigDecimal waterAmount;

    private BigDecimal elevatorFee;
    private BigDecimal wifiFee;
    /** Các dịch vụ khác (không gán vào thang máy/wifi). */
    private BigDecimal generalServiceFee;
    /** elevator + wifi + general */
    private BigDecimal totalServiceFee;

    private BigDecimal roomRent;
    private BigDecimal grandTotal;

    @Builder.Default
    private List<ServiceLineAmountDTO> serviceLines = new ArrayList<>();
}
