package com.example.roommanagement.dto.request.room;

import com.example.roommanagement.infrastructure.constant.StatusRoom;
import jakarta.annotation.security.DenyAll;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FindAllRoomDTO {
    private Long stt;
    private String id;
    private String code;
    private String name;
    private BigDecimal price;
    private String acreage;
    private Integer peopleMax;
    private String description;
    private String type;
    private String status;
    private String customer;
    private String houseForRent;
}
