package com.example.roommanagement.infrastructure.lister;

import com.example.roommanagement.entity.BaseEntity;
import jakarta.persistence.PrePersist;

import java.util.UUID;

public class CreatePrimaryLister {
    @PrePersist
    private void onPrePersist(BaseEntity entity) {
        entity.setId(UUID.randomUUID().toString());
    }
}
