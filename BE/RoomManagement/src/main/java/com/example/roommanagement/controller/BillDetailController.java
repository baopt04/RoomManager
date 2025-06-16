package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.bill.FindAllBillProjection;
import com.example.roommanagement.dto.request.billDetail.BillDetailProjection;
import com.example.roommanagement.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/billDetail")
public class BillDetailController {
    @Autowired
    private BillService billService;
    @GetMapping("/getAll")
    public ResponseEntity<List<BillDetailProjection>> getBillDetail() {
        List<BillDetailProjection> response = billService.findAllBillDetails();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<List<BillDetailProjection>> detailBill(@PathVariable String id) {
        List<BillDetailProjection> reponse = billService.detailBillDetail(id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
}
