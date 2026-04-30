package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusRoomViewing;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "room_viewing")
@Builder
public class RoomViewing extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_room", nullable = false)
    private Room room;

    @Column(name = "view_date")
    private LocalDateTime viewDate;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private StatusRoomViewing status;
}
