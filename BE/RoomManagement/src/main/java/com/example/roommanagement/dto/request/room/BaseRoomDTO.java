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
    private String decription;
    private String type;
    private StatusRoom status;
    private Customer customer;
    private HouseForRent houseForRent;

}
