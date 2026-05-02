package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.bill.FindAllBillDTO;
import com.example.roommanagement.dto.request.bill.FindAllBillProjection;
import com.example.roommanagement.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, String> {
    Optional<Bill> findById(String id);
boolean existsByCode(String code);
    @Query(value = """
            select 
             row_number() over (order by b.last_modified_date desc) as stt , 
             b.id as id,
             b.code as code,
                         b.total_room as totalRoom,
             b.total_room_service as totalRoomService ,
             b.total_water_service as totalPriceWater,
             b.total_electricity_service as totalPriceElectricity,
            b.total_amount as totalAmonut,
            b.amount_paid as amountPaid,   
                b.electricity_usage as electricityUsage,
                b.water_usage as waterUsage,            
                     b.mother_pay as motherPay,  
                                 b.year_pay as yearPay,
                                 b.paid_date as paidDate ,
                       b.due_date as dueDate,          
                          b.date_create as dateCreate,         
                          b.status as status,           
                             b.description as description, 
             b.id_room as room ,
             b.id_customer as customer ,
             b.id_contract as contract  ,
                         b.id_admin as admin
             from bill b
            """, nativeQuery = true)
    List<FindAllBillProjection> findAllBills();

    @Query(value = """
            select 
             row_number() over (order by b.last_modified_date desc) as stt , 
             b.id as id,
             b.code as code,
                         b.total_room as totalRoom,
             b.total_room_service as totalRoomService ,
             b.total_water_service as totalPriceWater,
             b.total_electricity_service as totalPriceElectricity,
            b.total_amount as totalAmonut,
            b.amount_paid as amountPaid,   
                b.electricity_usage as electricityUsage,
                b.water_usage as waterUsage,            
                     b.mother_pay as motherPay,  
                                 b.year_pay as yearPay,
                                 b.paid_date as paidDate ,
                       b.due_date as dueDate,          
                          b.date_create as dateCreate,         
                          b.status as status,           
                             b.description as description, 
             b.id_room as room ,
             b.id_customer as customer ,
             b.id_contract as contract  ,
                         b.id_admin as admin
             from bill b where b.id_room is null and b.id_customer is null and b.id_contract is null
            """, nativeQuery = true)
    List<FindAllBillProjection> findAllBillNoCreateBill();

    @Query(value = """
            select 
             row_number() over (order by b.last_modified_date desc) as stt , 
             b.id as id,
             b.code as code,
                         b.total_room as totalRoom,
             b.total_room_service as totalRoomService ,
             b.total_water_service as totalPriceWater,
             b.total_electricity_service as totalPriceElectricity,
            b.total_amount as totalAmonut,
            b.amount_paid as amountPaid,   
                b.electricity_usage as electricityUsage,
                b.water_usage as waterUsage,            
                     b.mother_pay as motherPay,  
                                 b.year_pay as yearPay,
                                 b.paid_date as paidDate ,
                       b.due_date as dueDate,          
                          b.date_create as dateCreate,         
                          b.status as status,           
                             b.description as description, 
                                         ph.method as meThod ,
             b.id_room as room ,
             b.id_customer as customer ,
             b.id_contract as contract  ,
                         b.id_admin as admin 
             from bill b
                         left join payment_history ph on ph.id_bill = b.id
                         where b.id = :id
            """, nativeQuery = true)
    FindAllBillProjection detailBill(@Param("id")String id);

}
