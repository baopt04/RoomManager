package com.example.roommanagement.dto.respon;

import com.example.roommanagement.infrastructure.constant.StatusRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomCustomerResponse {
    private String id;
    private String name;
    private String slug;
    private BigDecimal price;
    private String acreage;
    private Integer peopleMax;
    private String description;
    private StatusRoom status;
    private String type;
    private List<String> images;
    private BigDecimal electricUnitPrice;
    private BigDecimal waterUnitPrice;
    private LocalDateTime lastModifiedDate;
}
