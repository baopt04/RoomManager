package com.example.roommanagement.dto.request.contract;

import jakarta.annotation.security.DenyAll;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FindAllContractDTO {
    private Long stt;
    private String id;
    private String code;
    private Date dateStart;
    private Date dateEnd;
    private BigDecimal contractDeponsit;
    private Date nextDueDate;
    private String status;
    private String description;
    private String room;
    private String houseForRent;
    private String admin;
    private String customer;

}
