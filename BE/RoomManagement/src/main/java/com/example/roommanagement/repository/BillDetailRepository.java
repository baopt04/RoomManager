package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.billDetail.BillDetailProjection;
import com.example.roommanagement.entity.BillDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface BillDetailRepository extends JpaRepository<BillDetail , Long> {
    @Query( value ="""
            SELECT ROW_NUMBER() over (order by bd.last_modified_date desc ) as stt ,
            bd.id as id , 
           
            bd.id_bill as billId , 
            bd.type as type ,
            bd.description as description,
            bd.quantity as quantity , 
            bd.amount as amount , 
            bd.unit_price as unitPrice 
            from bill_detail bd
            """ , nativeQuery = true)
    List<BillDetailProjection> finAllBillDetails();

    @Query( value ="""
            SELECT ROW_NUMBER() over (order by bd.last_modified_date desc ) as stt ,
            bd.id as id , 
            bd.id_bill as billId , 
            bd.type as type ,
            bd.description as description,
            bd.quantity as quantity , 
            bd.amount as amount , 
            bd.unit_price as unitPrice 
            from bill_detail bd where bd.id_bill = :id
            """ , nativeQuery = true)
    List<BillDetailProjection>   detailBillDetail(@Param("id") String id);
@Modifying
@Transactional
    void deleteBillDetailByBillId(String id);
}
