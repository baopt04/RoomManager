package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusContract;
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
        name = "contract",
        indexes = {
                @Index(name = "idx_contract_room_status", columnList = "id_room,status"),
                @Index(name = "idx_contract_customer_status", columnList = "id_customer,status")
        }
)
@Builder

public class Contract extends BaseEntity {
    private String code;
    @Column(name = "date_start")
    private Date dateStart;
    @Column(name = "date_end")
    private Date dateEnd;
    @Column(name = "contract_deposit")
    private BigDecimal contractDeponsit;
    @Column(name = "next_due_date")
    private Date nextDueDate;
    @Enumerated(EnumType.STRING)
    private StatusContract status;
    @Column(name = "discription")
    private String description;
    @OneToOne
    @JoinColumn(name = "id_room" , referencedColumnName = "id")
    private Room room;
    @OneToOne
    @JoinColumn(name = "id_house_for_rent" , referencedColumnName = "id")
    private HouseForRent houseForRent;
    @ManyToOne
    @JoinColumn(name = "id_admin" , referencedColumnName = "id")
    private Admin admin;
    @ManyToOne
    @JoinColumn(name = "id_customer" , referencedColumnName = "id")
    private Customer customer;


}
