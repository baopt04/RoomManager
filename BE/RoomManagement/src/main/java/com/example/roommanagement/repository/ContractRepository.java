package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.contract.FindAllContractDTO;
import com.example.roommanagement.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, String> {
    Optional<Contract> findById(String id);

    @Query(value = """
            SELECT 
             ROW_NUMBER() over (order by r.last_modified_date desc ) as stt ,
             r.id as id ,
             r.code as code ,
             r.date_start as dateStart ,
             r.date_end as dateEnd , 
             r.contract_deposit as contractDeponsit ,
             r.next_due_date as nextDueDate ,
             r.status as status ,
             r.discription as discription ,
             r.id_room as room ,
             r.id_house_for_rent as houseForRent ,
             r.id_admin as admin ,
             r.id_customer as customer
             FROM Contract r
            """, nativeQuery = true)
    List<FindAllContractDTO> findAllContracts();

    @Query(value = """
SELECT c.id FROM Contract c where c.id_room =:id_room
""" , nativeQuery = true)
    List<Object[]> findIdContract(@Param("id_room")String id_room);

}
