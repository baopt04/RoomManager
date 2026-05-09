package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.maintenance.BaseMaintenanceDTO;
import com.example.roommanagement.dto.request.maintenance.CreateMaintenanceDTO;
import com.example.roommanagement.dto.request.maintenance.FindAllMaintencanceDTO;
import com.example.roommanagement.dto.request.maintenance.UpdateMaintenanceDTO;
import com.example.roommanagement.entity.Maintenance;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.MaintencanceService;
import jakarta.validation.Valid;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/admin/mainten")
public class MaintencanceController {
    @Autowired
    private MaintencanceService maintencanceService;
    @GetMapping("/getAll")
    public ResponseEntity<Page<FindAllMaintencanceDTO>> getAllMaintencance(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FindAllMaintencanceDTO> list = maintencanceService.findAllMaintencance(pageable);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<CreateMaintenanceDTO> create(@Valid @RequestBody CreateMaintenanceDTO createMaintenanceDTO) {
        CreateMaintenanceDTO reponse = maintencanceService.create(createMaintenanceDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<UpdateMaintenanceDTO> update(@PathVariable String id, @Valid @RequestBody UpdateMaintenanceDTO updateMaintenanceDTO) {
        UpdateMaintenanceDTO reponse = maintencanceService.update(id, updateMaintenanceDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<BaseMaintenanceDTO> detail(@PathVariable String id) {
        BaseMaintenanceDTO reponse = maintencanceService.detail(id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        maintencanceService.deleteById(id);
        return new ResponseEntity<>("Xóa thành công", HttpStatus.OK);
    }
}
