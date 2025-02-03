package com.example.roommanagement.dto.request.admin;

import com.example.roommanagement.infrastructure.constant.Role;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BaseAdminDTO {
    @NotNull(message = "Tên không được trống")
    @Size(min = 2, message = "Vui lòng nhâp lớn hai ký tự")
    private String name;
    private String password;
    @NotNull(message = "Vui lòng nhâập email")
    @Email(message = "Vui lòng nhập đúng định dạng email")
    private String email;
    @NotNull(message = "Vui lòng nhập số điện thoại")
    @Pattern(regexp = "^\\+?[0-9]{9,10}$", message = " Số điện thoại từ 9 đến 10 số")
    private String numberPhone;
    @NotNull(message = "Vui lòng chọn  quyền hạn")
    private Role role;

}
