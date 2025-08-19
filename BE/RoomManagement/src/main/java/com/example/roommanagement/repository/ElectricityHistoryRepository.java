package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.electricity.FindAllElectricityAndWaterHistoryProjection;
import com.example.roommanagement.entity.ElectricityHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ElectricityHistoryRepository extends JpaRepository<ElectricityHistory , String> {
    Optional<ElectricityHistory> findByElectricity_IdAndMonthAndYear(String id , Integer mother , Integer year);
    @Query(value = """
    SELECT 
        el.id AS id,
        el.number_first AS numberFirst,
        el.number_last AS numberLast,
        el.used_number AS usedNumber,
        el.unit_price AS unitPrice,
        el.total_price AS totalPrice,
        el.month AS month,
        el.year AS year,
        el.status AS status
    FROM electricity_history el 
    WHERE el.id_electricity = :idElectricity
""", nativeQuery = true)
    List<FindAllElectricityAndWaterHistoryProjection> findByIdElectricity(@Param("idElectricity") String idElectricity);

}
