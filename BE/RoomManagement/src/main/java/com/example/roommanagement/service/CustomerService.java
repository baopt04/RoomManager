package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.customer.BaseCustomerDTO;
import com.example.roommanagement.dto.request.customer.CreateCustomerDTO;
import com.example.roommanagement.dto.request.customer.FindAllCustomerDTO;
import com.example.roommanagement.dto.request.customer.UpdateCustomerDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {
    CreateCustomerDTO create(CreateCustomerDTO createCustomerDTO);

    UpdateCustomerDTO update(String id, UpdateCustomerDTO updateCustomerDTO );

    Page<FindAllCustomerDTO> findAll(Pageable pageable);

    FindAllCustomerDTO getOneByEmail(String email);

    FindAllCustomerDTO getOneByNumberPhone(String phone);

    BaseCustomerDTO detail(String id);
}
