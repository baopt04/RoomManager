package com.example.roommanagement.dto.request.maintenance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FindAllMaintencanceDTO {
    private Long stt;
    private String id;
    private String code;
    private String name;
    private Date dataRequest;
    private Date dataComplete;
    private String description;
    private BigDecimal expense;
    private String status;
    private String room;
    private String houseForRent;
}
