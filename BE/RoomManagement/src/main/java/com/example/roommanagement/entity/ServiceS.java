package com.example.roommanagement.entity;

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
@Table(name = "service")
@Builder
public class ServiceS extends BaseEntity {
    private String code;
    private String name;
    private BigDecimal wifi;
    private BigDecimal parking;
    private BigDecimal elevator;
    @Column(name = "general_service")
    private BigDecimal generalService;
    private BigDecimal price;
    @Column(name = "unit_of_measure")
    private String unitOfMeasure;

    private String discription;
    @ManyToOne
    @JoinColumn(name = "id_room" , referencedColumnName = "id")
    private Room room;
}
