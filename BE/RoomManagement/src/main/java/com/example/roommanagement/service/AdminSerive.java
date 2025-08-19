package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.admin.*;
import com.example.roommanagement.entity.Admin;
import com.example.roommanagement.infrastructure.error.Reponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AdminSerive {
 CreateAdminDTO create(CreateAdminDTO createAdminDTO);
    UpdateAdminDTO update(UpdateAdminDTO updateAdminDTO , String id);
    List<Admin> findAll();
    List<FindAllAdminDTO> findAllAdminRespon();
   ResponseEntity<SignIn> signIn(SignIn signIn);
   Reponse<FindAllAdminDTO> getOneEmail(String email);
   Reponse<FindAllAdminDTO> getOneNumberPhone(String phone);
   Admin changePassword(String email , ChangePassword changePassword);
    AdminProjection detail(String id);
    String lockerAdmin(String id , LockerAdminDTO lockerAdminDTO);
}
