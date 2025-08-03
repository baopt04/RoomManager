package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusRoomHistory;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "room_history")
@Entity
public class RoomHistory extends BaseEntity{
    @Column(name = "price")
    private BigDecimal price;
    @Column(name = "start_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "dd/MM/yyyy")
    private Date startDate;
    @Column(name = "end_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "dd/MM/yyyy")
    private Date endDate;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusRoomHistory status;
    @Column(name = "is_paid")
    private Boolean isPaid;
    @ManyToOne
    @JoinColumn(name = "id_room")
    private Room room;
    @ManyToOne
    @JoinColumn(name = "id_customer")
    private Customer customer;

}
