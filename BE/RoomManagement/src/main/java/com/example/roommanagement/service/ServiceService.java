package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.electricity.UpdateElectricityDTO;
import com.example.roommanagement.dto.request.service.BaseServiceDTO;
import com.example.roommanagement.dto.request.service.CreateServiceDTO;
import com.example.roommanagement.dto.request.service.FindAllServiceDTO;
import com.example.roommanagement.dto.request.service.UpdateServiceDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ServiceService {
    Page<FindAllServiceDTO> findAll(Pageable pageable);

    CreateServiceDTO create(CreateServiceDTO createServiceDTO);

    UpdateServiceDTO update(String id, UpdateServiceDTO updateServiceDTO);

    BaseServiceDTO detail(String id);
}

