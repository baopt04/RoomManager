package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.constant.StatusRoom;
import com.example.roommanagement.infrastructure.util.SlugUtil;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "room",
        indexes = {
                @Index(name = "idx_room_customer_status", columnList = "id_customer,status"),
                @Index(name = "idx_room_house_customer", columnList = "id_house_for_rent,id_customer"),
                @Index(name = "idx_room_status", columnList = "status")
        }
)
@Builder
public class Room extends BaseEntity {
    private String code;
    private String name;
    @Column(name = "slug")
    private String slug;
    private BigDecimal price;
    private String acreage;
    @Column(name = "people_max")
    private Integer peopleMax;
    @Column(name = "decription")
    private String decription;

    private String type;
    @Enumerated(EnumType.STRING)
    private StatusRoom status;
    @ManyToOne
    @JoinColumn(name = "id_customer" , referencedColumnName = "id" , nullable = true)
    private Customer customer;
    @ManyToOne
    @JoinColumn(name = "id_house_for_rent" , referencedColumnName = "id")
    private HouseForRent houseForRent;

    @PrePersist
    @PreUpdate
    public void generateSlug() {
        if (this.name != null) {
            this.slug = SlugUtil.toSlug(this.name);
        }
    }
}
