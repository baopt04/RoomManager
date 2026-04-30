package com.example.roommanagement.dto.request.maintenance;

import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.constant.StatusMaintenance;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseMaintenanceDTO {
    private String code;
    private String name;
    private Date dataRequest;
    private Date dataComplete;
    private String description;
    private BigDecimal expense;
    private StatusMaintenance status;
    private Room room;

}
