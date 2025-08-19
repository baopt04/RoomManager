package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.admin.*;
import com.example.roommanagement.dto.respon.AdminRespon;
import com.example.roommanagement.entity.Admin;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.AdminSerive;
import com.example.roommanagement.service.RefreshTokenService;
import com.example.roommanagement.service.impl.RoomHistoryScheduler;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/public")
public class PublicController {
    @Autowired
    private AdminSerive adminSerive;
@Autowired
private RefreshTokenService refreshTokenService;
    @PostMapping("/login")
    public ResponseEntity<SignIn> signIn(@Valid @RequestBody SignIn signInDTO) {
        return adminSerive.signIn(signInDTO);
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
    @PostMapping("/refresh-token")
    public ResponseEntity<SignIn> refreshToken(HttpServletRequest request) {
        return refreshTokenService.refreshTokenAccess(request);
    }
    @GetMapping("/check-cookie")
    public String checkCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                System.out.println(cookie.getName() + " = " + cookie.getValue());
            }
        }
        return "done";
    }
}
