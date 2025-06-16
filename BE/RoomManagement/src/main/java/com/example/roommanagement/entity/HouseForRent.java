package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusHouseForRent;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "house_for_rent")
@Builder
public class HouseForRent extends BaseEntity{
    private String code;
    private String name;
    private String address;
    private String discription;
    private BigDecimal price;
    @Enumerated(EnumType.STRING)
    private StatusHouseForRent status;
    @ManyToOne
    @JoinColumn(name = "id_host" ,referencedColumnName = "id")
    private Host host;
}
