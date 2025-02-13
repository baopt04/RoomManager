package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.electricity.CreateElectricityDTO;
import com.example.roommanagement.dto.request.electricity.FindAllElectricityDTO;
import com.example.roommanagement.dto.request.electricity.UpdateElectricityDTO;
import com.example.roommanagement.entity.Electricity;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface ElectricityService {
    List<FindAllElectricityDTO> getAllElectricity();
    Reponse<CreateElectricityDTO> create(CreateElectricityDTO createElectricityDTO);
    Reponse<UpdateElectricityDTO> update(String id , UpdateElectricityDTO updateElectricityDTO);
}
