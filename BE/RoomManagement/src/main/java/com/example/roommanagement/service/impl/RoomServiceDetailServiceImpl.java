package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.roomServiceDetail.BaseRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.CreateRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.FindAllRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.UpdateRoomServiceDetail;
import com.example.roommanagement.entity.RoomService;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.repository.RoomServiceDetailRepository;
import com.example.roommanagement.service.RoomServiceDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class RoomServiceDetailServiceImpl implements RoomServiceDetailService {
    @Autowired
    private RoomServiceDetailRepository roomServiceDetailRepository;

    @Override
    public List<FindAllRoomServiceDetail> getAll() {
        return roomServiceDetailRepository.findAllRoomService()    ;
    }

    @Override
    public CreateRoomServiceDetail create(CreateRoomServiceDetail request) {
        if (roomServiceDetailRepository.existsByRoom_IdAndServiceS_Id(
                request.getRoom().getId(),
                request.getService().getId())) {
            throw new BusinessException(Constrants.HAVE_SERVICE_ROOM);
        }
        RoomService roomService = RoomService.builder()
                .serviceS(request.getService())
                .room(request.getRoom()).build();
        roomServiceDetailRepository.save(roomService);
        return request;
    }

    @Override
    public UpdateRoomServiceDetail update(String id, UpdateRoomServiceDetail request) {
       RoomService roomService = roomServiceDetailRepository.findById(id).orElseThrow(
               () -> new RuntimeException(Constrants.NOT_FOUND)
       );
       if (!roomService.getRoom().getId().equals(request.getRoom().getId()) || !roomService.getServiceS().getId().equals(request.getService().getId())) {
           if (roomServiceDetailRepository.existsByRoom_IdAndServiceS_Id(
                   request.getRoom().getId(),
                   request.getService().getId())) {
               throw new BusinessException(Constrants.HAVE_SERVICE_ROOM);
           }
       }
       roomService.setServiceS(request.getService());
       roomService.setRoom(request.getRoom());
       roomServiceDetailRepository.save(roomService);
       return request;
    }

    @Override
    public BaseRoomServiceDetail detail(String id) {
        RoomService roomService = roomServiceDetailRepository.findById(id).orElseThrow(
                () -> new RuntimeException(Constrants.NOT_FOUND)
        );
        BaseRoomServiceDetail baseRoomServiceDetail = new BaseRoomServiceDetail(
                roomService.getServiceS() ,
                roomService.getRoom()
        );
        return baseRoomServiceDetail;
    }
}
