package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusBill;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bill")
@Builder
public class Bill extends BaseEntity {
    private String code;
    @Column(name = "total_price_service")
    private BigDecimal totalPriceService;
    @Column(name = "total_price_water")
    private BigDecimal totalPriceWater;
    @Column(name = "total_price_electricity")
    private BigDecimal totalPriceElectricity;
    @Column(name = "payment_date")
    private Date paymnetDate;
    @Column(name = "total_price")
    private BigDecimal totalPrice;
    @Enumerated(EnumType.STRING)
    private StatusBill status;
    @OneToOne
    @JoinColumn(name = "id_room" , referencedColumnName = "id")
    private Room room;
    @ManyToOne
    @JoinColumn(name = "id_customer", referencedColumnName = "id")
    private Customer customer;
    @ManyToOne
    @JoinColumn(name = "id_contract" , referencedColumnName = "id")
    private Contract contract;
}
