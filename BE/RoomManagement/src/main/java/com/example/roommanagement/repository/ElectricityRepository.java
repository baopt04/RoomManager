package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.electricity.FindAllElectricityDTO;
import com.example.roommanagement.dto.request.water.FindAllWaterDTO;
import com.example.roommanagement.entity.Electricity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Repository
public interface ElectricityRepository extends CrudRepository<Electricity, String> {
    Optional<Electricity> findById(String id);
    boolean existsByRoom_Id(String id);
    Optional<Electricity> findByRoomId(String roomId);

    @Query(value = """
            SELECT 
            ROW_NUMBER() over(order by r.last_modified_date desc ) as stt ,
                        r.id as id,
            r.code as code ,
            r.number_first as numberFirst ,
            r.number_last as numberLast ,
            r.unit_price as unitPrice ,
            r.data_close as dataClose ,
            r.total_price as totalPrice ,
                        r.status as stautus,
            r.id_room as room
            FROM Electricity r
            """, nativeQuery = true)
    List<FindAllElectricityDTO> findAllElectricity();

    @Modifying
    @Query(value = """
            UPDATE Electricity e set e.status = "DA_THANH_TOAN" where e.id_room =:id_room
             AND e.status = "CHUA_THANH_TOAN"
            """, nativeQuery = true)
    void updateElectricityStatus(@Param("id_room") String id_room);
}
