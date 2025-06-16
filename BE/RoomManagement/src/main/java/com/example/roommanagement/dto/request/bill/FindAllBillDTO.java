package com.example.roommanagement.dto.request.bill;

import com.example.roommanagement.entity.Admin;
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

public class FindAllBillDTO {
    private Long stt;
    private String id;
    private String code;
    private BigDecimal totalRoom;
    private BigDecimal totalRoomService;
    private BigDecimal totalPriceWater;
    private BigDecimal totalPriceElectricity;
    private BigDecimal totalAmonut;
    private BigDecimal amountPaid;
    private BigDecimal electricityUsage;
    private BigDecimal waterUsage;
    private Date motherPay;
    private Date dueDate;
    private Date dateCreate;
    private String status;
    private String description;
    private Room room;
    private Customer customer;
    private Contract contract;
    private Admin admin;
}
