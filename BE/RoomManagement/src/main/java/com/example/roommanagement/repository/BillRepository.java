package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.bill.FindAllBillDTO;
import com.example.roommanagement.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, String> {
    Optional<Bill> findById(String id);

    @Query(value = """
            SELECT 
             ROW_NUMBER() over (order by b.last_modified_date desc) as stt , 
             b.id as id,
             b.code as code,
             b.total_price_service as totalPriceService ,
             b.total_price_water as totalPriceWater,
             b.total_price_electricity as totalPriceElectricity,
             b.payment_date as paymnetDate ,
             b.total_price as totalPrice,
             b.status as status ,
             b.id_room as room ,
             b.id_customer as customer ,
             b.id_contract as contract 
             FROM Bill b
            """, nativeQuery = true)
    List<FindAllBillDTO> findAllBill();



}
