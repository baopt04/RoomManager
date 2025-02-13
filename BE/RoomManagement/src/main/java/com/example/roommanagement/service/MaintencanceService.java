package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.maintenance.CreateMaintenanceDTO;
import com.example.roommanagement.dto.request.maintenance.FindAllMaintencanceDTO;
import com.example.roommanagement.dto.request.maintenance.UpdateMaintenanceDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface MaintencanceService {
    List<FindAllMaintencanceDTO> findAllMaintencance();
    Reponse<CreateMaintenanceDTO> create(CreateMaintenanceDTO createMaintenanceDTO);
    Reponse<UpdateMaintenanceDTO> update(String id ,UpdateMaintenanceDTO updateMaintenanceDTO);
}
