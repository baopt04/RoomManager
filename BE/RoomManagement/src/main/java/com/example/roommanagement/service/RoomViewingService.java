package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.roomViewing.RoomViewingRequest;
import com.example.roommanagement.dto.respon.roomViewing.RoomViewingResponse;
import com.example.roommanagement.infrastructure.constant.StatusRoomViewing;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoomViewingService {
    RoomViewingResponse create(RoomViewingRequest request);
    RoomViewingResponse updateStatus(String id, StatusRoomViewing status);
    Page<RoomViewingResponse> getAll(Pageable pageable);
    List<RoomViewingResponse> getByStatus(StatusRoomViewing status);
}
