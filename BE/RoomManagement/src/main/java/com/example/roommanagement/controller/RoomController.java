package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.room.CreateRoomDTO;
import com.example.roommanagement.dto.request.room.FindAllRoomDTO;
import com.example.roommanagement.dto.request.room.ListPriceRoom;
import com.example.roommanagement.dto.request.room.UpdateRoomDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.RoomService;
import org.hibernate.annotations.processing.Find;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/room")
public class RoomController {
    @Autowired
    private RoomService roomService;
    @GetMapping("/getAll")
    public ResponseEntity<List<FindAllRoomDTO>> getAll() {
        List<FindAllRoomDTO> list = roomService.findAllRooms();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<Reponse<CreateRoomDTO>> create(@RequestBody CreateRoomDTO createRoomDTO) {
        Reponse<CreateRoomDTO> reponse = roomService.createRoom(createRoomDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Reponse<UpdateRoomDTO>> update(@PathVariable String id , @RequestBody UpdateRoomDTO updateRoomDTO) {
        Reponse<UpdateRoomDTO> reponse = roomService.updateRoom(id, updateRoomDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/getCustomerAndHouseForRent")
    public ResponseEntity<Reponse<FindAllRoomDTO>> getCustomerAndHouseForRent(@RequestParam("customer") String customer ,
                                                                              @RequestParam("houseForRent") String houseForRent) {
        Reponse<FindAllRoomDTO> reponse = roomService.findCustomerAndHouseForRent(customer, houseForRent);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }

}
