package com.example.roommanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "host")
@Builder
public class Host extends BaseEntity {
    private String code;
    private String name;
    @Column(name = "number_phone")
    private String numberPhone;
    private String email;
    private Boolean gender;

}
