package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.electricity.FindAllElectricityAndWaterHistoryProjection;
import com.example.roommanagement.entity.ElectricityHistory;
import com.example.roommanagement.entity.WaterHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WaterHistoryRepository extends JpaRepository<WaterHistory, String> {
    Optional<WaterHistory> findByWater_IdAndMonthAndYear(String id , Integer mother , Integer year);
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
    FROM water_history el 
    WHERE el.id_water = :idWater
""", nativeQuery = true)
    List<FindAllElectricityAndWaterHistoryProjection> findByIdElectricity(@Param("idWater") String idWater);

}
