package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.electricity.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ElectricityService {
    Page<FindAllElectricityDTO> getAllElectricity(Pageable pageable);
    CreateElectricityDTO create(CreateElectricityDTO createElectricityDTO);
    UpdateElectricityDTO update(String id , UpdateElectricityDTO updateElectricityDTO);
    BaseElectricityDTO detail(String id);
    List<FindAllElectricityAndWaterHistoryProjection> getAllHistoryElectricity(String id);
}
