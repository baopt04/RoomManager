package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.service.FindAllServiceDTO;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.entity.ServiceS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceS, String> {
    Optional<ServiceS> findById(String id);

boolean existsByName(String name);
    @Query(value = """
            select 
            row_number() over (order by r.last_modified_date desc ) as stt,
            r.id as id ,
            r.code as code ,
            r.name as name,
            r.price as price ,
            r.unit_of_measure as unitOfMeasure ,
            r.discription as discription 
             from service r 
            """, nativeQuery = true)
    List<FindAllServiceDTO> findAllServices();

}
