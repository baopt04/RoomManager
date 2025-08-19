package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusCustomer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "customer")
@Entity
@Builder
public class Customer  extends BaseEntity{
    private String code;
    private String name;
    @Column(name = "number_phone")
    private String numberPhone;
    private String email;
    private Boolean gender;
    @Column(name = "citizen_identification")
    private String cccd;
    @Column(name = "date_of_birth")
    private Date dateOfBirth;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusCustomer status;

}
