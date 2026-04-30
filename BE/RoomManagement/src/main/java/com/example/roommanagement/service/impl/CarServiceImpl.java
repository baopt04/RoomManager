package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.car.BaseCarDTO;
import com.example.roommanagement.dto.request.car.CreateCarDTO;
import com.example.roommanagement.dto.request.car.FindAllCarDTO;
import com.example.roommanagement.dto.request.car.UpdateCarDTO;
import com.example.roommanagement.entity.Car;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.repository.CarRepository;
import com.example.roommanagement.service.CarService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CarServiceImpl implements CarService {
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private Generate generate;
    @Override
    public List<FindAllCarDTO> findAllCars() {
       return carRepository.findAllCars();
    }

    @Override
    public CreateCarDTO create(CreateCarDTO createCarDTO) {
        if (carRepository.existsByLicensePlate(createCarDTO.getLicensePlate())) {
            throw new BusinessException(Constrants.CAR_EXISTS);
        }
        String code = generate.generateCodeCar();
        while (carRepository.existsByCode(code)) {
            code = generate.generateCodeCar();
        }
        Car car = Car.builder()
                .code(code)
                .licensePlate(createCarDTO.getLicensePlate())
                .brandCar(createCarDTO.getBrandCar())
                .color(createCarDTO.getColor())
                .type(createCarDTO.getCarType())
                .color(createCarDTO.getColor())
                .room(createCarDTO.getRoom())
                .customer(createCarDTO.getCustomer())
                .build();
        carRepository.save(car);
        return createCarDTO;
    }

    @Override
    public UpdateCarDTO update(String id, UpdateCarDTO updateCarDTO) {
        Optional<Car> optional = carRepository.findById(id);
        if (optional.isEmpty()) {
            throw new BusinessException(Constrants.CAR_NOT_FOUND);
        }
        if (!updateCarDTO.getLicensePlate().equals(optional.get().getLicensePlate())) {
            if (carRepository.existsByLicensePlate(updateCarDTO.getLicensePlate())) {
                throw new BusinessException(Constrants.CAR_EXISTS);
            }
        }
        Car car = optional.get();
        car.setLicensePlate(updateCarDTO.getLicensePlate());
        car.setBrandCar(updateCarDTO.getBrandCar());
        car.setColor(updateCarDTO.getColor());
        car.setType(updateCarDTO.getCarType());
        car.setRoom(updateCarDTO.getRoom());
        car.setCustomer(updateCarDTO.getCustomer());
        carRepository.save(car);
        return updateCarDTO;

    }

    @Override
    public BaseCarDTO detail(String id) {
       Car car = carRepository.findById(id).orElseThrow(
               () -> new BusinessException(Constrants.CAR_NOT_FOUND)
       );
         BaseCarDTO baseCarDTO = new BaseCarDTO(
                 car.getCode() ,
                 car.getLicensePlate() ,
                 car.getType() ,
                 car.getBrandCar() ,
                 car.getColor() ,
                 car.getRoom() ,
                 car.getCustomer()
         );
         return baseCarDTO;
    }
    @Transactional
    @Override
    public void delete(String id) {
     Optional<Car> optionalCar = carRepository.findById(id);
     if (!optionalCar.isEmpty()){
            carRepository.deleteById(id);
        } else {
            throw new BusinessException(Constrants.CAR_NOT_FOUND);
     }
    }
}
