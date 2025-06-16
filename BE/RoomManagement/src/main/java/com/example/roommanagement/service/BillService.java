package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.bill.*;
import com.example.roommanagement.dto.request.billDetail.BillDetailProjection;
import com.example.roommanagement.entity.Bill;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface BillService {
    List<FindAllBillProjection> findAllBills();
    List<FindAllBillProjection> findAllBillNoCreateBills();
    Bill createBill(String id);
    CreateBillDTO createBillForCustomer(String id , CreateBillDTO request);
    UpdateBillDTO updateBillForCustomer(String id , UpdateBillDTO request);
    List<BillDetailProjection> findAllBillDetails();
    FindAllBillProjection detailBill(String id);
    List<BillDetailProjection> detailBillDetail(String id);
}
