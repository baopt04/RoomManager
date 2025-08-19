package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.contract.ContractHistoryProjection;
import com.example.roommanagement.dto.request.contract.FindAllContractDTO;
import com.example.roommanagement.entity.ContractHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractHistoryRepository extends JpaRepository<ContractHistory , String> {
    Optional<ContractHistory> findByRoomId(String idRoom);

    @Query(value = """
            SELECT 
             ROW_NUMBER() over (order by r.last_modified_date desc ) as stt ,
             r.id as id ,
             r.date_start as dateStart ,
             r.date_end as dateEnd , 
             r.contract_deposit as contractDeponsit ,
             r.next_due_date as nextDueDate ,
             r.status as status ,
             r.discription as discription ,
             r.id_room as room ,
             r.id_house_for_rent as houseForRent ,
             r.id_customer as customer
             FROM contract_history r where id_contract = :id_contract
            """, nativeQuery = true)
    List<ContractHistoryProjection> getAllContractHistory(@RequestParam("id_contract")String id_contract);

}
