package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.electricity.*;

import java.util.List;

public interface ElectricityService {
    List<FindAllElectricityDTO> getAllElectricity();
    CreateElectricityDTO create(CreateElectricityDTO createElectricityDTO);
    UpdateElectricityDTO update(String id , UpdateElectricityDTO updateElectricityDTO);
    BaseElectricityDTO detail(String id);
    List<FindAllElectricityAndWaterHistoryProjection> getAllHistoryElectricity(String id);
}
