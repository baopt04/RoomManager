package com.example.roommanagement.dto.request.customer;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FindAllCustomerDTO  {
    private Long stt;
    private String id;
    private String code;
    private String name;
    private String numberPhone;
    private String email;
    private Boolean gender;
    private String cccd;
    private Date dateOfBirth;

}
