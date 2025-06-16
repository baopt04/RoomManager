package com.example.roommanagement.dto.request.car;

import com.example.roommanagement.entity.Customer;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.constant.TypeCar;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BaseCarDTO {
    private String code;
    private String licensePlate;
        private String carType;
    private String brandCar;
    private String color;
private Room room;
private Customer customer;
}
