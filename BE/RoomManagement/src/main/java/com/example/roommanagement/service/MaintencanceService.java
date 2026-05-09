package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.maintenance.BaseMaintenanceDTO;
import com.example.roommanagement.dto.request.maintenance.CreateMaintenanceDTO;
import com.example.roommanagement.dto.request.maintenance.FindAllMaintencanceDTO;
import com.example.roommanagement.dto.request.maintenance.UpdateMaintenanceDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MaintencanceService {
    Page<FindAllMaintencanceDTO> findAllMaintencance(Pageable pageable);
    CreateMaintenanceDTO create(CreateMaintenanceDTO createMaintenanceDTO);
    UpdateMaintenanceDTO update(String id ,UpdateMaintenanceDTO updateMaintenanceDTO);
    BaseMaintenanceDTO detail(String id);
    void deleteById(String id);
}
