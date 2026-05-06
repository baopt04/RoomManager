package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.roomServiceDetail.FindAllRoomServiceDetail;
import com.example.roommanagement.entity.RoomService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomServiceDetailRepository extends JpaRepository<RoomService , String> {
    @Query(value = """
            select 
            row_number() over(order by rs.last_modified_date desc ) as stt ,
                        rs.id as id, 
            s.name as service ,
            r.name as room
            from room_services rs
            left join room r on r.id = rs.id_room
            left join service s on s.id = rs.id_service
            """, nativeQuery = true)
    List<FindAllRoomServiceDetail> findAllRoomService();
    boolean existsByRoom_IdAndServiceS_Id(String room_id , String service_id);

    @Query("""
            SELECT DISTINCT rs FROM RoomService rs
            JOIN FETCH rs.serviceS
            JOIN FETCH rs.room
            WHERE rs.room.id IN :roomIds
            """)
    List<RoomService> findAllByRoomIdsWithServiceAndRoom(@Param("roomIds") List<String> roomIds);

}
