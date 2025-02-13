package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.room.CreateRoomDTO;
import com.example.roommanagement.dto.request.room.FindAllRoomDTO;
import com.example.roommanagement.dto.request.room.ListPriceRoom;
import com.example.roommanagement.dto.request.room.UpdateRoomDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface RoomService {
    List<FindAllRoomDTO> findAllRooms();
    Reponse<CreateRoomDTO> createRoom(CreateRoomDTO createRoomDTO);
    Reponse<UpdateRoomDTO> updateRoom(String id ,UpdateRoomDTO updateRoomDTO);
    Reponse<FindAllRoomDTO> findCustomerAndHouseForRent(String customer ,String houseForRent);
}
