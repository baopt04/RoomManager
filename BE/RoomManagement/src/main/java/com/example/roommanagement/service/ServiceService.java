package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.electricity.UpdateElectricityDTO;
import com.example.roommanagement.dto.request.service.BaseServiceDTO;
import com.example.roommanagement.dto.request.service.CreateServiceDTO;
import com.example.roommanagement.dto.request.service.FindAllServiceDTO;
import com.example.roommanagement.dto.request.service.UpdateServiceDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface ServiceService {
    List<FindAllServiceDTO> findAll();

    CreateServiceDTO create(CreateServiceDTO createServiceDTO);

    UpdateServiceDTO update(String id, UpdateServiceDTO updateServiceDTO);

    BaseServiceDTO detail(String id);
}

