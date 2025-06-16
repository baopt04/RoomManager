package com.example.roommanagement.dto.request.billDetail;

import java.math.BigDecimal;

public interface BillDetailProjection {
    Long getStt();
    String getId();
    String getBillId();
    String getType();
    String getDescription();
    BigDecimal getQuantity();
    BigDecimal getAmount();
    BigDecimal getUnitPrice();
}
