package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.bill.CreateBillDTO;
import com.example.roommanagement.dto.request.bill.FindAllBillDTO;
import com.example.roommanagement.dto.request.bill.UpdateBillDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface BillService {
    List<FindAllBillDTO> findAllBills();
    Reponse<CreateBillDTO> create(String id_room , CreateBillDTO createBillDTO);
    Reponse<UpdateBillDTO> update(String id ,UpdateBillDTO updateBillDTO);
}
