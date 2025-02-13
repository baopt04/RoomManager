package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.contract.CreateContractDTO;
import com.example.roommanagement.dto.request.contract.FindAllContractDTO;
import com.example.roommanagement.dto.request.contract.UpdateContractDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.ContractService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/contract")
public class ContractController {
    @Autowired
    private ContractService contractService;
    @GetMapping("/getAll")
    public ResponseEntity<List<FindAllContractDTO>> getAll() {
        List<FindAllContractDTO> list = contractService.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<Reponse<CreateContractDTO>> create(@Valid @RequestBody CreateContractDTO createContractDTO) {
        Reponse<CreateContractDTO> response = contractService.create(createContractDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Reponse<UpdateContractDTO>> update(@PathVariable String id , @Valid @RequestBody UpdateContractDTO updateContractDTO) {
        Reponse<UpdateContractDTO> response = contractService.update(id, updateContractDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
