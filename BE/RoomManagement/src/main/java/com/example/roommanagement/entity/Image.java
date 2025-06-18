package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.TypeImages;
import jakarta.persistence.*;
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
    @Column(name = "image_type")
    @Enumerated(EnumType.STRING)
    private TypeImages type;
    public Image(String name) {
        this.name = name;
    }
}
