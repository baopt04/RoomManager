package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.maintenance.CreateMaintenanceDTO;
import com.example.roommanagement.dto.request.maintenance.FindAllMaintencanceDTO;
import com.example.roommanagement.dto.request.maintenance.UpdateMaintenanceDTO;
import com.example.roommanagement.entity.Maintenance;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.MaintenaceRepository;
import com.example.roommanagement.service.MaintencanceService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaintencanceServiceImpl implements MaintencanceService {

    @Autowired
    private MaintenaceRepository maintenaceRepository;
    @Autowired
    private Generate generate;

    @Override
    public List<FindAllMaintencanceDTO> findAllMaintencance() {
        return maintenaceRepository.findAllMaintencance();
    }

    @Override
    public Reponse<CreateMaintenanceDTO> create(CreateMaintenanceDTO createMaintenanceDTO) {
        Maintenance maintenance = Maintenance.builder()
                .code(generate.generateCodeMaintenance())
                .name(createMaintenanceDTO.getName())
                .dataRequest(createMaintenanceDTO.getDataRequest())
                .dataComplete(createMaintenanceDTO.getDataComplete())
                .description(createMaintenanceDTO.getDescription())
                .expense(createMaintenanceDTO.getExpense())
                .status(createMaintenanceDTO.getStatus())
                .room(createMaintenanceDTO.getRoom())
                .build();
        maintenaceRepository.save(maintenance);
        return new Reponse<>(200 , Constrants.CREATE , createMaintenanceDTO);
    }

    @Override
    public Reponse<UpdateMaintenanceDTO> update(String id, UpdateMaintenanceDTO updateMaintenanceDTO) {
        Optional<Maintenance> maintenance = maintenaceRepository.findById(id);
        if (!maintenance.isPresent()) {
            return new Reponse<>(404 , Constrants.NOT_FOUND , updateMaintenanceDTO);
        }
        Maintenance updateMaintenance = maintenance.get();
        updateMaintenance.setName(updateMaintenanceDTO.getName());
        updateMaintenance.setDataRequest(updateMaintenanceDTO.getDataRequest());
        updateMaintenance.setDataComplete(updateMaintenanceDTO.getDataComplete());
        updateMaintenance.setDescription(updateMaintenanceDTO.getDescription());
        updateMaintenance.setExpense(updateMaintenanceDTO.getExpense());
        updateMaintenance.setStatus(updateMaintenanceDTO.getStatus());
        updateMaintenance.setRoom(updateMaintenanceDTO.getRoom());
        maintenaceRepository.save(updateMaintenance);
        return new Reponse<>(200 , Constrants.UPDATE , updateMaintenanceDTO);
    }
}
