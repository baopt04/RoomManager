package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.customer.CreateCustomerDTO;
import com.example.roommanagement.dto.request.customer.FindAllCustomerDTO;
import com.example.roommanagement.dto.request.customer.UpdateCustomerDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface CustomerService {
    Reponse<CreateCustomerDTO> create(CreateCustomerDTO createCustomerDTO);

    Reponse<UpdateCustomerDTO> update(String id, UpdateCustomerDTO updateCustomerDTO);

    List<FindAllCustomerDTO> findAll();

    Reponse<FindAllCustomerDTO> getOneByEmail(String email);

    Reponse<FindAllCustomerDTO> getOneByNumberPhone(String phone);
}
