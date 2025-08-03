package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.admin.*;
import com.example.roommanagement.dto.respon.AdminRespon;
import com.example.roommanagement.entity.Admin;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.AdminSerive;
import com.example.roommanagement.service.impl.RoomHistoryScheduler;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
        List<Admin> reponse = adminSerive.findAll();
        return ResponseEntity.ok(reponse);
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<Reponse<Admin>> update(@PathVariable String id, @Valid @RequestBody UpdateAdminDTO updateAdminDTO) {
        Reponse<Admin> reponse = adminSerive.update(updateAdminDTO, id);
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

    @GetMapping("/check-user")
    public ResponseEntity<String> checkUser(Principal principal) {
        if (principal != null) {
            return ResponseEntity.ok("Current user: " + principal.getName());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
    }

    @GetMapping("/getEmail")
    public ResponseEntity<Reponse<FindAllAdminDTO>> findByEmail(@RequestParam String email) {

        Reponse<FindAllAdminDTO> reponse = adminSerive.getOneEmail(email);
        return ResponseEntity.ok(reponse);
    }

    @GetMapping("/getNumberPhone")
    public ResponseEntity<Reponse<FindAllAdminDTO>> findByNumberPhone(@RequestParam String numberPhone) {
        Reponse<FindAllAdminDTO> reponse = adminSerive.getOneNumberPhone(numberPhone);
        return ResponseEntity.ok(reponse);
    }
    @Autowired
    private RoomHistoryScheduler roomHistoryScheduler;

    @GetMapping("/run-scheduler")
    public ResponseEntity<String> runSchedulerNow() {
        roomHistoryScheduler.generateRoomHistory();
        return ResponseEntity.ok("Scheduler executed!");
    }
}
