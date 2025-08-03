package com.example.roommanagement.dto.request.statistical;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.GetMapping;

import java.math.BigDecimal;

public interface MonthlyTotalDTO {
     Integer getMonth();
     Integer getYear();
     BigDecimal getTotalWater();
     BigDecimal getTotalElectricity();
     BigDecimal getTotalRoom();
     BigDecimal getTotalService();
     BigDecimal getTotalMonth();
}
