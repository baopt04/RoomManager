package com.example.roommanagement.repository;

import com.example.roommanagement.entity.RoomViewing;
import com.example.roommanagement.infrastructure.constant.StatusRoomViewing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomViewingRepository extends JpaRepository<RoomViewing, String> {
    List<RoomViewing> findByStatusOrderByCreateDateDesc(StatusRoomViewing status);
    List<RoomViewing> findAllByOrderByCreateDateDesc();
}
