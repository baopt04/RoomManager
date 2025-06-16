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
@Table(name = "room_services")
@Builder
public class RoomService extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "id_service", referencedColumnName = "id")
    private ServiceS serviceS;
    @ManyToOne
    @JoinColumn(name = "id_room", referencedColumnName = "id")
    private Room room;
}
