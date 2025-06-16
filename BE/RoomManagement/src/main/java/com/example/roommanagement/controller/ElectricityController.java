package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.electricity.BaseElectricityDTO;
import com.example.roommanagement.dto.request.electricity.CreateElectricityDTO;
import com.example.roommanagement.dto.request.electricity.FindAllElectricityDTO;
import com.example.roommanagement.dto.request.electricity.UpdateElectricityDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.ElectricityService;
import jakarta.validation.Valid;
import org.hibernate.annotations.processing.Find;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/electricity")
public class ElectricityController {
    @Autowired
    private ElectricityService electricityService;
    @GetMapping("/getAll")
    public ResponseEntity<List<FindAllElectricityDTO>> getAll() {
        List<FindAllElectricityDTO> list = electricityService.getAllElectricity();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<CreateElectricityDTO> create(@Valid @RequestBody CreateElectricityDTO createElectricityDTO) {
        CreateElectricityDTO reponse = electricityService.create(createElectricityDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<UpdateElectricityDTO> update(@PathVariable String id , @Valid @RequestBody UpdateElectricityDTO updateElectricityDTO) {
        UpdateElectricityDTO reponse = electricityService.update(id, updateElectricityDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<BaseElectricityDTO> detail(@PathVariable String id) {
        BaseElectricityDTO baseElectricityDTO = electricityService.detail(id);
        return new ResponseEntity<>(baseElectricityDTO, HttpStatus.OK);
    }
}


