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
@Table(name = "image")
@Builder
public class Image extends BaseEntity {
    private String name;
    @ManyToOne
    @JoinColumn(name = "id_contract" , referencedColumnName = "id")
    private Contract contract;
    @ManyToOne
    @JoinColumn(name = "id_room" , referencedColumnName = "id")
    private Room room;
}
