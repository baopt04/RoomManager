package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.electricity.FindAllElectricityAndWaterHistoryProjection;
import com.example.roommanagement.dto.request.water.BaseWaterDTO;
import com.example.roommanagement.dto.request.water.CreateWaterDTO;
import com.example.roommanagement.dto.request.water.FindAllWaterDTO;
import com.example.roommanagement.dto.request.water.UpdateWaterDTO;
import com.example.roommanagement.entity.ElectricityHistory;
import com.example.roommanagement.entity.Water;
import com.example.roommanagement.entity.WaterHistory;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.constant.StatusWaterEndElectric;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.WaterHistoryRepository;
import com.example.roommanagement.repository.WaterRepository;
import com.example.roommanagement.service.WaterService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WaterServiceImpl implements WaterService {
    @Autowired
    private WaterRepository waterRepository;
    @Autowired
    private Generate generate;
    @Autowired
    private WaterHistoryRepository waterHistoryRepository;
    @Override
    public List<FindAllWaterDTO> findAllWater() {
    return waterRepository.findAllWaters();
    }

    @Override
    public CreateWaterDTO create(CreateWaterDTO createWaterDTO) {
        BigDecimal numberFirst = createWaterDTO.getNumberFirst();
        BigDecimal numberLast = createWaterDTO.getNumberLast();
        BigDecimal numberQuantity = numberLast.subtract(numberFirst);
        LocalDateTime dateNow = LocalDateTime.now();
        Integer mother = dateNow.getMonthValue() ;
        Integer year = dateNow.getYear();
        if (waterRepository.existsByRoom_Id(createWaterDTO.getRoom().getId())) {
            throw new BusinessException(Constrants.ROOM_EXISTS_WATER_ELECTRICITY);
        }
        if(numberQuantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException( Constrants.NUMBER_FIRST_LAST );
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
                .mother(mother)
                .year(year)
                .status(createWaterDTO.getStatus())
                .room(createWaterDTO.getRoom())
                .build();
        waterRepository.save(water);
        WaterHistory waterHistory = WaterHistory.builder()
                .numberFirst(numberFirst)
                .numberLast(numberLast)
                .unitPrice(unitPrice)
                .totalPrice(totalPrice)
                .month(mother)
                .year(year)
                .status(StatusWaterEndElectric.CHUA_THANH_TOAN)
                .water(water)
                .build();
        waterHistoryRepository.save(waterHistory);
        return createWaterDTO;
    }

    @Override
    public UpdateWaterDTO update(String id, UpdateWaterDTO updateWaterDTO) {
        Optional<Water> optionalWater = waterRepository.findById(id);
        if(!optionalWater.isPresent()) {
            throw new BusinessException( Constrants.NOT_FOUND);
        }
        if (!optionalWater.get().getRoom().getId().equals(updateWaterDTO.getRoom().getId())) {
            if (waterRepository.existsByRoom_Id(updateWaterDTO.getRoom().getId())) {
                throw new BusinessException(Constrants.ROOM_EXISTS_WATER_ELECTRICITY);
            }
        }
        BigDecimal numberFirst = updateWaterDTO.getNumberFirst();
        BigDecimal numberLast = updateWaterDTO.getNumberLast();
        BigDecimal numberQuantity = numberLast.subtract(numberFirst);
        LocalDateTime localDateTime = LocalDateTime.now();
        Integer mother = localDateTime.getMonthValue() ;
        Integer year = localDateTime.getYear();
        if(numberQuantity.compareTo(BigDecimal.ZERO) < 0) {
           throw new BusinessException( Constrants.NUMBER_FIRST_LAST );
        }
        BigDecimal unitPrice = updateWaterDTO.getUnitPrice();
        BigDecimal totalPrice = numberQuantity.multiply(unitPrice);
        optionalWater.get().setNumberFirst(numberFirst);
       optionalWater.get().setNumberLast(numberLast);
       optionalWater.get().setUnitPrice(unitPrice);
       optionalWater.get().setDataClose(numberQuantity);
       optionalWater.get().setTotalPrice(totalPrice);
       optionalWater.get().setMother(mother);
       optionalWater.get().setYear(year);
       optionalWater.get().setStatus(updateWaterDTO.getStatus());
       optionalWater.get().setRoom(updateWaterDTO.getRoom());
        waterRepository.save(optionalWater.get());
        Optional<WaterHistory> optionalWaterHistory = waterHistoryRepository.findByWater_IdAndMonthAndYear(id , mother , year);
        if (optionalWaterHistory.isPresent()) {
            WaterHistory history = optionalWaterHistory.get();
            history.setNumberFirst(numberFirst);
            history.setNumberLast(numberLast);
            history.setUnitPrice(unitPrice);
            history.setTotalPrice(totalPrice);
            history.setStatus(updateWaterDTO.getStatus());
            waterHistoryRepository.save(history);
        }else {
            WaterHistory newHistory = WaterHistory.builder()
                    .numberFirst(numberFirst)
                    .numberLast(numberLast)
                    .unitPrice(unitPrice)
                    .totalPrice(totalPrice)
                    .month(mother)
                    .year(year)
                    .status(updateWaterDTO.getStatus())
                    .water(optionalWater.get())
                    .build();
            waterHistoryRepository.save(newHistory);
        }

        return updateWaterDTO;
    }

    @Override
    public BaseWaterDTO detail(String id) {
      Water wt = waterRepository.findById(id).orElseThrow(() -> new BusinessException(Constrants.NOT_FOUND));

      return new BaseWaterDTO(
             wt.getCode(),
              wt.getNumberFirst() ,
              wt.getNumberLast() ,
              wt.getUnitPrice() ,
              wt.getDataClose() ,
              wt.getTotalPrice() ,
              wt.getStatus() ,
              wt.getRoom()
      );
    }

    @Override
    public List<FindAllElectricityAndWaterHistoryProjection> getAllHistoryWater(String id) {
        return waterHistoryRepository.findByIdElectricity(id);
    }
}
