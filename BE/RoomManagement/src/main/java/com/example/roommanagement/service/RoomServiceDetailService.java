package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.roomServiceDetail.BaseRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.CreateRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.FindAllRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.UpdateRoomServiceDetail;

import java.util.List;

public interface RoomServiceDetailService {
    List<FindAllRoomServiceDetail> getAll();
    CreateRoomServiceDetail create(CreateRoomServiceDetail request);
    UpdateRoomServiceDetail update(String id , UpdateRoomServiceDetail request);
    BaseRoomServiceDetail detail(String id );
}
