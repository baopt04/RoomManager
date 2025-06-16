package com.example.roommanagement.dto.request.houseForRent;

import com.example.roommanagement.entity.Host;
import com.example.roommanagement.infrastructure.constant.StatusHouseForRent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseHouseForRentDTO {
    private String code;
    private String name;
    private String address;
    private String discription;
    private BigDecimal price;
    private String status;
    private Host host;
}
