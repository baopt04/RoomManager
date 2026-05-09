package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.customer.FindAllCustomerDTO;
import com.example.roommanagement.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    boolean existsByEmail(String email);

    boolean existsByNumberPhone(String phone);

    boolean existsByCccd(String cccd);

    Optional<Customer> findById(String id);
    Optional<Customer> findByEmail(String email);

    @Query(value = """
            select 
            row_number() over(order by ct.last_modified_date desc ) as stt , 
                        ct.id as id,
            ct.code as code , 
            ct.name as name , 
            ct.email as email ,
            ct.number_phone as numberPhone,
            ct.gender as gender , 
            ct.citizen_identification as cccd ,
            ct.date_of_birth as date ,
            ct.status as status
            from customer ct 
            """, countQuery = """
            select count(ct.id)
            from customer ct
            """, nativeQuery = true)
    Page<FindAllCustomerDTO> findAllCustomers(Pageable pageable);

    @Query(value = """
            select 
             row_number() over (order by ct.last_modified_date desc ) as stt, 
             ct.id as id , 
             ct.code as code , 
             ct.name as name , 
             ct.email as email ,
             ct.number_phone as numberPhone ,
             ct.gender as gender , 
             ct.citizen_identification as cccd , 
             ct.date_of_birth as date 
             from customer ct where ct.email =:email
            """, nativeQuery = true)
    FindAllCustomerDTO getOneByEmail(@Param("email") String email);

    @Query(value = """
            select 
             row_number() over (order by ct.last_modified_date desc ) as stt, 
             ct.id as id , 
             ct.code as code , 
             ct.name as name , 
             ct.email as email ,
             ct.number_phone as numberPhone ,
             ct.gender as gender , 
             ct.citizen_identification as cccd , 
             ct.date_of_birth as date 
             from customer ct where ct.number_phone =:numberPhone
            """, nativeQuery = true)
    FindAllCustomerDTO getOneByNumberPhone(@Param("numberPhone") String numberPhone);
}
