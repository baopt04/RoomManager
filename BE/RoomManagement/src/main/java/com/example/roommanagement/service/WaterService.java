package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.water.BaseWaterDTO;
import com.example.roommanagement.dto.request.water.CreateWaterDTO;
import com.example.roommanagement.dto.request.water.FindAllWaterDTO;
import com.example.roommanagement.dto.request.water.UpdateWaterDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface WaterService {
    List<FindAllWaterDTO> findAllWater();
    CreateWaterDTO create(CreateWaterDTO createWaterDTO);
    UpdateWaterDTO update(String id , UpdateWaterDTO updateWaterDTO);
    BaseWaterDTO detail(String id );
}
