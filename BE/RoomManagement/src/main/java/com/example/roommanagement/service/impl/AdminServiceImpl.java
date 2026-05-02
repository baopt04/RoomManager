package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.admin.*;
import com.example.roommanagement.entity.Admin;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.constant.StatusAdmin;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.AdminRepository;
import com.example.roommanagement.service.AdminSerive;
import com.example.roommanagement.service.EmailService;
import com.example.roommanagement.service.RefreshTokenService;
import com.example.roommanagement.util.Generate;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminSerive {
    @Value("${app.auth.cookie.secure:false}")
    private boolean authCookieSecure;

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
    @Autowired
    private RefreshTokenService refreshTokenService;

    @Override
    public CreateAdminDTO create(CreateAdminDTO createAdminDTO) {
        if (adminRepository.existsAdminByEmail(createAdminDTO.getEmail())) {
          throw new BusinessException(Constrants.EMAIL_EXISTS);
        }
        if (adminRepository.existsByNumberPhone(createAdminDTO.getNumberPhone())) {
           throw new BusinessException(Constrants.NUMBER_PHONE_EXISTS);
        }

        String rawPassword = generate.generatePasswordAdmin(7);
        Admin admin = Admin.builder()
                .name(createAdminDTO.getName())
                .code(generate.generateCodeAdmin())
                .numberPhone(createAdminDTO.getNumberPhone())
                .email(createAdminDTO.getEmail())
                .password(passwordEncoder.encode(rawPassword))
                .role(createAdminDTO.getRole())
                .statusAdmin(StatusAdmin.HOAT_DONG)
                .build();
        adminRepository.save(admin);
        try {
            emailService.sendMailCreateAmdin(createAdminDTO.getEmail(), "Đăng ký tài khoản thành công"
                    , "Mật khẩu của bạn là :" + rawPassword);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
       return createAdminDTO;

    }

    @Override
    public UpdateAdminDTO update(UpdateAdminDTO updateAdminDTO, String id) {

        Optional<Admin> admin = adminRepository.findById(id);
        if (!admin.isPresent()) {
          throw new BusinessException(Constrants.ADMIN_FOUND);
        }
        Admin admin1 = admin.get();
        if (!admin1.getEmail().equals(updateAdminDTO.getEmail())) {
            if (adminRepository.existsAdminByEmail(updateAdminDTO.getEmail())) {
               throw new BusinessException(Constrants.EMAIL_EXISTS);
            }
        }
        if (!admin1.getNumberPhone().equals(updateAdminDTO.getNumberPhone())) {
            if (adminRepository.existsByNumberPhone(updateAdminDTO.getNumberPhone())) {
                throw new BusinessException(Constrants.NUMBER_PHONE_EXISTS);
            }
        }
        admin1.setName(updateAdminDTO.getName());
        admin1.setEmail(updateAdminDTO.getEmail());
        admin1.setNumberPhone(updateAdminDTO.getNumberPhone());
        admin1.setRole(updateAdminDTO.getRole());
        adminRepository.save(admin1);
        return updateAdminDTO;
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
    public ResponseEntity<SignIn> signIn(SignIn signIn) {
        var user = adminRepository.findAdminByEmail(signIn.getEmail())
                .orElseThrow(() -> new BusinessException(Constrants.EMAIL_FOUND));
                if (user.getStatusAdmin() == StatusAdmin.BI_KHOA) {
                    throw new BusinessException(Constrants.LOCKER_ADMIN_LOGIN);
                }

                try {
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(signIn.getEmail() , signIn.getPassword())
                        );
                }catch (RuntimeException e) {
                    throw new RuntimeException(Constrants.LOGIN_FAIL);
                }
                String accessToken = jwtUtils.generateAccessToken(user);
                String refreshToken = jwtUtils.generateRefreshToken(user);
        refreshTokenService.createRefreshToken(user.getId() , refreshToken);
        ResponseCookie cookie = buildRefreshTokenCookie(refreshToken, 7L * 24 * 60 * 60);
        SignIn response = new SignIn(user.getEmail() , null , user.getName() , user.getRole().toString() , accessToken );
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    private ResponseCookie buildRefreshTokenCookie(String refreshTokenValue, long maxAgeSeconds) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from("refreshToken", refreshTokenValue)
                .httpOnly(true)
                .secure(authCookieSecure)
                .path("/")
                .maxAge(maxAgeSeconds);
        // Cross-site cookies require SameSite=None + Secure (HTTPS). Local http dev uses Lax + Secure=false.
        if (authCookieSecure) {
            builder.sameSite("None");
        } else {
            builder.sameSite("Lax");
        }
        return builder.build();
    }


    @Override
    public Reponse<FindAllAdminDTO> getOneEmail(String email) {
        if (email == null || email.isEmpty()) {
            return new Reponse<>(404, Constrants.FIND_NULL, null);
        }
        FindAllAdminDTO adminRespon = adminRepository.getOneAdminByEmail(email);
        if (adminRespon == null) {
            return new Reponse<>(404, Constrants.NOT_FOUND, null);
        }
        return new Reponse<>(200, Constrants.GET_SUCCESS, adminRespon);
    }

    @Override
    public Reponse<FindAllAdminDTO> getOneNumberPhone(String numberPhone) {
        if (numberPhone == null || numberPhone.isEmpty()) {
            return new Reponse<>(404, Constrants.FIND_NULL, null);
        }
        FindAllAdminDTO adminRespon = adminRepository.getOneAdminByNumberPhone(numberPhone);
        if (adminRespon == null) {
            return new Reponse<>(404, Constrants.NOT_FOUND, null);
        }
        return new Reponse<>(200, Constrants.GET_SUCCESS, adminRespon);
    }

    @Override
    public Admin changePassword(String email , ChangePassword password) {
        Optional<Admin> optional = adminRepository.findAdminByEmail(email);
        if (optional.isEmpty()) {
            throw new BusinessException(Constrants.ADMIN_FOUND);
        }
        Admin admin = optional.get();
        if (!passwordEncoder.matches(password.getPasswordOld(), admin.getPassword())) {
            throw new BusinessException(Constrants.PASSWORD_CHANGE);
        }
        admin.setPassword(passwordEncoder.encode(password.getPasswordNew()));
        adminRepository.save(admin);
        return admin;
    }

    @Override
    public AdminProjection detail(String id) {
        return adminRepository.findProjectedById(id)
                .orElseThrow(() -> new BusinessException(Constrants.ADMIN_FOUND));
    }

    @Override
    public String lockerAdmin(String id , LockerAdminDTO lockerAdminDTO) {
    Admin admin = adminRepository.findById(id).orElseThrow(
            () -> new BusinessException(Constrants.ADMIN_FOUND)
    );
    String emailLockerSend = admin.getEmail();
    LocalDateTime localDateTime= LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        String formatDate = localDateTime.format(formatter);
    if (lockerAdminDTO.getUnlocker().equals("locker")) {
        admin.setStatusAdmin(StatusAdmin.BI_KHOA);
        admin.setDescription(lockerAdminDTO.getDescription());
        try {
            emailService.sendMailCreateAmdin(emailLockerSend, "Thông báo khóa tài khoản trong hệ thống Hostel Manager "
                    + formatDate      , "Lý do khóa tài khoản : "+ lockerAdminDTO.getDescription());
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }else {
        admin.setStatusAdmin(StatusAdmin.HOAT_DONG);
        admin.setDescription("");
        try {
            emailService.sendMailCreateAmdin(emailLockerSend, "Thông báo mở lại tài khoản trong hệ thống Hostel Manager "
                    + formatDate      , "Tài khoản của bạn đã được mở lại bạn hãy đăng nhập lại bằng tài khoản và mật khẩu. : ");
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
    adminRepository.save(admin);
    return Constrants.LOCKER_ADMIN;
    }


}
