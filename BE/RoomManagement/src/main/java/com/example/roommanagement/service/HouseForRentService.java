package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.houseForRent.CreateHouseForRentDTO;
import com.example.roommanagement.dto.request.houseForRent.FindAllHouseForRentDTO;
import com.example.roommanagement.dto.request.houseForRent.UpdateHouseForRentDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface HouseForRentService {
    List<FindAllHouseForRentDTO> getAllHouseForRent();
    Reponse<CreateHouseForRentDTO> create(CreateHouseForRentDTO createHouseForRent);
    Reponse<UpdateHouseForRentDTO> update(String id, UpdateHouseForRentDTO updateHouseForRent);
    Reponse<FindAllHouseForRentDTO> findByNameAndAddress(String name, String address);
}
