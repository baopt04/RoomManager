package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.TypeCar;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "car")
@Entity
@Builder
public class Car extends BaseEntity{
    @ManyToOne
    @JoinColumn(name = "id_room", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_car_room"))
    private Room room;

    @ManyToOne
    @JoinColumn(name = "id_customer", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_car_customer"))
    private Customer customer;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "license_plate", nullable = false, unique = true)
    private String licensePlate;

    @Column
    private String type;

    @Column(name = "brand_car")
    private String brandCar;

    @Column
    private String color;
}
