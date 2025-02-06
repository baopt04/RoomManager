package com.example.roommanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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

}
