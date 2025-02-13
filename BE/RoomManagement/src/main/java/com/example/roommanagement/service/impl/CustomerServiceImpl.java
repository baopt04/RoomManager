package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.customer.CreateCustomerDTO;
import com.example.roommanagement.dto.request.customer.FindAllCustomerDTO;
import com.example.roommanagement.dto.request.customer.UpdateCustomerDTO;
import com.example.roommanagement.entity.Customer;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.CustomerRepository;
import com.example.roommanagement.service.CustomerService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private Generate generate;

    @Override
    public Reponse<CreateCustomerDTO> create(CreateCustomerDTO createCustomerDTO) {
        if (customerRepository.existsByEmail(createCustomerDTO.getEmail())) {
            return new Reponse<>(400, Constrants.EMAIL_EXISTS, null);
        }
        if (customerRepository.existsByNumberPhone(createCustomerDTO.getNumberPhone())) {
            return new Reponse<>(400, Constrants.NUMBER_PHONE_EXISTS, null);
        }
        if (customerRepository.existsByCccd(createCustomerDTO.getCccd())) {
            return new Reponse<>(400, Constrants.CCCD_EXISTS, null);
        }
        Customer customer = Customer.builder()
                .name(createCustomerDTO.getName())
                .email(createCustomerDTO.getEmail())
                .numberPhone(createCustomerDTO.getNumberPhone())
                .cccd(createCustomerDTO.getCccd())
                .code(generate.generateCodeCustomer())
                .gender(createCustomerDTO.getGender())
                .dateOfBirth(createCustomerDTO.getDateOfBirth())
                .build();
        customerRepository.save(customer);
        return new Reponse<>(200, "Register Success", createCustomerDTO);
    }

    @Override
    public Reponse<UpdateCustomerDTO> update(String id, UpdateCustomerDTO updateCustomerDTO) {

        Optional<Customer> customer = customerRepository.findById(id);

        if (!customer.isPresent()) {
            return new Reponse<>(404, Constrants.NOT_FOUND, null);
        }
        Customer customer1 = customer.get();
        if (!customer1.getEmail().equals(updateCustomerDTO.getEmail())) {
            if (customerRepository.existsByEmail(updateCustomerDTO.getEmail())) {
                return new Reponse<>(400, Constrants.EMAIL_EXISTS, null);
            }
        }
        if (!customer1.getNumberPhone().equals(updateCustomerDTO.getNumberPhone())) {
            if (customerRepository.existsByNumberPhone(updateCustomerDTO.getNumberPhone())) {
                return new Reponse<>(400, Constrants.NUMBER_PHONE_EXISTS, null);
            }
        }
        if (!customer1.getCccd().equals(updateCustomerDTO.getCccd())) {
            if (customerRepository.existsByCccd(updateCustomerDTO.getCccd())) {
                return new Reponse<>(400, Constrants.CCCD_EXISTS, null);
            }

        }
        customer1.setName(updateCustomerDTO.getName());
        customer1.setEmail(updateCustomerDTO.getEmail());
        customer1.setNumberPhone(updateCustomerDTO.getNumberPhone());
        customer1.setGender(updateCustomerDTO.getGender());
        customer1.setDateOfBirth(updateCustomerDTO.getDateOfBirth());
        customer1.setCccd(updateCustomerDTO.getCccd());
        customerRepository.save(customer1);
        return new Reponse<>(200, "Update Success", updateCustomerDTO);
    }

    @Override
    public List<FindAllCustomerDTO> findAll() {
        return customerRepository.findAllCustomers();
    }

    @Override
    public Reponse<FindAllCustomerDTO> getOneByEmail(String email) {
        if (email == null || email.isEmpty()) {
            return new Reponse<>(400, Constrants.FIND_EMAIL_NULL, null);
        }
        FindAllCustomerDTO respon = customerRepository.getOneByEmail(email);
        if (respon == null) {
            return new Reponse<>(404, Constrants.NOT_FOUND, null);
        }
        return new Reponse<>(200, Constrants.GET_SUCCESS, respon);
    }

    @Override
    public Reponse<FindAllCustomerDTO> getOneByNumberPhone(String phone) {
        if (phone == null || phone.isEmpty()) {
            return new Reponse<>(400, Constrants.FIND_NULL, null);
        }
        FindAllCustomerDTO respon = customerRepository.getOneByNumberPhone(phone);
        if (respon == null) {
            return new Reponse<>(404, Constrants.NOT_FOUND, null);
        }
        return new Reponse<>(200, Constrants.GET_SUCCESS, respon);
    }


}
