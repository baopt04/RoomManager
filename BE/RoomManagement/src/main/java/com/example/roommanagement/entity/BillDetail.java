package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.TypeBillDetail;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bill_detail")
@Entity
@Builder
public class BillDetail extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "id_bill", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_bill_detail_bill"))
    private Bill bill;

   @Column(name = "type")
   @Enumerated(EnumType.STRING)
    private TypeBillDetail type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private BigDecimal quantity;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    @Column
    private BigDecimal amount;
}
