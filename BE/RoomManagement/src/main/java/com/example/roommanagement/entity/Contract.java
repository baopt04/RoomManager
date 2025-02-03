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
@Table(name = "contract")
@Builder

public class Contract extends BaseEntity {
    @Column(name = "date_start")
    private Date dateStart;
    @Column(name = "date_end")
    private Date dateEnd;
    @Column(name = "contract_deponsit")
    private BigDecimal contractDeponsit;
    @Column(name = "next_due_date")
    private Date nextDueDate;
    @Enumerated(EnumType.STRING)
    private StatusContract statusContract;
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
