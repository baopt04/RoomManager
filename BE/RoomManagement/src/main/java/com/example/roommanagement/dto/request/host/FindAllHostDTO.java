package com.example.roommanagement.dto.request.host;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FindAllHostDTO {
    private Long stt;
    private String id;
    private String code;
    private String name;
    private String email;
    private String numberPhone;
    private Boolean gender;
}
