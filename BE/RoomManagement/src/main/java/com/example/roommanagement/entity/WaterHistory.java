package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusWaterEndElectric;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Table(name = "water_history")
@Entity
public class WaterHistory extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "id_water")
    private Water water;

    @Column(name = "number_first", nullable = false, precision = 10, scale = 2)
    private BigDecimal numberFirst;

    @Column(name = "number_last", nullable = false, precision = 10, scale = 2)
    private BigDecimal numberLast;

    @Column(name = "used_number", precision = 10, scale = 2, insertable = false, updatable = false)
    private BigDecimal usedNumber; // Generated column in DB

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(nullable = false)
    private int month;

    @Column(nullable = false)
    private int year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private StatusWaterEndElectric status;


}
