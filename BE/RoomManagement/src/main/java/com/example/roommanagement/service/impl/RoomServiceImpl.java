package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.room.*;
import com.example.roommanagement.entity.Image;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.ImageRepository;
import com.example.roommanagement.repository.RoomRepository;
import com.example.roommanagement.service.RoomService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {
    @Override
    public List<FindAllRoomDTO> findAllRooms() {
        return roomRepository.findRoom();
    }

    @Override
    public CreateRoomDTO createRoom(CreateRoomDTO createRoomDTO) {
        if (roomRepository.existsByName(createRoomDTO.getName())) {
            throw new BusinessException(Constrants.NAME_EXISTS);
        }
        Room room = Room.builder()
                .code(generate.generateCodeRoom())
                .name(createRoomDTO.getName())
                .price(createRoomDTO.getPrice())
                .acreage(createRoomDTO.getAcreage())
                .peopleMax(createRoomDTO.getPeopleMax())
                .decription(createRoomDTO.getDecription())
                .type(createRoomDTO.getType())
                .status(createRoomDTO.getStatus())
                .houseForRent(createRoomDTO.getHouseForRent())
                .customer(createRoomDTO.getCustomer())
                .build();
        roomRepository.save(room);
       return createRoomDTO;
    }

    @Override
    public UpdateRoomDTO updateRoom(String id, UpdateRoomDTO updateRoomDTO) {
        Optional<Room> optionalRoom = roomRepository.findById(id);
        if (!optionalRoom.isPresent()) {
            throw new BusinessException( Constrants.NOT_FOUND );
        }
        if (!optionalRoom.get().getName().equals(updateRoomDTO.getName())) {
            if (roomRepository.existsByName(updateRoomDTO.getName())) {
                throw new BusinessException(Constrants.NAME_EXISTS);
            }
        }
        Room room = optionalRoom.get();
        room.setName(updateRoomDTO.getName());
        room.setPrice(updateRoomDTO.getPrice());
        room.setAcreage(updateRoomDTO.getAcreage());
        room.setPeopleMax(updateRoomDTO.getPeopleMax());
        room.setDecription(updateRoomDTO.getDecription());
        room.setType(updateRoomDTO.getType());
        room.setStatus(updateRoomDTO.getStatus());
        room.setHouseForRent(updateRoomDTO.getHouseForRent());
        room.setCustomer(updateRoomDTO.getCustomer());
        roomRepository.save(room);
        return updateRoomDTO;
    }

    @Override
    public FindAllRoomDTO findCustomerAndHouseForRent(String customer, String houseForRent) {
        if (customer == null && customer.isEmpty() || houseForRent == null && houseForRent.isEmpty()) {
            throw new BusinessException(Constrants.NOT_FOUND);
        }
        FindAllRoomDTO find = roomRepository.getCustomerAndHouseForRent(customer, houseForRent);
        if(find == null) {
            throw new BusinessException(Constrants.NOT_FOUND);
        }
        return find;
    }

    @Override
    public BaseRoomDTO detailRoom(String id) {
        Optional<Room> room = roomRepository.findById(id);
        if (!room.isPresent()) {
            throw new BusinessException(Constrants.NOT_FOUND);
        }
        BaseRoomDTO baseRoomDTO = new BaseRoomDTO();
        baseRoomDTO.setCode(room.get().getCode());
        baseRoomDTO.setName(room.get().getName());
        baseRoomDTO.setPrice(room.get().getPrice());
        baseRoomDTO.setAcreage(room.get().getAcreage());
        baseRoomDTO.setPeopleMax(room.get().getPeopleMax());
        baseRoomDTO.setDecription(room.get().getDecription());
        baseRoomDTO.setType(room.get().getType());
        baseRoomDTO.setStatus(room.get().getStatus());
        baseRoomDTO.setCustomer(room.get().getCustomer());
        baseRoomDTO.setHouseForRent(room.get().getHouseForRent());
        return baseRoomDTO;
    }

    @Override
    public List<FindAllRoomProjection> findAllRoomNoPayment(Integer mother, Integer year) {
        return roomRepository.findRoomsWithoutBillInMonthAndYear(mother, year);
    }

    @Override
    public RoomDetailProjection findTotalPriceRoom(String id) {
        return roomRepository.findTotalPriceRoomDetailById(id);
    }

    @Override
    public List<Image> findAllImagesForRoom(String id) {
        return imageRepository.findByRoomId(id);

    }


    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private Generate generate;
@Autowired
    private ImageRepository imageRepository;
}
