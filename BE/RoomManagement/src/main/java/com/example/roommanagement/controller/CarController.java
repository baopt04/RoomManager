package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.car.BaseCarDTO;
import com.example.roommanagement.dto.request.car.CreateCarDTO;
import com.example.roommanagement.dto.request.car.FindAllCarDTO;
import com.example.roommanagement.dto.request.car.UpdateCarDTO;
import com.example.roommanagement.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/admin/car")
public class CarController {
    @Autowired
    private CarService carService;
    @GetMapping("/getAll")
    public ResponseEntity<Page<FindAllCarDTO>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FindAllCarDTO> list = carService.findAllCars(pageable);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<CreateCarDTO> create(@RequestBody CreateCarDTO createCarDTO) {
        CreateCarDTO createCarDTO1 = carService.create(createCarDTO);
        return new ResponseEntity<>(createCarDTO1, HttpStatus.CREATED);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<UpdateCarDTO> update(@PathVariable String id , @RequestBody UpdateCarDTO updateCarDTO) {
        UpdateCarDTO updateCarDTO1 = carService.update(id, updateCarDTO);
        return new ResponseEntity<>(updateCarDTO1, HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<BaseCarDTO> detail(@PathVariable String id) {
        BaseCarDTO baseCarDTO = carService.detail(id);
        return new ResponseEntity<>(baseCarDTO, HttpStatus.OK);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        carService.delete(id);
        return new ResponseEntity<>("Delete success", HttpStatus.OK);
    }
}
