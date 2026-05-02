package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.car.FindAllCarDTO;
import com.example.roommanagement.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car , Long> {

    Optional<Car> findById(String id);
    boolean existsByLicensePlate(String licensePlate);
    boolean existsByCode(String code);
    void deleteById(String id);
    @Query(value = """
            select row_number() over (order by c.last_modified_date desc) as stt ,
            c.id as id , 
                c.code as code ,
                c.license_plate as licensePlate,
                c.type as type , 
                c.brand_car as brandCar,
                c.color as color , 
                c.id_room as room , 
                c.id_customer as customer
            from car c
            """ , nativeQuery = true)
    List<FindAllCarDTO> findAllCars();
}
