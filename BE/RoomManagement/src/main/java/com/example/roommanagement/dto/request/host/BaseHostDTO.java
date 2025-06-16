package com.example.roommanagement.dto.request.host;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseHostDTO {
    private String code;
    private String name;
    private String numberPhone;
    private String email;
    private Boolean gender;

}
