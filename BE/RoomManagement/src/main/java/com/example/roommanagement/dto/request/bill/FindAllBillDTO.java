package com.example.roommanagement.dto.request.bill;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class FindAllBillDTO {
    private Long stt;
    private String id;
    private String code;
    private BigDecimal totalPriceService;
    private BigDecimal totalPriceWater;
    private BigDecimal totalPriceElectricity;
    private Date paymentDate;
    private BigDecimal totalPrice;
    private String status;
    private String room;
    private String customer;
    private String contract;
}
