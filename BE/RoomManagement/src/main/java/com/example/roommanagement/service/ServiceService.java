package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.service.CreateServiceDTO;
import com.example.roommanagement.dto.request.service.FindAllServiceDTO;
import com.example.roommanagement.dto.request.service.UpdateServiceDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface ServiceService {
    List<FindAllServiceDTO> findAll();

    Reponse<CreateServiceDTO> create(CreateServiceDTO createServiceDTO);

    Reponse<UpdateServiceDTO> update(String id, UpdateServiceDTO updateServiceDTO);
}
