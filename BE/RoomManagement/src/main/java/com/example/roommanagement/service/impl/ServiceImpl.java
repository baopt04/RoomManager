package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.service.BaseServiceDTO;
import com.example.roommanagement.dto.request.service.CreateServiceDTO;
import com.example.roommanagement.dto.request.service.FindAllServiceDTO;
import com.example.roommanagement.dto.request.service.UpdateServiceDTO;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.entity.ServiceS;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.RoomRepository;
import com.example.roommanagement.repository.ServiceRepository;
import com.example.roommanagement.service.ServiceService;
import com.example.roommanagement.util.Generate;
import org.hibernate.sql.Update;
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
    public CreateServiceDTO create(CreateServiceDTO createServiceDTO) {
        if (serviceRepository.existsByName(createServiceDTO.getName())) {
           throw new BusinessException( Constrants.NAME_EXISTS);
        }
        ServiceS serviceS = ServiceS.builder()
                .code(generate.generateCodeService())
                .name(createServiceDTO.getName())
                .price(createServiceDTO.getPrice())
                .unitOfMeasure(createServiceDTO.getUnitOfMeasure())
                .discription(createServiceDTO.getDiscription())
                .build();
        serviceRepository.save(serviceS);
      return createServiceDTO;
    }

    @Override
    public UpdateServiceDTO update(String id, UpdateServiceDTO updateServiceDTO) {
        Optional<ServiceS> serviceS = serviceRepository.findById(id);
        if (!serviceS.isPresent()) {
            throw new BusinessException( Constrants.NOT_FOUND);
        }
        serviceS.get().setName(updateServiceDTO.getName());
        serviceS.get().setPrice(updateServiceDTO.getPrice());
        serviceS.get().setUnitOfMeasure(updateServiceDTO.getUnitOfMeasure());
        serviceS.get().setDiscription(updateServiceDTO.getDiscription());
        serviceRepository.save(serviceS.get());
        return  updateServiceDTO;
    }

    @Override
    public BaseServiceDTO detail(String id) {
        ServiceS serviceS = serviceRepository.findById(id).orElseThrow(
                () -> new BusinessException( Constrants.NOT_FOUND)
        );
        BaseServiceDTO baseServiceDTO = new BaseServiceDTO(
              serviceS.getCode() ,
              serviceS.getName() ,
              serviceS.getPrice() ,
                serviceS.getUnitOfMeasure() ,
                serviceS.getDiscription()
        );
        return baseServiceDTO;
    }
}
