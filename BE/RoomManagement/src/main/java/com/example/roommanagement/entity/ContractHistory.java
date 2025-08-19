package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusContract;
import com.example.roommanagement.infrastructure.constant.StatusContractHistory;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "contract_history")
@Entity
public class ContractHistory extends BaseEntity{
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
    @Enumerated(EnumType.STRING)
    private StatusContractHistory history_type;
    @Column(name = "discription")
    private String description;
    @ManyToOne
    @JoinColumn(name = "id_contract" , referencedColumnName = "id")
    private Contract contract;
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
