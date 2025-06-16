package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.electricity.BaseElectricityDTO;
import com.example.roommanagement.dto.request.electricity.CreateElectricityDTO;
import com.example.roommanagement.dto.request.electricity.FindAllElectricityDTO;
import com.example.roommanagement.dto.request.electricity.UpdateElectricityDTO;
import com.example.roommanagement.entity.Electricity;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface ElectricityService {
    List<FindAllElectricityDTO> getAllElectricity();
    CreateElectricityDTO create(CreateElectricityDTO createElectricityDTO);
    UpdateElectricityDTO update(String id , UpdateElectricityDTO updateElectricityDTO);
    BaseElectricityDTO detail(String id);
}
