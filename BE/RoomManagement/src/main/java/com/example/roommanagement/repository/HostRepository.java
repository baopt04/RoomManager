package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.host.FindAllHostDTO;
import com.example.roommanagement.entity.Host;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HostRepository extends JpaRepository<Host, String> {
    boolean existsByNumberPhone(String numberPhone);

    boolean existsByEmail(String email);

    Optional<Host> findById(String id);

    @Query(value = """
            select 
            row_number() over (order by ht.last_modified_date desc ) as stt ,
            ht.id as id ,
            ht.code as code ,
            ht.name as name ,
            ht.email as email ,
            ht.number_phone as numberPhone ,
            ht.gender as gender
             from host ht 
            """, nativeQuery = true)
    List<FindAllHostDTO> findAllHosts();

    @Query(value = """
            select 
            row_number() over (order by ht.last_modified_date desc ) as stt ,
            ht.id as id ,
            ht.code as code ,
            ht.name as name ,
            ht.email as email ,
            ht.number_phone as numberPhone ,
            ht.gender as gender
             from host ht 
                        where ht.email = :email
            """, nativeQuery = true)
    FindAllHostDTO getOneHostByEmail(String email);

    @Query(value = """
            select 
            row_number() over (order by ht.last_modified_date desc ) as stt ,
            ht.id as id ,
            ht.code as code ,
            ht.name as name ,
            ht.email as email ,
            ht.number_phone as numberPhone ,
            ht.gender as gender
             from host ht 
                        where ht.number_phone = :numberPhone
            """, nativeQuery = true)
    FindAllHostDTO getOneHostByNumberPhone(String numberPhone);
}
