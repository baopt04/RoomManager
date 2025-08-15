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
public class PublicController {
    @Autowired
    private AdminSerive adminSerive;

    @PostMapping("/login")
    public ResponseEntity<SignIn> signIn(@Valid @RequestBody SignIn signInDTO) {
        SignIn reponse = adminSerive.signIn(signInDTO);
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
    @PostMapping("/change-password/{email}")
    public ResponseEntity<Admin> changePassword(@PathVariable String email, @RequestBody ChangePassword changePassword){
        Admin admin = adminSerive.changePassword(email , changePassword);
        return new ResponseEntity<>(admin , HttpStatus.OK);
    }
    @Autowired
    private RoomHistoryScheduler roomHistoryScheduler;

    @GetMapping("/run-scheduler")
    public ResponseEntity<String> runSchedulerNow() {
        roomHistoryScheduler.generateRoomHistory();
        return ResponseEntity.ok("Scheduler executed!");
    }
}
