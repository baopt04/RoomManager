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
@Table(
        name = "bill",
        indexes = {
                @Index(name = "idx_bill_month_year_status", columnList = "mother_pay,year_pay,status"),
                @Index(name = "idx_bill_room", columnList = "id_room"),
                @Index(name = "idx_bill_customer", columnList = "id_customer"),
                @Index(name = "idx_bill_contract", columnList = "id_contract")
        }
)
@Builder
public class Bill extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "total_room")
    private BigDecimal totalRoom;

    @Column(name = "total_room_service")
    private BigDecimal totalRoomService;

    @Column(name = "total_water_service")
    private BigDecimal totalPriceWater;

    @Column(name = "total_electricity_service")
    private BigDecimal totalPriceElectricity;

    @Column(name = "total_amount")
    private BigDecimal totalAmonut;

    @Column(name = "amount_paid")
    private BigDecimal amountPaid;

    @Column(name = "electricity_usage")
    private BigDecimal electricityUsage;

    @Column(name = "water_usage")
    private BigDecimal waterUsage;

    @Column(name = "mother_pay")
    private Integer motherPay;

    @Column(name = "year_pay")
    private Integer yearPay;

    @Column(name = "paid_date")
    private Date paidDate;

    @Column(name = "due_date")
    private Date dueDate;

    @Column(name = "date_create")
    private Date dateCreate;

    @Enumerated(EnumType.STRING)
    private StatusBill status;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToOne
    @JoinColumn(name = "id_room", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_bill_room"))
    private Room room;

    @ManyToOne
    @JoinColumn(name = "id_customer", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_bill_customer"))
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "id_contract", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_bill_contract"))
    private Contract contract;

    @ManyToOne
    @JoinColumn(name = "id_admin", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_bill_admin"))
    private Admin admin;
}
