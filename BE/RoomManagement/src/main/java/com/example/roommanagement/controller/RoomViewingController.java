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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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
    public ResponseEntity<Page<RoomViewingResponse>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(roomViewingService.getAll(pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RoomViewingResponse>> getByStatus(
            @PathVariable StatusRoomViewing status) {
        return ResponseEntity.ok(roomViewingService.getByStatus(status));
    }
}
