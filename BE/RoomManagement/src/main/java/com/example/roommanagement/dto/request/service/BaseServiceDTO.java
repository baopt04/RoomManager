package com.example.roommanagement.dto.request.service;

import com.example.roommanagement.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseServiceDTO {
    private String code;
    private String name;
    private BigDecimal wifi;
    private BigDecimal parking;
    private BigDecimal elevator;
    private BigDecimal generalService;
    private BigDecimal price;
    private String unitOfMeasure;
    private String discription;
    private Room room;
}
