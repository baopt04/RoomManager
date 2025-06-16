package com.example.roommanagement.dto.request.contract;

import com.example.roommanagement.entity.Admin;
import com.example.roommanagement.entity.Customer;
import com.example.roommanagement.entity.HouseForRent;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.constant.StatusContract;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseContractDTO {
    private String code;
    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "dd/MM/yyyy")
    private Date dateStart;
    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "dd/MM/yyyy")
    private Date dateEnd;
    private BigDecimal contractDeponsit;
    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "dd/MM/yyyy")
    private Date nextDueDate;
    private StatusContract status;
    private String description;
    private String roomId;
    private String houseForRentId;
    private String adminId;
    private String customerId;
    private List<MultipartFile> images;
    private List<String> imageUrls;

}
