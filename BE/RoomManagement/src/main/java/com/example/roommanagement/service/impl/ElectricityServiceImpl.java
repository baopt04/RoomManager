package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.electricity.BaseElectricityDTO;
import com.example.roommanagement.dto.request.electricity.CreateElectricityDTO;
import com.example.roommanagement.dto.request.electricity.FindAllElectricityDTO;
import com.example.roommanagement.dto.request.electricity.UpdateElectricityDTO;
import com.example.roommanagement.entity.Electricity;
import com.example.roommanagement.entity.ElectricityHistory;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.constant.StatusWaterEndElectric;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.ElectricityHistoryRepository;
import com.example.roommanagement.repository.ElectricityRepository;
import com.example.roommanagement.service.ElectricityService;
import com.example.roommanagement.util.Generate;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ElectricityServiceImpl implements ElectricityService {
    @Autowired
    private ElectricityRepository electricityRepository;
    @Autowired
    private Generate generate;
    @Autowired
    private ElectricityHistoryRepository electricityHistoryRepository;
    @Override
    public List<FindAllElectricityDTO> getAllElectricity() {
       return electricityRepository.findAllElectricity();
    }

    @Override
    public CreateElectricityDTO create(CreateElectricityDTO createElectricityDTO) {
        BigDecimal numberFirst = createElectricityDTO.getNumberFirst();
        BigDecimal numberLast = createElectricityDTO.getNumberLast();
        BigDecimal unitPrice = createElectricityDTO.getUnitPrice();
        BigDecimal quantityData = numberLast.subtract(numberFirst);
        LocalDateTime dateNow = LocalDateTime.now();
        Integer mother = dateNow.getMonthValue() ;
        Integer year = dateNow.getYear();
        if (quantityData.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException( Constrants.NUMBER_FIRST_LAST );
        }
        if (electricityRepository.existsByRoom_Id(createElectricityDTO.getRoom().getId())) {
            throw new BusinessException(Constrants.HAVE_ROOM);
        }
        BigDecimal totalPrice = quantityData.multiply(unitPrice);
        Electricity electricity = Electricity.builder()
                .code(generate.generateCodeElectricity())
                .numberFirst(numberFirst)
                .numberLast(numberLast)
                .unitPrice(unitPrice)
                .dataClose(quantityData)
                .totalPrice(totalPrice)
                .status(createElectricityDTO.getStatus())
                .room(createElectricityDTO.getRoom())
                .build();
        electricityRepository.save(electricity);

        ElectricityHistory electricityHistory = ElectricityHistory.builder()
                .numberFirst(numberFirst)
                .numberLast(numberLast)
                .unitPrice(unitPrice)
                .totalPrice(totalPrice)
                .month(mother)
                .year(year)
                .status(StatusWaterEndElectric.CHUA_THANH_TOAN)
                .electricity(electricity)
                .build();
        electricityHistoryRepository.save(electricityHistory);
       return createElectricityDTO;
    }

    @Override
    public UpdateElectricityDTO update(String id, UpdateElectricityDTO updateElectricityDTO) {
        Optional<Electricity> electricity = electricityRepository.findById(id);
        LocalDateTime localDateTime = LocalDateTime.now();
        Integer mother = localDateTime.getMonthValue() ;
        Integer year = localDateTime.getYear();
        if (!electricity.isPresent()) {
            throw new BusinessException( Constrants.NOT_FOUND);
        }
        if (!updateElectricityDTO.getRoom().getId().equals(electricity.get().getRoom().getId())) {
            if (electricityRepository.existsByRoom_Id(updateElectricityDTO.getRoom().getId())) {
                throw new BusinessException(Constrants.HAVE_ROOM);
            }
        }
        BigDecimal numberFirst = updateElectricityDTO.getNumberFirst();
        BigDecimal numberLast = updateElectricityDTO.getNumberLast();
        BigDecimal unitPrice = updateElectricityDTO.getUnitPrice();
        BigDecimal quantityData = numberLast.subtract(numberFirst);
        if (quantityData.compareTo(BigDecimal.ZERO) < 0) {
           throw new BusinessException( Constrants.NUMBER_FIRST_LAST);
        }
        BigDecimal totalPrice = quantityData.multiply(unitPrice);
        electricity.get().setNumberFirst(numberFirst);
        electricity.get().setNumberLast(numberLast);
        electricity.get().setUnitPrice(unitPrice);
        electricity.get().setDataClose(quantityData);
        electricity.get().setTotalPrice(totalPrice);
        electricity.get().setStatus(updateElectricityDTO.getStatus());
        electricity.get().setRoom(updateElectricityDTO.getRoom());
        electricityRepository.save(electricity.get());
        ElectricityHistory electricityHistory = ElectricityHistory.builder()
                .numberFirst(numberFirst)
                .numberLast(numberLast)
                .unitPrice(unitPrice)
                .totalPrice(totalPrice)
                .month(mother)
                .year(year)
                .status(updateElectricityDTO.getStatus())
                .electricity(electricity.get())
                .build();
        electricityHistoryRepository.save(electricityHistory);
       return updateElectricityDTO;
    }

    @Override
    public BaseElectricityDTO detail(String id) {
        Electricity electricity = electricityRepository.findById(id).orElseThrow(
                () -> new BusinessException( Constrants.NOT_FOUND)
        );
        BaseElectricityDTO baseElectricityDTO = new BaseElectricityDTO(
                electricity.getCode() ,
                electricity.getNumberFirst() ,
                electricity.getNumberLast() ,
                electricity.getUnitPrice() ,
                electricity.getDataClose() ,
                electricity.getTotalPrice() ,
                electricity.getStatus() ,
                electricity.getRoom()
        );
        return baseElectricityDTO;
    }
}
