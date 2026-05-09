package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.roomServiceDetail.BaseRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.CreateRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.FindAllRoomServiceDetail;
import com.example.roommanagement.dto.request.roomServiceDetail.UpdateRoomServiceDetail;
import com.example.roommanagement.service.RoomService;
import com.example.roommanagement.service.RoomServiceDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/admin/roomService")
public class RoomServiceController {
    @Autowired
    private RoomServiceDetailService roomServiceDetailService;
    @GetMapping("/getAll")
    public ResponseEntity<Page<FindAllRoomServiceDetail>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FindAllRoomServiceDetail> list = roomServiceDetailService.getAll(pageable);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<CreateRoomServiceDetail> create(@RequestBody CreateRoomServiceDetail request){
        CreateRoomServiceDetail createRoomServiceDetail = roomServiceDetailService.create(request);
        return new ResponseEntity<>(createRoomServiceDetail, HttpStatus.CREATED);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<UpdateRoomServiceDetail> update(@PathVariable String id, @RequestBody UpdateRoomServiceDetail request){
        UpdateRoomServiceDetail updateRoomServiceDetail = roomServiceDetailService.update(id, request);
        return new ResponseEntity<>(updateRoomServiceDetail, HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<BaseRoomServiceDetail> getDetail(@PathVariable String id){
        BaseRoomServiceDetail baseRoomServiceDetail = roomServiceDetailService.detail(id);
        return new ResponseEntity<>(baseRoomServiceDetail, HttpStatus.OK);
    }
}
