package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.customer.BaseCustomerDTO;
import com.example.roommanagement.dto.request.customer.CreateCustomerDTO;
import com.example.roommanagement.dto.request.customer.FindAllCustomerDTO;
import com.example.roommanagement.dto.request.customer.UpdateCustomerDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface CustomerService {
    CreateCustomerDTO create(CreateCustomerDTO createCustomerDTO);

    UpdateCustomerDTO update(String id, UpdateCustomerDTO updateCustomerDTO);

    List<FindAllCustomerDTO> findAll();

    FindAllCustomerDTO getOneByEmail(String email);

    FindAllCustomerDTO getOneByNumberPhone(String phone);

    BaseCustomerDTO detail(String id);
}
