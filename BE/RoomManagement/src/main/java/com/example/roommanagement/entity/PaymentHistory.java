package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusMethod;
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
@Table(name = "payment_history")
@Entity
@Builder
public class PaymentHistory extends BaseEntity{
    @ManyToOne
    @JoinColumn(name = "id_bill", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_payment_history_bill"))
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "id_customer", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_payment_history_customer"))
    private Customer customer;

    @Column(name = "payment_date")
    private Date paymentDate;

    @Column
    private BigDecimal amount;

    @Column
    @Enumerated(EnumType.STRING)
    private StatusMethod method;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_refund")
    private Boolean isRefund = false;
}
