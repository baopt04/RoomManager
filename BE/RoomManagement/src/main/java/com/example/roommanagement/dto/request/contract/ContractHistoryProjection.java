package com.example.roommanagement.dto.request.contract;

import java.math.BigDecimal;
import java.util.Date;

public interface ContractHistoryProjection {
     Long getStt();
    String getId();
    Date getDateStart();
    Date getDateEnd();
    BigDecimal getContractDeponsit();
    Date getNextDueDate();
    String getStatus();
    String getDiscription();
    String getRoom();
    String getHouseForRent();
    String getCustomer();

}
