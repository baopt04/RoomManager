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
import com.example.roommanagement.dto.request.electricity.ElectricityPriceProjection;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Repository
public interface ElectricityRepository extends CrudRepository<Electricity, String> {
    Optional<Electricity> findById(String id);
    boolean existsByRoom_Id(String id);
    Optional<Electricity> findTopByRoomIdOrderByLastModifiedDateDesc(String roomId);

    @Query(value = """
            select 
            row_number() over(order by r.last_modified_date desc ) as stt ,
                        r.id as id,
            r.code as code ,
            r.number_first as numberFirst ,
            r.number_last as numberLast ,
            r.unit_price as unitPrice ,
            r.data_close as dataClose ,
            r.total_price as totalPrice ,
                        r.mother as mother ,
                                    r.year as year ,
                        r.status as stautus,
            r.id_room as room
            from electricity r
            """, nativeQuery = true)
    List<FindAllElectricityDTO> findAllElectricity();

    @Modifying
    @Query(value = """
            update electricity e set e.status = "DA_THANH_TOAN" where e.id_room =:id_room
             and e.status = "CHUA_THANH_TOAN"
            """, nativeQuery = true)
    void updateElectricityStatus(@Param("id_room") String id_room);

    @Query(value = """
        select e.id_room as roomId, e.unit_price as unitPrice 
        from electricity e 
        inner join (
            select id_room, max(last_modified_date) as max_date 
            from electricity 
            where id_room in :roomIds 
            group by id_room
        ) as max_e on e.id_room = max_e.id_room and e.last_modified_date = max_e.max_date
    """, nativeQuery = true)
    List<ElectricityPriceProjection> findLatestUnitPricesByRoomIds(@Param("roomIds") List<String> roomIds);
}
