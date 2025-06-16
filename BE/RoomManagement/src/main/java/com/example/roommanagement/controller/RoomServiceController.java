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

@RestController
@RequestMapping("/admin/roomService")
public class RoomServiceController {
    @Autowired
    private RoomServiceDetailService roomServiceDetailService;
    @GetMapping("/getAll")
    public ResponseEntity<List<FindAllRoomServiceDetail>> getAll(){
        List<FindAllRoomServiceDetail> list = roomServiceDetailService.getAll();
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
