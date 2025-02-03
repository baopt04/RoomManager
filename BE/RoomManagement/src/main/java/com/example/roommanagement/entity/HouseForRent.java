package com.example.roommanagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "house_for_rent")
@Builder
public class HouseForRent extends BaseEntity{
    private String code;
    private String name;
    private String address;
    private String discription;
    @ManyToOne
    @JoinColumn(name = "id_host" ,referencedColumnName = "id")
    private Host host;
}
