package com.example.roommanagement.repository;

import com.example.roommanagement.entity.Electricity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElectricityRepository extends CrudRepository<Electricity, String> {
}
