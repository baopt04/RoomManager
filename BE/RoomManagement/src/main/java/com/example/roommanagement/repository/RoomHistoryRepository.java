package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.room.FindAllRoomHistoryProjection;
import com.example.roommanagement.entity.RoomHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface RoomHistoryRepository extends JpaRepository<RoomHistory, String> {
    @Query(value = """
            select 
            row_number() over (order by r.last_modified_date desc) as stt ,
              r.id as id , 
              r.price as price ,
              r.start_date as startDate ,
              r.end_date as endDate ,
              r.status as status , 
              r.is_paid as isPaid ,
              r.id_customer as customer 
              from room_history r where id_room = :idRoom
            """, nativeQuery = true)
    List<FindAllRoomHistoryProjection> findAllRoomHistoryProjection(@Param("idRoom") String idRoom);

    boolean existsByRoom_IdAndStartDateAndEndDate(String roomId, Date startDate, Date endDate);
}
