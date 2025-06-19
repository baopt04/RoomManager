package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.electricity.FindAllElectricityAndWaterHistoryProjection;
import com.example.roommanagement.dto.request.water.BaseWaterDTO;
import com.example.roommanagement.dto.request.water.CreateWaterDTO;
import com.example.roommanagement.dto.request.water.FindAllWaterDTO;
import com.example.roommanagement.dto.request.water.UpdateWaterDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.WaterService;
import jakarta.validation.Valid;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/water")
public class WaterController {
    @Autowired
    private WaterService waterService;
    @GetMapping("/getAll")
    public ResponseEntity<List<FindAllWaterDTO>> getAll() {
        List<FindAllWaterDTO> list = waterService.findAllWater();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<CreateWaterDTO> create(@Valid  @RequestBody CreateWaterDTO createWaterDTO) {
        CreateWaterDTO reponse = waterService.create(createWaterDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<UpdateWaterDTO> update(@PathVariable String id, @Valid @RequestBody UpdateWaterDTO updateWaterDTO) {
        UpdateWaterDTO reponse = waterService.update(id, updateWaterDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<BaseWaterDTO> detail(@PathVariable String id) {
        BaseWaterDTO reponse = waterService.detail(id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/history/{id}")
    public ResponseEntity<List<FindAllElectricityAndWaterHistoryProjection>> history(@PathVariable String id) {
        List<FindAllElectricityAndWaterHistoryProjection> list = waterService.getAllHistoryWater(id);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
