package com.example.roommanagement.service;

import com.example.roommanagement.dto.respon.RoomCustomerResponse;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoomCustomerService {
    Page<RoomCustomerResponse> getAllRoomsForCustomer(Pageable pageable);
    RoomCustomerResponse getRoomDetailForCustomer(String id);
    List<RoomCustomerResponse> searchRoomsByAddress(String address);
}
