package com.example.roommanagement.dto.request.bill;

import com.example.roommanagement.entity.*;
import com.example.roommanagement.infrastructure.constant.StatusBill;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseBillDTO {
    private String code;
    private BigDecimal totalRoom;
    private BigDecimal totalRoomService;
    private BigDecimal totalPriceWater;
    private BigDecimal totalPriceElectricity;
    private BigDecimal totalAmonut;
    private BigDecimal amountPaid;
    private BigDecimal electricityUsage;
    private BigDecimal waterUsage;
    private Integer motherPay;
    private Integer yearPay;
    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "dd/MM/yyyy")
    private Date paidDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "dd/MM/yyyy")
    private Date dueDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "dd/MM/yyyy")
    private Date dateCreate;
    private StatusBill status;
    private String description;
    private String roomId;
    private String customerId;
    private String contractId;
    private Admin admin;
    @JsonProperty(defaultValue = "false")
    private Boolean isHistory;

}
