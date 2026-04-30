package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.roomViewing.RoomViewingRequest;
import com.example.roommanagement.dto.respon.roomViewing.RoomViewingResponse;
import com.example.roommanagement.infrastructure.constant.StatusRoomViewing;
import com.example.roommanagement.service.RoomViewingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/room-viewing")
@RequiredArgsConstructor
public class RoomViewingController {

    private final RoomViewingService roomViewingService;

    @PostMapping
    public ResponseEntity<RoomViewingResponse> create(@Valid @RequestBody RoomViewingRequest request) {
        return ResponseEntity.ok(roomViewingService.create(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RoomViewingResponse> updateStatus(
            @PathVariable String id, 
            @RequestParam StatusRoomViewing status) {
        return ResponseEntity.ok(roomViewingService.updateStatus(id, status));
    }

    @GetMapping
    public ResponseEntity<List<RoomViewingResponse>> getAll() {
        return ResponseEntity.ok(roomViewingService.getAll());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RoomViewingResponse>> getByStatus(
            @PathVariable StatusRoomViewing status) {
        return ResponseEntity.ok(roomViewingService.getByStatus(status));
    }
}
