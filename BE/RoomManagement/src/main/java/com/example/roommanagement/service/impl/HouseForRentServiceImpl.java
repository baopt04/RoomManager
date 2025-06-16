package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.houseForRent.BaseHouseForRentDTO;
import com.example.roommanagement.dto.request.houseForRent.CreateHouseForRentDTO;
import com.example.roommanagement.dto.request.houseForRent.FindAllHouseForRentDTO;
import com.example.roommanagement.dto.request.houseForRent.UpdateHouseForRentDTO;
import com.example.roommanagement.entity.Host;
import com.example.roommanagement.entity.HouseForRent;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.constant.StatusHouseForRent;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.HostRepository;
import com.example.roommanagement.repository.HouseForRentRepository;
import com.example.roommanagement.service.HouseForRentService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HouseForRentServiceImpl implements HouseForRentService {
    @Autowired
    private HouseForRentRepository houseForRentRepository;
    @Autowired
    private Generate generate;
@Autowired
private HostRepository hostRepository;
    @Override
    public List<FindAllHouseForRentDTO> getAllHouseForRent() {
        return houseForRentRepository.findAllHouseForRent();
    }

    @Override
    public CreateHouseForRentDTO create(CreateHouseForRentDTO createHouseForRent) {
        if (houseForRentRepository.existsByName(createHouseForRent.getName())) {
            throw new BusinessException( Constrants.NAME_EXISTS);
        }
        Host host = hostRepository.findById(createHouseForRent.getHost().getId())
                .orElseThrow(() -> new BusinessException("Host not found"));
        HouseForRent houseForRent = HouseForRent.builder()
                .code(generate.generateCodeHouseForRent())
                .name(createHouseForRent.getName())
                .address(createHouseForRent.getAddress())
                .discription(createHouseForRent.getDiscription())
                .price(createHouseForRent.getPrice())
                .status(StatusHouseForRent.valueOf(createHouseForRent.getStatus()))
                .host(host)
                .build();
        houseForRentRepository.save(houseForRent);
      return createHouseForRent;
    }

    @Override
    public UpdateHouseForRentDTO update(String id, UpdateHouseForRentDTO updateHouseForRent) {
        Optional<HouseForRent> houseForRent = houseForRentRepository.findById(id);
        if (!houseForRent.isPresent()) {
            throw new BusinessException( Constrants.NOT_FOUND);
        }
        if (!houseForRent.get().getName().equals(updateHouseForRent.getName())) {
            if (houseForRentRepository.existsByName(updateHouseForRent.getName())) {
               throw new BusinessException( Constrants.NAME_EXISTS);
            }
        }
        Host host = hostRepository.findById(updateHouseForRent.getHost().getId())
                .orElseThrow(() -> new BusinessException("Host not found"));
        houseForRent.get().setName(updateHouseForRent.getName());
        houseForRent.get().setAddress(updateHouseForRent.getAddress());
        houseForRent.get().setHost(host);
        houseForRent.get().setDiscription(updateHouseForRent.getDiscription());
        houseForRent.get().setPrice(updateHouseForRent.getPrice());
        houseForRent.get().setStatus(StatusHouseForRent.valueOf(updateHouseForRent.getStatus()));
        houseForRentRepository.save(houseForRent.get());
     return updateHouseForRent;
    }

    @Override
    public FindAllHouseForRentDTO findByNameAndAddress(String name, String address) {
        if ((name == null || name.isEmpty()) && (address == null || address.isEmpty())) {
            throw new BusinessException( Constrants.FIND_NULL);
        }

        FindAllHouseForRentDTO search = houseForRentRepository.findByNameAndAddress(name, address);
        if (search == null) {
            throw new BusinessException( Constrants.NOT_FOUND);
        }
       return search;
    }

    @Override
    public BaseHouseForRentDTO detail(String id) {
        Optional<HouseForRent> houseForRent = houseForRentRepository.findById(id);
        if (!houseForRent.isPresent()) {
            throw new BusinessException( Constrants.NOT_FOUND);
        }
        BaseHouseForRentDTO baseHouseForRentDTO = new BaseHouseForRentDTO(
                houseForRent.get().getCode(),
                houseForRent.get().getName(),
                houseForRent.get().getAddress(),
                houseForRent.get().getDiscription(),
                houseForRent.get().getPrice(),
                houseForRent.get().getStatus().toString(),
                houseForRent.get().getHost()
        );
        return baseHouseForRentDTO;
    }

}
