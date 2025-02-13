package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.water.CreateWaterDTO;
import com.example.roommanagement.dto.request.water.FindAllWaterDTO;
import com.example.roommanagement.dto.request.water.UpdateWaterDTO;
import com.example.roommanagement.entity.Water;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.WaterRepository;
import com.example.roommanagement.service.WaterService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class WaterServiceImpl implements WaterService {
    @Autowired
    private WaterRepository waterRepository;
    @Autowired
    private Generate generate;
    @Override
    public List<FindAllWaterDTO> findAllWater() {
    return waterRepository.findAllWaters();
    }

    @Override
    public Reponse<CreateWaterDTO> create(CreateWaterDTO createWaterDTO) {
        BigDecimal numberFirst = createWaterDTO.getNumberFirst();
        BigDecimal numberLast = createWaterDTO.getNumberLast();
        BigDecimal numberQuantity = numberLast.subtract(numberFirst);
        if(numberQuantity.compareTo(BigDecimal.ZERO) < 0) {
            return new Reponse<>(400 , Constrants.NUMBER_FIRST_LAST , null);
        }
        BigDecimal unitPrice = createWaterDTO.getUnitPrice();
        BigDecimal totalPrice = numberQuantity.multiply(unitPrice);
        Water water = Water.builder()
                .code(generate.generateCodeWater())
                .numberFirst(numberFirst)
                .numberLast(numberLast)
                .unitPrice(unitPrice)
                .dataClose(numberQuantity)
                .totalPrice(totalPrice)
                .status(createWaterDTO.getStatus())
                .room(createWaterDTO.getRoom())
                .build();
        waterRepository.save(water);
        return new Reponse<>(200 , Constrants.CREATE , createWaterDTO);
    }

    @Override
    public Reponse<UpdateWaterDTO> update(String id, UpdateWaterDTO updateWaterDTO) {
        Optional<Water> optionalWater = waterRepository.findById(id);
        if(!optionalWater.isPresent()) {
            return new Reponse<>(404 , Constrants.NOT_FOUND ,null);
        }
        BigDecimal numberFirst = updateWaterDTO.getNumberFirst();
        BigDecimal numberLast = updateWaterDTO.getNumberLast();
        BigDecimal numberQuantity = numberLast.subtract(numberFirst);
        if(numberQuantity.compareTo(BigDecimal.ZERO) < 0) {
            return new Reponse<>(400 , Constrants.NUMBER_FIRST_LAST , null);
        }
        BigDecimal unitPrice = updateWaterDTO.getUnitPrice();
        BigDecimal totalPrice = numberQuantity.multiply(unitPrice);
        optionalWater.get().setNumberFirst(numberFirst);
       optionalWater.get().setNumberLast(numberLast);
       optionalWater.get().setUnitPrice(unitPrice);
       optionalWater.get().setDataClose(numberQuantity);
       optionalWater.get().setTotalPrice(totalPrice);
       optionalWater.get().setStatus(updateWaterDTO.getStatus());
       optionalWater.get().setRoom(updateWaterDTO.getRoom());
        waterRepository.save(optionalWater.get());
        return new Reponse<>(200 , Constrants.UPDATE , updateWaterDTO);
    }
}
