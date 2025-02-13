package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.room.CreateRoomDTO;
import com.example.roommanagement.dto.request.room.FindAllRoomDTO;
import com.example.roommanagement.dto.request.room.ListPriceRoom;
import com.example.roommanagement.dto.request.room.UpdateRoomDTO;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.RoomRepository;
import com.example.roommanagement.service.RoomService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomServiceImpl implements RoomService {
    @Override
    public List<FindAllRoomDTO> findAllRooms() {
        return roomRepository.findRoom();
    }

    @Override
    public Reponse<CreateRoomDTO> createRoom(CreateRoomDTO createRoomDTO) {
        Room room = Room.builder()
                .code(generate.generateCodeRoom())
                .name(createRoomDTO.getName())
                .price(createRoomDTO.getPrice())
                .acreage(createRoomDTO.getAcreage())
                .peopleMax(createRoomDTO.getPeopleMax())
                .description(createRoomDTO.getDescription())
                .status(createRoomDTO.getStatus())
                .houseForRent(createRoomDTO.getRoomHouseForRent())
                .customer(createRoomDTO.getRoomCustomer())
                .build();
        roomRepository.save(room);
        return new Reponse<>(200 , Constrants.CREATE , createRoomDTO);
    }

    @Override
    public Reponse<UpdateRoomDTO> updateRoom(String id, UpdateRoomDTO updateRoomDTO) {
        Optional<Room> optionalRoom = roomRepository.findById(id);
        if (!optionalRoom.isPresent()) {
            return new Reponse<>(400 , Constrants.NOT_FOUND , updateRoomDTO);
        }
        Room room = optionalRoom.get();
        room.setName(updateRoomDTO.getName());
        room.setAcreage(updateRoomDTO.getAcreage());
        room.setPeopleMax(updateRoomDTO.getPeopleMax());
        room.setDescription(updateRoomDTO.getDescription());
        room.setStatus(updateRoomDTO.getStatus());
        room.setHouseForRent(updateRoomDTO.getRoomHouseForRent());
        room.setCustomer(updateRoomDTO.getRoomCustomer());
        roomRepository.save(room);
        return new Reponse<>(200 , Constrants.UPDATE , updateRoomDTO);
    }

    @Override
    public Reponse<FindAllRoomDTO> findCustomerAndHouseForRent(String customer, String houseForRent) {
        if (customer == null && customer.isEmpty() || houseForRent == null && houseForRent.isEmpty()) {
            return new Reponse<>(400 , Constrants.FIND_NULL , null);
        }
        FindAllRoomDTO find = roomRepository.getCustomerAndHouseForRent(customer, houseForRent);
        if(find == null) {
            return new Reponse<>(400 , Constrants.NOT_FOUND , null);
        }
        return new Reponse<>(200 , Constrants.GET_SUCCESS , find);
    }



    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private Generate generate;

}
