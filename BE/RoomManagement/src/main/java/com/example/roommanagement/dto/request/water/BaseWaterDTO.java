package com.example.roommanagement.dto.request.water;

import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.constant.StatusWaterEndElectric;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseWaterDTO {
    private BigDecimal numberFirst;
    private BigDecimal numberLast;
    private BigDecimal unitPrice;
    private BigDecimal dataClose;
    private BigDecimal totalPrice;
    private StatusWaterEndElectric status;
    private Room room;
}
