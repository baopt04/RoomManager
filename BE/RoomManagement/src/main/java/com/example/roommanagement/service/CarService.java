package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.car.BaseCarDTO;
import com.example.roommanagement.dto.request.car.CreateCarDTO;
import com.example.roommanagement.dto.request.car.FindAllCarDTO;
import com.example.roommanagement.dto.request.car.UpdateCarDTO;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CarService {
    Page<FindAllCarDTO> findAllCars(Pageable pageable);
    CreateCarDTO create(CreateCarDTO createCarDTO);
    UpdateCarDTO update(String id , UpdateCarDTO updateCarDTO);
    BaseCarDTO detail(String id);
    void delete(String id);
}
