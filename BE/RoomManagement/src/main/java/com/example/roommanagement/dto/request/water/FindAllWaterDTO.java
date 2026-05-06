package com.example.roommanagement.dto.request.water;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FindAllWaterDTO {
    private Long stt;
    private String id;
    private String code;
    private BigDecimal numberFirst;
    private BigDecimal numberLast;
    private BigDecimal unitPrice;
    private BigDecimal dataClose;
    private BigDecimal totalPrice;
    private Integer mother;
    private Integer year;
    private String status;
    private String houseForRent;
    private String room;
}
