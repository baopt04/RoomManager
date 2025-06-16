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
    private BigDecimal price;
    @Column(name = "unit_of_measure")
    private String unitOfMeasure;
    @Column(name = "discription")
    private String discription;

}
