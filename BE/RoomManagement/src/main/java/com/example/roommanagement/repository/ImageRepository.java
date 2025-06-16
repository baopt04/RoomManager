package com.example.roommanagement.repository;


import com.example.roommanagement.entity.Image;
import jdk.jfr.Registered;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import com.example.roommanagement.entity.Contract;

import java.util.List;
import java.util.Optional;

@Registered
public interface ImageRepository extends JpaRepository<Image, String> {
List<Image> findByContractId(String idContract);

    @Modifying
    @Transactional
    @Query("DELETE FROM Image i WHERE i.contract.id = :contractId")
    void deleteByContractId(@Param("contractId") String contractId);

    List<Image> findByRoomId(String idRoom);


}
