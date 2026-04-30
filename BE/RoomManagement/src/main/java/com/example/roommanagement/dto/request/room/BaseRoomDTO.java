package com.example.roommanagement.dto.request.room;

import com.example.roommanagement.entity.Customer;
import com.example.roommanagement.entity.HouseForRent;
import com.example.roommanagement.infrastructure.constant.StatusRoom;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class BaseRoomDTO {
    private String code;
    private String name;
    private String slug;
    private BigDecimal price;
    private String acreage;
    private Integer peopleMax;
    private String decription;
    private String type;
    private StatusRoom status;
    private String customerId;
    private String houseForRentId;
    private List<MultipartFile> images;
    private List<String> imageUrls;


}
