package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.service.CreateServiceDTO;
import com.example.roommanagement.dto.request.service.FindAllServiceDTO;
import com.example.roommanagement.dto.request.service.UpdateServiceDTO;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.entity.ServiceS;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.RoomRepository;
import com.example.roommanagement.repository.ServiceRepository;
import com.example.roommanagement.service.ServiceService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceImpl implements ServiceService {
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private Generate generate;


    @Override
    public List<FindAllServiceDTO> findAll() {
        return serviceRepository.findAllServices();
    }

    @Override
    public Reponse<CreateServiceDTO> create(CreateServiceDTO createServiceDTO) {
        if (serviceRepository.existsByName(createServiceDTO.getName())) {
            return new Reponse<>(400, Constrants.NAME_EXISTS, null);
        }
     if (serviceRepository.existsByRoom(createServiceDTO.getRoom())) {
         return new Reponse<>(400 , Constrants.ID_DUPLICATE , null);
     }
        BigDecimal wifi = createServiceDTO.getWifi();
        BigDecimal parking = createServiceDTO.getParking();
        BigDecimal elevator = createServiceDTO.getElevator();
        BigDecimal generalService = createServiceDTO.getGeneralService();
        BigDecimal totalPice = createServiceDTO.getPrice();
        totalPice = wifi.add(parking).add(elevator).add(generalService);
        ServiceS serviceS = ServiceS.builder()
                .code(generate.generateCodeService())
                .name(createServiceDTO.getName())
                .wifi(wifi)
                .parking(parking)
                .elevator(elevator)
                .generalService(generalService)
                .price(totalPice)
                .unitOfMeasure(createServiceDTO.getUnitOfMeasure())
                .discription(createServiceDTO.getDiscription())
                .room(createServiceDTO.getRoom())
                .build();
        serviceRepository.save(serviceS);
        return new Reponse<>(200, Constrants.CREATE, createServiceDTO);
    }

    @Override
    public Reponse<UpdateServiceDTO> update(String id, UpdateServiceDTO updateServiceDTO) {
        Optional<ServiceS> serviceS = serviceRepository.findById(id);
        if (!serviceS.isPresent()) {
            return new Reponse<>(404, Constrants.NOT_FOUND, null);
        }
        ServiceS service = serviceS.get();
        if (!service.getName().equals(updateServiceDTO.getName())) {
            if (serviceRepository.existsByName(updateServiceDTO.getName())) {
                return new Reponse<>(400, Constrants.NAME_EXISTS, null);
            }
        }
        BigDecimal wifi = updateServiceDTO.getWifi();
        BigDecimal parking = updateServiceDTO.getParking();
        BigDecimal elevator = updateServiceDTO.getElevator();
        BigDecimal generalService = updateServiceDTO.getGeneralService();
        BigDecimal totalPice = updateServiceDTO.getPrice();
        totalPice = wifi.add(parking).add(elevator).add(generalService);

        serviceS.get().setName(updateServiceDTO.getName());
        serviceS.get().setWifi(wifi);
        serviceS.get().setParking(parking);
        serviceS.get().setElevator(elevator);
        serviceS.get().setGeneralService(generalService);
        serviceS.get().setPrice(totalPice);
        serviceS.get().setUnitOfMeasure(updateServiceDTO.getUnitOfMeasure());
        serviceS.get().setDiscription(updateServiceDTO.getDiscription());
        serviceS.get().setRoom(updateServiceDTO.getRoom());
        serviceRepository.save(serviceS.get());
        return new Reponse<>(200, Constrants.UPDATE, updateServiceDTO);
    }
}
