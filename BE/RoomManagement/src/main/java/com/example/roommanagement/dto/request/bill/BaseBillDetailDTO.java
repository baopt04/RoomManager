package com.example.roommanagement.dto.request.bill;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BaseBillDetailDTO {
    private String id;
    private String type;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal amount;
}
