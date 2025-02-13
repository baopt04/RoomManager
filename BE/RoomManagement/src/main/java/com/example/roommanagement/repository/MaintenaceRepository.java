package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.maintenance.FindAllMaintencanceDTO;
import com.example.roommanagement.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaintenaceRepository extends JpaRepository<Maintenance, String> {
    Optional<Maintenance> findById(String id);

    @Query(value = """
            SELECT 
            ROW_NUMBER() over (order by m.last_modified_date desc) as stt,
            m.id as id ,
            m.code as code ,
            m.name as name ,
            m.data_request as dataRequest ,
            m.data_complete as dataComplete ,
            m.discription as description ,
            m.expense as expense ,
            m.status as status ,
            m.id_room as id_room 
             FROM Maintenance m
            """, nativeQuery = true)
    List<FindAllMaintencanceDTO> findAllMaintencance();
}
