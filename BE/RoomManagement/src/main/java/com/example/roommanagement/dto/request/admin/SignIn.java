package com.example.roommanagement.dto.request.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignIn{
 @NotNull(message = "Vui lòng nhập email!")
 @Email(message = "Vui lòng nhập đúng định dạng email")
 private  String email;
 @NotNull(message = "Vui lòng nhập password !")
  private  String password;
  private   String token;
  private String role;
}
