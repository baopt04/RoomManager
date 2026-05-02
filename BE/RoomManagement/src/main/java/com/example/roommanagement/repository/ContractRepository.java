package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.contract.FindAllContractDTO;
import com.example.roommanagement.entity.Contract;
import com.example.roommanagement.infrastructure.constant.StatusContract;
import com.example.roommanagement.infrastructure.constant.StatusRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, String> {
    Optional<Contract> findById(String id);
    boolean existsByRoom_Id(String roomId);
    boolean existsByRoom_IdAndIdNot(String roomId, String id);
    @Query(value = """
            select 
             row_number() over (order by r.last_modified_date desc ) as stt ,
             r.id as id ,
             r.code as code ,
             r.date_start as dateStart ,
             r.date_end as dateEnd , 
             r.contract_deposit as contractDeponsit ,
             r.next_due_date as nextDueDate ,
             r.status as status ,
             r.discription as discription ,
             rm.name as room ,
             h.name as houseForRent ,
             adm.name as admin ,
             c.name as customer
             from contract r
             left join room rm on rm.id = r.id_room
             left join house_for_rent h on h.id = r.id_house_for_rent
             left join admin adm on adm.id = r.id_admin
             left join customer c on c.id = r.id_customer
            """, nativeQuery = true)
    List<FindAllContractDTO> findAllContracts();

    @Query(value = """
select c.id from contract c where c.id_room =:id_room
""" , nativeQuery = true)
    List<Object[]> findIdContract(@Param("id_room")String id_room);

    Optional<Contract> findTopByRoomIdOrderByLastModifiedDateDesc(String roomId);
    List<Contract>  findByStatus(StatusContract statusContract);

    @Query("SELECT c.room.status FROM Contract c WHERE c.room.id = :roomId")
    StatusRoom getRoomStatusByRoomId(@Param("roomId") String roomId);
    @Query("SELECT c FROM Contract c WHERE CAST(c.dateEnd AS date) = CAST(:date AS date)")
    List<Contract> findByDateEnd(@Param("date") Date date);

    @Query("SELECT c FROM Contract c WHERE MONTH(c.dateEnd) = :month AND YEAR(c.dateEnd) = :year")
    List<Contract> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

}
