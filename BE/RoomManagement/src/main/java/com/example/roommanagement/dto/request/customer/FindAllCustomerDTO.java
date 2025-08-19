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
    private String email;
    private String numberPhone;
    private Boolean gender;
    private String cccd;
    private Date dateOfBirth;
    private String status;

}
