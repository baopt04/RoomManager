package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.respon.RoomCustomerResponse;
import com.example.roommanagement.entity.Electricity;
import com.example.roommanagement.entity.Image;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.entity.Water;
import com.example.roommanagement.infrastructure.constant.StatusRoom;
import com.example.roommanagement.repository.ElectricityRepository;
import com.example.roommanagement.repository.ImageRepository;
import com.example.roommanagement.repository.RoomCustomerRepository;
import com.example.roommanagement.repository.WaterRepository;
import com.example.roommanagement.service.RoomCustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomCustomerServiceImpl implements RoomCustomerService {

    private final RoomCustomerRepository roomCustomerRepository;
    private final ImageRepository imageRepository;
    private final ElectricityRepository electricityRepository;
    private final WaterRepository waterRepository;

    @Override
    public List<RoomCustomerResponse> getAllRoomsForCustomer() {
        List<Room> rooms = roomCustomerRepository.findAllByStatus(StatusRoom.TRONG);
        return rooms.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public RoomCustomerResponse getRoomDetailForCustomer(String id) {
        Room room = roomCustomerRepository.findById(id).orElse(null);
        if (room == null || !room.getStatus().equals(StatusRoom.TRONG)) {
            return null;
        }
        return mapToResponse(room);
    }

    @Override
    public List<RoomCustomerResponse> searchRoomsByAddress(String address) {
        List<Room> rooms = roomCustomerRepository.searchByAddress(address, StatusRoom.TRONG);
        return rooms.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private RoomCustomerResponse mapToResponse(Room room) {
        List<String> images = imageRepository.findByRoomId(room.getId())
                .stream()
                .map(Image::getName)
                .collect(Collectors.toList());

        BigDecimal electricPrice = electricityRepository.findTopByRoomIdOrderByLastModifiedDateDesc(room.getId())
                .map(Electricity::getUnitPrice)
                .orElse(BigDecimal.ZERO);

        BigDecimal waterPrice = waterRepository.findTopByRoomIdOrderByLastModifiedDateDesc(room.getId())
                .map(Water::getUnitPrice)
                .orElse(BigDecimal.ZERO);

        return RoomCustomerResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .slug(room.getSlug())
                .price(room.getPrice())
                .acreage(room.getAcreage())
                .peopleMax(room.getPeopleMax())
                .description(room.getDecription())
                .status(room.getStatus())
                .type(room.getType())
                .images(images)
                .electricUnitPrice(electricPrice)
                .waterUnitPrice(waterPrice)
                .lastModifiedDate(room.getLastModifiedDate())
                .build();
    }
}
