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
    select 
        el.id as id,
        el.number_first as numberFirst,
        el.number_last as numberLast,
        el.used_number as usedNumber,
        el.unit_price as unitPrice,
        el.total_price as totalPrice,
        el.month as month,
        el.year as year,
        el.status as status
    from electricity_history el 
    where el.id_electricity = :idElectricity
""", nativeQuery = true)
    List<FindAllElectricityAndWaterHistoryProjection> findByIdElectricity(@Param("idElectricity") String idElectricity);

}
