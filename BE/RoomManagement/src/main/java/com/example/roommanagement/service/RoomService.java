package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.image.FindAllImageProjection;
import com.example.roommanagement.dto.request.room.*;
import com.example.roommanagement.entity.Image;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface RoomService {
    List<FindAllRoomDTO> findAllRooms();
    CreateRoomDTO createRoom(CreateRoomDTO createRoomDTO);
    UpdateRoomDTO updateRoom(String id ,UpdateRoomDTO updateRoomDTO);
    FindAllRoomDTO findCustomerAndHouseForRent(String customer ,String houseForRent);
    BaseRoomDTO detailRoom(String id);
    List<FindAllRoomProjection> findAllRoomNoPayment(Integer mother , Integer year);
    RoomDetailProjection findTotalPriceRoom(String id);

    List<FindAllImageProjection> findAllImagesForRoom(String id);
}
