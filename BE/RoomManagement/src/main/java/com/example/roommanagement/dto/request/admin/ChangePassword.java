package com.example.roommanagement.dto.request.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePassword {
    private String passwordOld;
    private String passwordNew;
}
