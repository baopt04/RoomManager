package com.example.roommanagement.controller;

import com.example.roommanagement.dto.respon.RoomCustomerResponse;
import com.example.roommanagement.service.RoomCustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer/rooms")
@RequiredArgsConstructor
public class RoomCustomerController {

    private final RoomCustomerService roomCustomerService;

    @GetMapping
    public ResponseEntity<List<RoomCustomerResponse>> getAllRooms() {
        return ResponseEntity.ok(roomCustomerService.getAllRoomsForCustomer());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomCustomerResponse> getRoomDetail(@PathVariable String id) {
        RoomCustomerResponse response = roomCustomerService.getRoomDetailForCustomer(id);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<RoomCustomerResponse>> searchByAddress(@RequestParam String address) {
        return ResponseEntity.ok(roomCustomerService.searchRoomsByAddress(address));
    }
}
