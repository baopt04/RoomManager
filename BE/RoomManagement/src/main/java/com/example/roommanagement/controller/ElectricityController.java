package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.electricity.*;
import com.example.roommanagement.service.ElectricityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/admin/electricity")
public class ElectricityController {
    @Autowired
    private ElectricityService electricityService;
    @GetMapping("/getAll")
    public ResponseEntity<Page<FindAllElectricityDTO>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FindAllElectricityDTO> list = electricityService.getAllElectricity(pageable);
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
    @GetMapping("/history/{id}")
    public ResponseEntity<List<FindAllElectricityAndWaterHistoryProjection>> history(@PathVariable String id) {
        List<FindAllElectricityAndWaterHistoryProjection> list = electricityService.getAllHistoryElectricity(id);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}


