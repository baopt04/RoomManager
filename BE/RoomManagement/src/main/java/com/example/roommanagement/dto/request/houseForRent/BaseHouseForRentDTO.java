package com.example.roommanagement.dto.request.houseForRent;

import com.example.roommanagement.entity.Host;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseHouseForRentDTO {
    private String code;
    private String name;
    private String address;
    private String discription;
    private Host host;
}
