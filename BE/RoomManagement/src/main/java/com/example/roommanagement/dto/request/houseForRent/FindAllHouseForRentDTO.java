package com.example.roommanagement.dto.request.houseForRent;

import com.example.roommanagement.entity.Host;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String id_host;
}
