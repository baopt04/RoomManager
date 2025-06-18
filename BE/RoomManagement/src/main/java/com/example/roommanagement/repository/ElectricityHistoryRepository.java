package com.example.roommanagement.repository;

import com.example.roommanagement.entity.ElectricityHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElectricityHistoryRepository extends JpaRepository<ElectricityHistory , String> {
}
