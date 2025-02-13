package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.bill.CreateBillDTO;
import com.example.roommanagement.dto.request.bill.FindAllBillDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.BillService;
import jakarta.validation.Valid;
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
    public ResponseEntity<List<FindAllBillDTO>> getAll() {
        List<FindAllBillDTO> list = billService.findAllBills();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping("/create/{id}")
    public ResponseEntity<Reponse<CreateBillDTO>> create(@PathVariable String id , @Valid @RequestBody CreateBillDTO createBillDTO) {
        Reponse<CreateBillDTO> reponse = billService.create(id, createBillDTO);
        System.out.println("Check create bill");
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
}
