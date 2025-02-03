package com.example.roommanagement.dto.request.admin;

import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FindAllAdminDTO {
    private Integer stt;
    private String code;
    private String name;
    private String email;
    private String numberPhone;
    private String role;
private Timestamp lastModifiedDate;
}
