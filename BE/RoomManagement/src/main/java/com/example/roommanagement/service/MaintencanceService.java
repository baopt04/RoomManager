package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.maintenance.BaseMaintenanceDTO;
import com.example.roommanagement.dto.request.maintenance.CreateMaintenanceDTO;
import com.example.roommanagement.dto.request.maintenance.FindAllMaintencanceDTO;
import com.example.roommanagement.dto.request.maintenance.UpdateMaintenanceDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface MaintencanceService {
    List<FindAllMaintencanceDTO> findAllMaintencance();
    CreateMaintenanceDTO create(CreateMaintenanceDTO createMaintenanceDTO);
    UpdateMaintenanceDTO update(String id ,UpdateMaintenanceDTO updateMaintenanceDTO);
    BaseMaintenanceDTO detail(String id);
}
