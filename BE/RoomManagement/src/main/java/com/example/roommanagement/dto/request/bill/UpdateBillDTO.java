package com.example.roommanagement.dto.request.bill;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateBillDTO  extends BaseBillDTO{
    private String billId;
    private Date paymentDate;
    private BigDecimal amount;
    private String method;
    private String description;
    private Boolean isRefund;
}
