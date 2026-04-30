package com.example.roommanagement.dto.request.bill;

import java.math.BigDecimal;
import java.util.Date;

public interface FindAllBillProjection {
    Long getStt();
    String getId();
    String getCode();
    BigDecimal getTotalRoom();
    BigDecimal getTotalRoomService();
    BigDecimal getTotalPriceWater();
    BigDecimal getTotalPriceElectricity();
    BigDecimal getTotalAmonut();
    BigDecimal getAmountPaid();
    BigDecimal getElectricityUsage();
    BigDecimal getWaterUsage();
    Integer getMotherPay();
    Integer getYearPay();
    Date getPaidDate();
    Date getDueDate();
    Date getDateCreate();
    String getStatus();
    String getDescription();
    String getMeThod();
    String getRoom();
    String getCustomer();
    String getContract();
    String getAdmin();

}
