package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.roomViewing.RoomViewingRequest;
import com.example.roommanagement.dto.respon.roomViewing.RoomViewingResponse;
import com.example.roommanagement.infrastructure.constant.StatusRoomViewing;

import java.util.List;

public interface RoomViewingService {
    RoomViewingResponse create(RoomViewingRequest request);
    RoomViewingResponse updateStatus(String id, StatusRoomViewing status);
    List<RoomViewingResponse> getAll();
    List<RoomViewingResponse> getByStatus(StatusRoomViewing status);
}
