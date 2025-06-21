package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.car.BaseCarDTO;
import com.example.roommanagement.dto.request.car.CreateCarDTO;
import com.example.roommanagement.dto.request.car.FindAllCarDTO;
import com.example.roommanagement.dto.request.car.UpdateCarDTO;

import java.util.List;

public interface CarService {
    List<FindAllCarDTO> findAllCars();
    CreateCarDTO create(CreateCarDTO createCarDTO);
    UpdateCarDTO update(String id , UpdateCarDTO updateCarDTO);
    BaseCarDTO detail(String id);
    void delete(String id);
}
