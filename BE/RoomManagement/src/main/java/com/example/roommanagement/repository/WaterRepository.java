package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.water.FindAllWaterDTO;
import com.example.roommanagement.entity.Electricity;
import com.example.roommanagement.entity.Water;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import com.example.roommanagement.dto.request.water.WaterPriceProjection;

@Repository
public interface WaterRepository extends JpaRepository<Water, String> {
    Optional<Water> findById(String id);
boolean existsByRoom_Id(String id);
    Optional<Water> findTopByRoomIdOrderByLastModifiedDateDesc(String roomId);

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
                        r.status as status ,
            r.id_room as room
            from water r
            """, nativeQuery = true)
    List<FindAllWaterDTO> findAllWaters();

    @Modifying
    @Query(value = """
            update water w set w.status = "DA_THANH_TOAN" where w.id_room = :id_room
            and w.status = "CHUA_THANH_TOAN"
            """, nativeQuery = true)
    void updateWaterStatus(@Param("id_room") String id_room);

    @Query(value = """
        select w.id_room as roomId, w.unit_price as unitPrice 
        from water w 
        inner join (
            select id_room, max(last_modified_date) as max_date 
            from water 
            where id_room in :roomIds 
            group by id_room
        ) as max_w on w.id_room = max_w.id_room and w.last_modified_date = max_w.max_date
    """, nativeQuery = true)
    List<WaterPriceProjection> findLatestUnitPricesByRoomIds(@Param("roomIds") List<String> roomIds);
}
