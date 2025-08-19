package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.admin.*;
import com.example.roommanagement.entity.Admin;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.AdminSerive;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminSerive adminSerive;
    @GetMapping("/getAll")
    public ResponseEntity<List<Admin>> getAll() {
        List<Admin> reponse = adminSerive.findAll();
        return ResponseEntity.ok(reponse);
    }
    @PostMapping("/update/{id}")
    public ResponseEntity<UpdateAdminDTO> update(@PathVariable String id, @Valid @RequestBody UpdateAdminDTO updateAdminDTO) {
      UpdateAdminDTO reponse = adminSerive.update(updateAdminDTO, id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/getAllAdmin")
    public ResponseEntity<List<FindAllAdminDTO> > getAllAdmin() {
        List<FindAllAdminDTO> list = adminSerive.findAllAdminRespon();
        return ResponseEntity.ok(list);
    }
    @PostMapping("/create")
    public ResponseEntity<CreateAdminDTO> create(@Valid @RequestBody CreateAdminDTO createAdminDTO) {
        CreateAdminDTO response = adminSerive.create(createAdminDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<AdminProjection> getAdminDetail(@PathVariable String id) {
        return new ResponseEntity<>(adminSerive.detail(id) , HttpStatus.OK);
    }
    @PostMapping("/locker-admin/{id}")
    public ResponseEntity<String> lockerAdmin(@PathVariable String id , @RequestBody LockerAdminDTO lockerAdminDTO) {
        String response = adminSerive.lockerAdmin(id , lockerAdminDTO);
        return new ResponseEntity<>(response , HttpStatus.OK);
    }
}
