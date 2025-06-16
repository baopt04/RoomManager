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
public class FindAllHouseForRentDTO {
    private Long stt;
    private String id;
    private String code;
    private String name;
    private String address;
    private String discription;
    private BigDecimal price;
    private String status;
    private String id_host;
}
