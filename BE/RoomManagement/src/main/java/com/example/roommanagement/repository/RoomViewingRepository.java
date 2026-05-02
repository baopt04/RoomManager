package com.example.roommanagement.repository;

import com.example.roommanagement.entity.RoomViewing;
import com.example.roommanagement.infrastructure.constant.StatusRoomViewing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomViewingRepository extends JpaRepository<RoomViewing, String> {
    @Query("SELECT rv FROM RoomViewing rv JOIN FETCH rv.room WHERE rv.status = :status ORDER BY rv.createDate DESC")
    List<RoomViewing> findByStatusWithRoom(@Param("status") StatusRoomViewing status);

    @Query("SELECT rv FROM RoomViewing rv JOIN FETCH rv.room ORDER BY rv.createDate DESC")
    List<RoomViewing> findAllWithRoom();
}
