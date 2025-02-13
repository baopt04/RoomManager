package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.maintenance.CreateMaintenanceDTO;
import com.example.roommanagement.dto.request.maintenance.FindAllMaintencanceDTO;
import com.example.roommanagement.dto.request.maintenance.UpdateMaintenanceDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.MaintencanceService;
import jakarta.validation.Valid;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/mainten")
public class MaintencanceController {
    @Autowired
    private MaintencanceService maintencanceService;
    @GetMapping("/getAll")
    public ResponseEntity<List<FindAllMaintencanceDTO>> getAllMaintencance() {
        List<FindAllMaintencanceDTO> list = maintencanceService.findAllMaintencance();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<Reponse<CreateMaintenanceDTO>> create(@Valid @RequestBody CreateMaintenanceDTO createMaintenanceDTO) {
        Reponse<CreateMaintenanceDTO> reponse = maintencanceService.create(createMaintenanceDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Reponse<UpdateMaintenanceDTO>> update(@PathVariable String id, @Valid @RequestBody UpdateMaintenanceDTO updateMaintenanceDTO) {
        Reponse<UpdateMaintenanceDTO> reponse = maintencanceService.update(id, updateMaintenanceDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
}
