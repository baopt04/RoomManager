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
import java.util.Collections;
import java.util.List;
import java.util.Map;
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
        return mapToResponses(rooms);
    }

    @Override
    public RoomCustomerResponse getRoomDetailForCustomer(String id) {
        Room room = roomCustomerRepository.findById(id).orElse(null);
        if (room == null || !room.getStatus().equals(StatusRoom.TRONG)) {
            return null;
        }
        List<RoomCustomerResponse> responses = mapToResponses(List.of(room));
        return responses.isEmpty() ? null : responses.get(0);
    }

    @Override
    public List<RoomCustomerResponse> searchRoomsByAddress(String address) {
        List<Room> rooms = roomCustomerRepository.searchByAddress(address, StatusRoom.TRONG);
        return mapToResponses(rooms);
    }

    private List<RoomCustomerResponse> mapToResponses(List<Room> rooms) {
        if (rooms.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> roomIds = rooms.stream().map(Room::getId).collect(Collectors.toList());

        Map<String, List<String>> imagesMap = imageRepository.findByRoomIdIn(roomIds).stream()
                .filter(img -> img.getRoom() != null)
                .collect(Collectors.groupingBy(img -> img.getRoom().getId(), Collectors.mapping(Image::getName, Collectors.toList())));

        Map<String, BigDecimal> electricityMap = electricityRepository.findLatestUnitPricesByRoomIds(roomIds).stream()
                .collect(Collectors.toMap(
                        com.example.roommanagement.dto.request.electricity.ElectricityPriceProjection::getRoomId,
                        com.example.roommanagement.dto.request.electricity.ElectricityPriceProjection::getUnitPrice,
                        (price1, price2) -> price1
                ));

        Map<String, BigDecimal> waterMap = waterRepository.findLatestUnitPricesByRoomIds(roomIds).stream()
                .collect(Collectors.toMap(
                        com.example.roommanagement.dto.request.water.WaterPriceProjection::getRoomId,
                        com.example.roommanagement.dto.request.water.WaterPriceProjection::getUnitPrice,
                        (price1, price2) -> price1
                ));

        return rooms.stream().map(room -> RoomCustomerResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .slug(room.getSlug())
                .price(room.getPrice())
                .acreage(room.getAcreage())
                .peopleMax(room.getPeopleMax())
                .description(room.getDecription())
                .status(room.getStatus())
                .type(room.getType())
                .images(imagesMap.getOrDefault(room.getId(), Collections.emptyList()))
                .electricUnitPrice(electricityMap.getOrDefault(room.getId(), BigDecimal.ZERO))
                .waterUnitPrice(waterMap.getOrDefault(room.getId(), BigDecimal.ZERO))
                .lastModifiedDate(room.getLastModifiedDate())
                .build()).collect(Collectors.toList());
    }
}
