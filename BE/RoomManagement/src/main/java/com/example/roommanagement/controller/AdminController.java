package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.admin.CreateAdminDTO;
import com.example.roommanagement.dto.request.admin.FindAllAdminDTO;
import com.example.roommanagement.dto.request.admin.SignIn;
import com.example.roommanagement.dto.request.admin.UpdateAdminDTO;
import com.example.roommanagement.dto.respon.AdminRespon;
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
@RequestMapping("/public")
public class AdminController {
    @Autowired
    private AdminSerive adminSerive;
    @PostMapping("/create")
    public ResponseEntity<Reponse<Admin>> create(@Valid @RequestBody CreateAdminDTO createAdminDTO) {
        Reponse<Admin> response = adminSerive.create(createAdminDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/getAll")
    public ResponseEntity<List<Admin>> getAll() {
     List<Admin> reponse =  adminSerive.findAll();
     return ResponseEntity.ok(reponse);
    }
    @PostMapping("/update/{id}")
    public ResponseEntity<Reponse<Admin>> update(@PathVariable String id, @Valid @RequestBody UpdateAdminDTO updateAdminDTO) {
        Reponse<Admin> reponse = adminSerive.update(updateAdminDTO , id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
@PostMapping("/login")
    public ResponseEntity<Reponse<SignIn>> signIn(@Valid @RequestBody SignIn signInDTO) {
        Reponse<SignIn> reponse = adminSerive.signIn(signInDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
}
@GetMapping("/getAllAdmin")
    public ResponseEntity<List<FindAllAdminDTO>> getAllAdmin() {
        List<FindAllAdminDTO> list = adminSerive.findAllAdminRespon();
        return ResponseEntity.ok(list);
}
}
