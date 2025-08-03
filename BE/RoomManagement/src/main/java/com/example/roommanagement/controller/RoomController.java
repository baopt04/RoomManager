package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.image.FindAllImageProjection;
import com.example.roommanagement.dto.request.room.*;
import com.example.roommanagement.entity.Image;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.RoomService;
import org.hibernate.annotations.processing.Find;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    @PostMapping(value = "/create" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreateRoomDTO> create(@ModelAttribute CreateRoomDTO createRoomDTO) {
        CreateRoomDTO reponse = roomService.createRoom(createRoomDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @PutMapping(value = "/update/{id}" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UpdateRoomDTO> update(@PathVariable String id ,@ModelAttribute UpdateRoomDTO updateRoomDTO) {
        UpdateRoomDTO reponse = roomService.updateRoom(id, updateRoomDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/getCustomerAndHouseForRent")
    public ResponseEntity<FindAllRoomDTO> getCustomerAndHouseForRent(@RequestParam("customer") String customer ,
                                                                              @RequestParam("houseForRent") String houseForRent) {
        FindAllRoomDTO reponse = roomService.findCustomerAndHouseForRent(customer, houseForRent);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<BaseRoomDTO> detail(@PathVariable String id) {
        BaseRoomDTO reponse = roomService.detailRoom(id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/findByRoomNoPayMent")
    public ResponseEntity<List<FindAllRoomProjection>> findByRoomNoPayMent(@RequestParam("mother")Integer mother , @RequestParam("year")Integer year) {
        List<FindAllRoomProjection> list = roomService.findAllRoomNoPayment(mother , year);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @GetMapping("/findTotalPriceRoom")
    public ResponseEntity<RoomDetailProjection> findTotalPriceRoom(@RequestParam("id") String id) {
        RoomDetailProjection reponse = roomService.findTotalPriceRoom(id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/findAllImages/{id}")
    public ResponseEntity<List<FindAllImageProjection>> findAllImageForRoom(@PathVariable String id) {
        List<FindAllImageProjection> reponse = roomService.findAllImagesForRoom(id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/findAllHouseForRent")
    public ResponseEntity<List<FindAllRoomDTO>> findAllHouseForRent(
            @RequestParam(required = false) String idHouseForRent,
            @RequestParam(required = false) String idCustomer) {

        List<FindAllRoomDTO> response = roomService.findAllHouseForRentAndCustomer(idHouseForRent, idCustomer);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/findAllRoomHistory")
    public ResponseEntity<List<FindAllRoomHistoryProjection>> findAllRoomHistory(@RequestParam("idRoom")String idRoom) {
        List<FindAllRoomHistoryProjection> response = roomService.findAllRoomHistory(idRoom);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/getAllStatus")
    public ResponseEntity<List<RoomStatusCountProjection>> getAllStatus() {
        List<RoomStatusCountProjection> response = roomService.getAllStatusRoom();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
