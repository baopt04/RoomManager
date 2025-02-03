package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusRoom;
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
@Table(name = "room")
@Builder
public class Room extends BaseEntity {
    private String code;
    private String name;
    private BigDecimal price;
    private String acreage;
    @Column(name = "people_max")
    private Integer peopleMax;
    private String description;
    @Enumerated(EnumType.STRING)
    private StatusRoom statusRoom;
    @ManyToOne
    @JoinColumn(name = "id_customer" , referencedColumnName = "id")
    private Customer customer;
    @ManyToOne
    @JoinColumn(name = "id_house_for_rent" , referencedColumnName = "id")
    private HouseForRent houseForRent;
}
