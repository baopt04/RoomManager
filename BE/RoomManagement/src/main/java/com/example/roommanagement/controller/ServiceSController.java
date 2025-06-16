package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.service.BaseServiceDTO;
import com.example.roommanagement.dto.request.service.CreateServiceDTO;
import com.example.roommanagement.dto.request.service.FindAllServiceDTO;
import com.example.roommanagement.dto.request.service.UpdateServiceDTO;
import com.example.roommanagement.service.ServiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/service")
public class ServiceSController {
    @Autowired
    private ServiceService serviceService;
    @GetMapping("/getAll")
    public ResponseEntity<List<FindAllServiceDTO>> getAllServices() {
        List<FindAllServiceDTO> list = serviceService.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<CreateServiceDTO> create(@Valid @RequestBody CreateServiceDTO createServiceDTO) {
        CreateServiceDTO response = serviceService.create(createServiceDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<UpdateServiceDTO> update(@PathVariable String id, @Valid @RequestBody UpdateServiceDTO updateServiceDTO) {
        UpdateServiceDTO response = serviceService.update(id, updateServiceDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<BaseServiceDTO> detail(@PathVariable String id) {
        BaseServiceDTO baseServiceDTO = serviceService.detail(id);
        return new ResponseEntity<>(baseServiceDTO, HttpStatus.OK);
    }
}
