package com.example.roommanagement.service;

import com.example.roommanagement.dto.respon.RoomCustomerResponse;

import java.util.List;

public interface RoomCustomerService {
    List<RoomCustomerResponse> getAllRoomsForCustomer();
    RoomCustomerResponse getRoomDetailForCustomer(String id);
    List<RoomCustomerResponse> searchRoomsByAddress(String address);
}
