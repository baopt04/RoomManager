package com.example.roommanagement.dto.request.room;

import com.example.roommanagement.entity.Customer;
import com.example.roommanagement.entity.HouseForRent;
import com.example.roommanagement.infrastructure.constant.StatusRoom;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class BaseRoomDTO {
    private String code;
    private String name;
    private BigDecimal price;
    private String acreage;
    private Integer peopleMax;
    private String description;
    private StatusRoom status;
    private Customer roomCustomer;
    private HouseForRent roomHouseForRent;

}
