package com.example.roommanagement.repository;

import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.constant.StatusRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface RoomCustomerRepository extends JpaRepository<Room, String> {
    @Query(value = "SELECT r FROM Room r LEFT JOIN FETCH r.customer LEFT JOIN FETCH r.houseForRent hr LEFT JOIN FETCH hr.host WHERE r.status = :status",
           countQuery = "SELECT count(r) FROM Room r WHERE r.status = :status")
    Page<Room> findAllByStatus(@Param("status") StatusRoom status, Pageable pageable);

    @Query("SELECT r FROM Room r LEFT JOIN FETCH r.customer LEFT JOIN FETCH r.houseForRent hr LEFT JOIN FETCH hr.host WHERE hr.address LIKE %:address% AND r.status = :status")
    List<Room> searchByAddress(@Param("address") String address, @Param("status") StatusRoom status);
}
