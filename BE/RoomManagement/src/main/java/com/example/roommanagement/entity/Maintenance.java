package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusMaintenance;
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
@Table(name = "maintenance")
@Builder
public class Maintenance extends BaseEntity {
    private String code;
    private String name;
    @Column(name = "data_request")
    private Date dataRequest;
    @Column(name = "data_complete")
    private Date dataComplete;
    private String description;
    private BigDecimal expense;
    @Enumerated(EnumType.STRING)
    private StatusMaintenance  statusMaintenance;
    @ManyToOne
    @JoinColumn(name = "id_room" , referencedColumnName = "id")
    private Room room;

}
