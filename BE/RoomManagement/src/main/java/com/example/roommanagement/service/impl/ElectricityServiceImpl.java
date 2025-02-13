package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.electricity.CreateElectricityDTO;
import com.example.roommanagement.dto.request.electricity.FindAllElectricityDTO;
import com.example.roommanagement.dto.request.electricity.UpdateElectricityDTO;
import com.example.roommanagement.entity.Electricity;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.ElectricityRepository;
import com.example.roommanagement.service.ElectricityService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ElectricityServiceImpl implements ElectricityService {
    @Autowired
    private ElectricityRepository electricityRepository;
    @Autowired
    private Generate generate;
    @Override
    public List<FindAllElectricityDTO> getAllElectricity() {
       return electricityRepository.findAllElectricity();
    }

    @Override
    public Reponse<CreateElectricityDTO> create(CreateElectricityDTO createElectricityDTO) {
        BigDecimal numberFirst = createElectricityDTO.getNumberFirst();
        BigDecimal numberLast = createElectricityDTO.getNumberLast();
        BigDecimal unitPrice = createElectricityDTO.getUnitPrice();
        BigDecimal quantityData = numberLast.subtract(numberFirst);
        if (quantityData.compareTo(BigDecimal.ZERO) < 0) {
            return new Reponse<>(400 , Constrants.NUMBER_FIRST_LAST , null);
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
        return new Reponse<>(200 , Constrants.CREATE , createElectricityDTO);
    }

    @Override
    public Reponse<UpdateElectricityDTO> update(String id, UpdateElectricityDTO updateElectricityDTO) {
        Optional<Electricity> electricity = electricityRepository.findById(id);
        if (!electricity.isPresent()) {
            return new Reponse<>(400 , Constrants.NOT_FOUND , null);
        }
        BigDecimal numberFirst = updateElectricityDTO.getNumberFirst();
        BigDecimal numberLast = updateElectricityDTO.getNumberLast();
        BigDecimal unitPrice = updateElectricityDTO.getUnitPrice();
        BigDecimal quantityData = numberLast.subtract(numberFirst);
        if (quantityData.compareTo(BigDecimal.ZERO) < 0) {
            return new Reponse<>(400 , Constrants.NUMBER_FIRST_LAST , null);
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
        return new Reponse<>(200 , Constrants.UPDATE , updateElectricityDTO);
    }
}
