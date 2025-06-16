package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.bill.*;
import com.example.roommanagement.dto.request.billDetail.BillDetailProjection;
import com.example.roommanagement.entity.Bill;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.BillService;
import jakarta.validation.Valid;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/bill")
public class BillController {
    @Autowired
    private BillService billService;

    @GetMapping("/getAll")
    public ResponseEntity<List<FindAllBillProjection>> getAll() {
        List<FindAllBillProjection> list = billService.findAllBills();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/getAllBillNoCreateBill")
    public ResponseEntity<List<FindAllBillProjection>> getAllBillNoCreateBill() {
        List<FindAllBillProjection> list = billService.findAllBillNoCreateBills();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/create/{id}")
    public ResponseEntity<Bill> create(@PathVariable String id) {
        Bill bill = billService.createBill(id);
        return new ResponseEntity<>(bill, HttpStatus.CREATED);
    }
@PostMapping("/saveBill/{id}")
    public ResponseEntity<CreateBillDTO> saveBill(@PathVariable String id , @RequestBody CreateBillDTO createBillDTO) {
    CreateBillDTO response = billService.createBillForCustomer(id , createBillDTO);
    return new ResponseEntity<>(response, HttpStatus.CREATED);
}

@GetMapping("/detail/{id}")
    public ResponseEntity<FindAllBillProjection> detailBill(@PathVariable String id) {
        FindAllBillProjection reponse = billService.detailBill(id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
}
@PutMapping("/update/{id}")
    public ResponseEntity<UpdateBillDTO> update(@PathVariable String id, @RequestBody UpdateBillDTO updateBillDTO) {
        UpdateBillDTO reponse = billService.updateBillForCustomer(id, updateBillDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
}

}
