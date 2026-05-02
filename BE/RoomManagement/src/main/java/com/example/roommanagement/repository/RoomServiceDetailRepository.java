package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.roomServiceDetail.FindAllRoomServiceDetail;
import com.example.roommanagement.entity.RoomService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomServiceDetailRepository extends JpaRepository<RoomService , String> {
    @Query(value = """
            select 
            row_number() over(order by r.last_modified_date desc ) as stt ,
                        r.id as id, 
            r.id_service as service ,
            r.id_room as room
            from room_services r
            """, nativeQuery = true)
    List<FindAllRoomServiceDetail> findAllRoomService();
    boolean existsByRoom_IdAndServiceS_Id(String room_id , String service_id);

}
