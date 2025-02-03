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
@Table(name = "electricity")
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
    @OneToOne
    @JoinColumn(name = "id_room")
    private Room room;
}
