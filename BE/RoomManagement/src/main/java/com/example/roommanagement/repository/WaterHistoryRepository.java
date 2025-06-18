package com.example.roommanagement.repository;

import com.example.roommanagement.entity.WaterHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterHistoryRepository extends JpaRepository<WaterHistory, String> {
}
