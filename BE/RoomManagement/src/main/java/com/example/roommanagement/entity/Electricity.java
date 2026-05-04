package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusWaterEndElectric;
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
@Table(
        name = "electricity",
        indexes = {
                @Index(name = "idx_electricity_room", columnList = "id_room"),
                @Index(name = "idx_electricity_month_year", columnList = "mother,year"),
                @Index(name = "idx_electricity_room_status_month_year", columnList = "id_room,status,mother,year")
        }
)
@Builder
public class Electricity extends BaseEntity {
    private String code;
    @Column(name = "number_first")
    private BigDecimal numberFirst;
    @Column(name = "number_last")
    private BigDecimal numberLast;
    @Column(name = "unit_price")
    private BigDecimal unitPrice;
    @Column(name = "data_close")
    private BigDecimal dataClose;
    @Column(name = "total_price")
    private BigDecimal totalPrice;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusWaterEndElectric status;
    @Column(name = "mother")
    private Integer mother;
    @Column(name = "year")
    private Integer year;
    @ManyToOne
    @JoinColumn(name = "id_room")
    private Room room;
}
