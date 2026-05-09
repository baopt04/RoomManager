package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.maintenance.FindAllMaintencanceDTO;
import com.example.roommanagement.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface MaintenaceRepository extends JpaRepository<Maintenance, String> {
    Optional<Maintenance> findById(String id);

    @Query(value = """
            select 
            row_number() over (order by m.last_modified_date desc) as stt,
            m.id as id ,
            m.code as code ,
            m.name as name ,
            m.data_request as dataRequest ,
            m.data_complete as dataComplete ,
            m.discription as description ,
            m.expense as expense ,
            m.status as status ,
            r.name as room ,
                hfr.name as houseForRent
             from maintenance m
             left join room r on r.id = m.id_room
                         left join house_for_rent hfr on hfr.id = r.id_house_for_rent
            """, countQuery = """
             select count(m.id)
             from maintenance m
             left join room r on r.id = m.id_room
                         left join house_for_rent hfr on hfr.id = r.id_house_for_rent
            """, nativeQuery = true)
    Page<FindAllMaintencanceDTO> findAllMaintencance(Pageable pageable);
    @Transactional
    @Modifying
    void deleteById(String id);

}
