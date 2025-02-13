package com.example.roommanagement.dto.request.bill;

import com.example.roommanagement.entity.Contract;
import com.example.roommanagement.entity.Customer;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.constant.StatusBill;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseBillDTO {
    private String code;
    private BigDecimal totalPriceService;
    private BigDecimal totalPriceWater;
    private BigDecimal totalPriceElectricity;
    private Date paymentDate;
    private BigDecimal totalPrice;
    private StatusBill status;
    private Room room;
    private Customer customer;
    private Contract contract;
}
