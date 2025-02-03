package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.admin.CreateAdminDTO;
import com.example.roommanagement.dto.request.admin.FindAllAdminDTO;
import com.example.roommanagement.dto.request.admin.SignIn;
import com.example.roommanagement.dto.request.admin.UpdateAdminDTO;
import com.example.roommanagement.dto.respon.AdminRespon;
import com.example.roommanagement.entity.Admin;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.AdminRepository;
import com.example.roommanagement.service.AdminSerive;
import com.example.roommanagement.util.Generate;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminSerive {
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private Generate generate;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Reponse<Admin> create(CreateAdminDTO createAdminDTO) {
        if (adminRepository.existsAdminByEmail(createAdminDTO.getEmail())) {
            return new Reponse<>(400, "Email đã tồn tại !", null);
        }
        if (adminRepository.existsByNumberPhone(createAdminDTO.getNumberPhone())) {
            return new Reponse<>(400, "Số điện thoại đã tồn tại !", null);
        }

        String rawPassword = generate.generatePasswordAdmin(7);
        Admin admin = Admin.builder()
                .name(createAdminDTO.getName())
                .code(generate.generateCode())
                .numberPhone(createAdminDTO.getNumberPhone())
                .email(createAdminDTO.getEmail())
                .password(passwordEncoder.encode(rawPassword))
                .role(createAdminDTO.getRole())
                .build();
        adminRepository.save(admin);
        try {
            emailService.sendMail(createAdminDTO.getEmail(), "Đăng ký tài khoản thành công"
                    , "Mật khẩu của bạn là :" + rawPassword);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return new Reponse<>(200, "Success", admin);

    }

    @Override
    public Reponse<Admin> update(UpdateAdminDTO updateAdminDTO, String id) {
        if (adminRepository.existsAdminByEmail(updateAdminDTO.getEmail())) {
            return new Reponse<>(400, "Email đã tồn tại !", null);
        }
        if (adminRepository.existsByNumberPhone(updateAdminDTO.getNumberPhone())) {
            return new Reponse<>(400, "Số điện thoại đã tồn tại ! ", null);
        }
        Optional<Admin> admin = adminRepository.findById(id);
        if (!admin.isPresent()) {
            return new Reponse<>(404, "Không tìm thấy", null);
        }
        Admin admin1 = admin.get();
        if (admin1.getEmail().equals(updateAdminDTO.getEmail()) || admin1.getNumberPhone().equals(updateAdminDTO.getNumberPhone())) {
            if (adminRepository.existsByNumberPhone(updateAdminDTO.getNumberPhone())) {
                return new Reponse<>(400, "Số điện thoại đã tồn tại !", null);
            }
            if (adminRepository.existsAdminByEmail(updateAdminDTO.getEmail())) {
                return new Reponse<>(400, "Email đã tồn tại !", null);
            }
        }
        admin1.setName(updateAdminDTO.getName());
        admin1.setEmail(updateAdminDTO.getEmail());
        admin1.setNumberPhone(updateAdminDTO.getNumberPhone());
        admin1.setRole(updateAdminDTO.getRole());
        adminRepository.save(admin1);
        return new Reponse<>(200, "Update Success", admin1);
    }

    @Override
    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    @Override
    public List<FindAllAdminDTO> findAllAdminRespon() {
        return adminRepository.getAllAdmins();
    }

    @Override
    public Reponse<SignIn> signIn(SignIn signIn) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    signIn.getEmail(), signIn.getPassword()
            ));
            var user = adminRepository.findByEmail(signIn.getEmail()).orElseThrow();
            String role = String.valueOf(user.getRole());
            var jwt = jwtUtils.generateToken(user);
            signIn.setToken(jwt);
            signIn.setRole(role);
            return new Reponse<SignIn>(200, "Success",signIn);
        }catch (Exception e) {
            return new Reponse<>(500 , "Error loginn" , null);
        }
        }

}
