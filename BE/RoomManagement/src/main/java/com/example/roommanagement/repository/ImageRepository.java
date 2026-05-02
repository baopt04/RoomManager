package com.example.roommanagement.repository;


import com.example.roommanagement.dto.request.image.FindAllImageProjection;
import com.example.roommanagement.entity.Image;
import jdk.jfr.Registered;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.example.roommanagement.entity.Contract;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image, String> {
List<Image> findByContractId(String idContract);
    List<Image> findByRoomId(String idRoom);
    @Modifying
    @Transactional
    @Query("DELETE FROM Image i WHERE i.contract.id = :contractId")
    void deleteByContractId(@Param("contractId") String contractId);
    @Query(value = """
    select i.id , i.name , i.id_room from image i where i.id_room = :id and i.image_type = 'ROOM'
""", nativeQuery = true)
    List<FindAllImageProjection> findByRoomIdImage(@Param("id") String idRoom);



}
