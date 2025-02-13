package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.houseForRent.CreateHouseForRentDTO;
import com.example.roommanagement.dto.request.houseForRent.FindAllHouseForRentDTO;
import com.example.roommanagement.dto.request.houseForRent.UpdateHouseForRentDTO;
import com.example.roommanagement.entity.HouseForRent;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.Reponse;
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

    @Override
    public List<FindAllHouseForRentDTO> getAllHouseForRent() {
        return houseForRentRepository.findAllHouseForRent();
    }

    @Override
    public Reponse<CreateHouseForRentDTO> create(CreateHouseForRentDTO createHouseForRent) {
        if (houseForRentRepository.existsByName(createHouseForRent.getName())) {
            return new Reponse<>(400, Constrants.NAME_EXISTS, null);
        }
        HouseForRent houseForRent = HouseForRent.builder()
                .code(generate.generateCodeHouseForRent())
                .name(createHouseForRent.getName())
                .address(createHouseForRent.getAddress())
                .discription(createHouseForRent.getDiscription())
                .host(createHouseForRent.getHost())
                .build();
        houseForRentRepository.save(houseForRent);
        return new Reponse<>(200, Constrants.CREATE, createHouseForRent);
    }

    @Override
    public Reponse<UpdateHouseForRentDTO> update(String id, UpdateHouseForRentDTO updateHouseForRent) {
        Optional<HouseForRent> houseForRent = houseForRentRepository.findById(id);
        if (!houseForRent.isPresent()) {
            return new Reponse<>(400, Constrants.NOT_FOUND, null);
        }
        if (!houseForRent.get().getName().equals(updateHouseForRent.getName())) {
            if (houseForRentRepository.existsByName(updateHouseForRent.getName())) {
                return new Reponse<>(400, Constrants.NAME_EXISTS, null);
            }
        }
        houseForRent.get().setName(updateHouseForRent.getName());
        houseForRent.get().setAddress(updateHouseForRent.getAddress());
        houseForRent.get().setHost(updateHouseForRent.getHost());
        houseForRent.get().setDiscription(updateHouseForRent.getDiscription());
        houseForRentRepository.save(houseForRent.get());
        return new Reponse<>(200, Constrants.UPDATE, updateHouseForRent);
    }

    @Override
    public Reponse<FindAllHouseForRentDTO> findByNameAndAddress(String name, String address) {
        if ((name == null || name.isEmpty()) && (address == null || address.isEmpty())) {
            return new Reponse<>(400, Constrants.FIND_NULL, null);
        }

        FindAllHouseForRentDTO search = houseForRentRepository.findByNameAndAddress(name, address);
        if (search == null) {
            return new Reponse<>(404, Constrants.NOT_FOUND, null);
        }
        return new Reponse<>(200, Constrants.GET_SUCCESS, search);
    }

}
