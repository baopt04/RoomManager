package com.example.roommanagement.dto.request.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FindAllServiceDTO {
    private Long stt;
    private String id;
    private String code;
    private String name;
    private BigDecimal wifi;
    private BigDecimal parking;
    private BigDecimal elevator;
    private BigDecimal generalService;
    private BigDecimal price;
    private String unitOfMeasure;
    private String description;
    private String room;
}
