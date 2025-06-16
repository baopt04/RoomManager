package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.houseForRent.FindAllHouseForRentDTO;
import com.example.roommanagement.entity.HouseForRent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseForRentRepository extends JpaRepository<HouseForRent, String> {
    boolean existsByName(String name);

    Optional<HouseForRent> findById(String id);

    @Query(value = """
            SELECT 
             ROW_NUMBER() over (order by r.last_modified_date desc ) as stt ,
             r.id as id ,
             r.code as code , 
             r.name as name ,
             r.address as address ,
             r.discription as discription ,
            r.price as price ,
                        r.status as status ,
             r.id_host as id_host
             FROM  house_for_rent r
            """, nativeQuery = true)
    List<FindAllHouseForRentDTO> findAllHouseForRent();


    @Query(value = """
           SELECT 
            ROW_NUMBER() over (order by r.last_modified_date desc ) as stt ,
            r.id as id ,
            r.code as code , 
            r.name as name ,
            r.address as address ,
            r.discription as discription ,
            r.id_host as id_host
            FROM house_for_rent r
            WHERE 
            (:name IS NULL OR r.name LIKE %:name%) 
            AND (:address IS NULL OR r.address LIKE %:address%)
           """, nativeQuery = true)
    FindAllHouseForRentDTO findByNameAndAddress(@Param("name") String name, @Param("address") String address);

}
