package com.example.roommanagement.dto.request.contract;

import com.example.roommanagement.entity.Admin;
import com.example.roommanagement.entity.Customer;
import com.example.roommanagement.entity.HouseForRent;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.constant.StatusContract;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseContractDTO {
    private String code;
    private Date dateStart;
    private Date dateEnd;
    private BigDecimal contractDeponsit;
    private Date nextDueDate;
    private StatusContract status;
    private String description;
    private Room room;
    private HouseForRent houseForRent;
    private Admin admin;
    private Customer customer;
}
