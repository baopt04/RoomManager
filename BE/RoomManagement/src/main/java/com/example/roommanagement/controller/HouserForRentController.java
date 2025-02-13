package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.houseForRent.CreateHouseForRentDTO;
import com.example.roommanagement.dto.request.houseForRent.FindAllHouseForRentDTO;
import com.example.roommanagement.dto.request.houseForRent.UpdateHouseForRentDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.HouseForRentService;
import org.hibernate.annotations.processing.Find;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/houseForRent")
public class HouserForRentController {
    @Autowired
    private HouseForRentService houseForRentService;
    @GetMapping("/getAll")
    public ResponseEntity<List<FindAllHouseForRentDTO>> getAll() {
        List<FindAllHouseForRentDTO> list = houseForRentService.getAllHouseForRent();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<Reponse<CreateHouseForRentDTO>> create(@RequestBody CreateHouseForRentDTO createHouseForRentDTO) {
        Reponse<CreateHouseForRentDTO> create = houseForRentService.create(createHouseForRentDTO);
        return new ResponseEntity<>(create, HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Reponse<UpdateHouseForRentDTO>> update(@PathVariable String id ,@RequestBody UpdateHouseForRentDTO updateHouseForRentDTO) {
        Reponse<UpdateHouseForRentDTO> update = houseForRentService.update(id, updateHouseForRentDTO);
        return new ResponseEntity<>(update, HttpStatus.OK);
    }
    @GetMapping("/getNameAndAddress")
    public ResponseEntity<Reponse<FindAllHouseForRentDTO>> getNameAndPhone(@RequestParam(name = "name") String name , @RequestParam(name = "address") String address) {
        Reponse<FindAllHouseForRentDTO> search = houseForRentService.findByNameAndAddress(name, address);
        return new ResponseEntity<>(search, HttpStatus.OK);
    }
}
