package com.example.roommanagement.dto.request.customer;

import com.example.roommanagement.infrastructure.constant.StatusCustomer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseCustomerDTO {
    private String id;
    private String code;
    @NotNull(message = "Tên không được trống")
    @Size(min = 2 , message = "Vui lòng nhậ lớn hơn 2 ký tư")
    private String name;
    @NotNull(message = "Vui lòng nhập email")
    @Email(message = "Vui lòng nhập đúng định dạng email")
    private String email;
    @NotNull(message = "Vui lòng nhập  số điện thoại")
    @Pattern(regexp = "^\\+?[0-9]{9,10}$", message = " Số điện thoại từ 9 đến 10 số")
    private String numberPhone;

    private Boolean gender;
    @NotNull(message = "Vui lòng nhập cccd")
    @Size(min = 12 , message = "Vui lòng nhập từ 12 số")
    private String cccd;
    private Date dateOfBirth;
    private StatusCustomer status;

}
