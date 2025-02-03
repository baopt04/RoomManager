package com.example.roommanagement.repository;

import com.example.roommanagement.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenaceRepository extends JpaRepository<Maintenance , String> {
}
