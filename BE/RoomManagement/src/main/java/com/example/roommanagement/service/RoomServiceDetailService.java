package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.roomServiceDetail.BaseRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.CreateRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.FindAllRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.UpdateRoomServiceDetail;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoomServiceDetailService {
    Page<FindAllRoomServiceDetail> getAll(Pageable pageable);
    CreateRoomServiceDetail create(CreateRoomServiceDetail request);
    UpdateRoomServiceDetail update(String id , UpdateRoomServiceDetail request);
    BaseRoomServiceDetail detail(String id );
}
