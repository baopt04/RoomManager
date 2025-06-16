package com.example.roommanagement.dto.request.car;

import com.example.roommanagement.infrastructure.constant.TypeCar;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FindAllCarDTO   {
    private Long stt;
    private String id;
    private String code;
    private String licensePlate;
    private String type;
    private String brandCar;
    private String color;
    private String room;
    private String customer;

}
